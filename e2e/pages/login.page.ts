import { expect, type Page } from '@playwright/test';
import { BasePage, RENDER_TIMEOUT } from './base.page';
import { commonLocators } from '../locators/common.locators';
import { routes } from '../support/routes';

/**
 * The login form - the one screen the rest of the suite deliberately skips.
 *
 * Everything else authenticates through `POST /auth/login` in
 * setup/auth.setup.ts, because signing in through the UI thirty times over is
 * slow and turns one broken login into thirty confusing failures. The cost of
 * that choice is that NOTHING exercised the form a user actually types into.
 * This object exists to close exactly that gap, and nothing more - do not
 * reach for it to authenticate other tests.
 *
 * Read-only in the sense that matters here: it creates a session, and mutates
 * no club data, so it is safe against the shared deployed environment.
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto(routes.login);

    await expect(
      commonLocators.loginSubmit(this.page),
      `${routes.login} never rendered its submit button`,
    ).toBeVisible({ timeout: RENDER_TIMEOUT });

    await this.awaitHydration();
  }

  /**
   * Wait until React has attached its handlers to the form.
   *
   * THE FORM BEING VISIBLE IS NOT THE FORM BEING USABLE. The page is
   * server-rendered, so the fields and the submit button paint long before the
   * JavaScript that makes them work arrives - and submitting inside that window
   * does not merely fail, it triggers a credential-leak bug: `handleSubmit`'s
   * preventDefault has not been attached, so the browser falls back to a native
   * GET and writes the email and password into the URL. Full write-up in
   * COVERAGE.md section 3 ("Worth raising with the dev team", item 0).
   *
   * Without this wait SMK-020 and SMK-021 flaked - 3 failures in 6 runs against
   * `dev` on 2026-07-30 - and each failure was really that bug, surfacing in a
   * test that is not about it.
   *
   * WHAT THIS IS AND IS NOT. It is a test-side wait so these two scenarios can
   * assert the thing they are named for. It is NOT a judgement that the bug is
   * acceptable. An automated red test for it (`SMK-023`) was written and then
   * pulled from the suite for now at QA's request, pending how it gets filed -
   * this wait stayed because it independently stops a real flake. If SMK-023 is
   * reinstated, re-pair the two: same file, same "removed together" rule.
   *
   * React marks every DOM node it owns with a `__reactFiber$…` / `__reactProps$…`
   * property on hydration; their absence is the most direct signal available
   * that no handler is attached yet. If React ever stops doing that, this times
   * out loudly rather than passing early.
   */
  private async awaitHydration(): Promise<void> {
    await this.page.waitForFunction(
      () => {
        const form = document.querySelector('form');
        if (!form) return false;
        return Object.keys(form).some(
          (k) => k.startsWith('__reactFiber$') || k.startsWith('__reactProps$'),
        );
      },
      undefined,
      { timeout: RENDER_TIMEOUT },
    );
  }

  /**
   * Fill the form, submit it, and wait for the server to answer.
   *
   * The locators resolve the VISIBLE copy of each field: the page renders
   * <LoginForm /> twice, once per responsive branch, so `#email` exists twice
   * in the DOM - see the note in common.locators.ts.
   *
   * WAITING FOR THE RESPONSE IS WHAT MAKES expectRejected MEAN ANYTHING.
   * Without it, "we are still on /login" is trivially true for the instant
   * between the click and the answer, so `toHaveURL` would pass on its first
   * poll and the test would report a rejection whether or not one happened.
   * Waiting here moves that assertion to after the outcome is decided.
   *
   * The promise is created BEFORE the click, or a fast answer arrives with
   * nobody listening. A timeout falls through rather than throwing: the
   * assertion that follows says far more than a bare wait failure would.
   */
  async signIn(email: string, password: string): Promise<void> {
    await commonLocators.loginEmail(this.page).fill(email);
    await commonLocators.loginPassword(this.page).fill(password);

    const answered = this.page
      .waitForResponse((res) => /\/auth\/login\b/.test(res.url()), { timeout: RENDER_TIMEOUT })
      .catch(() => null);

    await commonLocators.loginSubmit(this.page).click();
    await answered;
  }

  /** Assert the sign-in was accepted and the app let us in. */
  async expectSignedIn(): Promise<void> {
    await expect(
      this.page,
      `sign-in did not reach ${routes.dashboard}. If it landed on ` +
        `/change-password or /complete-profile the account is flagged, not the ` +
        `form - clear the flag or reseed.`,
    ).toHaveURL(new RegExp(`${routes.dashboard}/?$`), { timeout: RENDER_TIMEOUT });
  }

  /**
   * Assert the sign-in was refused.
   *
   * Staying on /login is the DURABLE assertion and comes first: it is still
   * true a minute later. The toast is asserted separately by the caller,
   * because `autoClose: 4000` (providers.tsx) means it is gone four seconds
   * after it appears - a slow page can outlive the only evidence that anything
   * was reported to the user.
   */
  async expectRejected(): Promise<void> {
    await expect(
      this.page,
      `a wrong password was accepted - the app navigated away from ${routes.login}`,
    ).toHaveURL(new RegExp(`${routes.login}/?$`), { timeout: RENDER_TIMEOUT });
  }
}

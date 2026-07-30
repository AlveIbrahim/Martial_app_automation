import { expect, type Page } from '@playwright/test';
import { commonLocators } from '../locators/common.locators';

/**
 * Budget for waiting on the screen a test is about - a positive page marker OR
 * a denial screen. Both get the same allowance, because both are gated on the
 * same thing.
 *
 * Denial screens are NOT an instant early return, which is easy to assume and
 * wrong: the guards read `if (!isOwner && clubRole)`, so nothing renders -
 * neither the page nor the block - until `clubRole` resolves from
 * MyClubContext. Measured against `dev` on 2026-07-28:
 *
 *   sensei -> /teachers  denial screen:  6.3s, 6.5s, 6.9s, 7.0s, 12.4s
 *   owner  -> /members   page heading:   4.6s - 8.2s over 10 samples
 *
 * A 15s budget left as little as 2.6s of headroom, and the deployed testing
 * environment is shared and runs parallel workers - so an unlucky run tipped
 * over and reported "flaky". These are slow screens, not broken ones.
 *
 * NOTE ON NETWORK: these figures are from one machine on one connection. A
 * slower or less stable link raises every number, so the same suite can be
 * stable in one place and flaky in another with no code change.
 *
 * If a screen ever needs MORE than this, treat it as a real finding about page
 * performance and report it - do not just raise the number.
 */
export const RENDER_TIMEOUT = 30_000;

/**
 * Budget for `GET /users/clubs` to answer - see gotoAndAwaitClubRole.
 *
 * Deliberately larger than RENDER_TIMEOUT, because it is waiting on something
 * different: not a screen painting, but the deployed front end getting around
 * to issuing its first API call at all. Measured against `dev` on 2026-07-29,
 * from domcontentloaded on the club overview:
 *
 *   /users/clubs response:  6.4s, 18.9s, 24.9s
 *   Members tab visible:   8.5s, 13.0s, 20.0s, 24.8s, 28.4s, 35.0s
 *
 * The API itself is fast - each of those calls took 1.2-1.8s once sent. The
 * page simply does not start fetching for up to ~17s after DOM content loaded,
 * so every role-dependent control inherits that delay. That is a real
 * performance finding about the deployed build, recorded in COVERAGE.md; this
 * constant only stops it being mistaken for a flaky selector.
 */
export const CLUB_ROLE_TIMEOUT = 60_000;

/**
 * Why a navigation ended up somewhere it should not have, in one sentence.
 *
 * Shared by every navigation helper below so a landing-page surprise always
 * reads the same way, whether the route was supposed to stay put or to
 * redirect.
 */
function trapReason(path: string): string {
  const traps: Record<string, string> = {
    '/login': 'session cookie was not accepted (expired token, or wrong environment auth state)',
    '/change-password': 'account is flagged mustChangePassword - clear it or reseed',
    '/complete-profile': 'profile is incomplete and the account is older than 14 days',
    '/dashboard': 'app bounced to the dashboard - the account may not be a member of this club',
  };
  return traps[path] ?? 'unexpected redirect';
}

/**
 * Shared behaviour for every page object: navigation, and the two access
 * outcomes every club screen can produce.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(route: string): Promise<void> {
    await this.page.goto(route, { waitUntil: 'domcontentloaded' });
    await this.assertNotRedirectedAway(route);
  }

  /**
   * Navigate, then wait until the app KNOWS which role you are.
   *
   * Required before any "this control is / is not offered" assertion. The tab
   * bar, the share control and the site and library management controls are
   * all gated on the club role, and the app resolves that from
   * `GET /users/clubs` - until it answers, `userRole` sits at its 'member'
   * default (Header.tsx ~line 1207 says so explicitly, to avoid a flash of
   * owner chrome).
   *
   * That default is why waiting matters in BOTH directions. An absence check
   * run before the response passes for every role including the owner - a
   * false green. A presence check run before it fails for the owner - a false
   * red, which is how this was found.
   *
   * The response promise is created BEFORE navigating, or a fast answer would
   * arrive before anyone is listening. If it never comes we fall through
   * rather than fail here: the assertion that follows gives a far better
   * message than a bare wait timeout would.
   */
  async gotoAndAwaitClubRole(route: string): Promise<void> {
    const clubRoleResolved = this.page
      .waitForResponse((res) => /\/users\/clubs\b/.test(res.url()), {
        timeout: CLUB_ROLE_TIMEOUT,
      })
      .catch(() => null);

    await this.goto(route);
    await clubRoleResolved;
  }

  /**
   * Navigate somewhere that is SUPPOSED to redirect, and assert where it lands.
   *
   * `goto` treats any redirect as a failure, which is right for a page that
   * should stay put and wrong for the handful that route onwards by design.
   * `/dashboard/myClub` is the live case: it is not a club picker, it pushes to
   * the first club the account belongs to (myClub/page.tsx ~line 13).
   *
   * The named traps still apply - a session problem lands on /login and must be
   * reported as a session problem, not as "the redirect went somewhere odd".
   */
  async gotoExpectingRedirect(from: string, expected: RegExp): Promise<void> {
    const clubRoleResolved = this.page
      .waitForResponse((res) => /\/users\/clubs\b/.test(res.url()), {
        timeout: CLUB_ROLE_TIMEOUT,
      })
      .catch(() => null);

    await this.page.goto(from, { waitUntil: 'domcontentloaded' });
    await clubRoleResolved;

    // The redirect is client-side - a router.push inside an effect - so it
    // happens after the response awaited above. Poll for the URL rather than
    // reading it once.
    try {
      await expect(this.page).toHaveURL(expected, { timeout: RENDER_TIMEOUT });
    } catch {
      // Landing somewhere unexpected is far more often a session problem than a
      // routing one, and "toHaveURL failed" hides that. Name the trap instead.
      const current = new URL(this.page.url()).pathname;
      throw new Error(
        `Expected ${from} to redirect to ${expected} but it is on ${current}.\n` +
          `Likely cause: ${trapReason(current)}.`,
      );
    }
  }

  /**
   * The authenticated layout force-redirects in two cases:
   *   - mustChangePassword          -> /change-password
   *   - profile incomplete + >14d   -> /complete-profile
   * Freshly seeded demo accounts hit these often. Without an explicit check the
   * failure reads "heading not found" with no clue why, so detect it and say
   * what actually happened.
   */
  private async assertNotRedirectedAway(expectedPath: string): Promise<void> {
    const current = new URL(this.page.url()).pathname;
    if (current === expectedPath) return;

    throw new Error(
      `Expected to stay on ${expectedPath} but landed on ${current}.\n` +
        `Likely cause: ${trapReason(current)}.`,
    );
  }

  /** Assert the access-denied screen is showing. */
  async expectBlocked(route: string): Promise<void> {
    await expect(
      commonLocators.denialHeading(this.page),
      `expected an access-denied screen on ${route}, but none appeared`,
    ).toBeVisible({ timeout: RENDER_TIMEOUT });
  }

  /** Assert the denial screen is NOT showing. Never sufficient on its own. */
  async expectNotBlocked(route: string): Promise<void> {
    await expect(
      commonLocators.denialHeading(this.page),
      `${route} rendered an access-denied screen for a role that should be allowed`,
    ).toBeHidden();
  }
}

import { test, expect } from '../../../support/fixtures';
import { assertCredentialsPresent } from '../../../support/roles';
import { commonLocators } from '../../../locators/common.locators';

/**
 * Smoke group 03 - authentication.
 *
 * Scenarios: e2e/smoke_testing_scenarios.md
 *   SMK-020  Sign in through the login form
 *   SMK-021  A wrong password is rejected with a readable error
 *
 * Both are new IDs - the manual sheets have no scenario for the login form
 * itself, because ONB-003 covers "log in" as an outcome rather than as a
 * screen.
 *
 * THIS IS THE ONE PLACE THE FORM IS EXERCISED. Everything else in the suite
 * authenticates through `POST /auth/login` in setup/auth.setup.ts, which is the
 * right trade for speed but leaves the screen every real user types into
 * completely untested. Do not "simplify" these two by reusing a saved session:
 * the session is what they exist to avoid.
 *
 * NO `test.use(asRole(...))`, on purpose. playwright.config.ts sets no
 * project-level storageState, so omitting it IS the unauthenticated context -
 * this needs no separate project. It looks like an oversight otherwise, which
 * is why it is written down here.
 *
 * Safe against the shared environment: signing in creates a session and
 * mutates no club data.
 */

test.describe('The login form', () => {
  test('SMK-020 - valid credentials sign a user in through the form @SMK-020', async ({
    loginPage,
  }) => {
    /**
     * The member account, because it is the least privileged one that still
     * belongs to the club - a failure here is about the form, not about what
     * the account can then reach.
     *
     * assertCredentialsPresent gives "Missing credentials for role member" if
     * .env has not been filled in, rather than a 401 that looks like a broken
     * login.
     */
    const { email, password } = assertCredentialsPresent('member');

    await loginPage.open();
    await loginPage.signIn(email, password);
    await loginPage.expectSignedIn();
  });

  test('SMK-021 - a wrong password is refused @SMK-021', async ({ loginPage, page }) => {
    const { email } = assertCredentialsPresent('member');

    await loginPage.open();
    await loginPage.signIn(email, 'definitely-not-the-password');

    /**
     * The durable assertion first: we are still on /login. It is true a minute
     * later, and it is the one that would catch the failure that actually
     * matters - a wrong password being accepted.
     */
    await loginPage.expectRejected();

    /**
     * Then that the user was TOLD. This is a react-toastify toast
     * (LoginForm.tsx ~line 166), not inline form copy, and `autoClose: 4000`
     * in providers.tsx means it is gone four seconds after it appears.
     *
     * If this ever goes flaky while the assertion above stays green, the toast
     * is being outrun rather than not shown - that is a timing artefact of the
     * four-second budget, not a regression in the rejection itself.
     *
     * The copy is not asserted: the message is whatever the server sent,
     * passed through `tm(...)`, so pinning a string here would break on a
     * backend wording change that harms nobody.
     */
    await expect(
      commonLocators.loginErrorToast(page),
      'the sign-in was correctly refused, but nothing told the user why',
    ).toBeVisible();
  });
});

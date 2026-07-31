import { test, asRole } from '../../../support/fixtures';
import { routes } from '../../../support/routes';
import { personalLocators } from '../../../locators/personal.locators';

/**
 * Smoke group 12 - profile.
 *
 * Manual scenarios: manual-qa/role-member.md
 *   MEM-019  Account / security / language settings - STEP 1 ONLY
 *
 * WHAT IS AUTOMATED, AND WHY THE REST IS NOT
 *
 * Step 1 is a read: the settings page loads and offers its tabs. That is what
 * this file asserts.
 *
 * Steps 2-5 all WRITE - changing a password, flipping privacy toggles, saving a
 * push preference, switching the UI language. Every one of them mutates a shared
 * seeded account, so they belong with the mutating-tests milestone and its
 * `@destructive` project, not here. The suite is read-only against `dev` and
 * must stay that way (README section 6). This scenario is therefore 🟡, not ✅.
 *
 * Step 5's language switch also overlaps group 17 (`XC-001`) - the folder README
 * says to assert it in one place, and group 17 is that place.
 *
 * No positive control is needed here. Nothing is asserted ABSENT, so there is no
 * false-green risk of the kind README section 7 describes - every assertion
 * below fails if its selector is wrong.
 *
 * Read-only: this opens one page and reads it. Nothing is saved.
 */

test.use(asRole('member'));

test.describe('Member can open their own settings', () => {
  test('MEM-019 - the settings page loads with its tabs @MEM-019', async ({ personalSection }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-member.md#MEM-019',
    });

    /**
     * THE SHEET IS OUT OF DATE HERE, and the code wins (COVERAGE.md section 5).
     *
     * Step 1 says "tabs such as Privacy, Security and Notifications". The page
     * actually renders FOUR for an adult profile - Club Privacy, Security,
     * Notifications and Membership (settings/page.tsx ~line 727 mobile, ~1539
     * desktop). "Membership" is missing from the sheet entirely.
     *
     * All four are asserted rather than the sheet's three, so a tab silently
     * disappearing turns this red. The sheet needs the Membership row added.
     *
     * A fifth tab, "Billing & Subscription", is behind
     * `SHOW_BILLING_SECTION = false` (~line 34) and renders for nobody. That is
     * the sheet's own "billing pane currently hidden" note and MEM-043's STUB -
     * deliberately NOT asserted, and explicitly not a bug to file.
     */
    await personalSection('settings').expectMarkers(routes.personalSettings, [
      { label: 'Club Privacy tab', locator: personalLocators.settingsPrivacyTab },
      { label: 'Security tab', locator: personalLocators.settingsSecurityTab },
      { label: 'Notifications tab', locator: personalLocators.settingsNotificationsTab },
      { label: 'Membership tab', locator: personalLocators.settingsMembershipTab },
    ]);
  });
});

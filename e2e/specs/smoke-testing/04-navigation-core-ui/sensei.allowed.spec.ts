import { test, asRole } from '../../../support/fixtures';
import { clubRoute, routes } from '../../../support/routes';
import { commonLocators } from '../../../locators/common.locators';

/**
 * Smoke group 04 - navigation & core UI.
 *
 * Manual scenario: manual-qa/role-sensei.md
 *   SEN-001  My Club is visible to a sensei
 *
 * The positive counterpart to sensei.blocked.spec.ts in this folder, and the
 * sensei twin of secretary.allowed.spec.ts.
 *
 * Read-only: it navigates and reads.
 */

test.use(asRole('sensei'));

test.describe('Sensei is offered the club they teach at', () => {
  test('SEN-001 - My Club leads to the club the sensei teaches at @SEN-001', async ({
    dashboardPage,
    clubSection,
    clubId,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-sensei.md#SEN-001',
    });

    /**
     * Step 1. The sheet said a plain member with no staff role would not see
     * this entry, and used that as the point of the check. That is not what the
     * app does: the gate is `isAnyClubOwner || userClubs.length > 0`
     * (DesktopSidebar.tsx ~line 201), so any account belonging to a club sees
     * My Club, member or not. The sheet has been corrected, and what is left to
     * assert is simply that the sensei is offered the entry.
     */
    await dashboardPage.expectControlsPresent([
      { label: 'My Club nav entry', locator: commonLocators.myClubNav },
    ]);

    /**
     * Steps 2 and 3: one navigation, not two. `/dashboard/myClub` redirects to
     * the first club rather than offering a picker (myClub/page.tsx ~line 13).
     *
     * NO TAB ASSERTIONS HERE, DELIBERATELY. SEN-002 step 2 expects a sensei to
     * see a Settings tab, and they do - but that is the open bug SEN-042
     * already reports as a red test in sensei.blocked.spec.ts, caused by
     * (authenticated)/layout.tsx ~line 286 mapping a sensei to
     * `userRole: 'owner'`. Asserting the tab bar here would either duplicate a
     * known red or, worse, encode the defect as the expected result. It stays
     * with the one test that treats it as a bug. COVERAGE.md section 3.
     */
    await clubSection('overview').expectReachedVia(routes.myClub, clubRoute(clubId, 'overview'));
  });
});

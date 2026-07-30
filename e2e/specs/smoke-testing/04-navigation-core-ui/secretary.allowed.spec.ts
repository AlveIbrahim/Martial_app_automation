import { test, asRole } from '../../../support/fixtures';
import { clubRoute, routes } from '../../../support/routes';
import { commonLocators } from '../../../locators/common.locators';

/**
 * Smoke group 04 - navigation & core UI.
 *
 * Manual scenario: manual-qa/role-secretary.md
 *   SEC-001  My Club nav is visible to the secretary
 *
 * The positive counterpart to secretary.blocked.spec.ts in this folder. That
 * file proves a secretary is turned away from Analytics, History, Teachers and
 * (currently, wrongly) Club Settings; this one proves they still get the
 * management surface they are entitled to. A boundary battery with no positive
 * side is indistinguishable from an app that is simply broken for everyone.
 *
 * It doubles as the positive control for MEM-005: the Members tab that a plain
 * member must NOT be offered is asserted here, with the same selector, for a
 * role that must be.
 *
 * Read-only: it navigates and reads.
 */

test.use(asRole('secretary'));

test.describe('Secretary is offered the club they administer', () => {
  test('SEC-001 - My Club leads to the club, with the secretary tab set @SEC-001', async ({
    dashboardPage,
    clubSection,
    clubId,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-secretary.md#SEC-001',
    });

    /**
     * Step 1: the entry exists in the main navigation. It is gated on
     * `isAnyClubOwner || userClubs.length > 0` (DesktopSidebar.tsx ~line 201),
     * so this asserts the secretary belongs somewhere - it is NOT a staff-only
     * marker, and a plain member in a club sees it too.
     */
    await dashboardPage.expectControlsPresent([
      { label: 'My Club nav entry', locator: commonLocators.myClubNav },
    ]);

    /**
     * Steps 2 and 3, which the sheet had as two: open a club picker, then pick
     * the club. There is no picker. `/dashboard/myClub` redirects straight to
     * the first club the account belongs to (myClub/page.tsx ~line 13), so the
     * two steps are one navigation and the sheet has been corrected.
     *
     * Then the tab set, which is the part with teeth. The club tab bar renders
     * `overview | members | site | settings` and drops two of them by role
     * (Header.tsx ~line 1201): a secretary is offered Members and is NOT
     * offered Settings.
     *
     * Note what this does and does not say about SEC-043. The Settings TAB is
     * correctly withheld here - that is the assertion below. The Settings PAGE
     * is still reachable by typing its URL, which is the open bug, and it is
     * asserted in secretary.blocked.spec.ts where it belongs. The two are
     * different halves of the same screen's access control, and only one of
     * them is broken.
     */
    await clubSection('overview').expectReachedVia(routes.myClub, clubRoute(clubId, 'overview'), {
      present: [{ label: 'Members tab', locator: commonLocators.membersTab }],
      absent: [{ label: 'Settings tab', locator: commonLocators.settingsTab }],
    });
  });
});

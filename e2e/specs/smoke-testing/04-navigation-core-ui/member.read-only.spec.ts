import { test, asRole } from '../../../support/fixtures';
import { clubRoute } from '../../../support/routes';
import { commonLocators } from '../../../locators/common.locators';
import { dashboardLocators } from '../../../locators/dashboard.locators';

/**
 * Smoke group 04 - navigation & core UI.
 *
 * Manual scenarios: manual-qa/role-member.md
 *   MEM-001  Dashboard loads for a plain member
 *   MEM-005  View club overview (member view)
 *
 * What a plain member CAN see on the navigation surface. member.blocked.spec.ts,
 * in this folder, covers what they cannot.
 *
 * The rest of the member read-only battery sits with the group its screen
 * belongs to: MEM-004 in ../11-exams-grading-belts/, MEM-011 in
 * ../15-video-library/, and MEM-008 in ../../regression/ - the sites roster is
 * a regression concern rather than a smoke one.
 *
 * Every "no management control" assertion here is paired with a positive
 * control in owner.allowed.spec.ts, in this folder, proving the SAME selector
 * matches for the primary owner. Without that pair an absence check passes
 * loudest when the selector is simply wrong - README section 7.
 *
 * Read-only, like the rest of the suite: these open pages and read them.
 * Nothing here writes, so they are safe against the shared dev environment.
 */

test.use(asRole('member'));

test.describe('Member can see their own screens, without management controls', () => {
  test('MEM-001 - the dashboard loads for a plain member @MEM-001', async ({ dashboardPage }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-member.md#MEM-001',
    });

    /**
     * Step 2's "no management actions" is asserted through the club share /
     * QR-link control, which is the one owner-only action that renders on this
     * screen (DesktopSidebar.tsx ~line 297, gated on `isAnyClubOwner`).
     *
     * Approve-member and create-class are deliberately NOT asserted here: they
     * do not render on this page for ANY role, so checking for them would pass
     * for the wrong reason and prove nothing.
     */
    await dashboardPage.expectControlsAbsent([
      { label: 'share club / QR link', locator: commonLocators.shareClub },
    ]);

    // Step 1: the cards the sheet expects.
    await dashboardPage.expectCard(dashboardLocators.announcements, 'Club Announcements');
    await dashboardPage.expectCard(dashboardLocators.recentActivity, 'Recent Activity');
  });

  test('MEM-005 - the club overview renders without management controls @MEM-005', async ({
    clubSection,
    clubId,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-member.md#MEM-005',
    });

    /**
     * Step 2, precisely: the tab bar renders `overview | members | site |
     * settings` and drops two of them for a member - Header.tsx ~line 1201
     * hides Settings from `userRole === 'member'` and from a secretary, and
     * Members from `userRole === 'member'`. So a member sees Overview and
     * Sites only.
     */
    await clubSection('overview').expectControlsAbsent(clubRoute(clubId, 'overview'), [
      { label: 'Members tab', locator: commonLocators.membersTab },
      { label: 'Settings tab', locator: commonLocators.settingsTab },
      { label: 'share club / QR link', locator: commonLocators.shareClub },
    ]);
  });
});

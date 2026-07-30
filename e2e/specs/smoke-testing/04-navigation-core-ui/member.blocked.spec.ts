import { test, asRole } from '../../../support/fixtures';
import { clubRoute, type ClubPageKey } from '../../../support/routes';
import type { ClubSection } from '../../../pages/club-section.page';

/**
 * Smoke group 04 - navigation & core UI.
 *
 * Manual scenarios: manual-qa/role-member.md
 *   MEM-007  BLOCKED: View members list
 *   MEM-041  BLOCKED: analytics / history / settings / teachers
 *
 * MEM-042 belongs to group 09 and lives in
 * ../09-calendar-scheduling/member.blocked.spec.ts.
 *
 * Every route asserted here is paired with a positive control in
 * owner.allowed.spec.ts, in this folder, proving the same route DOES load for
 * the primary owner. Without that pair a denial-shaped failure of the app
 * itself would read as correct access control.
 */

test.use(asRole('member'));

test.describe('Member is blocked from management screens', () => {
  // MEM-041 fans out over four routes; each gets its own test so a single
  // regression names the exact page.
  const MEM_041_ROUTES: Array<{ page: ClubPageKey & ClubSection; label: string }> = [
    { page: 'analytics', label: 'Analytics' },
    { page: 'history', label: 'History' },
    { page: 'settings', label: 'Settings' },
    { page: 'teachers', label: 'Teachers' },
  ];

  for (const { page: pageKey, label } of MEM_041_ROUTES) {
    test(`MEM-041 - member blocked from ${label} @MEM-041`, async ({ clubSection, clubId }) => {
      test.info().annotations.push({
        type: 'manual-scenario',
        description: `manual-qa/role-member.md#MEM-041 (${label})`,
      });
      await clubSection(pageKey).expectRestricted(clubRoute(clubId, pageKey));
    });
  }

  /**
   * Scan Attendance is deliberately NOT in the list above. `/scan-attendance`
   * is student self-check-in and is meant to open for a member - it blocks
   * `secretary` only. The staff-side screen is a different route. MEM-041
   * step 6 has been corrected to match; see manual-qa/role-member.md.
   */

  test('MEM-007 - member blocked from the members roster @MEM-007', async ({
    clubSection,
    clubId,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-member.md#MEM-007',
    });
    // Verified in app source: members/page.tsx blocks clubRole === 'club_member'
    // with an "Access Restricted" screen.
    await clubSection('membersRoster').expectRestricted(clubRoute(clubId, 'members'));
  });
});

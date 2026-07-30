import { test, asRole } from '../../../support/fixtures';
import { clubRoute, routes } from '../../../support/routes';
import { clubSectionLocators } from '../../../locators/club-section.locators';
import { personalLocators } from '../../../locators/personal.locators';

/**
 * Smoke group 11 - exams, grading & belt progression.
 *
 * Manual scenarios: manual-qa/role-member.md
 *   MEM-002  Personal belt reference           /dashboard/belts
 *   MEM-003  Personal progression (step 1)     /progress
 *   MEM-004  Progress within a club (step 1)   .../[clubID]/progress
 *
 * The rest of the member read-only battery is in
 * ../04-navigation-core-ui/member.read-only.spec.ts.
 *
 * MEM-003 and MEM-004 are presence checks and need no positive control - a
 * selector that matched nothing would turn them red rather than green. MEM-002
 * also asserts an ABSENCE, so it is paired with owner.allowed.spec.ts in this
 * folder. Read-only throughout; nothing here writes.
 */

test.use(asRole('member'));

test.describe('Member can read their own belts and progress', () => {
  test('MEM-002 - the belt reference renders, without staff controls @MEM-002', async ({
    personalSection,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-member.md#MEM-002',
    });

    /**
     * Step 2 of the sheet asked for the master belts AND the club's belts. The
     * page shows the CLUB's belts only - it is fed by `useGetBeltsByClubQuery`
     * for the selected club and never fetches a master set (belts/page.tsx
     * ~lines 88-93). The sheet has been corrected to match; there is no master
     * belt list on this screen to look for.
     *
     * The club selector the sheet mentions renders only for an account in more
     * than one club (~line 276), so a single-club demo member never sees it.
     * Not asserted either way - it is a function of the seed, not of the role.
     *
     * And "no management controls" on this screen reduces to ONE control:
     * Eligible Students, gated on `canViewEligible` (~lines 130-133) for club
     * owner, primary owner, secretary and sensei. Nothing else here is
     * role-gated for a member - a belt's editor opens from the belt row and is
     * `canEdit` (~line 124), which excludes them for the same reason.
     *
     * Paired with owner.allowed.spec.ts in this folder, which proves this very
     * selector matches for the primary owner. Without that pair a green result
     * here would be equally consistent with a broken selector.
     *
     * One visit, both directions: this page waits on `GET /users/clubs` before
     * it can answer either question.
     */
    await personalSection('belts').expectControls(routes.belts, {
      present: [{ label: 'Dan Ranks section', locator: personalLocators.beltsDanRanks }],
      absent: [{ label: 'Eligible Students', locator: personalLocators.eligibleStudents }],
    });
  });

  test('MEM-003 - personal progression renders for a member @MEM-003', async ({
    personalSection,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-member.md#MEM-003 (step 1)',
    });

    /**
     * Step 1 only, and for the same reason MEM-004 stops there: step 3 asks
     * whether the attendance total at the top matches the sum of the
     * per-curriculum breakdown below, and the seeded member has no attendance
     * at all. The comparison is 0 == 0 - it would pass whether or not the app
     * computes either number correctly, which is worse than not testing it.
     * It needs seeded attendance; that is the data-setup milestone.
     *
     * Step 2 ("the numbers are real, not placeholders") is a human judgement
     * on the same empty data and stays manual.
     */
    await personalSection('progress').expectMarkers(routes.personalProgress, [
      { label: 'belt progression path', locator: personalLocators.progressBeltPath },
    ]);
  });

  test('MEM-004 - club-scoped progress renders for a member @MEM-004', async ({
    clubSection,
    clubId,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-member.md#MEM-004 (step 1)',
    });

    /**
     * Step 1 only. Steps 2 and 3 compare numbers - the club page against
     * `/progress`, and the attendance total against the per-curriculum
     * breakdown. The seeded member has no attendance ("No classes attended
     * yet"), so both comparisons are 0 == 0 and would pass without proving
     * anything. They need seeded attendance; that is the data-setup milestone.
     */
    await clubSection('clubProgress').expectControlsPresent(clubRoute(clubId, 'progress'), [
      { label: 'Belt Journey', locator: clubSectionLocators.beltJourney },
      { label: 'Overall Attendance', locator: clubSectionLocators.overallAttendance },
    ]);
  });
});

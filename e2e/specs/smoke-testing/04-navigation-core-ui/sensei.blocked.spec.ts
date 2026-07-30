import { test, expect, asRole } from '../../../support/fixtures';
import { clubRoute } from '../../../support/routes';
import { ROLE_CLUB_OWNER, ROLE_PRIMARY_OWNER } from '../../../locators/members.locators';

/**
 * Smoke group 04 - navigation & core UI.
 *
 * Manual scenarios: manual-qa/role-sensei.md
 *   SEN-040  BLOCKED: Analytics
 *   SEN-041  BLOCKED: History
 *   SEN-043  BLOCKED: Manage Teachers
 *   SEN-044  BLOCKED: change roles / add / remove / transfer owner
 *
 *   SEN-042  PROBE: reaching Club Settings - currently RED, see below
 *
 * Paired with owner.allowed.spec.ts in this folder, which proves the same
 * routes load and the same role dropdown DOES offer the owner-level options to
 * the primary owner.
 */

test.use(asRole('sensei'));

test.describe('Sensei is blocked from owner-only screens', () => {
  const BLOCKED = [
    { id: 'SEN-040', page: 'analytics' as const, label: 'Analytics' },
    { id: 'SEN-041', page: 'history' as const, label: 'History' },
    { id: 'SEN-043', page: 'teachers' as const, label: 'Teachers' },
  ];

  for (const { id, page: pageKey, label } of BLOCKED) {
    test(`${id} - sensei blocked from ${label} @${id}`, async ({ clubSection, clubId }) => {
      test.info().annotations.push({
        type: 'manual-scenario',
        description: `manual-qa/role-sensei.md#${id}`,
      });
      await clubSection(pageKey).expectRestricted(clubRoute(clubId, pageKey));
    });
  }

  /**
   * SEN-044, the part that holds: a sensei cannot grant owner-level roles.
   *
   * The role editor opens for a sensei, but offers only Club Member and
   * Secretary - the two owner-level options are gated on `isPrimaryOwner`
   * (EditProfileDialog.tsx ~line 237). Paired with the positive control in
   * owner.allowed.spec.ts so this cannot pass on a broken selector.
   */
  test('SEN-044 - sensei cannot grant owner-level roles @SEN-044', async ({
    membersPage,
    clubId,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-sensei.md#SEN-044',
    });

    const options = await membersPage.offeredRoleOptions(clubRoute(clubId, 'members'));

    expect(
      options.filter((o) => ROLE_CLUB_OWNER.test(o) || ROLE_PRIMARY_OWNER.test(o)),
      `a sensei must not be able to grant owner-level roles, but the role ` +
        `dropdown offered: ${JSON.stringify(options)}`,
    ).toHaveLength(0);
  });

  /**
   * EXPECTED TO FAIL - it is reporting an open bug, not a broken test.
   *
   * Assigning roles is owner-only, but a sensei is given the "Assign Role"
   * control anyway.
   *
   * Cause, verified in source and against `dev`: (authenticated)/layout.tsx
   * (~line 286) maps sensei - and secretary, and admin - into
   * `userRole: 'owner'` for the club being viewed, and the button guard is
   * `userRole === 'owner' && target is not primary owner && clubRole !==
   * 'secretary'` (MemberProfileDialog.tsx ~line 396). A sensei satisfies all
   * three. Gating on `clubRole` would fix it.
   *
   * The data is not at risk: PUT /clubs/:clubId/members/:memberId/role requires
   * owner or primary owner (backend clubRoutes.js ~line 858), so the save is
   * refused. The defect is that a control which can never succeed is offered.
   *
   * Same root cause as SEC-043 and SEN-042. Stays RED until the app is fixed.
   */
  test('SEN-044 - sensei is not offered the role editor @SEN-044', async ({
    membersPage,
    clubId,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-sensei.md#SEN-044',
    });
    await membersPage.expectRoleEditorNotOffered(clubRoute(clubId, 'members'), 'sensei');
  });

  /**
   * EXPECTED TO FAIL - same root cause as SEC-043 and SEN-044 above.
   *
   * Club Settings is owner-only, but a sensei gets both the Settings tab and
   * the page itself: settings/page.tsx (~line 444) guards on
   * `userRole !== 'owner'`, and the layout puts sensei in that bucket. A
   * secretary at least has the tab hidden; a sensei is shown it.
   *
   * The server refuses the save (PUT /clubs/:clubId requires owner or primary
   * owner), so this is reachability, not data loss. Proving the refusal means
   * attempting a write, which belongs with the mutating-tests milestone.
   *
   * The sheet keeps its wider PROBE steps for a human; this covers the one
   * part with a definite right answer.
   */
  test('SEN-042 - sensei blocked from Club Settings @SEN-042', async ({
    clubSection,
    clubId,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-sensei.md#SEN-042',
    });
    await clubSection('settings').expectRestricted(clubRoute(clubId, 'settings'));
  });
});

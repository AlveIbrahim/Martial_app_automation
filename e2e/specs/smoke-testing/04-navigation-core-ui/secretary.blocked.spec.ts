import { test, asRole } from '../../../support/fixtures';
import { clubRoute } from '../../../support/routes';

/**
 * Smoke group 04 - navigation & core UI.
 *
 * Manual scenarios: manual-qa/role-secretary.md
 *   SEC-040  BLOCKED: Analytics
 *   SEC-041  BLOCKED: History
 *   SEC-044  BLOCKED: Manage Teachers
 *   SEC-043  BLOCKED: Club Settings - currently RED, see the note at the bottom
 *
 * SEC-042 (Scan Attendance) belongs to group 10 and lives in
 * ../10-attendance-qr/secretary.blocked.spec.ts.
 *
 * Not automated:
 *   SEC-045  PROBE across every owner-only control - a KNOWN-GAP observation
 *            scenario with no defined pass/fail
 *
 * Paired with owner.allowed.spec.ts in this folder, which proves the same
 * routes DO load for the primary owner.
 */

test.use(asRole('secretary'));

test.describe('Secretary is blocked from owner-only screens', () => {
  const BLOCKED = [
    { id: 'SEC-040', page: 'analytics' as const, label: 'Analytics' },
    { id: 'SEC-041', page: 'history' as const, label: 'History' },
    { id: 'SEC-044', page: 'teachers' as const, label: 'Teachers' },
  ];

  for (const { id, page: pageKey, label } of BLOCKED) {
    test(`${id} - secretary blocked from ${label} @${id}`, async ({ clubSection, clubId }) => {
      test.info().annotations.push({
        type: 'manual-scenario',
        description: `manual-qa/role-secretary.md#${id}`,
      });
      await clubSection(pageKey).expectRestricted(clubRoute(clubId, pageKey));
    });
  }
});

/**
 * EXPECTED TO FAIL - it is reporting an open bug, not a broken test.
 *
 * Club Settings is owner-only. The Settings TAB is correctly hidden from a
 * secretary, but typing the address opens the real settings form.
 *
 * Cause, verified in source: (authenticated)/layout.tsx (~line 286) maps
 * secretary - and sensei, and admin - into `userRole: 'owner'` for the club
 * being viewed, while settings/page.tsx (~line 444) guards on
 * `userRole !== 'owner'`. The page's own comment says it means
 * "club_owner_primary/club_owner/admin", so the guard does not match its
 * intent. Gating on `clubRole` would fix it.
 *
 * The data is not at risk: PUT /clubs/:clubId requires owner or primary owner
 * (backend clubRoutes.js ~line 281), so a secretary's save is refused. The
 * defect is that an owner-only screen is reachable at all.
 *
 * This stays RED until the app is fixed. Do not skip it and do not soften it -
 * a red result here is the bug report.
 */
test.describe('Secretary is blocked from owner-only screens', () => {
  test('SEC-043 - secretary blocked from Club Settings @SEC-043', async ({
    clubSection,
    clubId,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-secretary.md#SEC-043',
    });
    await clubSection('settings').expectRestricted(clubRoute(clubId, 'settings'));
  });
});

import { test, asRole } from '../../../support/fixtures';
import { clubRoute } from '../../../support/routes';

/**
 * Smoke group 10 - attendance & QR flow.
 *
 * Manual scenarios: manual-qa/role-secretary.md
 *   SEC-042  BLOCKED: Scan Attendance
 *
 * The rest of the secretary boundary battery is in
 * ../04-navigation-core-ui/secretary.blocked.spec.ts.
 *
 * `/scan-attendance` is student self-check-in: it opens for a member on
 * purpose and blocks `secretary` only. The instructor-side screen is a
 * different route, `site/[siteId]/rooms/[roomId]/attendance`.
 *
 * NO POSITIVE CONTROL EXISTS for this route. The owner battery omits
 * `/scan-attendance` because the page mounts a live camera (html5-qrcode,
 * `#qr-reader`), so a headless owner pass would say nothing useful. The cost is
 * real: a `/scan-attendance` route broken for everyone would read here as
 * correct access control. See this folder's README.
 */

test.use(asRole('secretary'));

test.describe('Secretary is blocked from scan attendance', () => {
  test('SEC-042 - secretary blocked from Scan Attendance @SEC-042', async ({
    clubSection,
    clubId,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-secretary.md#SEC-042',
    });
    await clubSection('scanAttendance').expectRestricted(clubRoute(clubId, 'scanAttendance'));
  });
});

import { test, expect, asRole } from '../../../support/fixtures';
import { clubRoute } from '../../../support/routes';
import { ROLE_CLUB_OWNER, ROLE_PRIMARY_OWNER } from '../../../locators/members.locators';
import { commonLocators } from '../../../locators/common.locators';

/**
 * Smoke group 04 - navigation & core UI.
 *
 * POSITIVE CONTROLS for every boundary test in this folder.
 *
 * The specs beside this one assert that a denial screen appears, or that a
 * control is not offered. On their own those tests would still pass if the
 * route 404'd, the club id were wrong, or the app were simply broken for
 * everyone - a denial-shaped false green.
 *
 * These prove the same routes and the same selectors DO work for the primary
 * owner, so a denial elsewhere is genuinely role-driven. If this file goes red,
 * treat every "blocked" and "control absent" result in this run as unreliable
 * until it is fixed.
 *
 * The other two groups with absence checks carry their own positive controls:
 * ../15-video-library/owner.allowed.spec.ts and
 * ../../regression/owner.allowed.spec.ts.
 *
 * Cross-references the "confirm it works for the owner" comparison steps in
 * manual-qa/role-secretary.md (SEC-045) and role-sensei.md (SEN-042/CR-018).
 */

test.use(asRole('ownerPrimary'));

test.describe('Owner CAN reach the screens other roles are blocked from', () => {
  test('owner reaches Analytics @positive-control', async ({ clubSection, clubId }) => {
    await clubSection('analytics').expectGranted(clubRoute(clubId, 'analytics'));
  });

  test('owner reaches History @positive-control', async ({ clubSection, clubId }) => {
    await clubSection('history').expectGranted(clubRoute(clubId, 'history'));
  });

  test('owner reaches Teachers @positive-control', async ({ clubSection, clubId }) => {
    await clubSection('teachers').expectGranted(clubRoute(clubId, 'teachers'));
  });

  test('owner reaches the members roster @positive-control', async ({ clubSection, clubId }) => {
    await clubSection('membersRoster').expectGranted(clubRoute(clubId, 'members'));
  });

  test('owner reaches Club Settings @positive-control', async ({ clubSection, clubId }) => {
    await clubSection('settings').expectGranted(clubRoute(clubId, 'settings'));
  });

  /**
   * POSITIVE CONTROL for the role-editor absence tests: SEN-044 in
   * sensei.blocked.spec.ts here, and OWS-040 / OWS-041 in
   * ../../regression/co-owner.blocked.spec.ts.
   *
   * Those assert the primary-owner-only options are NOT offered. This proves
   * the same three-step flow DOES offer them to the primary owner, so their
   * absence elsewhere is a permission boundary rather than a stale selector or
   * a dialog that silently failed to open. If this test is red, treat both of
   * those files as unreliable.
   *
   * Note for a folder-scoped run: this control lives here because SEN-044 does.
   * `npm run test:regression` on its own therefore runs OWS-040 / OWS-041
   * without it - see ../../regression/README.md.
   */
  test('owner is offered the owner-level roles @positive-control', async ({
    membersPage,
    clubId,
  }) => {
    const options = await membersPage.offeredRoleOptions(clubRoute(clubId, 'members'));

    expect(
      options.filter((o) => ROLE_CLUB_OWNER.test(o) || ROLE_PRIMARY_OWNER.test(o)),
      `the primary owner must be offered both owner-level roles, but the ` +
        `dropdown offered: ${JSON.stringify(options)}`,
    ).toHaveLength(2);
  });

  /**
   * POSITIVE CONTROLS for member.read-only.spec.ts in this folder.
   *
   * Those tests assert a plain member is offered none of these controls. Each
   * test below proves the SAME selector matches for the primary owner on the
   * SAME screen, so a member's empty result is a permission boundary and not a
   * selector that matches nothing for anybody. If one of these goes red, treat
   * its partner in the member spec as proving nothing.
   */
  test('owner IS offered the club tabs and share control @positive-control', async ({
    clubSection,
    clubId,
  }) => {
    await clubSection('overview').expectControlsPresent(clubRoute(clubId, 'overview'), [
      { label: 'Members tab', locator: commonLocators.membersTab },
      { label: 'Settings tab', locator: commonLocators.settingsTab },
      { label: 'share club / QR link', locator: commonLocators.shareClub },
    ]);
  });

  test('owner sees the share control on their dashboard @positive-control', async ({
    dashboardPage,
  }) => {
    await dashboardPage.expectControlsPresent([
      { label: 'share club / QR link', locator: commonLocators.shareClub },
    ]);
  });

  /**
   * Scan Attendance intentionally omitted: the page mounts a live camera
   * (html5-qrcode, #qr-reader) and needs real hardware plus a permissions
   * grant, so a headless pass or fail says nothing useful. It stays a manual
   * check - see manual-qa/role-owner-primary.md and START-HERE section 5.
   *
   * The cost: SEC-042 in ../10-attendance-qr/ has no positive control, so a
   * `/scan-attendance` route that broke for everyone would read as correct
   * access control. Noted in that folder's README.
   */
});

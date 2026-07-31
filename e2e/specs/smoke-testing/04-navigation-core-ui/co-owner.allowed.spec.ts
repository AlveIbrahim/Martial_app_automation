import { test, asRole } from '../../../support/fixtures';
import { clubRoute, type ClubPageKey } from '../../../support/routes';
import { commonLocators } from '../../../locators/common.locators';
import type { ClubSection } from '../../../pages/club-section.page';

/**
 * Smoke group 04 - navigation & core UI.
 *
 * Manual scenario: manual-qa/role-owner-secondary.md
 *   OWS-001  Co-owner sees the full management surface
 *
 * THE SHEET NEEDS TWO CORRECTIONS, both confirmed in the source.
 *
 * 1. Step 1 asks for "the five tabs (Overview, Calendar, Members, Site,
 *    Settings)". The bar renders FOUR - Header.tsx ~line 1202 maps over
 *    `['overview','members','site','settings']`. A `calendar` entry survives in
 *    the label map beside it (~line 1216) but is never rendered, which is
 *    probably where the fifth came from. Calendar is a SIDEBAR destination, not
 *    a club tab; `SMK-030` covers it there.
 *
 * 2. Step 1 also calls the third tab "Site". Its label is "Sites", plural,
 *    while the route and tab key stay singular.
 *
 * WHY THIS IS 🟡 AND NOT ✅: step 3 lists Scan Attendance among the pages to
 * open. That screen mounts a live camera (`html5-qrcode`, `#qr-reader`) and
 * needs real hardware plus a permissions grant, so it stays a manual check for
 * every owner-ish role - the same reason it is excluded from OWP's battery. All
 * nine other pages in step 3 are automated below.
 *
 * WHAT THE GUARDS ACTUALLY SAY, since "co-owner reaches everything" is the
 * claim under test and it is worth citing rather than assuming:
 *   - usage             `clubRole` in club_owner | club_owner_primary   (~line 285)
 *   - eligible-students `canView` includes club_owner                   (~line 414)
 *   - promotions        `canManage` includes club_owner                 (~line 201)
 *   - exams, curricula, belts    no role guard at all
 *   - analytics, history, teachers, settings, members   owner-only, and a
 *     co-owner IS an owner
 * So every page below is expected to open. A denial on any of them is a real
 * finding, not a broken test.
 *
 * Note `usage` is one of the few screens that gates on `clubRole` rather than
 * `userRole` - it is what the three red tests in COVERAGE.md section 3 should
 * have done.
 *
 * Read-only: navigate and assert. Nothing is saved.
 */

test.use(asRole('coOwner'));

test.describe('Co-owner is offered the full management surface', () => {
  /**
   * Step 1. The tab bar is the discriminator between the owner view and the
   * member view, so this is the test that answers the scenario's actual
   * question - "owner view, not member view".
   *
   * Overview and Sites carry no role condition, so they prove the bar rendered
   * at all; Members and Settings are the two a plain member is denied
   * (Header.tsx ~lines 1203-1211). Asserting all four together means a missing
   * Members tab cannot be confused with a tab bar that never painted.
   */
  test('OWS-001 - the club overview gives a co-owner the full tab set @OWS-001', async ({
    clubSection,
    clubId,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-owner-secondary.md#OWS-001',
    });

    await clubSection('overview').expectControls(clubRoute(clubId, 'overview'), {
      present: [
        { label: 'Overview tab', locator: commonLocators.overviewTab },
        { label: 'Members tab', locator: commonLocators.membersTab },
        { label: 'Sites tab', locator: commonLocators.sitesTab },
        { label: 'Settings tab', locator: commonLocators.settingsTab },
      ],
      absent: [],
    });
  });

  /**
   * Steps 2 and 3. One test per page rather than one loop through all of them:
   * `fullyParallel` then spreads them across workers, and a failure names the
   * page in the report instead of stopping the sweep at the first bad one.
   *
   * The four tab destinations come first, then the nine management pages.
   */
  /**
   * `route` and `section` are carried separately because they are not always the
   * same word: the members page is route key `members` and section
   * `membersRoster`. Everywhere else they coincide.
   */
  const DESTINATIONS: Array<{ route: ClubPageKey; section: ClubSection; label: string }> = [
    // Step 2 - where each tab leads.
    { route: 'members', section: 'membersRoster', label: 'the members roster' },
    { route: 'site', section: 'site', label: 'Sites' },
    { route: 'settings', section: 'settings', label: 'Club Settings' },
    // Step 3 - the management pages reached from the overview.
    { route: 'analytics', section: 'analytics', label: 'Analytics' },
    { route: 'history', section: 'history', label: 'History' },
    { route: 'teachers', section: 'teachers', label: 'Teachers' },
    { route: 'clubBelts', section: 'clubBelts', label: 'the club belt system' },
    { route: 'curricula', section: 'curricula', label: 'Curricula' },
    { route: 'exams', section: 'exams', label: 'Belt Promotion Exams' },
    { route: 'promotions', section: 'promotions', label: 'Belt Promotions' },
    { route: 'eligibleStudents', section: 'eligibleStudents', label: 'Eligible Students' },
    { route: 'usage', section: 'usage', label: 'App Usage' },
  ];

  for (const { route, section, label } of DESTINATIONS) {
    test(`OWS-001 - co-owner reaches ${label} @OWS-001`, async ({ clubSection, clubId }) => {
      test.info().annotations.push({
        type: 'manual-scenario',
        description: 'manual-qa/role-owner-secondary.md#OWS-001',
      });

      // expectGranted waits for a POSITIVE marker, not merely the absence of a
      // denial - these pages render nothing at all until the club role
      // resolves, so "no denial visible" is true of the loading frame too.
      await clubSection(section).expectGranted(clubRoute(clubId, route));
    });
  }
});

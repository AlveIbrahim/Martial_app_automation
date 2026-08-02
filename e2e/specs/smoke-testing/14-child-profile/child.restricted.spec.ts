import { test, asRole } from '../../../support/fixtures';
import type { NavKey } from '../../../locators/nav.locators';
import { assertChildProfilePresent } from '../../../support/roles';

/**
 * Smoke group 14 - child profile.
 *
 * Manual scenario: manual-qa/role-child.md
 *   CHD-001  Child menu is restricted
 *
 * TWO OF THESE ARE RED ON PURPOSE. See CLAUDE.md rule 4.
 *
 * The app hides exactly ONE of the things CHD-001 says a child must not be
 * offered. Both nav components carry this pair of lines, and the comment does
 * not match the code (DesktopSidebar.tsx ~line 232, BottomNavigation.tsx ~line
 * 142):
 *
 *     // Child profiles: hide messages and support (parent-only features)
 *     if (currentProfileType === 'child' && item.nameKey === 'support') return false;
 *
 * Messages is named in the comment and missing from the code - an unfinished
 * line, not a disagreement about intent, which is why it is asserted as the
 * scenario states rather than corrected in the sheet. My Club is asserted on
 * the sheet's authority alone; if product rules that children should see their
 * club, delete that row rather than softening the assertion.
 *
 * The sheet needed two corrections, both applied to manual-qa/role-child.md:
 *   - It expects a "Belts" item. Neither nav component renders `nameKey:
 *     'belts'` for any role, so no test could ever pass. The sheet was wrong.
 *   - It reads the phone bar's missing Messages as a child restriction. That
 *     bar is a different six-item set for everyone (see nav.locators.ts), and
 *     it also drops Support for any club member regardless of profile - so
 *     neither absence is child-specific and neither is asserted here.
 */

test.use(asRole('parent'));

/** What CHD-001 says a child must NOT be offered in the sidebar. */
const WITHHELD_FROM_CHILD: Array<{ key: NavKey; label: string; red: boolean }> = [
  { key: 'support', label: 'Support', red: false },
  { key: 'messages', label: 'Messages', red: true },
  { key: 'myClub', label: 'My Club', red: true },
];

/**
 * Areas the child keeps. Asserted so a sidebar that failed to render at all
 * cannot make every absence check above pass for the wrong reason.
 */
const KEPT_BY_CHILD: Array<{ key: NavKey; label: string }> = [
  { key: 'home', label: 'Home' },
  { key: 'progress', label: 'Progress' },
  { key: 'library', label: 'Library' },
];

test.describe('CHD-001 - the child menu is restricted', () => {
  test.beforeEach(async ({ profileSwitchPage }) => {
    const { name, pin } = assertChildProfilePresent();
    await profileSwitchPage.switchToChild(name, pin);
    // The menu is left open by the switch and would cover the sidebar.
    await profileSwitchPage.closeAccountMenu();
  });

  for (const { key, label, red } of WITHHELD_FROM_CHILD) {
    test(`CHD-001 - sidebar withholds ${label} from a child @CHD-001`, async ({
      navigationPage,
    }) => {
      test.info().annotations.push({
        type: 'manual-scenario',
        description: `manual-qa/role-child.md#CHD-001 steps 1-3 (${label})`,
      });
      if (red) {
        test.info().annotations.push({
          type: 'known-app-bug',
          description:
            `${label} is offered to a child. Only 'support' is filtered on ` +
            `currentProfileType (DesktopSidebar.tsx ~line 233). Red until fixed.`,
        });
      }

      await navigationPage.expectDestinationWithheld(
        key,
        label,
        `CHD-001 says the child menu hides Messages, Support and My Club.`,
      );
    });
  }

  for (const { key, label } of KEPT_BY_CHILD) {
    test(`CHD-001 - sidebar still offers ${label} to a child @CHD-001`, async ({
      navigationPage,
    }) => {
      test.info().annotations.push({
        type: 'manual-scenario',
        description: `manual-qa/role-child.md#CHD-001 step 3 (${label} retained)`,
      });

      await navigationPage.expectDestinationOffered(
        key,
        label,
        `CHD-001 says this one stays. If EVERY item is missing the sidebar ` +
          `never rendered, and the withheld-item tests in this file are ` +
          `passing for the wrong reason - fix this one first.`,
      );
    });
  }

  test('CHD-001 - account menu offers Switch to Parent, not My Profile @CHD-001', async ({
    profileSwitchPage,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-child.md#CHD-001 step 4',
    });

    await profileSwitchPage.expectChildAccountMenu();
  });
});

/**
 * THE POSITIVE CONTROL (CLAUDE.md rule 3).
 *
 * Same account, same selectors, same viewport - without the switch. Every
 * absence asserted above has to be a presence here, or those tests are passing
 * because the selector is wrong rather than because the app withholds anything.
 *
 * This one carries more weight than most. Two of the three absences above are
 * expected to FAIL today, so the file's normal state is partly red. If this
 * control ever goes red too, that inverts the meaning of the failures upstairs
 * - they stop being "known app bug" and become "broken test" - and nothing
 * else in the file would tell you which you were looking at.
 */
test.describe('CHD-001 - positive control: the parent IS offered all of it', () => {
  for (const { key, label } of WITHHELD_FROM_CHILD) {
    test(`CHD-001 control - parent is offered ${label} @CHD-001`, async ({ navigationPage }) => {
      await navigationPage.openDashboard();

      await navigationPage.expectDestinationOffered(
        key,
        label,
        `The parent was not offered it either, so the child-side absence check ` +
          `for it proves nothing. Fix this before reading any CHD-001 result: ` +
          `either the selector is wrong, or this account has no clubs - ` +
          `Calendar, Payment and My Club are filtered out while ` +
          `GET /users/clubs is empty.`,
      );
    });
  }
});

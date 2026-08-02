import type { Page, Locator } from '@playwright/test';

/**
 * The account menu and the parent/child profile switcher. LOCATORS ONLY.
 *
 * WHERE THIS LIVES IN THE APP, AND THE ONE TRAP
 *
 * There are TWO switch-profile implementations in the frontend and only one of
 * them runs. `components/household/SwitchProfileModal.tsx` looks like the
 * obvious target - it is a clean, self-contained component with exactly the
 * markup you would want - but it is imported by nothing. The live switcher is
 * inline in `components/common/Header.tsx` (~line 1658, the dialog; ~line 1888,
 * the PIN modal), and its markup is NOT the same. Locators recorded against the
 * dead component match nothing at run time.
 *
 * NO TEST ATTRIBUTES HERE. Unlike the sidebar, none of this carries a
 * `data-track`, so these fall back to roles and accessible names, with EN|FR
 * alternation where a name is the only handle.
 */

/** EN|FR for the handful of names that have no structural alternative. */
const SWITCH_PROFILE = /Switch Profile|Changer de profil/i;
const SWITCH_TO_PARENT = /Switch to Parent|Passer au profil parent/i;
const MY_PROFILE = /My Profile|Mon profil/i;

export const profileLocators = {
  /**
   * The avatar in the top-right that opens the account menu.
   *
   * Anchored on `aria-haspopup="menu"`, which Radix's DropdownMenu.Trigger sets
   * itself - the button has no accessible name at all, only nested divs holding
   * an image or an initial (Header.tsx ~line 1095), so there is nothing else
   * stable to match. Scoped to `header` because the notification and club
   * switchers use the same primitive elsewhere on the page.
   */
  accountMenuTrigger: (page: Page): Locator =>
    page.locator('header button[aria-haspopup="menu"]').first(),

  /** One entry in the open account menu, by visible name. */
  accountMenuItem: (page: Page, name: RegExp): Locator =>
    page.getByRole('menuitem', { name }),

  /** "Switch Profile" - opens the dialog listing the household's profiles. */
  switchProfileItem: (page: Page): Locator =>
    page.getByRole('menuitem', { name: SWITCH_PROFILE }),

  /**
   * "My Profile" - the entry CHD-001 step 4 says a child must not be offered.
   * Gated on `currentProfileType !== 'child'` (Header.tsx ~line 1098).
   */
  myProfileItem: (page: Page): Locator =>
    page.getByRole('menuitem', { name: MY_PROFILE }),

  /**
   * "Switch to Parent" - a Button, not a menuitem, and it replaces the Logout
   * button at the foot of the menu for a child (Header.tsx ~line 1172). Its
   * presence is the cheapest proof that child mode is actually in effect.
   */
  switchToParentButton: (page: Page): Locator =>
    page.getByRole('button', { name: SWITCH_TO_PARENT }),

  /**
   * One child's card in the switch dialog, matched by the name shown on it
   * (Header.tsx ~line 1767). Scoped to the dialog so it cannot accidentally
   * match the same name on the household page behind it.
   */
  childProfileCard: (page: Page, childName: string): Locator =>
    page.getByRole('dialog').getByRole('button').filter({ hasText: childName }),

  /**
   * The PIN field. `input[name="pin"]` is exact and locale-proof
   * (Header.tsx ~line 1909); the placeholder is translated, the name is not.
   */
  pinInput: (page: Page): Locator => page.locator('input[name="pin"]'),

  /** The PIN modal's submit. It is the only submit inside that form. */
  pinSubmit: (page: Page): Locator =>
    page.locator('form:has(input[name="pin"]) button[type="submit"]'),
};

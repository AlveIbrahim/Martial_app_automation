import type { Page, Locator } from '@playwright/test';

/**
 * The primary sidebar navigation. LOCATORS ONLY.
 *
 * THE ONE PLACE THIS APP HAS A TEST-FRIENDLY ATTRIBUTE
 *
 * Every nav item renders `data-track="nav:<key>"` (DesktopSidebar.tsx ~line
 * 268), which is as close to a `data-testid` as this codebase gets. It is worth
 * preferring over the accessible name for two concrete reasons, not just tidiness:
 *
 *   1. LOCALE-PROOF. No EN|FR alternation to keep in sync.
 *   2. IT SURVIVES THE COLLAPSED SIDEBAR. The text label is only rendered when
 *      `expanded` (~line 292); collapsed, the name comes from a `title`
 *      attribute instead. The attribute is there in both states.
 *
 * `:visible` IS LOAD-BEARING, exactly as it is for `#email` on the login page.
 * `BottomNavigation.tsx` (~line 161) renders the SAME `data-track` values for
 * its own items, and these are raw CSS locators - unlike `getByRole`, a CSS
 * locator matches hidden elements too, so without `:visible` each of these
 * resolves to two nodes and fails strict mode. The bottom bar is `md:hidden`
 * (~line 152), so at the suite's 1280px exactly one is visible.
 *
 * THE PHONE NAV IS A DIFFERENT SET, NOT A RESTYLE. The bottom bar offers six
 * items (home, calendar, library, payment, support, myClub) against the
 * sidebar's eight - it drops Messages and Progress entirely. Any nav assertion
 * re-recorded for a phone has to be written against that set, not this one.
 */

/**
 * The eight sidebar destinations, in render order (DesktopSidebar.tsx ~line 41).
 *
 * `share` is deliberately absent. It carries `data-track="nav:share"` and sits
 * in the same sidebar, but it is a `<button>` that opens a dialog rather than a
 * `<Link>` that navigates - so it cannot be part of a "does every destination
 * load" sweep. It is located as `commonLocators.shareClub` and driven by
 * `OWP-002`.
 */
export const NAV_KEYS = [
  'home',
  'calendar',
  'messages',
  'progress',
  'library',
  'support',
  'payment',
  'myClub',
] as const;

export type NavKey = (typeof NAV_KEYS)[number];

export const navLocators = {
  /** One sidebar destination, by its `data-track` key. */
  link: (page: Page, key: NavKey): Locator =>
    page.locator(`[data-track="nav:${key}"]:visible`),

  /**
   * Every visible sidebar destination at once, for counting.
   *
   * Deliberately excludes `nav:share`, which is a button: the attribute selector
   * is anchored to the eight keys above rather than matching `nav:*`.
   */
  allLinks: (page: Page): Locator =>
    page.locator(NAV_KEYS.map((k) => `[data-track="nav:${k}"]:visible`).join(', ')),
};

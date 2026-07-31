import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage, RENDER_TIMEOUT } from './base.page';
import { navLocators, NAV_KEYS, type NavKey } from '../locators/nav.locators';
import { clubSectionLocators } from '../locators/club-section.locators';
import { personalLocators } from '../locators/personal.locators';
import { dashboardLocators } from '../locators/dashboard.locators';
import { routes } from '../support/routes';

/**
 * The primary sidebar, and whether everything it offers actually works.
 *
 * WHY THIS CLICKS RATHER THAN NAVIGATES
 *
 * Every other page object in this suite reaches a screen with `goto`. This one
 * clicks the real link, because the thing under test IS the link. Three of the
 * eight hrefs are computed at render time from `GET /users/clubs`
 * (DesktopSidebar.tsx ~lines 198-223) - Calendar and Library resolve to
 * club-scoped URLs, and Payment forks between `/payments` for an owner and
 * `/user-payments` for everyone else. A test that navigated to a URL it worked
 * out for itself would assert the page renders while never touching the
 * computation that decides where the user is actually sent, which is the half
 * most likely to break.
 */

interface NavDestination {
  key: NavKey;
  /** What the item says on screen - for failure messages only, never matched. */
  label: string;
  /** Something only the destination renders, proving it truly loaded. */
  marker: (page: Page) => Locator;
}

/**
 * Where each sidebar item lands, and how to know it got there.
 *
 * The three markers added for SMK-030 are `messages`, `supportDesk` and
 * `payments`; the rest were already in the suite, which is the payoff of
 * keeping markers in `locators/` rather than inline.
 *
 * Two entries do NOT go where their name suggests, and both are deliberate:
 *   - `home` lands on `/dashboard`, so its marker is a dashboard card.
 *   - `myClub` does not render a picker; it redirects to the first club's
 *     overview (myClub/page.tsx ~line 13), so its marker is the overview's.
 */
const NAV_DESTINATIONS: NavDestination[] = [
  { key: 'home', label: 'Home', marker: dashboardLocators.announcements },
  { key: 'calendar', label: 'Calendar', marker: clubSectionLocators.calendar },
  { key: 'messages', label: 'Messages', marker: personalLocators.messages },
  { key: 'progress', label: 'Progress', marker: personalLocators.progress },
  { key: 'library', label: 'Library', marker: clubSectionLocators.clubLibrary },
  { key: 'support', label: 'Support', marker: personalLocators.supportDesk },
  { key: 'payment', label: 'Payment', marker: clubSectionLocators.payments },
  { key: 'myClub', label: 'My Club', marker: clubSectionLocators.overview },
];

export class NavigationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Walk every sidebar destination in turn and prove each one renders.
   *
   * Starts with `gotoAndAwaitClubRole`, and that is not the usual caution about
   * judging controls too early - here it is a hard prerequisite. Calendar,
   * Payment and My Club are FILTERED OUT of the sidebar entirely while
   * `userClubs` is empty (DesktopSidebar.tsx ~lines 224-234), so a sweep that
   * started before the response would find only five items and report the three
   * missing ones as a dead nav.
   *
   * No return trip between destinations: the sidebar is part of the
   * authenticated layout and is present on all eight screens, so the next click
   * happens from wherever the last one landed. `?standalone=true` on the Library
   * href does not strip the chrome - it only propagates to that page's own child
   * links (library/page.tsx ~line 81).
   */
  async expectEveryDestinationLoads(): Promise<void> {
    await this.gotoAndAwaitClubRole(routes.dashboard);

    // The count is asserted first so a sidebar that renders three items short
    // fails once, here, with a clear message - rather than eight times below.
    await expect(
      navLocators.allLinks(this.page),
      `the sidebar did not offer all ${NAV_KEYS.length} destinations to this role. ` +
        `Calendar, Payment and My Club are hidden while GET /users/clubs is ` +
        `unanswered or returns no clubs, so a short count usually means the club ` +
        `role never resolved - not that the nav is broken.`,
    ).toHaveCount(NAV_KEYS.length, { timeout: RENDER_TIMEOUT });

    for (const { key, label, marker } of NAV_DESTINATIONS) {
      const link = navLocators.link(this.page, key);

      await expect(
        link,
        `the sidebar offered no "${label}" destination (data-track="nav:${key}").`,
      ).toBeVisible({ timeout: RENDER_TIMEOUT });

      await link.click();

      await expect(
        marker(this.page),
        `"${label}" is offered in the sidebar, but following it never rendered ` +
          `its destination. Either the link points somewhere dead, or that page ` +
          `is broken for this role. Landed on: ${this.page.url()}`,
      ).toBeVisible({ timeout: RENDER_TIMEOUT });
    }
  }
}

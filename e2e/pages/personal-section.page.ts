import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage, RENDER_TIMEOUT } from './base.page';
import { personalLocators } from '../locators/personal.locators';
import type { NamedControl } from './club-section.page';

export type PersonalSection = 'belts' | 'progress' | 'settings';

/**
 * Any PERSONAL screen - one with no club id in its URL.
 *
 * One object rather than a class per page, for the same reason ClubSectionPage
 * gives: these pages differ only by which marker proves they rendered. What
 * differs from ClubSectionPage is the question being asked. There is no role
 * guard here and no denial screen to expect: every authenticated account
 * reaches these pages, and the test is what they are OFFERED once there.
 *
 * DashboardPage stays its own object - it is the personal home screen with its
 * own cards, and it predates this.
 */
export class PersonalSectionPage extends BasePage {
  constructor(page: Page, private readonly section: PersonalSection) {
    super(page);
  }

  private marker(): Locator {
    return personalLocators[this.section](this.page);
  }

  /**
   * Navigate and assert the real page rendered.
   *
   * `gotoAndAwaitClubRole`, not `goto`, even though these routes are not
   * club-scoped: their contents are still gated on data from
   * `GET /users/clubs` - the belts page picks its club from it
   * (belts/page.tsx ~line 45) and decides the Eligible Students control from
   * the role it reports (~line 130). Judge either before it answers and the
   * result describes the loading frame, not the role.
   *
   * `/settings` does not read the club role for its TAB BAR - that is gated on
   * the profile type - but it is covered by the same wait because the
   * authenticated layout issues `GET /users/clubs` on every page beneath it,
   * so the response arrives here too and the settings page's own club-scoped
   * content (the privacy toggles) depends on it. If a future personal route
   * ever loads WITHOUT that call, the wait falls through on its timeout rather
   * than failing - correct, but it would cost the full CLUB_ROLE_TIMEOUT, so
   * give that route a plain `goto` instead.
   */
  async expectLoaded(route: string): Promise<void> {
    await this.gotoAndAwaitClubRole(route);

    await expect(
      this.marker(),
      `expected ${route} to render for this role, but its content never appeared`,
    ).toBeVisible({ timeout: RENDER_TIMEOUT });
  }

  /** Load, then assert further markers the sheet expects on the page. */
  async expectMarkers(route: string, markers: NamedControl[]): Promise<void> {
    await this.expectLoaded(route);

    for (const { label, locator } of markers) {
      await expect(
        locator(this.page).first(),
        `"${label}" is missing from ${route}`,
      ).toBeVisible({ timeout: RENDER_TIMEOUT });
    }
  }

  /**
   * Load, then assert controls this role must not be offered.
   *
   * Waits for the page to render first, or the control is trivially absent
   * because nothing has loaded yet.
   */
  async expectControlsAbsent(route: string, controls: NamedControl[]): Promise<void> {
    await this.expectLoaded(route);

    for (const { label, locator } of controls) {
      await expect(
        locator(this.page),
        `"${label}" is visible on ${route} for a role that must not have it`,
      ).toHaveCount(0);
    }
  }

  /**
   * Both directions on one screen, in a single visit - see the twin on
   * ClubSectionPage. The belts page waits on `GET /users/clubs` before it can
   * decide either question, so asking them separately doubles the wait.
   */
  async expectControls(
    route: string,
    { present, absent }: { present: NamedControl[]; absent: NamedControl[] },
  ): Promise<void> {
    await this.expectLoaded(route);

    for (const { label, locator } of present) {
      await expect(
        locator(this.page).first(),
        `"${label}" did not appear on ${route} for a role that must have it`,
      ).toBeVisible({ timeout: RENDER_TIMEOUT });
    }

    for (const { label, locator } of absent) {
      await expect(
        locator(this.page),
        `"${label}" is visible on ${route} for a role that must not have it`,
      ).toHaveCount(0);
    }
  }

  /**
   * The mirror image, and the reason the absence checks mean anything: prove
   * the very same selectors DO match for a role that should have the controls.
   * See the false-green rule in README section 7.
   */
  async expectControlsPresent(route: string, controls: NamedControl[]): Promise<void> {
    await this.expectLoaded(route);

    for (const { label, locator } of controls) {
      await expect(
        locator(this.page).first(),
        `"${label}" did not appear on ${route} for a role that must have it - ` +
          `the matching absence test elsewhere therefore proves nothing`,
      ).toBeVisible({ timeout: RENDER_TIMEOUT });
    }
  }
}

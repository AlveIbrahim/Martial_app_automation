import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage, RENDER_TIMEOUT } from './base.page';
import { dashboardLocators } from '../locators/dashboard.locators';
import { routes } from '../support/routes';
import type { NamedControl } from './club-section.page';

/**
 * The personal home dashboard, `/dashboard`.
 *
 * Its own object rather than a ClubSectionPage because it is not club-scoped:
 * there is no club id in the URL and no club role to resolve, so none of the
 * "does this role get in" machinery applies. Every authenticated account gets
 * this page; only its contents differ.
 */
export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate and assert the real dashboard rendered, not a spinner.
   *
   * Waits for the club role as well, even though this page is not club-scoped:
   * the share control it is checked for is gated on `isAnyClubOwner`, which
   * comes from the same `GET /users/clubs` - see gotoAndAwaitClubRole.
   */
  async expectLoaded(): Promise<void> {
    await this.gotoAndAwaitClubRole(routes.dashboard);

    await expect(
      dashboardLocators.welcome(this.page),
      `${routes.dashboard} never rendered its welcome heading`,
    ).toBeVisible({ timeout: RENDER_TIMEOUT });
  }

  /** Assert a card the sheet expects is on the page. */
  async expectCard(card: (page: Page) => Locator, label: string): Promise<void> {
    await expect(
      card(this.page),
      `the "${label}" card is missing from ${routes.dashboard}`,
    ).toBeVisible({ timeout: RENDER_TIMEOUT });
  }

  /** Load, then assert controls this role must not be offered. */
  async expectControlsAbsent(controls: NamedControl[]): Promise<void> {
    await this.expectLoaded();

    for (const { label, locator } of controls) {
      await expect(
        locator(this.page),
        `"${label}" is visible on ${routes.dashboard} for a role that must not have it`,
      ).toHaveCount(0);
    }
  }

  /** The positive control for the above - see README section 7. */
  async expectControlsPresent(controls: NamedControl[]): Promise<void> {
    await this.expectLoaded();

    for (const { label, locator } of controls) {
      await expect(
        locator(this.page).first(),
        `"${label}" did not appear on ${routes.dashboard} for a role that must ` +
          `have it - the matching absence test therefore proves nothing`,
      ).toBeVisible({ timeout: RENDER_TIMEOUT });
    }
  }
}

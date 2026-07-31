import { expect, type Page, type Locator } from '@playwright/test';
import { BasePage, RENDER_TIMEOUT } from './base.page';
import { clubSectionLocators } from '../locators/club-section.locators';

export type ClubSection =
  | 'analytics'
  | 'history'
  | 'teachers'
  | 'settings'
  | 'membersRoster'
  | 'calendar'
  | 'scanAttendance'
  | 'overview'
  | 'site'
  | 'clubLibrary'
  | 'clubProgress'
  | 'payments'
  | 'usage'
  | 'eligibleStudents'
  | 'curricula'
  | 'promotions'
  | 'exams'
  | 'clubBelts';

/** A control named for failure messages, so a red test says which one appeared. */
export interface NamedControl {
  label: string;
  locator: (page: Page) => Locator;
}

/**
 * Any club screen whose test is "does this role get in, or get turned away".
 *
 * One object rather than seven near-identical classes: these pages differ only
 * by which marker proves they rendered. The members page has its own object
 * because it has real interaction behind it.
 */
export class ClubSectionPage extends BasePage {
  constructor(page: Page, private readonly section: ClubSection) {
    super(page);
  }

  private marker(): Locator {
    return clubSectionLocators[this.section](this.page);
  }

  /** Navigate, then assert this role is turned away. */
  async expectRestricted(route: string): Promise<void> {
    await this.goto(route);
    await this.expectBlocked(route);
  }

  /**
   * Navigate, then assert the real page rendered for this role.
   *
   * Takes a positive marker on purpose. Asserting only "denial block absent"
   * passes during the loading frame, which is a false green - the worst kind
   * of test.
   */
  async expectGranted(route: string): Promise<void> {
    await this.goto(route);

    await expect(
      this.marker(),
      `expected ${route} to render for this role, but its content never appeared`,
    ).toBeVisible({ timeout: RENDER_TIMEOUT });

    await this.expectNotBlocked(route);
  }

  /**
   * Assert the page loads for this role but a specific control is absent from
   * it (the "you can look, but not touch" scenarios).
   *
   * Waits for the page to actually render first, otherwise the control is
   * trivially absent because nothing has loaded yet.
   */
  async expectControlAbsent(
    route: string,
    control: (page: Page) => Locator,
    controlLabel: string,
  ): Promise<void> {
    await this.expectControlsAbsent(route, [{ label: controlLabel, locator: control }]);
  }

  /**
   * The same check for several controls on one screen, in a single visit.
   *
   * Calling expectControlAbsent once per control would reload these pages
   * three times over, and they take 5-8s each to resolve their club role.
   */
  async expectControlsAbsent(route: string, controls: NamedControl[]): Promise<void> {
    await this.gotoAndAwaitClubRole(route);

    await expect(
      this.marker(),
      `page ${route} never finished loading, so the absence of ` +
        `${controls.map((c) => `"${c.label}"`).join(', ')} proves nothing`,
    ).toBeVisible({ timeout: RENDER_TIMEOUT });

    for (const { label, locator } of controls) {
      await expect(
        locator(this.page),
        `"${label}" is visible on ${route} for a role that must not have it`,
      ).toHaveCount(0);
    }
  }

  /**
   * Arrive at this screen the way a user does - by following a route that
   * redirects here - and assert both where we landed and what is offered.
   *
   * `/dashboard/myClub` is the case this exists for. The sheets call it a club
   * picker; it is not. It redirects to the first club the account belongs to
   * (myClub/page.tsx ~line 13), so the thing to assert is the landing URL, not
   * a list of clubs to choose from.
   *
   * Controls are checked on the same load, because getting here costs a full
   * club-role resolution and these screens are slow.
   */
  async expectReachedVia(
    from: string,
    expectedRoute: string,
    controls: { present: NamedControl[]; absent: NamedControl[] } = { present: [], absent: [] },
  ): Promise<void> {
    const escaped = expectedRoute.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await this.gotoExpectingRedirect(from, new RegExp(`${escaped}/?$`));

    await expect(
      this.marker(),
      `${from} redirected to ${expectedRoute}, but the page never rendered for this role`,
    ).toBeVisible({ timeout: RENDER_TIMEOUT });

    await this.expectNotBlocked(expectedRoute);

    for (const { label, locator } of controls.present) {
      await expect(
        locator(this.page).first(),
        `"${label}" did not appear on ${expectedRoute} for a role that must have it`,
      ).toBeVisible({ timeout: RENDER_TIMEOUT });
    }

    for (const { label, locator } of controls.absent) {
      await expect(
        locator(this.page),
        `"${label}" is visible on ${expectedRoute} for a role that must not have it`,
      ).toHaveCount(0);
    }
  }

  /**
   * Both directions on one screen, in a single visit.
   *
   * The "you get these, but not those" scenarios - a staff role that is offered
   * the Members tab and withheld the Settings tab, for instance. Calling
   * expectControlsPresent and expectControlsAbsent in turn would load the page
   * twice, and these screens take 5-8s just to resolve their club role.
   *
   * The present list also does the absence list's positive-control work: it
   * proves the page reached the state where controls render at all, on the same
   * load, for the same role.
   */
  async expectControls(
    route: string,
    { present, absent }: { present: NamedControl[]; absent: NamedControl[] },
  ): Promise<void> {
    await this.gotoAndAwaitClubRole(route);

    await expect(
      this.marker(),
      `expected ${route} to render for this role, but its content never appeared`,
    ).toBeVisible({ timeout: RENDER_TIMEOUT });

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
    await this.gotoAndAwaitClubRole(route);

    await expect(
      this.marker(),
      `expected ${route} to render for this role, but its content never appeared`,
    ).toBeVisible({ timeout: RENDER_TIMEOUT });

    for (const { label, locator } of controls) {
      await expect(
        locator(this.page).first(),
        `"${label}" did not appear on ${route} for a role that must have it - ` +
          `the matching absence test elsewhere therefore proves nothing`,
      ).toBeVisible({ timeout: RENDER_TIMEOUT });
    }
  }
}

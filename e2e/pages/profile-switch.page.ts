import { expect, type Page } from '@playwright/test';
import { BasePage, RENDER_TIMEOUT } from './base.page';
import { profileLocators } from '../locators/profile.locators';
import { routes } from '../support/routes';

/**
 * Getting into child mode, which every group 14 scenario needs first.
 *
 * WHY THIS DRIVES THE UI RATHER THAN CALLING THE API
 *
 * `POST /households/{id}/switch-to-child` would be one request and far faster,
 * and the temptation is real. It is wrong here for a specific reason: the
 * switch sets a NEW pair of httpOnly cookies over the existing session
 * (ProfileContext.tsx ~line 86), and the front end only picks the change up
 * after it refetches `/users/profile` and re-renders. A test that swapped the
 * cookies underneath the browser would be asserting a nav state the app never
 * actually navigated into - which is precisely the bug class CHD-001 exists to
 * catch. So the switch happens the way a parent does it.
 *
 * A knock-on benefit: PAR-004 and CHD-007 are this same flow, so they reuse
 * this rather than re-recording it.
 */
export class ProfileSwitchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Sign-in-as-parent -> child, ending on the dashboard in child mode.
   *
   * Starts with `gotoAndAwaitClubRole` for the usual reason (CLAUDE.md rule 6):
   * everything this unlocks is a "control offered or withheld" assertion, and
   * `userRole` sits at its 'member' default until `GET /users/clubs` answers.
   */
  async switchToChild(childName: string, pin: string): Promise<void> {
    await this.gotoAndAwaitClubRole(routes.dashboard);

    await profileLocators.accountMenuTrigger(this.page).click();

    const switchItem = profileLocators.switchProfileItem(this.page);
    await expect(
      switchItem,
      `the account menu offered no "Switch Profile" entry. Either the menu did ` +
        `not open, or this account has no household (ONB-020).`,
    ).toBeVisible({ timeout: RENDER_TIMEOUT });
    await switchItem.click();

    const card = profileLocators.childProfileCard(this.page, childName);
    await expect(
      card,
      `the switch dialog listed no child called "${childName}".\n` +
        `ROLE_PARENT_CHILD_NAME must match a profile that exists in this ` +
        `environment's household - the dialog shows the name the API returns, ` +
        `which for a child created by ONB-021 is "<first> <last>".`,
    ).toBeVisible({ timeout: RENDER_TIMEOUT });
    await card.click();

    await profileLocators.pinInput(this.page).fill(pin);

    /**
     * Created before the click, or a fast answer lands before anyone listens.
     *
     * The path is `/switch-profile`, NOT `/switch-to-child` - the RTK Query
     * mutation is named `switchToChildProfile` but its url is not
     * (householdApi.ts ~line 571). Going the other way IS `/switch-to-parent`,
     * so the pair is not symmetric and the obvious guess is wrong in exactly
     * one direction.
     */
    const switched = this.page
      .waitForResponse(
        (res) => /\/switch-profile\b/.test(res.url()) && res.request().method() === 'POST',
        { timeout: RENDER_TIMEOUT },
      )
      .catch(() => null);

    await profileLocators.pinSubmit(this.page).click();
    const res = await switched;

    expect(
      res?.ok() ?? false,
      `the profile switch was rejected (${res?.status() ?? 'no response'}). ` +
        `Usually a wrong ROLE_PARENT_CHILD_PIN. Note the app locks a profile ` +
        `after repeated failures (PAR-006), and the lockout outlives the run - ` +
        `so a wrong PIN in .env poisons every later attempt for 15 minutes.`,
    ).toBeTruthy();

    // The cookies are set, but the nav is still the parent's until the profile
    // refetch lands and re-renders. Gate on a child-only control appearing, so
    // callers can assert immediately without racing the re-render.
    await this.expectInChildMode();
  }

  /**
   * Prove child mode is actually in effect.
   *
   * "Switch to Parent" replaces the Logout button for a child and nothing else
   * renders it (Header.tsx ~line 1172), so it is a positive marker - it cannot
   * pass by an element simply being absent, which is what makes it usable as
   * the precondition for a battery of absence checks.
   */
  async expectInChildMode(): Promise<void> {
    const trigger = profileLocators.accountMenuTrigger(this.page);
    const marker = profileLocators.switchToParentButton(this.page);

    await expect(async () => {
      if (!(await marker.isVisible())) {
        await trigger.click();
      }
      await expect(marker).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: RENDER_TIMEOUT });
  }

  /** Close the account menu so it cannot cover the nav being asserted. */
  async closeAccountMenu(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await expect(profileLocators.switchToParentButton(this.page)).toBeHidden();
  }

  /**
   * CHD-001 step 4: what the account menu offers a child.
   *
   * "Switch to Parent" present is a POSITIVE marker, so it cannot pass by the
   * menu simply failing to open - which is what makes the "My Profile" absence
   * below trustworthy in the same breath.
   */
  async expectChildAccountMenu(): Promise<void> {
    await this.openAccountMenu();

    await expect(
      profileLocators.switchToParentButton(this.page),
      'the child was offered no "Switch to Parent" control, so there is no way back.',
    ).toBeVisible({ timeout: RENDER_TIMEOUT });

    await expect(
      profileLocators.myProfileItem(this.page),
      'the account menu offered "My Profile" to a child. It is gated on ' +
        'currentProfileType !== "child" (Header.tsx ~line 1098).',
    ).toBeHidden();
  }

  /** Open the account menu and leave it open, for asserting its contents. */
  async openAccountMenu(): Promise<void> {
    const marker = profileLocators.switchProfileItem(this.page);
    await expect(async () => {
      if (!(await marker.isVisible())) {
        await profileLocators.accountMenuTrigger(this.page).click();
      }
      await expect(marker).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: RENDER_TIMEOUT });
  }
}

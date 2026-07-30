import { expect, type Page } from '@playwright/test';
import { BasePage, RENDER_TIMEOUT } from './base.page';
import { membersLocators, ROLE_OPTION_TEXT } from '../locators/members.locators';

/**
 * The members roster and its role editor.
 *
 * WHY THE INTERACTION MATTERS
 *
 * Earlier versions of these tests asserted `count === 0` for an "assign role" /
 * "transfer ownership" button on the members page and passed - for the wrong
 * reason. Nothing matched for ANY role, the primary owner included, because no
 * such buttons exist: promotion happens through a dropdown three interactions
 * deep. An absence check that never had anything to find is unfalsifiable.
 *
 * So this drives the real flow, and every absence assertion in the specs is
 * paired with a positive control proving the primary owner IS offered the same
 * options.
 *
 * READ-ONLY. It opens dialogs and the dropdown, and never saves - no role is
 * ever changed. Safe against the shared deployed environment.
 */
export class MembersPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Open a plain member's profile.
   *
   * A plain member on purpose: the "Assign Role" button is hidden when the
   * target is the primary owner (MemberProfileDialog.tsx ~line 398), which
   * would look identical to "this role may not assign roles".
   */
  private async openPlainMemberProfile(route: string): Promise<void> {
    await this.goto(route);

    const row = membersLocators.plainMemberRow(this.page);
    await expect(
      row,
      `no "Club Member" row on ${route}, so the member profile could not be opened. ` +
        `The roster either did not load or the seeded club has no plain member.`,
    ).toBeVisible({ timeout: RENDER_TIMEOUT });

    await row.click();
  }

  /**
   * Open the role editor and return the role labels it offers.
   */
  async offeredRoleOptions(route: string): Promise<string[]> {
    await this.openPlainMemberProfile(route);

    const assign = membersLocators.assignRole(this.page);
    await expect(
      assign,
      `the member profile dialog on ${route} offered no "Assign Role" button. ` +
        `Every role that reaches this check is expected to get it - the club-role ` +
        `restrictions are on the OPTIONS inside, not on opening the editor.`,
    ).toBeVisible({ timeout: RENDER_TIMEOUT });
    await assign.first().click();

    // The dropdown trigger renders the target's current role, so it matches the
    // same pattern as the options; clicking the first match opens the list.
    const trigger = membersLocators.roleChoice(this.page).first();
    await expect(
      trigger,
      `the role editor opened but no role dropdown appeared on ${route}.`,
    ).toBeVisible({ timeout: RENDER_TIMEOUT });
    await trigger.click();

    const labels = await membersLocators.roleChoice(this.page).allTextContents();
    const unique = [...new Set(labels.map((l) => l.trim()).filter((l) => ROLE_OPTION_TEXT.test(l)))];

    expect(
      unique.length,
      `the role dropdown on ${route} rendered no recognisable options. ` +
        `Labels seen: ${JSON.stringify(labels)}`,
    ).toBeGreaterThan(0);

    return unique;
  }

  /**
   * Assert this role is NOT offered the role editor at all.
   *
   * Anchors on a control every role legitimately gets, so "Assign Role is
   * absent" cannot pass simply because the dialog never opened.
   */
  async expectRoleEditorNotOffered(route: string, role: string): Promise<void> {
    await this.openPlainMemberProfile(route);

    await expect(
      membersLocators.updateBelt(this.page),
      `the member profile dialog did not open on ${route}, so the absence of ` +
        `"Assign Role" proves nothing.`,
    ).toBeVisible({ timeout: RENDER_TIMEOUT });

    await expect(
      membersLocators.assignRole(this.page),
      `a ${role} must not be offered the "Assign Role" control, but it is present. ` +
        `The app maps sensei, secretary and admin to userRole 'owner' for the club ` +
        `being viewed (layout.tsx ~line 286), and the button gates on userRole ` +
        `(MemberProfileDialog.tsx ~line 396). The server still refuses the save ` +
        `(clubRoutes.js ~line 858), so this is a UI leak rather than an escalation.`,
    ).toHaveCount(0);
  }
}

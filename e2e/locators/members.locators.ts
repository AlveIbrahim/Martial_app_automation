import type { Page, Locator } from '@playwright/test';

/**
 * Members page and its role editor. LOCATORS ONLY.
 *
 * There is no "transfer ownership" or "add co-owner" button anywhere in the
 * app. Promotion is done by picking a role from a dropdown, and the two
 * owner-level options render only for the primary owner (`isPrimaryOwner`,
 * EditProfileDialog.tsx ~line 237).
 *
 * DESKTOP PATH. At >=1024px the roster renders MembersTableView
 * (`hidden lg:block`); the card list with its own inline controls is the
 * <1024px path. Tests run at 1280x720, so the flow is:
 *   table row -> MemberProfileDialog -> "Assign Role" -> EditProfileDialog
 *
 * `SelectDropdown` (components/ui/select-dropdown.tsx) is plain buttons with no
 * ARIA roles, so options are matched by exact accessible name rather than
 * getByRole('option').
 */

/**
 * Role labels in the members role dropdown, from the `clubMembers` namespace.
 * Anchored so "Club Owner" cannot also match "Primary Owner" or vice versa.
 */
export const ROLE_OPTION_TEXT =
  /^(Club Member|Sensei|Secretary|Club Owner|Primary Owner|Membre du club|Secr[ée]taire|Propri[ée]taire du club|Propri[ée]taire principal)$/;

/** The two owner-level grants, offered only to the primary owner. */
export const ROLE_CLUB_OWNER = /^(Club Owner|Propri[ée]taire du club)$/;
export const ROLE_PRIMARY_OWNER = /^(Primary Owner|Propri[ée]taire principal)$/;

export const membersLocators = {
  /** A roster row for a plain member - the safe target to open. */
  plainMemberRow: (page: Page): Locator =>
    page.locator('table tbody tr').filter({ hasText: /Club Member|Membre du club/ }).first(),

  assignRole: (page: Page): Locator =>
    page.getByRole('button', { name: /^(Assign Role|Assigner un r[ôo]le)$/i }),

  /** Offered to every role that can open a profile - the "dialog opened" anchor. */
  updateBelt: (page: Page): Locator =>
    page.getByRole('button', { name: /^(Update Belt|Mettre [àa] jour ceinture)$/i }),

  /** Any role choice - matches the dropdown trigger and its options alike. */
  roleChoice: (page: Page): Locator =>
    page.getByRole('button').filter({ hasText: ROLE_OPTION_TEXT }),
};

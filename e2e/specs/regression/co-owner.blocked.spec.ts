import { test, expect, asRole } from '../../support/fixtures';
import { clubRoute } from '../../support/routes';
import { ROLE_CLUB_OWNER, ROLE_PRIMARY_OWNER } from '../../locators/members.locators';

/**
 * Regression, not smoke - the co-owner boundary is a depth concern rather than
 * a "does the product work at all" one. See the "Outside the smoke checklist"
 * table in smoke_testing_scenarios.md.
 *
 * Manual scenarios: manual-qa/role-owner-secondary.md
 *   OWS-040  BLOCKED: transfer primary ownership (primary owner only)
 *   OWS-041  BLOCKED: add a co-owner (primary owner only)
 *
 * Both are "control absent" checks, not page blocks: a co-owner has the full
 * owner surface including the members page, with exactly two controls reserved
 * for the primary owner.
 */

test.use(asRole('coOwner'));

/**
 * Both scenarios describe a "control" that does not exist as a button anywhere
 * in the app. Promotion is done by picking a role in the members role editor,
 * and the two owner-level options are rendered only when the current user is
 * the primary owner (`isPrimaryOwner`, EditProfileDialog.tsx ~line 237). There
 * is no transfer-ownership button at all - `TransferOwnershipDialog` exists but
 * `setTransferOwnershipConfirm` is never called with a member, so it is
 * unreachable in the UI.
 *
 * These therefore assert the option is not OFFERED, which is the same boundary
 * the scenarios mean.
 *
 * THEIR POSITIVE CONTROL IS IN ANOTHER FOLDER. "owner is offered the
 * owner-level roles" lives in
 * ../smoke-testing/04-navigation-core-ui/owner.allowed.spec.ts, because SEN-044
 * needs the same one. A full run pairs them; `npm run test:regression` alone
 * does not, so a passing result there is not on its own evidence that the
 * dropdown selector still matches anything. See README.md in this folder.
 */
test.describe('Co-owner does not get primary-owner-only controls', () => {
  test('OWS-040 - co-owner cannot grant primary ownership @OWS-040', async ({
    membersPage,
    clubId,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-owner-secondary.md#OWS-040',
    });

    const options = await membersPage.offeredRoleOptions(clubRoute(clubId, 'members'));

    expect(
      options.filter((o) => ROLE_PRIMARY_OWNER.test(o)),
      `a co-owner must not be able to hand over primary ownership, but the role ` +
        `dropdown offered: ${JSON.stringify(options)}`,
    ).toHaveLength(0);
  });

  test('OWS-041 - co-owner cannot promote another co-owner @OWS-041', async ({
    membersPage,
    clubId,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-owner-secondary.md#OWS-041',
    });

    const options = await membersPage.offeredRoleOptions(clubRoute(clubId, 'members'));

    expect(
      options.filter((o) => ROLE_CLUB_OWNER.test(o)),
      `a co-owner must not be able to create another co-owner, but the role ` +
        `dropdown offered: ${JSON.stringify(options)}`,
    ).toHaveLength(0);
  });
});

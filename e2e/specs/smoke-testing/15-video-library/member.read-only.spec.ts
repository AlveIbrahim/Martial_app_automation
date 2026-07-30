import { test, asRole } from '../../../support/fixtures';
import { clubRoute } from '../../../support/routes';
import { clubSectionLocators } from '../../../locators/club-section.locators';

/**
 * Smoke group 15 - video library.
 *
 * Manual scenarios: manual-qa/role-member.md
 *   MEM-011  Club library view, read-only (steps 1 and 3)
 *
 * The rest of the member read-only battery is in
 * ../04-navigation-core-ui/member.read-only.spec.ts.
 *
 * Paired with owner.allowed.spec.ts in this folder, which proves the manage
 * link DOES render for the primary owner on this same screen.
 */

test.use(asRole('member'));

test.describe('Member can read the club library, without managing it', () => {
  test('MEM-011 - the club library is read-only for a member @MEM-011', async ({
    clubSection,
    clubId,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-member.md#MEM-011 (steps 1 and 3)',
    });

    /**
     * The manage control is a LINK with an aria-label, not a button
     * (library/page.tsx ~line 639). A button-shaped selector would find
     * nothing for anyone and this test would be a false green.
     *
     * Worth knowing: that guard reads `userRole === 'owner' && clubRole !==
     * 'secretary'`, which is the same `userRole` alias behind SEN-044 - a
     * sensei is offered this control too. Out of scope for a member scenario;
     * recorded in COVERAGE.md instead.
     *
     * Step 2 (open a move and play its media) stays manual - it is a video
     * playback judgement.
     */
    await clubSection('clubLibrary').expectControlsAbsent(clubRoute(clubId, 'library'), [
      { label: 'Manage library', locator: clubSectionLocators.manageLibrary },
    ]);
  });
});

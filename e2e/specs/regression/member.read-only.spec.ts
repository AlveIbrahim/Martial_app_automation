import { test, asRole } from '../../support/fixtures';
import { clubRoute } from '../../support/routes';
import { clubSectionLocators } from '../../locators/club-section.locators';

/**
 * Regression, not smoke - the sites roster is a depth concern. See the
 * "Outside the smoke checklist" table in smoke_testing_scenarios.md.
 *
 * Manual scenarios: manual-qa/role-member.md
 *   MEM-008  Browse sites and rooms, read-only (steps 1 and 3)
 *
 * The smoke half of the member read-only battery is in
 * ../smoke-testing/04-navigation-core-ui/member.read-only.spec.ts.
 *
 * Paired with owner.allowed.spec.ts in this folder, which proves the same site
 * management controls DO render for the primary owner.
 */

test.use(asRole('member'));

test.describe('Member can browse sites and rooms, without managing them', () => {
  test('MEM-008 - sites and rooms are read-only for a member @MEM-008', async ({
    clubSection,
    clubId,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-member.md#MEM-008 (steps 1 and 3)',
    });

    /**
     * `canEdit` here is a real clubRole check - `club_owner_primary` or
     * `club_owner` only (site/page.tsx ~line 673) - not the `userRole` alias
     * that causes SEC-043 / SEN-042 / SEN-044. A member is correctly excluded.
     *
     * Step 2 (open a site, then a room inside it) is not automated yet: it
     * needs a seeded room to click into, which puts it with the data-setup
     * milestone. The list itself IS asserted, via the page marker.
     */
    await clubSection('site').expectControlsAbsent(clubRoute(clubId, 'site'), [
      { label: 'Add Site', locator: clubSectionLocators.addSite },
      { label: 'Add Room', locator: clubSectionLocators.addRoom },
    ]);
  });
});

import { test, asRole } from '../../support/fixtures';
import { clubRoute } from '../../support/routes';
import { clubSectionLocators } from '../../locators/club-section.locators';

/**
 * POSITIVE CONTROL for member.read-only.spec.ts in this folder.
 *
 * MEM-008 asserts a plain member is offered neither Add Site nor Add Room. This
 * proves the SAME selectors match for the primary owner on the SAME screen, so
 * the member's empty result is a permission boundary and not a selector that
 * matches nothing for anybody. If this is red, MEM-008 proves nothing.
 *
 * It lives here rather than with the wider owner battery so that
 * `npm run test:regression` can never run MEM-008 without its pair.
 */

test.use(asRole('ownerPrimary'));

test.describe('Owner CAN manage sites and rooms', () => {
  test('owner IS offered the site management controls @positive-control', async ({
    clubSection,
    clubId,
  }) => {
    await clubSection('site').expectControlsPresent(clubRoute(clubId, 'site'), [
      { label: 'Add Site', locator: clubSectionLocators.addSite },
      { label: 'Add Room', locator: clubSectionLocators.addRoom },
    ]);
  });
});

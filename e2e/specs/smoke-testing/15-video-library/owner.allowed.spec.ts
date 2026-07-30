import { test, asRole } from '../../../support/fixtures';
import { clubRoute } from '../../../support/routes';
import { clubSectionLocators } from '../../../locators/club-section.locators';

/**
 * Smoke group 15 - video library.
 *
 * POSITIVE CONTROL for member.read-only.spec.ts in this folder.
 *
 * MEM-011 asserts a plain member is not offered the library manage link. This
 * proves the SAME selector matches for the primary owner on the SAME screen, so
 * the member's empty result is a permission boundary and not a selector that
 * matches nothing for anybody. If this is red, MEM-011 proves nothing.
 *
 * It lives in this folder rather than with the wider owner battery so that
 * `npm run test:group -- 15` can never run the absence check without its pair.
 */

test.use(asRole('ownerPrimary'));

test.describe('Owner CAN manage the club library', () => {
  test('owner IS offered the library manage link @positive-control', async ({
    clubSection,
    clubId,
  }) => {
    await clubSection('clubLibrary').expectControlsPresent(clubRoute(clubId, 'library'), [
      { label: 'Manage library', locator: clubSectionLocators.manageLibrary },
    ]);
  });
});

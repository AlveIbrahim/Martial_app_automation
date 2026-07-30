import { test, asRole } from '../../../support/fixtures';
import { routes } from '../../../support/routes';
import { personalLocators } from '../../../locators/personal.locators';

/**
 * POSITIVE CONTROL for group 11. Not a manual scenario - it has no ID because
 * it proves nothing about the product on its own.
 *
 * What it does prove is that the selector MEM-002 checks for the absence of
 * actually matches something when the role is allowed to have it. Without
 * this, "a member is not offered Eligible Students" passes just as loudly when
 * the selector is simply wrong, or the control has been renamed, or the page
 * has stopped rendering entirely. That is the mistake SEN-044, OWS-040 and
 * OWS-041 all made before they were rewritten - COVERAGE.md section 1.
 *
 * IF THIS IS RED, TREAT MEM-002's ABSENCE RESULT AS UNRELIABLE.
 *
 * It lives in this folder, beside the check it backs, so that
 * `npm run test:group -- 11` cannot run one half without the other.
 */

test.use(asRole('ownerPrimary'));

test.describe('Positive control: the belts page offers its staff control to the owner', () => {
  test('owner IS offered Eligible Students on the belts page @positive-control', async ({
    personalSection,
  }) => {
    /**
     * `canViewEligible` (belts/page.tsx ~lines 130-133) admits club owner,
     * primary owner, secretary and sensei. The primary owner is the least
     * ambiguous of those to assert with - the other three are entangled with
     * the `userRole` aliasing bug in COVERAGE.md section 3.
     *
     * The Dan Ranks marker is asserted too, so a page that failed to render at
     * all reports as that rather than as a missing control.
     */
    await personalSection('belts').expectControlsPresent(routes.belts, [
      { label: 'Dan Ranks section', locator: personalLocators.beltsDanRanks },
      { label: 'Eligible Students', locator: personalLocators.eligibleStudents },
    ]);
  });
});

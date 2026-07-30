import { test, asRole } from '../../../support/fixtures';
import { clubRoute } from '../../../support/routes';
import { clubSectionLocators } from '../../../locators/club-section.locators';

/**
 * Smoke group 09 - calendar & scheduling.
 *
 * Manual scenarios: manual-qa/role-member.md
 *   MEM-042  BLOCKED: create an event (calendar half, steps 1-2)
 *
 * The rest of the member boundary battery is in
 * ../04-navigation-core-ui/member.blocked.spec.ts.
 */

test.use(asRole('member'));

test.describe('Member cannot schedule on the club calendar', () => {
  test('MEM-042 - member sees no create-event control on the calendar @MEM-042', async ({
    clubSection,
    clubId,
  }) => {
    test.info().annotations.push({
      type: 'manual-scenario',
      description: 'manual-qa/role-member.md#MEM-042 (calendar, steps 1-2)',
    });
    await clubSection('calendar').expectControlAbsent(
      clubRoute(clubId, 'calendar'),
      clubSectionLocators.createEvent,
      'create event/class',
    );
  });

  /**
   * MEM-042's members-page half is not here on purpose: a plain member is
   * turned away from that page entirely (MEM-007, in
   * ../04-navigation-core-ui/member.blocked.spec.ts), so there is no roster on
   * which to check for absent controls. The sheet's step 3 assumed they could
   * see it; MEM-007 is the behaviour that ships.
   *
   * NO POSITIVE CONTROL EXISTS for `clubSectionLocators.createEvent`. Nothing
   * proves that selector matches for the owner, so this test would also pass if
   * the selector were simply wrong. Writing OWP-009 or a create-event control
   * for the owner would close it - see this folder's README.
   */
});

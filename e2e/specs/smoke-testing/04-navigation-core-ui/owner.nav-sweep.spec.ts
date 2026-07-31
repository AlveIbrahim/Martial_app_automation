import { test, asRole } from '../../../support/fixtures';

/**
 * Smoke group 04 - navigation & core UI.
 *
 * Scenario: SMK-030 - every primary nav destination loads for the owner.
 *
 * NO MANUAL SHEET. `SMK-030` is one of the new IDs defined in
 * smoke_testing_scenarios.md rather than in `manual-qa/`, so there is no
 * annotation linking back to a markdown file - there is nothing to link to.
 *
 * WHAT THIS BUYS, IN ONE TEST
 *
 * Eight destinations, each proved to render. A dead route anywhere in the
 * primary navigation turns this red, which no other test in the suite would
 * catch: every other spec navigates by URL, so all of them would keep passing
 * while the thing a user actually clicks was broken.
 *
 * Run as the OWNER on purpose. The sidebar's contents are role-dependent, and
 * the owner sees the largest set - so this is the widest sweep available. The
 * member's narrower set is asserted from the other direction by `MEM-001` and
 * `MEM-005`, which check that management chrome is withheld.
 *
 * Read-only: it clicks links and reads headings. Nothing is saved.
 */

test.use(asRole('ownerPrimary'));

/**
 * Eight full page loads, and the club pages resolve their role slowly - the
 * measurements behind `CLUB_ROLE_TIMEOUT` are in base.page.ts. `test.slow()`
 * triples the 120s budget rather than raising the global one for every test.
 * This is a long test because it does eight tests' worth of work, not because
 * anything here is inefficient.
 */
test.slow();

test.describe('Owner can reach every primary navigation destination', () => {
  test('SMK-030 - every sidebar destination loads @SMK-030', async ({ navigationPage }) => {
    await navigationPage.expectEveryDestinationLoads();
  });
});

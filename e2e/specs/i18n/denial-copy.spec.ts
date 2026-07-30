import { test, expect, asRole } from '../../support/fixtures';
import { clubRoute } from '../../support/routes';
import { commonLocators, RAW_I18N_KEY } from '../../locators/common.locators';

/**
 * Pins the missing i18n key on the teachers denial screen.
 *
 * THE ACCESS CONTROL IS CORRECT. A sensei is properly turned away from the
 * teachers page, and sensei.blocked.spec.ts asserts exactly that as SEN-043.
 * What is broken is only the heading it is turned away with:
 * `teacherManagement.accessRestricted` is absent from BOTH messages/en.json and
 * messages/fr.json, so next-intl renders the key path itself and the user reads
 * a dotted identifier where a sentence should be. The `|| 'Access Restricted'`
 * fallback at teachers/page.tsx:128 is dead code - the key path it falls back
 * from is a truthy string.
 *
 * This is the worked example behind README section 7's middle row: behaviour
 * correct, copy broken. So `DENIAL_TEXT` in common.locators.ts tolerates the
 * raw-key shape, which keeps a label from breaking an access-control result -
 * and this spec is what pays for that tolerance, because with it in place
 * nothing else watches the label at all.
 *
 * `fixme` because the key is still missing: run it today and it fails. It is
 * not a scenario in its own right and has no manual ID.
 *
 * REMOVE THIS AND THE TOLERANCE TOGETHER. When the key lands in both messages
 * files, drop the `fixme`, confirm it passes, then narrow `DENIAL_TEXT` by
 * deleting its `\baccess(Restricted|Denied)\b` alternative.
 */

test.use(asRole('sensei'));

test.fixme('the teachers denial heading is a sentence, not a raw i18n key', async ({
  page,
  clubId,
}) => {
  const route = clubRoute(clubId, 'teachers');
  await page.goto(route, { waitUntil: 'domcontentloaded' });

  const heading = commonLocators.denialHeading(page);
  await expect(heading).toBeVisible();

  await expect(
    heading,
    `the denial screen on ${route} is showing a raw next-intl key instead of a ` +
      `sentence. Add "accessRestricted" to the teacherManagement namespace in ` +
      `messages/en.json and messages/fr.json.`,
  ).not.toHaveText(RAW_I18N_KEY);
});

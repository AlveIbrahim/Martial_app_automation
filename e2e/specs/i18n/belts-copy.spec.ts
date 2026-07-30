import { test, expect, asRole } from '../../support/fixtures';
import { routes } from '../../support/routes';
import { RAW_I18N_KEY_WITHIN } from '../../locators/common.locators';
import { personalLocators } from '../../locators/personal.locators';

/**
 * Pins the missing French keys on the belts page.
 *
 * THE PAGE WORKS. Belts load, the rank sections render, and the staff-only
 * Eligible Students control is correctly withheld from a member - MEM-002
 * asserts all of that. What is broken is the copy: the `belts` namespace has 13
 * keys in messages/en.json with no counterpart in messages/fr.json, so a French
 * user reads raw next-intl key paths where words should be.
 *
 *   beltLibrarySidebar   beltSystemSubtitle   beltSystemTitle   dan
 *   danSectionSubtitle   goToDashboard        joinClubBeltsDescription
 *   joinClubToViewBelts  kyu                  kyuSectionSubtitle
 *   rankOrderLocked      rankOrderLockedDescription              ranks
 *
 * `beltSystemTitle` is the page H1, so in French the largest text on the screen
 * reads "belts.beltSystemTitle".
 *
 * Same shape as denial-copy.spec.ts in this folder, and handled the same way:
 * MEM-002 anchors on `belts.kyuRanks`, which exists in both languages, so a
 * broken label cannot break a page-load result. This spec is what pays for that
 * tolerance - without it, nothing watches the H1 at all.
 *
 * WHY `fixme` HERE IS DIFFERENT FROM denial-copy's. That one fails today.
 * This one cannot even be observed today: the missing keys are French, the
 * suite's accounts render English, and the app takes its UI language from the
 * user's PROFILE rather than the browser locale - so reaching the defect means
 * writing to a profile, which belongs with the mutating-tests milestone. The
 * assertion below is written out so it becomes runnable the moment either the
 * keys land or the suite can run French.
 *
 * REMOVE THIS AND THE TOLERANCE TOGETHER. When the French keys land, drop the
 * `fixme` and point personalLocators.belts at the H1 (`beltsTitle`) instead of
 * the Kyu section header.
 */

test.use(asRole('member'));

test.fixme('the belts page H1 is a title, not a raw i18n key', async ({ page }) => {
  await page.goto(routes.belts, { waitUntil: 'domcontentloaded' });

  const heading = personalLocators.beltsTitle(page);
  await expect(heading).toBeVisible();

  /**
   * The UNANCHORED matcher, deliberately. This H1 is `{club name} · {title}`
   * (belts/page.tsx ~line 262), and the club-name prefix renders at >=640px -
   * the suite's width. An anchored "the whole label is a key" check would
   * therefore never match, and would call a broken title fine.
   */
  await expect(
    heading,
    `${routes.belts} is showing a raw next-intl key in its H1. Add the missing ` +
      `belts.* keys to messages/fr.json - the list is in this file's header.`,
  ).not.toHaveText(RAW_I18N_KEY_WITHIN);
});

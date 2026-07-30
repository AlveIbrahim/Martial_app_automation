import type { Page, Locator } from '@playwright/test';

/**
 * Positive page markers for the PERSONAL screens - the ones with no club id in
 * the URL. LOCATORS ONLY.
 *
 * Same job as club-section.locators.ts, different family of pages: these are
 * reached by every authenticated account and have no role guard of their own.
 * What differs by role is what they offer, which is what the absence checks
 * below are for.
 *
 * As everywhere else, never assert merely "the denial block is absent" - these
 * pages render a spinner while `GET /users/clubs` is in flight, so an absence
 * check passes on the loading frame and gives a false green.
 */
export const personalLocators = {
  /**
   * `/dashboard/belts`.
   *
   * Anchored on the Kyu section header rather than the page H1, deliberately.
   * The H1 is `belts.beltSystemTitle`, which is MISSING from
   * messages/fr.json - next-intl then renders the raw key path, so the heading
   * a French user reads is the literal "belts.beltSystemTitle". `belts.kyuRanks`
   * exists in both languages.
   *
   * That tolerance is what keeps a broken label from breaking a page-load
   * result. Its cost - that nothing here watches the label - is paid by
   * specs/i18n/belts-copy.spec.ts, and the two are removed together when the
   * French keys land. See README section 7.
   *
   * Safe on a club with no belts: the section headers render outside the belt
   * map (belts/page.tsx ~lines 388-394), so they appear even when the list is
   * empty.
   */
  belts: (page: Page): Locator =>
    page.getByRole('heading', { name: /^(Kyu Ranks|Rangs Kyu)$/i }).first(),

  beltsDanRanks: (page: Page): Locator =>
    page.getByRole('heading', { name: /^(Dan Ranks|Rangs Dan)$/i }).first(),

  /**
   * The belts page H1. Used ONLY by specs/i18n/belts-copy.spec.ts, to pin the
   * missing-French-key bug. Nothing behavioural should anchor on it - see the
   * note on `belts` above.
   */
  beltsTitle: (page: Page): Locator => page.getByRole('heading', { level: 1 }).first(),

  /**
   * "Eligible Students", the one staff control on the belts page.
   *
   * Gated on `canViewEligible` (belts/page.tsx ~lines 130-133): club owner,
   * primary owner, secretary and sensei - NOT a plain member. This is what
   * MEM-002's "no management controls" reduces to on this screen.
   *
   * Rendered twice, desktop `hidden sm:flex` (~line 267) and mobile `sm:hidden`
   * (~line 342). getByRole excludes hidden elements, so at the suite's 1280px
   * exactly one is matched: `toHaveCount(0)` and `.first()` both behave.
   */
  eligibleStudents: (page: Page): Locator =>
    page.getByRole('button', { name: /^(Eligible Students|[ÉE]l[èe]ves [ée]ligibles)$/i }),

  /**
   * `/progress` - the user's own progression, across clubs.
   *
   * `progress.pageTitle`, present in both messages files: EN "Belt Progression"
   * / FR "Progression de ceinture" (progress/page.tsx ~line 115).
   */
  progress: (page: Page): Locator =>
    page.getByRole('heading', { name: /^(Belt Progression|Progression de ceinture)$/i }).first(),

  /**
   * Proof the progression path itself rendered, not merely the page frame.
   *
   * This is the discriminator that makes MEM-003 mean something.
   * BeltProgressionPath returns early for three other states - loading, error,
   * and "you belong to no club" (BeltProgressionPath.tsx ~lines 73, 84, 100) -
   * and the section headers render only on the success path below them
   * (~line 119). The page H1 is outside the component and renders in all four.
   *
   * FRAGILE, for two reasons that are easy to get wrong:
   *
   *   1. It is a <span>, NOT a heading (BeltSectionHeader.tsx ~line 11), so
   *      `getByRole('heading')` matches nothing here. Text is the only handle.
   *   2. The French differs from the belts page even though the English does
   *      not. This is `progress.kyuRanks` = "Kyu Ranks" / "Grades Kyu"; the
   *      belts page is `belts.kyuRanks` = "Kyu Ranks" / "Rangs Kyu". Two
   *      namespaces, same EN string, different FR string. Recording this in
   *      English would hide the difference completely.
   */
  progressBeltPath: (page: Page): Locator =>
    page.getByText(/^(Kyu Ranks|Grades Kyu)$/i).first(),
};

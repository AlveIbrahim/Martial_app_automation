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

  /**
   * `/settings` - the user's OWN settings, not a club's.
   *
   * The route key is `personalSettings` in support/routes.ts, never `settings`:
   * codegen.mjs flattens the top-level and club-scoped keys into one table, so a
   * top-level `settings` would be shadowed by the club-scoped one. Same trap as
   * `progress` / `personalProgress`.
   *
   * RENDERED TWICE. The page returns a mobile branch (`sm:hidden`,
   * settings/page.tsx ~line 688) and a desktop branch (`hidden sm:block`, ~line
   * 1506), each with its own <h1> and its own full tab bar. The breakpoint is
   * `sm:` (640px), NOT the `lg:` (1024px) the members roster splits on - so the
   * branch that executes here is the DESKTOP one at the suite's 1280px.
   * getByRole excludes hidden elements, so exactly one of each is matched and
   * neither `.first()` nor `toHaveCount(0)` is thrown off. Re-record at the
   * target width before reusing any of these in a phone-sized test.
   *
   * `settings.title`, present in both messages files: EN "Settings" /
   * FR "Paramètres" (~lines 701 and 1519).
   */
  settings: (page: Page): Locator =>
    page.getByRole('heading', { name: /^(Settings|Param[èe]tres)$/i }).first(),

  /**
   * The four tabs a parent-profile account is offered (~line 727 mobile, ~1539
   * desktop). A child profile gets a single "Screen Time" tab instead, and the
   * whole bar is gated on `currentProfileType === 'parent'`.
   *
   * A fifth, "Billing & Subscription", is behind `SHOW_BILLING_SECTION = false`
   * (~line 34) and renders for nobody today. That is the sheet's "billing pane
   * currently hidden" note and MEM-043's STUB - do not assert it, and do not
   * file it.
   */
  settingsPrivacyTab: (page: Page): Locator =>
    page.getByRole('button', { name: /^(Club Privacy|Confidentialit[ée] du club)$/i }),

  /**
   * `settings.securityTab`. The FR alternative is listed for the day the
   * translation lands: fr.json currently holds the ENGLISH string "Security"
   * for this key, so a French user reads it in English. Cosmetic, and recorded
   * in COVERAGE.md rather than asserted here.
   */
  settingsSecurityTab: (page: Page): Locator =>
    page.getByRole('button', { name: /^(Security|S[ée]curit[ée])$/i }),

  /**
   * HARDCODED, not translated. These two labels are literal English strings in
   * the JSX (`label: 'Notifications'`, `label: 'Membership'`) rather than
   * `t(...)` calls, so they are the same in every language - unlike every other
   * tab beside them. That is a real localisation defect, logged in COVERAGE.md
   * section 6; it is not a missing key, so RAW_I18N_KEY would never catch it.
   *
   * The FR alternatives are what a fixed build should render. "Notifications" is
   * already correct French, so only Membership actually changes.
   */
  settingsNotificationsTab: (page: Page): Locator =>
    page.getByRole('button', { name: /^Notifications$/i }),
  settingsMembershipTab: (page: Page): Locator =>
    page.getByRole('button', { name: /^(Membership|Adh[ée]sion)$/i }),

  /**
   * `/dashboard/messages` - where the sidebar's Messages actually points.
   *
   * NOT `/messages`, which is a second, separate page component that also
   * exists. The route key for this one is `dashboardMessages`.
   *
   * The heading is `messages.title` and belongs to ConversationList, not the
   * page (ConversationList.tsx ~line 89) - so it proves the conversation list
   * itself mounted, which is the real content, rather than just the page frame.
   * EN and FR are both "Messages"; that is correct French, not a missing
   * translation.
   */
  messages: (page: Page): Locator =>
    page.getByRole('heading', { name: /^Messages$/i }).first(),

  /**
   * `/support`. `support.pageTitle`, present in both messages files:
   * EN "Support" / FR "Assistance".
   */
  supportDesk: (page: Page): Locator =>
    page.getByRole('heading', { name: /^(Support|Assistance)$/i }).first(),
};

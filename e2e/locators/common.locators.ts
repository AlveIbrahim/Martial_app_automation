import type { Page, Locator } from '@playwright/test';

/**
 * Locators shared across pages. LOCATORS ONLY - no actions, no assertions.
 * Actions live in `e2e/pages/*.page.ts`, assertions live in the specs.
 *
 * The app has ZERO `data-testid` attributes, so everything here leans on roles,
 * accessible names, and a handful of element ids. Selector priority ladder:
 *   1. stable id           (#email, #password, #qr-reader)
 *   2. getByRole, no name  (locale-proof)
 *   3. getByRole + EN|FR accessible-name regex
 *   4. getByLabel / aria-label
 *   5. CSS or raw text     (last resort, must be marked FRAGILE)
 *
 * When the app gains test ids, THESE FILES are the only ones that change.
 */

/**
 * The "you may not see this" heading, as a union.
 *
 * There is no shared AccessDenied component: the block is copy-pasted inline
 * across 9+ pages in three variants, verified in the app source:
 *   - hardcoded English "Access Restricted"  (analytics, members,
 *     scan-attendance, usage, payments, room attendance)
 *   - t('accessRestricted')                  (history, teachers,
 *     eligible-students)  EN "Access Restricted" / FR "Accès restreint"
 *   - t('accessDenied')                      (settings, library/*)
 *     EN "Access Denied" / FR "Accès refusé"
 *
 * The third alternative matches a RAW next-intl key ("teacherManagement.
 * accessRestricted"), which is what renders when a key is missing from
 * messages/*.json - next-intl returns the key path itself. The teachers page
 * is in exactly that state today.
 *
 * Tolerating it is deliberate: these checks assert ACCESS CONTROL, and the
 * block itself works correctly - only its label is broken. The cost is that no
 * test watches that label; the bug is tracked in COVERAGE.md instead.
 *
 * The no-space form cannot collide with properly-translated copy: "Access
 * Restricted" is already caught by the first alternative.
 */
export const DENIAL_TEXT =
  /Access (Restricted|Denied)|Acc[eè]s (restreint|refus[eé])|\baccess(Restricted|Denied)\b/i;

/**
 * What a MISSING translation looks like on screen.
 *
 * next-intl returns the key path itself when a key is absent from
 * messages/<locale>.json, so the user reads `teacherManagement.accessRestricted`
 * where a sentence should be. An in-code `|| 'Some Fallback'` never rescues it -
 * the returned key path is a truthy string.
 *
 * Two live instances, both tracked in COVERAGE.md section 6 and pinned by the
 * specs in specs/i18n/: `teacherManagement.accessRestricted` (missing from EN
 * and FR alike) and the `belts` namespace (13 keys present in EN, missing from
 * FR - including the belts page H1).
 *
 * Deliberately narrow: `word.word` with no spaces. Ordinary UI copy contains
 * spaces or ends a sentence, so it cannot collide.
 *
 * ANCHORED - "this label is nothing but a key". Right for the denial headings,
 * which render the key and nothing else.
 */
export const RAW_I18N_KEY = /^[a-z][a-zA-Z]*(\.[a-zA-Z]+)+$/;

/**
 * The same shape, unanchored - "a key appears somewhere in this text".
 *
 * Needed wherever the broken key is only PART of the string. The belts page H1
 * is the live case: it renders `{club name} · {title}` (belts/page.tsx ~line
 * 262), so at >=640px the anchored form above never matches and would report a
 * broken title as fine.
 *
 * Use the anchored one where the whole label should be a sentence; use this
 * where a key could hide inside otherwise-valid copy.
 */
export const RAW_I18N_KEY_WITHIN = /(^|\s)[a-z][a-zA-Z]*(\.[a-zA-Z]+)+(\s|$)/;

export const commonLocators = {
  /** The access-denied heading, at any heading level. */
  denialHeading: (page: Page): Locator => page.getByRole('heading', { name: DENIAL_TEXT }),

  /**
   * Login form.
   *
   * `:visible` is load-bearing, not decoration. The login page renders
   * `<LoginForm />` TWICE - once in the mobile branch (login/page.tsx ~line 49,
   * `lg:hidden`) and once in the desktop branch (~line 95, `hidden lg:flex`) -
   * so `#email` and `#password` are each duplicated in the DOM. A bare CSS
   * locator matches both and fails Playwright's strict mode; only one is
   * visible at any width, which is the one a user types into.
   *
   * The duplicate ids are an app defect in their own right (an id must be
   * unique, and `<label for="email">` is ambiguous with two targets). It is
   * cosmetic for these tests, so it is recorded in COVERAGE.md rather than
   * asserted here.
   */
  loginEmail: (page: Page): Locator => page.locator('#email:visible'),
  loginPassword: (page: Page): Locator => page.locator('#password:visible'),

  /**
   * The submit button, `auth.loginButton`: EN "Log In" / FR "Se connecter".
   *
   * Anchored, and the FR alternative is the real string. The previous
   * `/sign in|log ?in|connexion/i` matched neither French ("Se connecter" does
   * not contain "connexion"), and unanchored it also matched the button's own
   * `Logging In...` loading state - so it could resolve to a disabled button
   * mid-submit. getByRole ignores the hidden duplicate form, so no `:visible`
   * is needed here.
   */
  loginSubmit: (page: Page): Locator =>
    page.getByRole('button', { name: /^(Log ?In|Sign In|Se connecter)$/i }),

  /**
   * The error surfaced when a sign-in is refused.
   *
   * It is a react-toastify toast (LoginForm.tsx ~line 166), NOT inline form
   * copy - the inline `errors.email` / `errors.password` blocks are client-side
   * validation only and never carry a server rejection. `role="alert"` lands on
   * the toast BODY, which the app styles through `bodyClassName`
   * (providers.tsx ~line 60).
   *
   * THE EXCLUSION IS REQUIRED, not defensive. Next.js keeps its own
   * `<div role="alert" id="__next-route-announcer__">` in the DOM of every
   * page, so a bare `getByRole('alert')` resolves to two elements and fails
   * strict mode - confirmed on a live run, 2026-07-30. Excluding it by id
   * keeps the accessible-role semantics rather than dropping to a CSS class,
   * and it does not pin the message text: the copy comes from the server and a
   * backend rewording should not turn this red.
   *
   * `autoClose: 4000` (providers.tsx), so this disappears four seconds after it
   * appears. Assert it promptly, and never make it the only assertion that a
   * rejection happened - "still on /login" is the durable one.
   */
  loginErrorToast: (page: Page): Locator =>
    page.getByRole('alert').and(page.locator(':not(#__next-route-announcer__)')),

  /**
   * The "My Club" entry in the main navigation.
   *
   * Offered when `isAnyClubOwner || userClubs.length > 0` (DesktopSidebar.tsx
   * ~line 201), so a plain member who belongs to a club sees it too - it is not
   * a staff-only marker.
   *
   * The accessible name comes from the label span when the sidebar is expanded
   * and from the `title` attribute when it is collapsed (~lines 275 and 292),
   * so this holds either way. `[data-track="nav:myClub"]` is the fallback if
   * the name ever proves unstable.
   */
  myClubNav: (page: Page): Locator =>
    page.getByRole('link', { name: /^(My Club|Mon club)$/i }),

  /**
   * App chrome, present on every club page rather than owned by one screen.
   *
   * The club tab bar renders `overview | members | site | settings` and drops
   * two of them by role - Header.tsx ~line 1201: the Settings tab is hidden
   * from `userRole === 'member'` and from a secretary, and the Members tab is
   * hidden from `userRole === 'member'`. So a plain member sees Overview and
   * Sites only.
   *
   * Anchored: an unanchored /Members/ also matches the "{count} members" text
   * that appears on club cards.
   */
  membersTab: (page: Page): Locator =>
    page.getByRole('button', { name: /^(Members|Membres)$/i }),
  settingsTab: (page: Page): Locator =>
    page.getByRole('button', { name: /^(Settings|Param[èe]tres)$/i }),

  /**
   * The club share / QR-link control in the sidebar, gated on `isAnyClubOwner`
   * (DesktopSidebar.tsx ~line 297). This is the "generate QR / share link"
   * MEM-005 expects a plain member never to be offered.
   */
  shareClub: (page: Page): Locator =>
    page.getByRole('button', { name: /^(Share|Partager)$/i }),
};

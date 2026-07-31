import type { Page, Locator } from '@playwright/test';

/**
 * Positive page markers for the club sections. LOCATORS ONLY.
 *
 * Each marker matches something only the REAL page renders. Never assert
 * merely "the denial block is absent": these pages return null or a spinner
 * while the club role resolves, so an absence check passes on the loading
 * frame and gives a false green.
 */
export const clubSectionLocators = {
  /**
   * FRAGILE: `#analytics` does not exist in the live DOM - verified against
   * dev on 2026-07-28. The page heading is the only available anchor.
   */
  analytics: (page: Page): Locator =>
    page.getByRole('heading', { name: /analytics|analyses/i }).first(),

  scanAttendance: (page: Page): Locator => page.locator('#qr-reader'),

  // FRAGILE: no stable id on these pages yet; heading text is the best anchor.
  history: (page: Page): Locator =>
    page.getByRole('heading', { name: /history|historique/i }).first(),
  teachers: (page: Page): Locator =>
    page.getByRole('heading', { name: /teacher|sensei|enseignant/i }).first(),
  settings: (page: Page): Locator =>
    page.getByRole('heading', { name: /settings|param[eè]tres/i }).first(),
  membersRoster: (page: Page): Locator =>
    page.getByRole('heading', { name: /members|membres/i }).first(),

  /**
   * The calendar page heading is the current date ("Tuesday, July 28, 2026"),
   * not the word "calendar" - verified against dev on 2026-07-28. The
   * "Event Types" sidebar heading is the reliable anchor instead.
   */
  calendar: (page: Page): Locator =>
    page.getByRole('heading', { name: /event types|types d'[ée]v[ée]nement/i }).first(),

  /**
   * The club overview. `My Clubs` is the one heading BOTH a member and an
   * owner get here - the rest of the page forks by role, and the member-only
   * "Your Status" block would make the owner's positive control fail.
   */
  overview: (page: Page): Locator =>
    page.getByRole('heading', { name: /^(My Clubs|Mes clubs)$/i }).first(),

  site: (page: Page): Locator =>
    page
      .getByRole('heading', { name: /^(Your Training Sites|Vos sites d'entra[îi]nement)$/i })
      .first(),

  /** The club's own move library. Same heading for every role; the manage controls differ. */
  clubLibrary: (page: Page): Locator =>
    page.getByRole('heading', { name: /^(Video Library|Vid[ée]oth[èe]que)$/i }).first(),

  clubProgress: (page: Page): Locator =>
    page.getByRole('heading', { name: /^(My Progress|Ma progression)$/i }).first(),

  /** Proof the progress page rendered its real content, not just its title. */
  beltJourney: (page: Page): Locator =>
    page.getByRole('heading', { name: /^(Belt Journey|Parcours des Ceintures)$/i }).first(),
  overallAttendance: (page: Page): Locator =>
    page.getByRole('heading', { name: /^(Overall Attendance|Pr[ée]sence Globale)$/i }).first(),

  /**
   * The club's payments screen - where the sidebar's Payment lands for an
   * OWNER. A non-owner is sent to `/user-payments` instead, a different page
   * (DesktopSidebar.tsx ~lines 210-223), so this marker is owner-only.
   *
   * NOT ANCHORED TO A TRANSLATION, because there is not one: the heading is a
   * hardcoded English `<h1>Payments</h1>` (payments/page.tsx ~line 202) with no
   * `t(...)` call, so a French user reads it in English. Third instance of that
   * bug in this app - COVERAGE.md section 6 item 1d. The FR alternative below
   * is what a fixed build should render, and costs nothing to carry now.
   */
  payments: (page: Page): Locator =>
    page.getByRole('heading', { name: /^(Payments|Paiements)$/i }).first(),

  /** Management controls that must not render for the wrong role. */
  createEvent: (page: Page): Locator =>
    page.getByRole('button', {
      name: /create (event|class)|add event|nouvel? [ée]v[ée]nement/i,
    }),

  /** Site management, gated on `canEdit` - site/page.tsx ~line 673, owners only. */
  addSite: (page: Page): Locator =>
    page.getByRole('button', { name: /^(Add Site|Ajouter un site)$/i }),
  addRoom: (page: Page): Locator =>
    page.getByRole('button', { name: /^(Add Room|Ajouter une salle)$/i }),

  /**
   * NOT A BUTTON. The club library's manage control is a `<Link>` carrying
   * `aria-label={t('manageLibrary')}` - library/page.tsx ~line 639. Grepping
   * for a button by that name finds nothing and would prove nothing.
   */
  manageLibrary: (page: Page): Locator =>
    page.getByRole('link', { name: /^(Manage library|G[ée]rer la biblioth[èe]que)$/i }),
};

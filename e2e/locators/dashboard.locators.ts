import type { Page, Locator } from '@playwright/test';

/**
 * The personal home dashboard at `/dashboard`. LOCATORS ONLY.
 *
 * This screen is NOT club-scoped and has no role guard of its own - every
 * authenticated account reaches it. What differs by role is what it offers,
 * which is what MEM-001 is about.
 *
 * The welcome heading is not anchored at the end: the app renders
 * `{t('welcomeBack')}!` and the exclamation mark is outside the message.
 */
export const dashboardLocators = {
  welcome: (page: Page): Locator =>
    page.getByRole('heading', { name: /^(Welcome back|Bon retour)/i }).first(),

  announcements: (page: Page): Locator =>
    page.getByRole('heading', { name: /^(Club Announcements|Annonces du club)$/i }).first(),

  recentActivity: (page: Page): Locator =>
    page.getByRole('heading', { name: /^(Recent Activity|Activit[ée] r[ée]cente)$/i }).first(),
};

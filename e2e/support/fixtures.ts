import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { env } from '../config/environments';
import { ROLES, type RoleKey } from './roles';
import { MembersPage } from '../pages/members.page';
import { ClubSectionPage, type ClubSection } from '../pages/club-section.page';
import { PersonalSectionPage, type PersonalSection } from '../pages/personal-section.page';
import { DashboardPage } from '../pages/dashboard.page';
import { LoginPage } from '../pages/login.page';

/**
 * The analytics consent banner is a real source of flakiness.
 *
 * It renders as a dialog over the page and is what broke SEN-043 on an
 * otherwise-clean run (2026-07-28): the denial heading was never "visible"
 * because the consent dialog was covering it. It shows intermittently rather
 * than always, which is the worst kind of failure to chase - sessions here are
 * built from an APIRequestContext, which has no localStorage, so every browser
 * context starts with the consent unset and the banner races the assertions.
 *
 * Seeding localStorage before any page script runs is deterministic; clicking
 * the banner away would just be a second race. 'essential' is the same choice
 * the "Essential only" button records - the privacy-preserving one, no session
 * replay - so this does not opt the test accounts into extra tracking.
 *
 * Key and values verified in the app source:
 * martial-apps-frontend/src/components/analytics/ConsentBanner.tsx
 * (STORAGE_KEY = 'analytics_consent', scope 'full' | 'essential' | 'denied').
 */
const CONSENT_KEY = 'analytics_consent';
const CONSENT_DATE_KEY = 'analytics_consent_date';
const CONSENT_SCOPE = 'essential';

/**
 * Page objects, injected per test so specs never construct them by hand.
 * Add a new one here when you add a page object.
 */
interface TestFixtures {
  membersPage: MembersPage;
  /** Build a section page object for whichever club screen the test needs. */
  clubSection: (section: ClubSection) => ClubSectionPage;
  /** The same, for the personal screens that carry no club id in their URL. */
  personalSection: (section: PersonalSection) => PersonalSectionPage;
  /** The personal home dashboard - not club-scoped. */
  dashboardPage: DashboardPage;
  /**
   * The login form. Only the authentication specs need this - every other test
   * gets its session from setup/auth.setup.ts via `asRole(...)`.
   */
  loginPage: LoginPage;
}

interface WorkerFixtures {
  /**
   * The club every access-control test runs against.
   *
   * DISCOVERED, never hardcoded: the Demo Clubs seeder mints new UUIDs on each
   * reseed, so a hardcoded id makes the whole suite fail the next time QA
   * refreshes the test data.
   */
  clubId: string;
}

async function fetchClubs(request: APIRequestContext): Promise<Array<Record<string, unknown>>> {
  const res = await request.get(`${env.apiURL}/users/clubs`, {
    headers: { 'x-app-id': env.appId },
  });
  expect(
    res.ok(),
    `GET /users/clubs returned ${res.status()} - the saved session was rejected. ` +
      `Re-run "npm run test:setup" to refresh it.`,
  ).toBeTruthy();

  const body = await res.json();
  return body?.data?.clubs ?? body?.data ?? [];
}

function clubIdOf(club: Record<string, unknown>): string | undefined {
  return (club.clubId ?? club.id) as string | undefined;
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  /**
   * Suppress the analytics consent banner before the page's own scripts run.
   * See the note on CONSENT_KEY above.
   */
  page: async ({ page }, use) => {
    await page.addInitScript(
      ([key, dateKey, scope]) => {
        try {
          window.localStorage.setItem(key, scope);
          window.localStorage.setItem(dateKey, new Date().toISOString());
        } catch {
          /* localStorage unavailable - the banner may appear; not fatal */
        }
      },
      [CONSENT_KEY, CONSENT_DATE_KEY, CONSENT_SCOPE] as const,
    );
    await use(page);
  },

  membersPage: async ({ page }, use) => {
    await use(new MembersPage(page));
  },

  clubSection: async ({ page }, use) => {
    await use((section: ClubSection) => new ClubSectionPage(page, section));
  },

  personalSection: async ({ page }, use) => {
    await use((section: PersonalSection) => new PersonalSectionPage(page, section));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  clubId: [
    async ({ browser }, use) => {
      // Resolve from the owner's session: the primary owner belongs to the
      // seeded club by definition, so it is the most reliable anchor.
      const ctx = await browser.newContext({ storageState: env.authFile('ownerPrimary') });
      try {
        const clubs = await fetchClubs(ctx.request);

        const override = process.env.TEST_CLUB_ID;
        const club = override
          ? clubs.find((c) => clubIdOf(c) === override)
          : clubs[0];

        const resolved = club ? clubIdOf(club) : undefined;
        expect(
          resolved,
          override
            ? `TEST_CLUB_ID=${override} is not a club the owner account belongs to.`
            : `The owner account (${ROLES.ownerPrimary.email}) belongs to no clubs. ` +
              `Seed a demo club first - see manual-qa/00-start-here.md section 3.`,
        ).toBeTruthy();

        await use(resolved as string);
      } finally {
        await ctx.close();
      }
    },
    { scope: 'worker' },
  ],
});

export { expect };

/** Convenience for specs: `test.use(asRole('secretary'))`. */
export function asRole(role: RoleKey): { storageState: string } {
  return { storageState: env.authFile(role) };
}

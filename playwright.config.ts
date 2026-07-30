import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'node:path';

// Credentials live in .env (gitignored). Load before importing env config.
dotenv.config({ path: path.resolve(__dirname, '.env') });

// eslint-disable-next-line @typescript-eslint/no-var-requires
import { env } from './e2e/config/environments';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,

  /**
   * Empties allure-results/ so a report describes ONE run rather than every run
   * since the directory was last cleared by hand. See the file for what the
   * accumulated version actually reported. Runs once per `playwright test`
   * invocation, which is why it lives here and not in the npm scripts.
   */
  globalSetup: './e2e/setup/clean-allure.ts',

  // One retry even locally: the deployed environment is shared with other
  // testers and occasionally flaky. Retries surface as "flaky" in the report
  // rather than hiding failures.
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    // Allure: richer report, and it groups by the @SEC-040 / @MEM-041 tags so a
    // run reads like the manual sheet. `npm run report:allure` builds and opens
    // it. Results land in allure-results/ (gitignored) and are cleared on each
    // run so a deleted test cannot linger in the report.
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        environmentInfo: {
          target: process.env.TEST_ENV ?? 'local',
          node: process.version,
        },
      },
    ],
  ],

  use: {
    baseURL: env.baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Deterministic rendering. Note the app overrides UI language from the
    // user's profile, so assertions still match EN|FR - see selectors.ts.
    locale: 'en-GB',
    timezoneId: 'UTC',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  expect: { timeout: 10_000 },

  /**
   * The per-test budget MUST exceed the assertion budgets in e2e/pages/base.page.ts,
   * or those constants are dead code.
   *
   * Playwright's default is 30s, and leaving it there quietly capped everything:
   * `CLUB_ROLE_TIMEOUT` is 60s and `RENDER_TIMEOUT` is 30s, so a test could
   * never actually spend either. Three consequences, all seen on real runs:
   *
   *   1. A slow screen died at the TEST timeout instead of the assertion's, so
   *      the failure read "Test timeout of 30000ms exceeded" - losing the
   *      message the assertion had been written to produce. The deliberately
   *      red SEC-043 and SEN-042 both reported this way.
   *   2. `gotoAndAwaitClubRole` could not do its job. COVERAGE.md section 6
   *      measures the role-gated tab bar appearing as late as 35s on `dev`;
   *      waiting for it was impossible inside a 30s test.
   *
   * Found while chasing a login-form flake. That flake turned out to have a
   * different cause entirely - the pre-hydration submit bug in COVERAGE.md
   * section 3 - so this raise fixed none of it. It is kept because the capped
   * budgets were a real defect in their own right.
   *
   * 120s is the sequential worst case with headroom: 60s resolving the club
   * role, then 30s for the screen to paint, plus navigation. It is NOT an
   * invitation to let tests get slower - it is the ceiling that makes the
   * measured budgets real. The underlying app slowness is a recorded finding,
   * not an accepted cost.
   */
  timeout: 120_000,

  projects: [
    // Logs in every role and saves session state. Everything else depends on it.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testMatch: /specs\/.*\.spec\.ts/,
    },
  ],

  // No webServer block on purpose: this project targets an already-running app
  // (local dev server, or the deployed testing environment). Start the app
  // yourself, then point TEST_ENV / LOCAL_BASE_URL at it.
});

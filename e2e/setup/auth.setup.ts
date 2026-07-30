import { test as setup, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { env, accessTokenCookie } from '../config/environments';
import { ACCESS_CONTROL_ROLES, assertCredentialsPresent, ROLES } from '../support/roles';

/**
 * Logs in each role ONCE via the API and saves its session to
 * playwright/.auth/<env>/<role>.json for the spec projects to reuse.
 *
 * Why a setup project rather than globalSetup: a failed login shows up here as
 * a named, red test with a readable message, instead of an opaque crash before
 * the reporter exists. That matters when a QA engineer, not the author, is
 * reading the report.
 *
 * Login shape verified against martial-apps-frontend/scripts/test-cookie-auth.mjs.
 */

// Serial: the dashboard sanity check below depends on every login above
// having already saved its session file. Under fullyParallel a free worker
// could otherwise grab it first and skip it every time.
setup.describe.configure({ mode: 'serial' });

for (const role of ACCESS_CONTROL_ROLES) {
  setup(`authenticate ${role} (${ROLES[role].label})`, async ({ request }) => {
    const { email, password, label } = assertCredentialsPresent(role);

    const res = await request.post(`${env.apiURL}/auth/login`, {
      headers: { 'Content-Type': 'application/json', 'x-app-id': env.appId },
      data: { email, password, appId: env.appId },
    });

    expect(
      res.status(),
      `Login failed for ${label} <${email}> against ${env.apiURL}.\n` +
        `Check the credentials in .env and that ${env.name} is reachable.\n` +
        `Response: ${await res.text().catch(() => '(unreadable)')}`,
    ).toBe(200);

    const state = await request.storageState();

    /**
     * THE LOAD-BEARING ASSUMPTION.
     *
     * The app's auth cookies are httpOnly, so they are invisible to
     * document.cookie. Playwright's storageState serializes the
     * APIRequestContext cookie jar instead, which is NOT subject to that
     * restriction - so httpOnly cookies should be captured.
     *
     * If this assertion ever fails, the whole storageState approach is void:
     * fall back to parsing set-cookie manually and calling
     * context.addCookies() in a worker fixture. Isolated here on purpose.
     */
    const access = state.cookies.find((c) => c.name === accessTokenCookie);
    expect(
      access,
      `"${accessTokenCookie}" was not captured in storageState for ${label}.\n` +
        `Cookies present: ${state.cookies.map((c) => c.name).join(', ') || '(none)'}\n` +
        `If this fails, storageState is not capturing httpOnly cookies - see the ` +
        `fallback note in this file.`,
    ).toBeTruthy();
    expect(
      access!.httpOnly,
      `"${accessTokenCookie}" was captured but is not httpOnly - unexpected; ` +
        `the backend is meant to set it httpOnly.`,
    ).toBe(true);

    const file = env.authFile(role);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    await request.storageState({ path: file });
  });
}

/**
 * Sanity check that the seeded accounts are actually usable: each must reach
 * the app without being bounced to /change-password or /complete-profile,
 * which the layout forces and which would break every downstream test with a
 * confusing "element not found".
 */
setup('seeded accounts land on the dashboard', async ({ browser }) => {
  const failures: string[] = [];

  // If the logins above failed there is nothing to check here; skip rather
  // than adding a second, noisier failure on top of the real one.
  const missing = ACCESS_CONTROL_ROLES.filter((r) => !fs.existsSync(env.authFile(r)));
  setup.skip(
    missing.length > 0,
    `Skipped: no saved session for ${missing.join(', ')} - fix the login failures above first.`,
  );

  for (const role of ACCESS_CONTROL_ROLES) {
    const ctx = await browser.newContext({ storageState: env.authFile(role) });
    const page = await ctx.newPage();
    try {
      await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
      const landed = new URL(page.url()).pathname;
      if (!landed.startsWith('/dashboard')) {
        failures.push(`${ROLES[role].label}: redirected to ${landed}`);
      }
    } catch (err) {
      failures.push(`${ROLES[role].label}: ${(err as Error).message}`);
    } finally {
      await ctx.close();
    }
  }

  expect(
    failures,
    `Some seeded accounts cannot reach /dashboard:\n  ${failures.join('\n  ')}\n` +
      `Fix these before running the battery - every downstream failure would be a symptom of this.`,
  ).toEqual([]);
});

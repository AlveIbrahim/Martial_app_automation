#!/usr/bin/env node
/**
 * Opens Playwright codegen ALREADY SIGNED IN as one of the test roles, on the
 * page you name, in the same conditions the suite runs under.
 *
 *   npm run codegen:dev -- secretary settings
 *   npm run codegen:dev -- ownerPrimary members
 *   npm run codegen:dev -- sensei                 (defaults to the dashboard)
 *
 * This is a DISCOVERY tool: it finds candidate selectors on a screen nobody has
 * automated yet. Its output is never pasted into `locators/` as-is - see
 * "Finding selectors with codegen" in e2e/README.md for how to turn a recording
 * into a locator.
 *
 * Raw `npx playwright codegen` wastes time here, because three things are easy
 * to get wrong and all three cost real debugging time earlier in this project:
 *
 *   1. No saved session      -> codegen lands on /login and you record the
 *                               login form instead of the app.
 *   2. Viewport below 1024px -> the members roster renders a completely
 *                               different component below `lg:`, so you record
 *                               selectors that never execute in the suite.
 *   3. Consent banner        -> the analytics dialog covers the page on ~3 of
 *                               4 loads and codegen records clicks on it.
 *
 * This script makes all three impossible to get wrong. It is plain Node rather
 * than TypeScript so it can run without a compile step, which is also why the
 * per-target defaults live in e2e/config/targets.json - see the note there.
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { request } from '@playwright/test';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Credentials and per-machine overrides live in .env, exactly as
// playwright.config.ts loads them.
dotenv.config({ path: path.join(ROOT, '.env'), quiet: true });

/**
 * Rendering conditions, kept identical to playwright.config.ts. A selector
 * recorded under different conditions may not exist when the suite runs:
 * `devices['Desktop Chrome']` is 1280x720, the locale drives which of the
 * EN|FR strings the page renders, and the timezone decides what a date-derived
 * heading says (the calendar page's heading IS a date).
 */
const VIEWPORT = '1280,720';
const LOCALE = 'en-GB';
const TIMEZONE = 'UTC';

/**
 * Suppressing the consent banner. Same key, value and reasoning as the `page`
 * fixture in e2e/support/fixtures.ts - 'essential' is what the banner's
 * "Essential only" button records, so this opts the test accounts into nothing.
 *
 * The saved session files carry `origins: []` because they come from an API
 * request context, which has no localStorage - that empty array is precisely
 * why the banner shows up in a codegen browser.
 */
const CONSENT_KEY = 'analytics_consent';
const CONSENT_DATE_KEY = 'analytics_consent_date';
const CONSENT_SCOPE = 'essential';

/** Mirrors ACCESS_CONTROL_ROLES in e2e/support/roles.ts - the roles auth.setup.ts saves a session for. */
const ROLES = ['ownerPrimary', 'coOwner', 'sensei', 'secretary', 'member'];

const DEFAULT_PAGE = 'dashboard';

const USAGE = `Usage: npm run codegen[:dev] -- <role> [page]

  role   ${ROLES.join(' | ')}
  page   any key from e2e/support/routes.ts (default: ${DEFAULT_PAGE})

Examples:
  npm run codegen:dev -- secretary settings
  npm run codegen:dev -- ownerPrimary members
  npm run codegen -- sensei`;

/** Print a readable error and stop. Every failure here should say how to fix it. */
function fail(message) {
  console.error(`\ncodegen: ${message}\n`);
  process.exit(1);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/* ------------------------------------------------------------------ target */

/**
 * Same semantics as e2e/config/environments.ts: `local` unless TEST_ENV says
 * otherwise, with the same per-target env overrides. The values themselves are
 * read from the JSON both this script and environments.ts share, because an
 * appId that disagrees with the app's NEXT_PUBLIC_APP_ID mints a token under
 * the wrong cookie name - login returns 200 and the app then ignores it.
 */
function resolveTarget() {
  const targets = readJson(path.join(ROOT, 'e2e/config/targets.json'));
  const name = process.env.TEST_ENV ?? 'local';

  if (!Object.hasOwn(targets, name)) {
    fail(
      `Invalid TEST_ENV="${name}". Expected one of: ${Object.keys(targets).join(', ')}.\n` +
        `Use "npm run codegen" for local or "npm run codegen:dev" for dev.`,
    );
  }

  const defaults = targets[name];
  // LOCAL_BASE_URL / DEV_BASE_URL, matching the names environments.ts uses.
  const baseUrlVar = `${name.toUpperCase()}_BASE_URL`;

  return {
    name,
    baseURL: process.env[baseUrlVar] ?? defaults.baseURL,
    apiURL: process.env.API_BASE_URL ?? defaults.apiURL,
    appId: process.env.APP_ID ?? defaults.appId,
  };
}

/* ------------------------------------------------------------------ routes */

/**
 * Read the URL shapes out of e2e/support/routes.ts rather than repeating them.
 * That file calls itself the one place a route lives, and a stale copy here
 * would send codegen to a 404 that looks like a broken session.
 *
 * Club-scoped values keep their literal `${clubId}` placeholder; the caller
 * substitutes the id it discovered.
 */
function loadRoutes() {
  const file = path.join(ROOT, 'e2e/support/routes.ts');
  const src = fs.readFileSync(file, 'utf8');
  const routes = {};

  const top = src.match(/export const routes = \{([\s\S]*?)\n {2}club:/);
  for (const m of (top?.[1] ?? '').matchAll(/^\s*(\w+):\s*'([^']+)'/gm)) {
    routes[m[1]] = m[2];
  }

  const club = src.match(/club:\s*\(\s*clubId[^)]*\)\s*=>\s*\(\{([\s\S]*?)\n {2}\}\)/);
  for (const m of (club?.[1] ?? '').matchAll(/^\s*(\w+):\s*`([^`]+)`/gm)) {
    routes[m[1]] = m[2];
  }

  if (!routes[DEFAULT_PAGE] || Object.keys(routes).length < 4) {
    fail(
      `Could not read the route table out of ${path.relative(ROOT, file)}.\n` +
        `Its shape has probably changed - update the parser in scripts/codegen.mjs.`,
    );
  }
  return routes;
}

/* -------------------------------------------------------------------- args */

function parseArgs(argv, routes) {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    console.log(USAGE);
    process.exit(argv.length === 0 ? 1 : 0);
  }

  const [role, page = DEFAULT_PAGE, ...rest] = argv;

  if (!ROLES.includes(role)) {
    fail(
      `Unknown role "${role}".\n` +
        `Valid roles: ${ROLES.join(', ')}.\n\n${USAGE}`,
    );
  }
  if (!Object.hasOwn(routes, page)) {
    fail(
      `Unknown page "${page}".\n` +
        `Valid pages: ${Object.keys(routes).join(', ')}.\n` +
        `These come from e2e/support/routes.ts - add it there first if the ` +
        `route is new.\n\n${USAGE}`,
    );
  }
  if (rest.length > 0) {
    fail(`Unexpected extra argument "${rest[0]}".\n\n${USAGE}`);
  }

  return { role, page, route: routes[page] };
}

/* ------------------------------------------------------------------ tokens */

/** `exp` claim of a JWT, in seconds, or null if the value is not readable. */
function tokenExpiry(value) {
  const payload = String(value).split('.')[1];
  if (!payload) return null;
  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof claims.exp === 'number' ? claims.exp : null;
  } catch {
    return null;
  }
}

const isExpired = (exp) => exp !== null && exp * 1000 <= Date.now();
const asLocalTime = (exp) => new Date(exp * 1000).toLocaleString();

/**
 * Check the saved session before opening a browser.
 *
 * The ACCESS token lives 15 minutes, so the saved one is nearly always already
 * expired - that is normal and recoverable (see refreshAccessToken). The
 * REFRESH token lives 7 days; once that is gone nothing can be recovered and
 * the browser would just land on /login, which is the confusing outcome this
 * script exists to prevent.
 */
function inspectSession(state, target, setupCommand) {
  const cookie = (suffix) =>
    state.cookies?.find((c) => c.name === `${target.appId}_${suffix}`);

  const refresh = cookie('refreshToken');
  if (!refresh) {
    fail(
      `The saved session has no "${target.appId}_refreshToken" cookie.\n` +
        `Cookies present: ${state.cookies?.map((c) => c.name).join(', ') || '(none)'}\n` +
        `If the names differ only by prefix, the session was saved under a ` +
        `different APP_ID than this target uses. Otherwise re-run: ${setupCommand}`,
    );
  }

  const refreshExp = tokenExpiry(refresh.value);
  if (isExpired(refreshExp)) {
    fail(
      `The saved session for this role expired on ${asLocalTime(refreshExp)}.\n` +
        `Refresh tokens last 7 days. Re-run: ${setupCommand}`,
    );
  }

  const access = cookie('accessToken');
  return { accessExpired: !access || isExpired(tokenExpiry(access.value)) };
}

/**
 * Mint a fresh access token from the refresh cookie the context already holds.
 *
 * Needed for two reasons: an expired access cookie is dropped by the cookie
 * jar entirely (the API then answers "No authentication token provided"), and
 * handing the browser a live token means codegen never flashes through a
 * refresh on first paint.
 *
 * POST /auth/refresh-token reads the refresh token from the cookie and sets a
 * new access cookie on the response - martial-apps-backend/src/controllers/
 * authController.js:264. It does not rotate the refresh token, so the suite's
 * saved session file stays valid; this script never writes to it.
 */
async function refreshAccessToken(ctx, target, setupCommand) {
  const res = await ctx.post(`${target.apiURL}/auth/refresh-token`, {
    headers: { 'Content-Type': 'application/json', 'x-app-id': target.appId },
    data: {},
  });

  if (!res.ok()) {
    fail(
      `Could not refresh the saved session (POST /auth/refresh-token returned ` +
        `${res.status()}).\n` +
        `Response: ${await res.text().catch(() => '(unreadable)')}\n` +
        `Re-run: ${setupCommand}`,
    );
  }
}

/* ----------------------------------------------------------------- club id */

/**
 * DISCOVERED, never hardcoded - each reseed of the demo club mints new UUIDs.
 * Same call and same override as the `clubId` fixture in e2e/support/
 * fixtures.ts, but resolved from the requested role's own session, since the
 * URL has to be a club that role actually belongs to.
 */
async function discoverClubId(ctx, target, role, setupCommand) {
  const res = await ctx.get(`${target.apiURL}/users/clubs`, {
    headers: { 'x-app-id': target.appId },
  });

  if (!res.ok()) {
    fail(
      `GET /users/clubs returned ${res.status()} - the saved session for ` +
        `"${role}" was rejected.\nRe-run: ${setupCommand}`,
    );
  }

  const body = await res.json();
  const clubs = body?.data?.clubs ?? body?.data ?? [];
  const idOf = (club) => club?.clubId ?? club?.id;

  const override = process.env.TEST_CLUB_ID;
  const club = override ? clubs.find((c) => idOf(c) === override) : clubs[0];
  const clubId = club ? idOf(club) : undefined;

  if (!clubId) {
    fail(
      override
        ? `TEST_CLUB_ID=${override} is not a club the "${role}" account belongs to.\n` +
            `It belongs to: ${clubs.map(idOf).join(', ') || '(none)'}`
        : `The "${role}" account belongs to no clubs, so there is no club-scoped ` +
            `page to open.\nSeed a demo club first - see manual-qa/00-start-here.md section 3.`,
    );
  }
  return clubId;
}

/* --------------------------------------------------------- storage + spawn */

/**
 * Write the session codegen will load: the saved cookies, plus the consent key
 * in localStorage for the app's own origin.
 *
 * Mode 0600 and deleted on exit - this file holds live session tokens.
 */
function writeTempState(state, baseURL) {
  const origin = new URL(baseURL).origin;
  const consent = {
    origin,
    localStorage: [
      { name: CONSENT_KEY, value: CONSENT_SCOPE },
      { name: CONSENT_DATE_KEY, value: new Date().toISOString() },
    ],
  };

  const file = path.join(os.tmpdir(), `martial-codegen-${process.pid}.json`);
  fs.writeFileSync(
    file,
    JSON.stringify({
      ...state,
      origins: [...(state.origins ?? []).filter((o) => o.origin !== origin), consent],
    }),
    { mode: 0o600 },
  );
  return file;
}

function runCodegen(url, storageFile, cleanup) {
  const cli = path.join(path.dirname(require.resolve('@playwright/test')), 'cli.js');

  // --test-id-attribute is deliberately absent: the app has no data-testid
  // attributes yet. Add it here the day it gains them, and codegen will emit
  // getByTestId instead of role-and-name guesses.
  const args = [
    cli,
    'codegen',
    `--load-storage=${storageFile}`,
    `--viewport-size=${VIEWPORT}`,
    `--lang=${LOCALE}`,
    `--timezone=${TIMEZONE}`,
    url,
  ];

  const child = spawn(process.execPath, args, { stdio: 'inherit', cwd: ROOT });

  // Forward signals rather than exiting straight away: a bare `kill` on this
  // process would otherwise leave the browser running with nobody to close it.
  // Ctrl-C reaches the child on its own (same process group); this covers the
  // rest.
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
    process.on(signal, () => child.kill(signal));
  }

  child.on('error', (err) => {
    cleanup();
    fail(`Could not start Playwright codegen: ${err.message}\nTry "npm install".`);
  });
  child.on('close', (code, signal) => {
    cleanup();
    process.exit(signal ? 1 : (code ?? 0));
  });
}

/* -------------------------------------------------------------------- main */

async function main() {
  const target = resolveTarget();
  const routes = loadRoutes();
  const { role, page, route } = parseArgs(process.argv.slice(2), routes);

  // The setup command for THIS target, so the fix line is copy-pasteable.
  const setupCommand = `npm run test:setup${target.name === 'local' ? '' : `:${target.name}`}`;

  const authFile = path.join(ROOT, 'playwright/.auth', target.name, `${role}.json`);
  if (!fs.existsSync(authFile)) {
    fail(
      `No saved session for "${role}" on ${target.name}.\n` +
        `Expected: ${path.relative(ROOT, authFile)}\n` +
        `Create it with: ${setupCommand}`,
    );
  }

  const { accessExpired } = inspectSession(readJson(authFile), target, setupCommand);

  const ctx = await request.newContext({ storageState: authFile });
  let state;
  let clubId;
  try {
    if (accessExpired) await refreshAccessToken(ctx, target, setupCommand);
    if (route.includes('${clubId}')) {
      clubId = await discoverClubId(ctx, target, role, setupCommand);
    }
    state = await ctx.storageState();
  } finally {
    await ctx.dispose();
  }

  const url = target.baseURL + route.replace('${clubId}', clubId ?? '');
  const storageFile = writeTempState(state, target.baseURL);

  // The temp file holds live tokens. Remove it however this process ends -
  // `exit` is the backstop for the paths runCodegen does not see.
  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    try {
      fs.rmSync(storageFile, { force: true });
    } catch {
      /* best effort - it is in the OS temp dir either way */
    }
  };
  process.on('exit', cleanup);

  console.log(
    `\ncodegen  ${target.name}  as ${role}  ${page}${clubId ? `  club ${clubId}` : ''}\n` +
      `         ${url}\n` +
      `         signed in${accessExpired ? ' (token refreshed)' : ''}, ` +
      `consent suppressed, ${VIEWPORT.replace(',', 'x')}\n\n` +
      `Recorded output is a starting point, not a locator - see ` +
      `"Finding selectors with codegen" in e2e/README.md.\n`,
  );

  runCodegen(url, storageFile, cleanup);
}

main().catch((err) => fail(err?.stack ?? String(err)));

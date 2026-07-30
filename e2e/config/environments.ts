import path from 'node:path';
import type { RoleKey } from '../support/roles';

/**
 * Per-target defaults live in JSON, not here, because `scripts/codegen.mjs` is
 * plain Node and cannot import this TypeScript file. Duplicating the values
 * there is exactly the class of bug documented on `appId` below, so both
 * consumers read the same file instead.
 */
import targets from './targets.json';

/**
 * Which environment the run targets. Switch with the TEST_ENV env var:
 *   npm test          -> local   (default)
 *   npm run test:dev  -> dev-testing.martialapps.com
 */
export type TargetName = 'local' | 'dev';

const TARGET = (process.env.TEST_ENV ?? 'local') as TargetName;

if (TARGET !== 'local' && TARGET !== 'dev') {
  throw new Error(
    `Invalid TEST_ENV="${process.env.TEST_ENV}". Expected "local" or "dev".`,
  );
}

/**
 * Frontend origin and REST API origin per target.
 *
 * These are NOT the same host on the deployed environment: the frontend does
 * not proxy /api (there are no Next.js rewrites), so https://dev-testing…/api
 * returns a 404 HTML page. Verified against the live deployment, and the API
 * origin below was read out of the deployed bundle's NEXT_PUBLIC_API_BASE_URL.
 */
const TARGETS: Record<TargetName, { baseURL: string; apiURL: string; appId: string }> = {
  local: {
    // Frontend and backend both default to port 3000, so the frontend is
    // commonly run on 3001 locally - override with LOCAL_BASE_URL.
    baseURL: process.env.LOCAL_BASE_URL ?? targets.local.baseURL,
    // Backend default. Override with API_BASE_URL if yours differs.
    apiURL: process.env.API_BASE_URL ?? targets.local.apiURL,
    appId: targets.local.appId,
  },
  dev: {
    baseURL: process.env.DEV_BASE_URL ?? targets.dev.baseURL,
    apiURL: process.env.API_BASE_URL ?? targets.dev.apiURL,
    // The deployed testing build's NEXT_PUBLIC_APP_ID is namespaced with a
    // "_testing" suffix so its cookies never collide with the production
    // frontend on the same parent domain (martialapps.com). Logging in with
    // plain "martial_frontend" mints a token under the wrong cookie name -
    // the middleware won't see it and silently redirects to /login even
    // though the token itself is perfectly valid. Verified by comparing
    // cookies set by a real UI login against this environment.
    appId: targets.dev.appId,
  },
};

const baseURL = TARGETS[TARGET].baseURL;

export const env = {
  name: TARGET,
  baseURL,

  /**
   * The REST API origin. Separate from baseURL - see the note on TARGETS.
   * Override with API_BASE_URL when your backend runs elsewhere.
   */
  apiURL: TARGETS[TARGET].apiURL,

  /**
   * Cookie namespace. The frontend builds its cookie names from this, e.g.
   * `martial_frontend_accessToken`. Must match NEXT_PUBLIC_APP_ID in the app -
   * this differs per target (see TARGETS above). Override with APP_ID in .env
   * only if your setup differs from both built-in defaults.
   */
  appId: process.env.APP_ID ?? TARGETS[TARGET].appId,

  /**
   * Saved login state, namespaced PER ENVIRONMENT on purpose: a `secure`
   * cookie issued by the deployed env is silently dropped on http://localhost,
   * which otherwise shows up as a baffling "redirected to /login".
   */
  authFile: (role: RoleKey): string =>
    path.resolve(__dirname, '../../playwright/.auth', TARGET, `${role}.json`),
} as const;

export const accessTokenCookie = `${env.appId}_accessToken`;
export const refreshTokenCookie = `${env.appId}_refreshToken`;

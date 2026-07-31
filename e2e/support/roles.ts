/**
 * Test accounts, one per club role.
 *
 * Credentials come from .env (never committed). Set DEMO_PASSWORD to whatever
 * your six accounts share. The fallback below is the admin "Demo Clubs" tool's
 * password, which applies only to clubs seeded by that tool - hand-made
 * accounts will have their own. See manual-qa/00-start-here.md section 3.
 *
 * IMPORTANT: club roles are resolved PER CLUB. Every account below must be a
 * member of the SAME club, holding the role its key names. The clubId fixture
 * asserts this and fails with a readable message if it is not true.
 */

export type RoleKey =
  | 'ownerPrimary'
  | 'coOwner'
  | 'sensei'
  | 'secretary'
  | 'member'
  | 'parent';

export interface RoleCredentials {
  email: string;
  password: string;
  /** The club role this account is expected to hold, as the API reports it. */
  clubRole: string;
  /** Human label used in test titles and failure messages. */
  label: string;
}

/** Fallback only - the Demo Clubs tool's password. Real runs set DEMO_PASSWORD. */
const DEFAULT_PASSWORD = process.env.DEMO_PASSWORD ?? 'Demo@1234';

function credential(
  envVar: string,
  clubRole: string,
  label: string,
): RoleCredentials {
  return {
    email: process.env[`${envVar}_EMAIL`] ?? '',
    password: process.env[`${envVar}_PASSWORD`] ?? DEFAULT_PASSWORD,
    clubRole,
    label,
  };
}

export const ROLES: Record<RoleKey, RoleCredentials> = {
  ownerPrimary: credential('ROLE_OWNER_PRIMARY', 'club_owner_primary', 'owner (primary)'),
  coOwner: credential('ROLE_CO_OWNER', 'club_owner', 'co-owner'),
  sensei: credential('ROLE_SENSEI', 'sensei', 'sensei'),
  secretary: credential('ROLE_SECRETARY', 'secretary', 'secretary'),
  member: credential('ROLE_MEMBER', 'club_member', 'member'),
  parent: credential('ROLE_PARENT', 'club_member', 'parent'),
};

/** Roles the access-control battery actually signs in as. */
export const ACCESS_CONTROL_ROLES: RoleKey[] = [
  'ownerPrimary',
  'coOwner',
  'sensei',
  'secretary',
  'member',
];

/**
 * Every role `setup/auth.setup.ts` saves a session for.
 *
 * A superset of ACCESS_CONTROL_ROLES: the battery does not sign in as the
 * parent, but smoke groups 13 (household) and 14 (child profile) are entirely
 * parent scenarios - 18 rows - and `scripts/codegen.mjs` cannot open any of
 * those screens without a saved session. So the session is saved for everyone,
 * and the battery still runs as the five roles above.
 *
 * THE COST OF BEING ON THIS LIST: every spec project depends on `setup`, and
 * Playwright skips a dependent project when any dependency test fails. So if
 * the parent account does not exist in the target environment, its login goes
 * red and the WHOLE suite is skipped, not just the parent tests. Confirm a new
 * account with `npm run test:setup:dev` before adding it here.
 */
export const SESSION_ROLES: RoleKey[] = [...ACCESS_CONTROL_ROLES, 'parent'];

export function assertCredentialsPresent(role: RoleKey): RoleCredentials {
  const creds = ROLES[role];
  if (!creds.email) {
    throw new Error(
      `Missing credentials for role "${role}".\n` +
        `Set ROLE_${role.replace(/([A-Z])/g, '_$1').toUpperCase()}_EMAIL in .env ` +
        `(copy .env.example to .env and fill it in).`,
    );
  }
  return creds;
}

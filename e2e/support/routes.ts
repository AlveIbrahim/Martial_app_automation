/**
 * URL shapes, in ONE place. If the app's routing changes, this is the only
 * file to edit.
 *
 * Club roles are resolved per club from the clubID in the URL, so every
 * club-scoped route needs the club id the account actually belongs to - see
 * the `clubId` fixture, which discovers it rather than hardcoding it.
 *
 * ---------------------------------------------------------------------------
 * THREE BLOCKS, AND WHY THEY ARE SEPARATE
 *
 *   TOP_LEVEL              routes with no id in them at all
 *   routes.club(clubId)    routes needing ONLY a club id
 *   DYNAMIC_ROUTE_TEMPLATES  routes needing a further id - siteId, roomId, ...
 *
 * `scripts/codegen.mjs` is plain Node and cannot import this TypeScript file,
 * so it PARSES this source as text. Each block above has its own regex there.
 * Two rules keep that parse working:
 *
 *   1. Top-level and dynamic entries are SINGLE-QUOTED, so a `${placeholder}`
 *      inside them stays literal text rather than being interpolated.
 *   2. Club-scoped entries are BACKTICKED, because `${clubId}` there really is
 *      interpolated at runtime; codegen reads the un-evaluated source.
 *
 * If you change the shape of a block, update the parser in codegen.mjs too -
 * it fails loudly rather than silently opening the wrong page.
 *
 * ---------------------------------------------------------------------------
 * NAME COLLISIONS ARE A REAL BUG HERE, NOT A STYLE POINT
 *
 * codegen.mjs flattens all three blocks into ONE lookup table, so a key used
 * twice means one route silently shadows the other and `codegen -- <role> <key>`
 * opens the wrong page. Every personal route that has a club-scoped twin is
 * therefore prefixed: `personalProgress` / `progress`, `personalSettings` /
 * `settings`, `personalLibrary` / `library`, `personalMessages` / `messages`,
 * and `belts` / `clubBelts`.
 *
 * Adding a route? Grep this file for the key first.
 */

/**
 * Routes with no id in them. Reachable by `codegen -- <role> <key>` as-is.
 *
 * The four `(auth)` routes and the three `(home)` routes are UNAUTHENTICATED -
 * they render for a signed-out visitor. `codegen` still works on them, it just
 * loads a session that page does not need. See "Groups 1 and 2" in
 * smoke_testing_scenarios.md for the public-site and admin-app cases.
 */
const TOP_LEVEL = {
  /* ---- public / unauthenticated (smoke groups 1 and 3) ---- */
  home: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  verifyEmail: '/verify-email',
  privacy: '/privacy',
  terms: '/terms',

  /* ---- forced-redirect targets the layout can bounce you to (group 3) ---- */
  changePassword: '/change-password',
  completeProfile: '/complete-profile',

  /* ---- the personal surface (groups 4, 12, 15, 16) ---- */
  dashboard: '/dashboard',
  notifications: '/dashboard/notifications',
  profile: '/profile',
  editProfile: '/editProfile',
  /** The personal belt reference, not the club's own belt page - see `clubBelts`. */
  belts: '/dashboard/belts',
  /**
   * The signed-in user's own progression, across clubs.
   *
   * NOT called `progress` - see the collision note at the top of this file.
   */
  personalProgress: '/progress',
  /** The user's own settings - privacy, security, notifications, membership. */
  personalSettings: '/settings',
  /**
   * The global move library.
   *
   * WARNING, and it changes what a test here means: `/library` AUTO-REDIRECTS
   * to the first club's library (`library/page.tsx` ~line 81) unless you pass
   * `?view=master`. What you land on is the club library, which is `MEM-011`'s
   * screen, not the global one `MEM-009` describes. Confirm which the scenario
   * means before writing anything - COVERAGE.md Bucket A flags this.
   */
  personalLibrary: '/library',
  personalLibraryWarmup: '/library/warmup',
  personalMessages: '/messages',
  /**
   * Where the sidebar's "Messages" actually points (DesktopSidebar.tsx ~line 57).
   * `/messages` above is a second, separate page component - both exist. Use
   * THIS one for anything that follows the nav, `personalMessages` only if the
   * scenario names `/messages` directly.
   */
  dashboardMessages: '/dashboard/messages',
  help: '/help',
  /** The support desk: "My Tickets", its filters, and the report-an-issue entry point. */
  support: '/support',

  /* ---- club discovery and creation (group 6) ---- */
  /**
   * NOT a club picker. It redirects to the first club the account belongs to
   * (myClub/page.tsx ~line 13), so a test that navigates here lands on
   * `/dashboard/myClub/<clubId>` - use `gotoExpectingRedirect`, not `goto`.
   */
  myClub: '/dashboard/myClub',
  clubsDiscover: '/dashboard/clubs',
  clubCreate: '/dashboard/club/create',

  /* ---- household and child (groups 13 and 14) ---- */
  household: '/dashboard/household',
  householdCreate: '/dashboard/household/create',
  /** The child-facing surface. `MEM-044` records that this is still a placeholder. */
  portal: '/portal',
} as const;

export const routes = {
  ...TOP_LEVEL,

  club: (clubId: string) => ({
    overview: `/dashboard/myClub/${clubId}`,
    analytics: `/dashboard/myClub/${clubId}/analytics`,
    history: `/dashboard/myClub/${clubId}/history`,
    settings: `/dashboard/myClub/${clubId}/settings`,
    teachers: `/dashboard/myClub/${clubId}/teachers`,
    scanAttendance: `/dashboard/myClub/${clubId}/scan-attendance`,
    site: `/dashboard/myClub/${clubId}/site`,
    library: `/dashboard/myClub/${clubId}/library`,
    /** The signed-in user's own progress, scoped to this club. */
    progress: `/dashboard/myClub/${clubId}/progress`,
    members: `/dashboard/myClub/${clubId}/members`,
    calendar: `/dashboard/myClub/${clubId}/calendar`,
    usage: `/dashboard/myClub/${clubId}/usage`,
    eligibleStudents: `/dashboard/myClub/${clubId}/eligible-students`,
    promotions: `/dashboard/myClub/${clubId}/promotions`,
    exams: `/dashboard/myClub/${clubId}/exams`,
    curricula: `/dashboard/myClub/${clubId}/curricula`,
    /** The CLUB's belt ladder. The personal reference is top-level `belts`. */
    clubBelts: `/dashboard/myClub/${clubId}/belts`,
    messages: `/dashboard/myClub/${clubId}/messages`,
    payments: `/dashboard/myClub/${clubId}/payments`,
    userPayments: `/dashboard/myClub/${clubId}/user-payments`,
    libraryManage: `/dashboard/myClub/${clubId}/library/manage`,
    libraryWarmup: `/dashboard/myClub/${clubId}/library/warmup`,
    libraryMovementTypes: `/dashboard/myClub/${clubId}/library/movement-types`,
  }),
} as const;

/**
 * Routes needing an id BEYOND the club id.
 *
 * Single-quoted on purpose: the `${...}` inside stays literal text, which is
 * what both codegen's parser and `fillRoute` below read. TypeScript does not
 * interpolate single-quoted strings, so this compiles to exactly what you see.
 *
 * `scripts/codegen.mjs` RESOLVES these against the live API - it looks up the
 * first site, room, child and so on the way it already discovers the club id,
 * so `codegen -- ownerPrimary roomAttendance` opens a real room. Each id has a
 * resolver there; adding a placeholder here without adding its resolver makes
 * codegen fail with a named error rather than opening a broken URL.
 */
export const DYNAMIC_ROUTE_TEMPLATES = {
  /* ---- sites and rooms (groups 8 and 10) ---- */
  siteDetail: '/dashboard/myClub/${clubId}/site/${siteId}',
  siteCalendar: '/dashboard/myClub/${clubId}/site/${siteId}/calendar',
  room: '/dashboard/myClub/${clubId}/site/${siteId}/rooms/${roomId}',
  /**
   * The INSTRUCTOR-side attendance screen, and the one that blocks a plain
   * member. `/scan-attendance` is the student self-check-in screen and is a
   * different route - `MEM-041` step 6 confused the two and has been corrected.
   */
  roomAttendance: '/dashboard/myClub/${clubId}/site/${siteId}/rooms/${roomId}/attendance',

  /* ---- exams (group 11) ---- */
  examGrading: '/dashboard/myClub/${clubId}/exams/${examId}/grading',

  /* ---- library items (group 15) ---- */
  clubLibraryItem: '/dashboard/myClub/${clubId}/library/${moveId}',
  clubLibraryItemEdit: '/dashboard/myClub/${clubId}/library/${moveId}/edit',
  personalLibraryItem: '/library/${moveId}',

  /* ---- help and support (regression, and group 16's CR-016) ---- */
  helpArticle: '/help/${articleId}',
  supportTicket: '/support/${ticketId}',

  /* ---- household (group 14) ---- */
  householdChild: '/dashboard/household/child/${childId}',

  /* ---- joining a club by share link (group 6) ---- */
  join: '/join/${clubId}',
} as const;

/** Club-scoped page keys usable in data-driven tables. */
export type ClubPageKey = keyof ReturnType<typeof routes.club>;

export function clubRoute(clubId: string, page: ClubPageKey): string {
  return routes.club(clubId)[page];
}

export type DynamicRouteKey = keyof typeof DYNAMIC_ROUTE_TEMPLATES;

/**
 * Fill a dynamic template with real ids.
 *
 *   fillRoute('roomAttendance', { clubId, siteId, roomId })
 *
 * Throws on a missing placeholder rather than producing a URL with a literal
 * `${siteId}` in it, which would 404 in a way that looks like a routing bug.
 */
export function fillRoute(
  page: DynamicRouteKey,
  params: Record<string, string>,
): string {
  const template: string = DYNAMIC_ROUTE_TEMPLATES[page];

  return template.replace(/\$\{(\w+)\}/g, (_match, name: string) => {
    const value = params[name];
    if (!value) {
      throw new Error(
        `Route "${page}" needs "${name}", which was not supplied.\n` +
          `Template: ${template}\n` +
          `Given: ${Object.keys(params).join(', ') || '(nothing)'}`,
      );
    }
    return value;
  });
}

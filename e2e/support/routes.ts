/**
 * URL shapes, in ONE place. If the app's routing changes, this is the only
 * file to edit.
 *
 * Club roles are resolved per club from the clubID in the URL, so every
 * club-scoped route needs the club id the account actually belongs to - see
 * the `clubId` fixture, which discovers it rather than hardcoding it.
 */

export const routes = {
  login: '/login',
  dashboard: '/dashboard',
  /**
   * NOT a club picker. It redirects to the first club the account belongs to
   * (myClub/page.tsx ~line 13), so a test that navigates here lands on
   * `/dashboard/myClub/<clubId>` - use `gotoExpectingRedirect`, not `goto`.
   */
  myClub: '/dashboard/myClub',
  /** The personal belt reference, not the club's own belt page. */
  belts: '/dashboard/belts',
  /**
   * The signed-in user's own progression, across clubs.
   *
   * NOT called `progress`, deliberately. scripts/codegen.mjs flattens the
   * top-level and club-scoped keys into ONE table, top-level first, so a
   * top-level `progress` would be silently overwritten by the club-scoped one
   * below and `codegen -- member progress` would open the wrong page.
   */
  personalProgress: '/progress',

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
  }),
} as const;

/** Club-scoped page keys usable in data-driven tables. */
export type ClubPageKey = keyof ReturnType<typeof routes.club>;

export function clubRoute(clubId: string, page: ClubPageKey): string {
  return routes.club(clubId)[page];
}

# Smoke tests

One folder per group in the smoke checklist, numbered so the listing reads in
checklist order.

**The scenario list, its automation status, and the reason anything is manual
all live in one place: [`../../smoke_testing_scenarios.md`](../../smoke_testing_scenarios.md).**
Each folder README below points at its section rather than repeating it — two
copies of a checklist drift within a week.

```
smoke-testing/
├── 01-owner-registration/      sign up on the public site
├── 02-admin-club-onboarding/   the admin app: codes, clubs, demo seeding
├── 03-authentication/          sign in per role, sign out, rejection    1 spec
├── 04-navigation-core-ui/      every role lands somewhere sensible     7 specs
├── 05-viewport-layout/         phone / 768px / desktop
├── 06-club-creation-join/      create a club, join a club
├── 07-join-requests/           approve and reject
├── 08-class-creation/          sites, rooms, classes, events
├── 09-calendar-scheduling/     read the schedule, edit it as staff     1 spec
├── 10-attendance-qr/           room attendance and the QR flow         1 spec
├── 11-exams-grading-belts/     assess a student and move them up       2 specs
├── 12-profile/                 see and change your own details
├── 13-household/               create a family
├── 14-child-profile/           PIN, screen time, the child surface
├── 15-video-library/           the content students come for           2 specs
├── 16-realtime-messaging/      messages and notifications, live
└── 17-localization/            EN / FR, and no raw i18n keys
```

The folders with no spec count are not yet written; the checklist says what each
one needs and what blocks it. Two siblings sit beside this folder:
`../regression/` holds the automated scenarios that are **not** part of a smoke
pass, and `../i18n/` holds the copy checks that pin known label bugs - note that
neither `test:smoke` nor `test:group` reaches `../i18n/`, only a full `npm test`
does.

## Running one group

```bash
npm run test:smoke            # every folder above
npm run test:group -- 04      # one of them
npm run test:group            # list the groups and stop
```

The group argument takes a number, a folder name, or any unambiguous part of one
— `04`, `nav` and `04-navigation-core-ui` are the same folder. `:dev` twins
target the deployed environment. Full detail, including why the `setup` project
still runs under a path filter, is in [`../../README.md`](../../README.md)
section 2.

## Where a scenario's test goes

**By the screen it covers, not by the role it runs as.** A role's battery is
therefore split across folders — the member boundary tests sit in `04-` except
`MEM-042`, which is a calendar scenario and lives in `09-`. The file names carry
the role (`member.blocked.spec.ts`, `secretary.blocked.spec.ts`) so a report line
still says who was signed in.

**A positive control belongs in the same folder as the absence check it pairs
with.** Otherwise `npm run test:group -- <that group>` runs the absence check
without its pair, and a green result proves nothing — README section 7. One
pairing is currently split across folders and it is documented in
[`../regression/README.md`](../regression/README.md); do not add a second.

## Writing one

Same rules as everywhere else in this suite — nothing here is special:

- **A spec never contains a locator.** Locator into `e2e/locators/`, steps into
  `e2e/pages/`, assertions only in the spec. See README section 3.
- **Title starts with the scenario ID and carries it as a tag**
  (`test('MEM-002 - ... @MEM-002')`), so Allure reads like the sheet.
- **Add an annotation** linking back to the markdown, as the existing specs do.
- **Find selectors with `npm run codegen:dev -- <role> [page]`** — README
  section 4. Its output is a draft, never pasted in as-is.
- **Pair every "control absent" assertion with a positive control** proving the
  same selector matches for a role that should have it. README section 7.
- **Use `gotoAndAwaitClubRole`, not `goto`,** whenever the assertion is about a
  control being offered or withheld. The app defaults to `userRole: 'member'`
  until `GET /users/clubs` answers, so an early check passes for every role.

## Two things to settle before writing much here

Most rows in the checklist are blocked on infrastructure that does not exist
yet, and the two biggest are worth deciding as a group rather than per test:

1. **Writes.** Groups 6, 7, 8, 11, 13 and 14 mutate shared data. They need
   their own Playwright project and a `@destructive` tag kept out of `dev`
   runs. Until that exists, the read-only halves are what to write.
2. **Two sessions.** Group 16 and every `CR-*` journey need a second
   authenticated context. One fixture unblocks eleven rows.

Both are tracked in `../../COVERAGE.md` section 6.

# Smoke test scenarios

The smoke pass, as a checklist: 17 groups, each mapped to the scenarios in
[`../manual-qa/`](../manual-qa/) that prove it works, with what is automated
today and what cannot be.

**Smoke is the thin slice, not everything.** Each group lists the scenarios a
smoke run should cover, then names the deeper ones in that area for the
regression pass. Where a group needed a scenario the manual sheets do not have
— the admin app, the public website, the login form itself — a new `SMK-xxx`
entry fills the gap. Everything else keeps its sheet ID, so a failure is still
reported with the ID you already use in ClickUp.

**The app source is the source of truth for what the app does** — see README
section 5. Between the two documents: a sheet describes intended behaviour, and
this file is only the smoke selection and the automation status. Where either
disagrees with the code, correct the document.

- Automation detail, buckets and next milestones: [`COVERAGE.md`](COVERAGE.md)
- How the suite is built and how to add a test: [`README.md`](README.md)
- Test code goes in [`specs/smoke-testing/<group>/`](specs/smoke-testing/), one
  folder per group below. Anything this checklist does *not* list is automated in
  [`specs/regression/`](specs/regression/).

**Running a group.** Each group is a folder you can point at:

```bash
npm run test:smoke            # every group
npm run test:group -- 04      # one group, by number, name, or part of a name
npm run test:group            # list the groups and stop
```

A test is filed by the **screen it covers**, not the role it runs as, so a
role's battery is split across groups — the secretary boundary is in group 4
except `SEC-042`, which is an attendance scenario and lives in group 10.

---

## The Codegen column

Every row below carries the command that opens **that scenario's screen**, signed
in as the right role, at the suite's width, with the consent banner suppressed.
The column shows only the arguments — prefix them with the script:

```bash
npm run codegen:dev -- <what the column says>      # deployed dev
npm run codegen     -- <what the column says>      # your local app
```

So `-- member personalSettings` means:

```bash
npm run codegen:dev -- member personalSettings
```

**Ids are discovered, never typed.** `clubId` was always resolved from the
account; `siteId`, `roomId`, `childId`, `examId`, `moveId`, `articleId` and
`ticketId` now are too, so `-- ownerPrimary roomAttendance` opens a real room.
When the club has no such record yet, the script says which scenario creates one
rather than opening a broken URL.

Three kinds of row do **not** get a `codegen` command, and say why instead:

| Shown | Meaning |
| --- | --- |
| `npx playwright codegen …` | **Unauthenticated screens** — the public site and the auth forms. The script always loads a session, and a signed-in visitor gets redirected away from `/login`, so use raw codegen with no session at all. |
| — *admin app* | Group 2 only. A separate deployment with its own login; no target exists in `e2e/config/targets.json` yet. |
| — *reason* | Nothing to open: an email inbox, a real camera, a timing window. |

Route keys come from [`support/routes.ts`](support/routes.ts) — 63 of them. Run
`npm run codegen:dev` with a bad key to list every one.

---

## Status legend

| | Meaning |
| --- | --- |
| ✅ | Automated and green |
| 🔴 | Automated and **failing on purpose** — the red result is the bug report ([`COVERAGE.md`](COVERAGE.md) section 3) |
| 🟡 | Partly automated, **and the rest is still to do** — blocked on something buildable: seeded data, a fixture file, the write project. This one will move. |
| ⬜ | Automatable, not written yet |
| ⛔ | Cannot be automated — reason in the row. Stays a human check, forever |

**⛔ also works as a suffix**, and that is the distinction worth reading carefully:

| | Meaning |
| --- | --- |
| ✅ ⛔ | **Automation is COMPLETE.** Everything a machine can judge is automated and green; the remainder of the scenario needs a camera, an inbox, or a human eye and will never be automatable. **This is not a gap — do not count it as work outstanding.** |
| ⬜ ⛔ | The automatable half is not written yet; the other half never can be. |

**Why `✅ ⛔` exists rather than 🟡.** A row like `OWS-001` — where thirteen cases
are green and the only thing left is a QR scan needing real hardware — is *done*,
as done as it will ever be. Marking it 🟡 alongside rows that are genuinely
waiting on seeded data makes the backlog look bigger than it is and sends whoever
is picking up work to a row that can never move. **🟡 means "come back to this";
`✅ ⛔` means "finished, and here is the part a human still owns."**

---

## Coverage at a glance

| # | Group | Smoke scenarios | Automated | Blocked on |
| ---: | --- | ---: | ---: | --- |
| 1 | [Club owner registration (website)](#1-club-owner-registration-website) | 4 | 0 | Email OTP |
| 2 | [Club onboarding (admin app)](#2-club-onboarding-admin-app) | 5 | 0 | Second app target + admin credentials |
| 3 | [Authentication](#3-authentication) | 8 | 3 | Email OTP for sign-up |
| 4 | [Navigation & core UI](#4-navigation--core-ui) | 11 | 10 | — |
| 5 | [Viewport & layout](#5-viewport--layout) | 1 | 0 | Mobile/tablet Playwright projects |
| 6 | [Club creation & club join](#6-club-creation--club-join) | 5 | 0 | Club-creation code; destructive |
| 7 | [Join requests](#7-join-requests) | 6 | 0 | A pending request; destructive |
| 8 | [Class creation](#8-class-creation) | 6 | 0 | A site + room; destructive |
| 9 | [Calendar & scheduling](#9-calendar--scheduling) | 4 | 1 | A seeded event |
| 10 | [Attendance & QR flow](#10-attendance--qr-flow) | 6 | 1 | Real camera |
| 11 | [Exams, grading & belt progression](#11-exams-grading--belt-progression) | 13 | 3 | Seeded belt/exam data; destructive |
| 12 | [Profile](#12-profile) | 4 | 1 | Upload fixture |
| 13 | [Household creation](#13-household-creation) | 2 | 0 | Destructive |
| 14 | [Child profile](#14-child-profile) | 16 | 0 | A household + child; timing windows |
| 15 | [Video library](#15-video-library) | 8 | 1 | A free-tier account |
| 16 | [Real-time messaging](#16-real-time-messaging) | 12 | 0 | Two browser contexts |
| 17 | [Localization](#17-localization) | 1 | 0 | — |

"Automated" counts ✅, ✅ ⛔ and 🟡 alike — anything with a test behind it. ⬜ and
⬜ ⛔ have none. The group tables say which is which.

**20 smoke rows are automated today**, drawn from the 29 scenario IDs the suite
covers in total — `SMK-023` counts toward the 29 as a scenario this file tracks,
but not toward the 20 automated, since it currently has no test. The rest of those 29 are the co-owner boundary and the sites
roster — regression concerns rather than smoke ones, listed under
[Outside the smoke checklist](#outside-the-smoke-checklist).

---

## 1. Club owner registration (website)

*Proves a stranger can become an account holder.*

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `SMK-001` | Public site loads and its sign-up call to action reaches `/register` | ⬜ | `npx playwright codegen https://dev-testing.martialapps.com/` | New. The sheets cover no public page; the app has `(home)`, `/privacy`, `/terms`. Unauthenticated, so no session needed — the cheapest smoke test in this file. Route keys: `home`, `privacy`, `terms`. |
| `ONB-001` | Sign up from scratch | ⛔ | `npx playwright codegen …/register` | Completing it needs the OTP mailed by `ONB-002`. The **form itself** is automatable — required fields, password rules, duplicate email — and is worth a `SMK` split if you want it. |
| `ONB-002` | Verify email via OTP code | ⛔ | — *needs a real inbox* | Would need a mail-catcher service before it could ever run. |
| `ONB-004` | Forgot password and reset | ⛔ | `npx playwright codegen …/forgot-password` | The reset link arrives by email, so only the request form is reachable. Route key: `forgotPassword`. |

> **The whole group is gated on email.** Until there is a test-inbox service,
> registration is a human check. That is a tooling decision, not a QA one —
> worth raising if this path breaks often.

---

## 2. Club onboarding (admin app)

*Proves a club can be brought into existence at all.*

**No manual-qa sheet covers the admin app.** All five below are new. The app is
`martial-apps-admin-frontend`, a separate Next.js deployment with its own
login — so it needs its own entry in `e2e/config/targets.json`, its own admin
account in `.env`, and its own auth setup project. **That infrastructure does
not exist yet**; it is the prerequisite for this whole group.

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `SMK-010` | Admin signs in to the admin app | ⬜ | — *admin app* | `auth/login`. The gate for everything below. |
| `SMK-011` | Admin reviews and approves a club-creation code request | ⬜ | — *admin app* | `club-code-requests`. This is what unblocks `ONB-005` — `00-start-here.md` section 3 says a club cannot be created without a code a platform admin issues. |
| `SMK-012` | A newly created club appears in the admin clubs list | ⬜ | — *admin app* | `clubs`. The other half of `ONB-005`. |
| `SMK-013` | Demo Clubs tool seeds a club and its per-role logins | ⬜ | — *admin app* | `demo-clubs`. **The most valuable one in this group** — every account this suite runs as comes from that tool, so when it breaks, QA stops. |
| `SMK-014` | Admin invites a user | ⬜ | — *admin app* | `invite-user`. |

> **What "— *admin app*" costs to fix**, since it blocks all five: an entry in
> `e2e/config/targets.json` for the admin deployment, an admin account in `.env`,
> and a second auth setup project. Once those exist, `codegen` needs only its
> `TEST_ENV` to accept the new target name. Listed as milestone 4 at the bottom
> of this file.

---

## 3. Authentication

*Proves each role can get in, and that the wrong credentials cannot.*

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `ONB-003` | Log in | ✅ | `npx playwright codegen …/login` | `setup/auth.setup.ts` signs in all six roles through `POST /auth/login` and asserts each lands on `/dashboard` rather than `/change-password` or `/complete-profile`. This runs before every suite execution, so a broken login is one red setup test instead of thirty confusing failures. |
| `SMK-020` | Sign in through the **login form** | ✅ | `npx playwright codegen …/login` | `login-form.spec.ts`. The one test that types into the form; everything else authenticates via the API. Unauthenticated — it simply omits `asRole(...)`, which needs no separate project. |
| `SMK-021` | A wrong password is rejected with a readable error | ✅ | `npx playwright codegen …/login` | Same file. Asserts "still on `/login`" first, because that is durable; the error is a toast with a 4-second `autoClose`, so it is asserted second and its copy is not pinned. |
| `SMK-023` | Submitting before hydration must not put credentials in the URL | ⬜ | `npx playwright codegen …/login` | **The most serious bug this suite has found — see [`COVERAGE.md`](COVERAGE.md) section 3b.** A test existed, reproduced it deterministically, and was pulled from the suite for now at QA's request. The bug is unfixed; only the test is absent. |
| `SMK-022` | Sign out clears the session and protected routes bounce to `/login` | ⬜ | `-- member dashboard` | New. Sign-out lives in the app chrome, so this one DOES need a session — record the menu as a member, then assert the bounce. |
| `MEM-020` | Forced complete-profile / change-password redirect | ⬜ | `-- member changePassword` | Also `-- member completeProfile`. Needs an account flagged `mustChangePassword` or with an incomplete profile over 14 days old. `base.page.ts` already detects both redirects and names them — this would assert them deliberately. |
| `ONB-010` | Sign up as a new student | ⛔ | — *needs a real inbox* | Email OTP, as group 1. |
| `ONB-001` / `ONB-002` / `ONB-004` | Owner sign-up, OTP, password reset | ⛔ | — *see group 1* | See group 1. |

---

## 4. Navigation & core UI

*Proves every role lands somewhere sensible and is offered only what their role allows.*

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `MEM-001` | Member dashboard loads, no management actions | ✅ | `-- member dashboard` | `member.read-only.spec.ts` |
| `MEM-005` | Club overview, member tab set (no Members, no Settings, no share) | ✅ | `-- member overview` | Same file. Paired with an owner positive control. |
| `MEM-007` | Member turned away from the members roster | ✅ | `-- member members` | `member.blocked.spec.ts` |
| `MEM-041` | Member turned away from analytics / history / settings / teachers | ✅ | `-- member analytics` | Four cases, same file — swap the key for `history`, `settings`, `teachers`. |
| `SEC-040`, `SEC-041`, `SEC-043`, `SEC-044` | Secretary boundary | ✅ 🔴 | `-- secretary analytics` | Also `history`, `settings`, `teachers`. `secretary.blocked.spec.ts`. `SEC-043` is red on purpose. `SEC-042` is in group 10. |
| `SEN-040`–`SEN-044` | Sensei boundary across five screens | ✅ 🔴 | `-- sensei analytics` | Also `history`, `teachers`, `settings`, `members`. `sensei.blocked.spec.ts`. `SEN-042` and `SEN-044` are red on purpose. |
| `SEC-001` | My Club nav is visible to a secretary | ✅ | `-- secretary overview` | `secretary.allowed.spec.ts`. The positive counterpart to the secretary battery, and it doubles as a positive control for `MEM-005` — it asserts the Members tab IS offered, with the same selector. |
| `SEN-001` | My Club nav is visible to a sensei | ✅ | `-- sensei overview` | `sensei.allowed.spec.ts`. Stops before the tab bar deliberately: a sensei being shown the Settings tab is `SEN-042`, already red. |
| `OWS-001` | Co-owner sees the full management surface | ✅ ⛔ | `-- coOwner overview` | `co-owner.allowed.spec.ts`, 13 cases — the four tabs, then every page steps 2 and 3 list. **Two sheet corrections, both confirmed in source:** the tab bar renders **four** tabs, not five (`Header.tsx` ~line 1202 maps `['overview','members','site','settings']`; a `calendar` entry survives unused in the label map beside it, which is probably where the fifth came from), and the third tab is labelled **"Sites"**, plural. Only Scan Attendance is left out — it mounts a live camera, so it stays manual for every role. |
| `SMK-030` | Every primary nav destination loads for the owner | ✅ | `-- ownerPrimary dashboard` | `owner.nav-sweep.spec.ts`. Eight destinations in one test. **It CLICKS the links rather than navigating by URL**, because three hrefs are computed at render time — Calendar and Library resolve to club-scoped URLs, and Payment forks between `/payments` (owner) and `/user-payments` (everyone else). Navigating to a URL we worked out ourselves would skip the half most likely to break. The sidebar's items are the only `data-track`-attributed elements in the app — see the note below. |
| `CHD-001` | Child menu is restricted | ⬜ | `-- parent portal` | Needs a child profile — see group 14. |

> **The sidebar is the one place this app has a test attribute.** Every nav item
> renders `data-track="nav:<key>"` (`DesktopSidebar.tsx` ~line 268), so
> `nav.locators.ts` uses those rather than accessible names — locale-proof, and
> they survive the sidebar being collapsed, where the text label is not rendered
> at all. Two traps come with them: `BottomNavigation.tsx` reuses the SAME
> attribute values, so these are `:visible`-scoped (a CSS locator, unlike
> `getByRole`, matches hidden nodes); and the phone bar is a **different set of
> six**, dropping Messages and Progress, so it is not this sweep restyled.
>
> **Read `COVERAGE.md` section 1 before touching the boundary tests.** A
> "control absent" check passes loudest when the selector is simply wrong, and
> three of these once did exactly that.
>
> Every automated row above is backed by `owner.allowed.spec.ts` in the same
> folder — 8 cases proving the same routes and selectors DO work for the primary
> owner. It is not a scenario of its own, which is why it has no row. **If it is
> red, treat every result in this group as unreliable.**

---

## 5. Viewport & layout

*Proves the app is usable at the sizes people actually hold.*

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `XC-002` | Responsive layout at phone, the ~768px boundary, and desktop | ⬜ | `-- member overview` | ⚠️ **Codegen is pinned to 1280×720**, the suite's width (`VIEWPORT` in `scripts/codegen.mjs`), so it CANNOT record the phone or tablet branch. Edit that constant, or record by hand. **Needs infrastructure first:** the suite runs one project at 1280×720, and this group needs mobile and tablet projects in `playwright.config.ts`. |

> **This is not a restyle — it is different components.** `MembersTableView`
> renders at ≥1024px (`hidden lg:block`) and a card list renders below it, so a
> selector confirmed on desktop can match nothing on a phone. Any test added
> here has to be written against the branch that actually executes at that
> width, and re-recorded per width (README section 4).

---

## 6. Club creation & club join

*Proves a club can be created and a stranger can get into it.*

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `ONB-005` | Create a club (wizard) | ⬜ | `-- ownerPrimary clubCreate` | Blocked on a club-creation code from group 2, and **destructive** — every run leaves a club behind. |
| `ONB-011` | Join a club via a share / QR link | ⬜ ⛔ | `-- member join` | The `/join/[clubId]` **link** half is automatable — `clubId` is discovered, so this opens a real invite. Scanning the QR with a camera is ⛔. Destructive — creates a join request. |
| `ONB-012` | Discover and request a club inside the app | ⬜ | `-- member clubsDiscover` | `/dashboard/clubs`. Destructive. |
| `OWP-002` | Generate QR / share link | ⬜ | `-- ownerPrimary overview` | Read-only for the owner: the share dialog (sidebar) and the Settings QR tab — `-- ownerPrimary settings` for the second half. **A good early smoke test** — the control is already located as `commonLocators.shareClub`. |
| `OWP-040` | Empty-state sweep on a brand-new club | ⬜ | `-- ownerPrimary overview` | Needs a fresh club, so it pairs with `ONB-005`. |

---

## 7. Join requests

*Proves the club's front door opens and closes.*

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `OWP-010` | Owner approves a join request | ⬜ | `-- ownerPrimary members` | Needs a pending request. Destructive. |
| `OWP-011` | Owner rejects a join request | ⬜ | `-- ownerPrimary members` | Same. |
| `SEC-002` | Secretary approves / rejects | ⬜ | `-- secretary members` | Same, as secretary. |
| `OWS-002` | Co-owner approves / rejects | ⬜ | `-- coOwner members` | Same, as co-owner. |
| `CR-002` | Join request → owner approves → member appears in the roster | ⬜ | `-- ownerPrimary members` | Two browser contexts. Record each side separately — codegen drives one session at a time. |
| `CR-003` | Join request → owner rejects → applicant sees the not-approved state | ⬜ | `-- ownerPrimary members` | Two browser contexts; the applicant side is `-- member clubsDiscover`. |

> **Every row here writes.** They need their own Playwright project and a
> `@destructive` tag excluded from `dev` runs, plus a way to create a pending
> request — probably an API seeding helper. See `COVERAGE.md` Bucket B.

---

## 8. Class creation

*Proves a club can put a class on the calendar.*

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `OWP-003` | Create a site | ⬜ | `-- ownerPrimary site` | **Prerequisite** — a class needs a room, a room needs a site. Destructive. |
| `OWP-004` | Create a room in a site | ⬜ | `-- ownerPrimary siteDetail` | `siteId` is discovered, so this opens the first real site. Destructive. |
| `OWP-006` | Create a class | ⬜ | `-- ownerPrimary calendar` | Destructive. |
| `OWP-007` | Create a recurring class | ⬜ | `-- ownerPrimary calendar` | Destructive, and leaves many events behind. |
| `OWP-008` | Create an exam / workshop / social / tournament | ⬜ | `-- ownerPrimary calendar` | Four event types from one dialog. |
| `SEN-003` | Sensei creates / edits a class or workshop | ⬜ | `-- sensei calendar` | Staff-side permission check. |

---

## 9. Calendar & scheduling

*Proves the schedule is readable, and editable only by staff.*

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `MEM-042` | Member sees no create-event control on the calendar | ✅ | `-- member calendar` | `member.blocked.spec.ts`. **No positive control** — nothing proves that selector matches for the owner, so it would pass on a wrong selector. `OWP-009` would close it. |
| `MEM-006` | Member views the club calendar read-only | ⬜ | `-- member calendar` | **The demo club has no events** — the page reads "No events scheduled". Only the empty-state frame is automatable now; "real classes shown" and "tap an event" need a seeded event. |
| `OWP-009` | Edit / cancel / reschedule an event | ⬜ | `-- ownerPrimary calendar` | Destructive. Also closes `MEM-042`'s missing positive control. |
| `SEN-011` | Teaching-schedule filter on the calendar | ⬜ | `-- sensei calendar` | Read-only, needs events. The per-site view is `-- sensei siteCalendar`. |

> The calendar page heading is **the current date**, not the word "calendar".
> The stable anchor is the `Event Types` sidebar heading — already in
> `club-section.locators.ts`.

---

## 10. Attendance & QR flow

*Proves attendance can be taken — by camera and by hand.*

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `SEC-042` | Secretary is turned away from scan-attendance | ✅ | `-- secretary scanAttendance` | `secretary.blocked.spec.ts`. **No positive control, and none is possible** while the page mounts a live camera — a route broken for everyone would read as correct access control. |
| `OWP-031` | Take room-level attendance by hand | ⬜ | `-- ownerPrimary roomAttendance` | **The automatable half of this group** — marking attendance in the room screen needs no camera. `siteId` and `roomId` are both discovered. Destructive. |
| `SEN-010` | Sensei takes room-level attendance | ⬜ | `-- sensei roomAttendance` | Same, as sensei. |
| `SEN-009` | Scan attendance / generate a class QR | ⛔ | `-- ownerPrimary scanAttendance` | The screen opens and the QR half is visible, but the scan mounts a live camera (`html5-qrcode`, `#qr-reader`) needing real hardware plus a permissions grant. |
| `CR-001` | Member scans the class QR to self-register | ⛔ | `-- member scanAttendance` | Same, from the student side. Note this route ALLOWS a member by design — it blocks `secretary` only. |
| `OWS-006` | Co-owner uses scan-attendance | ⛔ | `-- coOwner scanAttendance` | Same page, same camera. |

> `/scan-attendance` is **student self-check-in** and opens for a member on
> purpose — it blocks `secretary` only. The instructor-side screen is a
> different route, `site/[siteId]/rooms/[roomId]/attendance`. `MEM-041` step 6
> was wrong about this and has been corrected.

---

## 11. Exams, grading & belt progression

*Proves a student can be assessed and moved up.*

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `MEM-004` | Club-scoped progress renders for a member | 🟡 | `-- member progress` | `member.read-only.spec.ts`. Step 1 only — the seeded member has **no attendance**, so the number comparisons in steps 2–3 are `0 == 0` and prove nothing. |
| `MEM-002` | Personal belt reference | ✅ | `-- member belts` | `member.read-only.spec.ts`, paired with `owner.allowed.spec.ts` in the same folder for the Eligible Students absence check. **The sheet has been corrected:** the page shows the club's belts only, not a master set as well. |
| `MEM-003` | Personal progression | 🟡 | `-- member personalProgress` | Same file. Step 1 only — the seeded member has no attendance, so steps 2–3's number comparisons are `0 == 0`. The key is `personalProgress`, **not** `progress`: the club-scoped `progress` would shadow it — see the collision note in `support/routes.ts`. |
| `OWP-016` | Define club belts | ⬜ | `-- ownerPrimary clubBelts` | The CLUB's ladder, not the personal `belts` reference. Destructive. |
| `OWP-017` | Create and assign a curriculum | ⬜ | `-- ownerPrimary curricula` | Destructive. |
| `OWP-018` | View eligible students | ⬜ | `-- ownerPrimary eligibleStudents` | Read-only, but needs eligibility data to be meaningful. |
| `OWP-019` | Schedule an exam and grade candidates | ⬜ | `-- ownerPrimary exams` | Grading is `-- ownerPrimary examGrading` (`examId` discovered). Destructive, and the grading half changes belts. |
| `OWP-020` | Run the promotion workflow | ⬜ | `-- ownerPrimary promotions` | **Irreversible** — promotes real members. |
| `SEN-004` / `SEN-005` | Sensei schedules an exam, grades, promotes | ⬜ | `-- sensei exams` | Same, as sensei. |
| `SEN-006` / `SEC-005` | Manage curricula / edit club belts as staff | ⬜ | `-- secretary curricula` | Also `-- secretary clubBelts`. Destructive. |
| `SEN-007` / `SEC-006` | View eligible students as staff | ⬜ | `-- sensei eligibleStudents` | Read-only. |
| `MEM-015` | Member self-enrolls / self-unenrols a curriculum | ⬜ | `-- member curricula` | Destructive but self-reversing. |
| `CR-014` | Exam grade → belt promotion → history reflects it | ⬜ | `-- ownerPrimary examGrading` | Two contexts, irreversible. The end-to-end proof for this whole group. |

---

## 12. Profile

*Proves a user can see and change their own details.*

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `MEM-018` | Edit own profile and avatar | ⬜ | `-- member editProfile` | The read-only view is `-- member profile`. The text fields are automatable; the **avatar upload needs a fixture image**. Destructive but self-reversing. |
| `MEM-019` | Account / security / language settings | 🟡 | `-- member personalSettings` | `member.read-only.spec.ts`. **Step 1 only** — the page loads and offers its tabs. Steps 2–5 all write (password, privacy toggles, push preference, language), so they wait on the mutating milestone. **The sheet lists three tabs; the page renders four** — `Membership` is missing from it and needs adding. Two of the four labels are hardcoded English, not `t(...)` calls — see [`COVERAGE.md`](COVERAGE.md) section 6. The language half overlaps group 17. Billing pane is a STUB — see `MEM-043`. |
| `MEM-020` | Forced complete-profile / change-password | ⬜ | `-- member changePassword` | Also `-- member completeProfile`. Listed under group 3 too. |
| `PAR-010` | Parent uses the full standard surface | ⬜ | `-- parent dashboard` | A sweep, mostly re-running MEM scenarios as the parent account. |

---

## 13. Household creation

*Proves a parent can set up a family.*

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `ONB-020` | Create a household | ⬜ | `-- parent householdCreate` | **Prerequisite for all of group 14.** Destructive. |
| `PAR-001` | View household members | ⬜ | `-- parent household` | Read-only once a household exists. |

> **The `parent` session is new**, and is what makes every command in this group
> and the next possible. `auth.setup.ts` saves one as of 2026-08-01
> (`SESSION_ROLES` in `support/roles.ts`), **verified green against `dev` the
> same day.** Worth knowing if you ever add another role to that list: every
> spec depends on the `setup` project, and Playwright skips dependents when a
> dependency fails — so an account that does not exist takes the whole suite
> down, not just its own tests. Confirm a new one with `npm run test:setup:dev`.

---

## 14. Child profile

*Proves the child experience is locked down as designed.*

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `ONB-021` | Create a child profile (PIN + screen time) | ⬜ | `-- parent household` | Prerequisite for the rest. Destructive. |
| `PAR-002` | Set / reset a child's PIN | ⬜ | `-- parent householdChild` | `childId` is discovered from the parent's own household. |
| `PAR-003` | Set / change a screen-time limit | ⬜ | `-- parent householdChild` | |
| `PAR-004` / `PAR-005` | Switch parent → child and back, with PIN | ⬜ | `-- parent household` | The core of this group. |
| `PAR-007` / `PAR-008` | Approve / deny a screen-time extension | ⬜ | `-- parent household` | Needs a pending request from `CHD-006`. |
| `PAR-009` | Open child profile detail | ⬜ | `-- parent householdChild` | Read-only. |
| `PAR-040` / `PAR-041` | Edge: mismatched PIN, very low limit | ⬜ | `-- parent householdChild` | Form validation, cheap to automate. |
| `CHD-001` | Child menu is restricted | ⬜ | `-- parent portal` | Also listed under group 4. |
| `CHD-002` | Child can use Library, Belts and Progress | ⬜ | `-- parent portal` | Read-only. |
| `CHD-006` | Child sends a screen-time extension request | ⬜ | `-- parent portal` | Destructive. |
| `CHD-007` | Switching back to the parent needs the PIN | ⬜ | `-- parent portal` | |
| `CHD-040` | Hidden pages reachable by typing the URL | ⬜ | `-- parent portal` | KNOWN-GAP: verify, do not file. The "child writes are refused" half is worth asserting. |
| `CR-010` | Screen-time request → parent approves | ⬜ | `-- parent household` | One account, two profiles. |
| `PAR-006` | PIN lockout escalation | ⛔ | — *hour-long waits* | 15 / 30 / 60-minute lockouts with a 24-hour reset. No test should sit waiting an hour. |
| `CHD-003` / `CHD-004` / `CHD-005` | Screen-time warning, lock screen, lock survives reload | ⛔ | — *real-time burn-down* | Needs the screen-time budget to burn down in real time. |
| `CHD-041` | Clearing browser storage does not unlock | ⛔ | — *depends on the above* | Depends on the lock state above. |

> **Every row here is gated on the child surface existing.** The `portal` and
> `householdChild` keys resolve only once the parent account has a household with
> a child profile in it — `ONB-020` then `ONB-021`. Until then codegen names the
> scenario that creates one rather than opening a broken URL.

---

## 15. Video library

*Proves the content students come for actually plays.*

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `MEM-011` | Club library is read-only for a member | ✅ ⛔ | `-- member library` | `member.read-only.spec.ts`. Steps 1 and 3; opening a move and playing it stays manual. Its positive control is `owner.allowed.spec.ts` in the same folder. |
| `MEM-009` | Global move library and a move detail | ⬜ | `-- member personalLibrary` | A move detail is `-- member personalLibraryItem` (`moveId` discovered). **Check the sheet first:** `/library` auto-redirects to the first club's library unless `?view=master` (`library/page.tsx` ~line 81), so what you land on is `MEM-011`'s screen. One of the two descriptions is wrong. |
| `MEM-010` | Global and club warmups | ⬜ | `-- member personalLibraryWarmup` | The club's own is `-- member libraryWarmup`. Read-only. |
| `MEM-022` | Library shows content for your tier and belt | ⬜ | `-- member library` | Needs a genuinely free-tier account; new accounts default to premium. |
| `XC-007` | Library content matches the account's tier and belt | ⬜ | `-- member library` | Same prerequisite; `XC-007` is the cross-cutting version. |
| `OWP-026` | Manage the club library | ⬜ | `-- ownerPrimary libraryManage` | Destructive. The manage control is a **link with an aria-label**, not a button. |
| `OWP-027` | Manage club warmups | ⬜ | `-- ownerPrimary libraryWarmup` | Destructive. |
| `SEN-008` | Sensei manages library content | ⬜ | `-- sensei library` | **Note an open bug here:** the manage control is gated on `userRole === 'owner'`, so a sensei is offered it — same root cause as `SEN-044`. See `COVERAGE.md` section 6 item 6. |

> Video playback itself is a visual judgement and stays manual everywhere in
> this group. The missing quality switcher is a known limitation — do not file.

---

## 16. Real-time messaging

*Proves messages and notifications arrive without a refresh.*

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `MEM-012` | Notification centre and mark read | ⬜ | `-- member notifications` | Reading the list is automatable; **mark-read is a write** and belongs with the mutating milestone. |
| `MEM-013` | Free tier can contact staff | ⬜ | `-- member personalMessages` | Destructive — sends a message. |
| `MEM-040` | A plain member cannot start a chat with another plain member | ⬜ | `-- member personalMessages` | Read-only: the contact picker simply does not offer them. A good absence check — pair it with a positive control. |
| `MEM-023` | Group messaging | ⬜ | `-- member personalMessages` | Two contexts. |
| `MEM-024` | Urgent / audible messages | ⬜ | `-- member notifications` | The audible half is a human check. |
| `OWP-029` | Send a club broadcast notification | ⬜ | `-- ownerPrimary overview` | Destructive, and it notifies every member of the shared club. |
| `CR-007` | Live DM between two sessions | ⬜ | `-- member personalMessages` | Two contexts. **The core realtime proof.** |
| `CR-008` | Live broadcast → the member's bell | ⬜ | `-- member notifications` | Two contexts; the sending side is `-- ownerPrimary overview`. |
| `CR-009` | Free-tier messaging gate | ⬜ | `-- member personalMessages` | Three identities, plus a free-tier account. |
| `CR-016` | Support ticket live thread | ⬜ | `-- member supportTicket` | `ticketId` is discovered, but the staff side needs the separate admin panel. |
| `CR-019` | Group chat: staff creates, a member participates | ⬜ | `-- sensei personalMessages` | Two contexts. The club-scoped view is `-- sensei messages`. |
| `XC-005` | Live updates over the connection (the realtime backbone) | ⬜ | `-- member personalMessages` | The umbrella check for the whole group. |

> **The blocker for almost all of this is a second authenticated context.** One
> fixture unlocks eleven of these twelve rows — it is the highest-leverage piece
> of infrastructure left. See `COVERAGE.md` section 6 item 3.

---

## 17. Localization

*Proves nothing is untranslated or hard-coded.*

| ID | Scenario | | Codegen | Notes |
| --- | --- | :-: | --- | --- |
| `XC-001` | Switch English and French and sweep for broken labels | ⬜ | `-- member overview` | Any route works — this is a sweep, not one screen. Automatable as a smoke sweep, and **the infrastructure is already here**: every locator in `locators/` carries an `EN\|FR` alternation, so both languages are already matched. ⚠️ Codegen always records in `en-GB` (`LOCALE` in `scripts/codegen.mjs`), so it can never show you the French string — read it from `messages/fr.json` instead. |

> **There are two live examples of exactly what this group catches**, and
> neither was found by looking for them.
> `teacherManagement.accessRestricted` is missing from both `messages/en.json`
> and `messages/fr.json`, so next-intl renders the raw key path to users on the
> teachers denial screen. And the whole `belts` namespace is missing 13 keys
> from `messages/fr.json` alone — including `beltSystemTitle`, the belts page
> H1, so a French user's largest on-screen text is `belts.beltSystemTitle`.
>
> A sweep for headings matching `RAW_I18N_KEY` (`locators/common.locators.ts`)
> would have caught both. Both are pinned individually in
> [`specs/i18n/`](specs/i18n/) meanwhile, and listed in `COVERAGE.md` section 6.
>
> **The French half needs infrastructure this group does not have yet.** The
> app takes its UI language from the user's **profile**, not the browser locale,
> so switching it is a write — which is why `belts-copy.spec.ts` is `fixme`
> rather than red. A profile-language fixture is the thing that unblocks this
> whole group.

---

## Outside the smoke checklist

Not everything the suite covers, or the sheets contain, belongs to one of the 17
groups. Recorded here so nothing looks lost:

| Area | Scenarios | Where it lives |
| --- | --- | --- |
| **Access-control battery** | `MEM-007`, `MEM-041`, `MEM-042`, `SEC-040`–`SEC-045`, `SEN-040`–`SEN-044`, `OWS-040`–`OWS-042`, `CR-017`, `CR-018` | Most of it overlaps navigation and is listed under group 4, with `MEM-042` in group 9 and `SEC-042` in group 10. `OWS-040` / `OWS-041` are regression rather than smoke and live in [`specs/regression/`](specs/regression/). |
| **Member management** | `OWP-012`, `OWP-014`, `OWP-021`, `OWP-022`, `OWP-030`, `OWS-003`, `OWS-007`, `OWS-009`, `SEC-002`, `SEC-003`, `CR-004`–`CR-006`, `CR-011`, `CR-012` | Regression. Mostly destructive; `OWP-030` / `CR-006` are irreversible. |
| **Sites & rooms** | `OWP-003`, `OWP-004`, `OWP-005`, `MEM-008` ✅ | `MEM-008` is automated in [`specs/regression/`](specs/regression/) with its own positive control; the rest is a prerequisite for group 8. |
| **Reporting** | `OWP-023`, `OWP-024`, `OWP-025`, `OWS-005` | Regression. Analytics, history, usage. |
| **Club settings & fee tiers** | `OWP-013`, `OWP-028` | Regression. Fee tiers are payment-adjacent. |
| **Help & support** | `MEM-016`, `MEM-017`, `MEM-021` | Regression. The help centre currently has **no seeded articles**. |
| **Exit requests** | `MEM-014`, `OWP-015`, `SEC-003`, `OWS-009`, `CR-011` | Regression, destructive. |
| **PWA, offline, device** | `XC-003`, `XC-004`, `XC-006` | ⛔ Real hardware and install prompts. Permanently manual. |
| **Placeholders** | `MEM-043`, `MEM-044` | STUB — the instruction is to confirm they are still placeholders. Nothing to assert. |
| **Payments / Stripe** | — | **Out of scope by decision**, not by difficulty. |

---

## What has to exist before most of this can be written

Ranked by how many rows above each one unblocks:

1. **A second authenticated browser context.** Unblocks eleven rows in group 16
   and every `CR-*` journey. One fixture.
2. **A destructive-test project** with its own tag, excluded from `dev` runs,
   plus a decision on isolation — likely a per-run club. Unblocks groups 6, 7, 8
   and most of 11.
3. **An API seeding helper** — a pending join request, a class starting now, a
   calendar event, an exam. Unblocks the rest of groups 7, 9 and 11, and turns
   three 🟡 rows green.
4. **The admin app as a second target** — its own `targets.json` entry, admin
   credentials, its own auth setup. Unblocks all of group 2, and `ONB-005`
   behind it.
5. **Mobile and tablet Playwright projects.** Unblocks group 5, and is what
   makes any responsive claim in the other groups verifiable at all.
6. **A free-tier test account.** Unblocks `MEM-022`, `XC-007`, `CR-009`.
7. **A mail-catcher service.** The only thing that would ever unblock group 1.

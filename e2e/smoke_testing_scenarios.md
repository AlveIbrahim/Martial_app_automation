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

Where this file and a sheet disagree, the sheet wins for *what should happen*;
this file is only the smoke selection and the automation status.

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

## Status legend

| | Meaning |
| --- | --- |
| ✅ | Automated and green |
| 🔴 | Automated and **failing on purpose** — the red result is the bug report ([`COVERAGE.md`](COVERAGE.md) section 3) |
| 🟡 | Partly automated — the rest is named in the row |
| ⬜ | Automatable, not written yet |
| ⛔ | Cannot be automated — reason in the row. Stays a human check, forever |

---

## Coverage at a glance

| # | Group | Smoke scenarios | Automated | Blocked on |
| ---: | --- | ---: | ---: | --- |
| 1 | [Club owner registration (website)](#1-club-owner-registration-website) | 4 | 0 | Email OTP |
| 2 | [Club onboarding (admin app)](#2-club-onboarding-admin-app) | 5 | 0 | Second app target + admin credentials |
| 3 | [Authentication](#3-authentication) | 8 | 3 | Email OTP for sign-up |
| 4 | [Navigation & core UI](#4-navigation--core-ui) | 11 | 8 | — |
| 5 | [Viewport & layout](#5-viewport--layout) | 1 | 0 | Mobile/tablet Playwright projects |
| 6 | [Club creation & club join](#6-club-creation--club-join) | 5 | 0 | Club-creation code; destructive |
| 7 | [Join requests](#7-join-requests) | 6 | 0 | A pending request; destructive |
| 8 | [Class creation](#8-class-creation) | 6 | 0 | A site + room; destructive |
| 9 | [Calendar & scheduling](#9-calendar--scheduling) | 4 | 2 | A seeded event |
| 10 | [Attendance & QR flow](#10-attendance--qr-flow) | 6 | 1 | Real camera |
| 11 | [Exams, grading & belt progression](#11-exams-grading--belt-progression) | 13 | 3 | Seeded belt/exam data; destructive |
| 12 | [Profile](#12-profile) | 4 | 0 | Upload fixture |
| 13 | [Household creation](#13-household-creation) | 2 | 0 | Destructive |
| 14 | [Child profile](#14-child-profile) | 16 | 0 | A household + child; timing windows |
| 15 | [Video library](#15-video-library) | 8 | 1 | A free-tier account |
| 16 | [Real-time messaging](#16-real-time-messaging) | 12 | 0 | Two browser contexts |
| 17 | [Localization](#17-localization) | 1 | 0 | — |

"Automated" counts ✅ and 🟡 rows alike; the group tables say which is which.

**18 smoke rows are automated today**, drawn from the 27 scenario IDs the suite
covers in total — `SMK-023` counts toward the 27 as a scenario this file tracks,
but not toward the 18 automated, since it currently has no test. The rest of those 27 are the co-owner boundary and the sites
roster — regression concerns rather than smoke ones, listed under
[Outside the smoke checklist](#outside-the-smoke-checklist).

---

## 1. Club owner registration (website)

*Proves a stranger can become an account holder.*

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `SMK-001` | Public site loads and its sign-up call to action reaches `/register` | ⬜ | New. The sheets cover no public page; the app has `(home)`, `/privacy`, `/terms`. Unauthenticated, so no session needed — the cheapest smoke test in this file. |
| `ONB-001` | Sign up from scratch | ⛔ | Completing it needs the OTP mailed by `ONB-002`. The **form itself** is automatable — required fields, password rules, duplicate email — and is worth a `SMK` split if you want it. |
| `ONB-002` | Verify email via OTP code | ⛔ | Needs a real inbox. Would need a mail-catcher service before it could ever run. |
| `ONB-004` | Forgot password and reset | ⛔ | Same: the reset link arrives by email. |

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

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `SMK-010` | Admin signs in to the admin app | ⬜ | `auth/login`. The gate for everything below. |
| `SMK-011` | Admin reviews and approves a club-creation code request | ⬜ | `club-code-requests`. This is what unblocks `ONB-005` — `00-start-here.md` section 3 says a club cannot be created without a code a platform admin issues. |
| `SMK-012` | A newly created club appears in the admin clubs list | ⬜ | `clubs`. The other half of `ONB-005`. |
| `SMK-013` | Demo Clubs tool seeds a club and its per-role logins | ⬜ | `demo-clubs`. **The most valuable one in this group** — every account this suite runs as comes from that tool, so when it breaks, QA stops. |
| `SMK-014` | Admin invites a user | ⬜ | `invite-user`. |

---

## 3. Authentication

*Proves each role can get in, and that the wrong credentials cannot.*

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `ONB-003` | Log in | ✅ | `setup/auth.setup.ts` signs in all five roles through `POST /auth/login` and asserts each lands on `/dashboard` rather than `/change-password` or `/complete-profile`. This runs before every suite execution, so a broken login is one red setup test instead of thirty confusing failures. |
| `SMK-020` | Sign in through the **login form** | ✅ | `login-form.spec.ts`. The one test that types into the form; everything else authenticates via the API. Unauthenticated — it simply omits `asRole(...)`, which needs no separate project. |
| `SMK-021` | A wrong password is rejected with a readable error | ✅ | Same file. Asserts "still on `/login`" first, because that is durable; the error is a toast with a 4-second `autoClose`, so it is asserted second and its copy is not pinned. |
| `SMK-023` | Submitting before hydration must not put credentials in the URL | ⬜ | **The most serious bug this suite has found — see [`COVERAGE.md`](COVERAGE.md) section 3b.** A test existed, reproduced it deterministically, and was pulled from the suite for now at QA's request. The bug is unfixed; only the test is absent. |
| `SMK-022` | Sign out clears the session and protected routes bounce to `/login` | ⬜ | New. |
| `MEM-020` | Forced complete-profile / change-password redirect | ⬜ | Needs an account flagged `mustChangePassword` or with an incomplete profile over 14 days old. `base.page.ts` already detects both redirects and names them — this would assert them deliberately. |
| `ONB-010` | Sign up as a new student | ⛔ | Email OTP, as group 1. |
| `ONB-001` / `ONB-002` / `ONB-004` | Owner sign-up, OTP, password reset | ⛔ | See group 1. |

---

## 4. Navigation & core UI

*Proves every role lands somewhere sensible and is offered only what their role allows.*

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `MEM-001` | Member dashboard loads, no management actions | ✅ | `member.read-only.spec.ts` |
| `MEM-005` | Club overview, member tab set (no Members, no Settings, no share) | ✅ | Same file. Paired with an owner positive control. |
| `MEM-007` | Member turned away from the members roster | ✅ | `member.blocked.spec.ts` |
| `MEM-041` | Member turned away from analytics / history / settings / teachers | ✅ | Four cases, same file. |
| `SEC-040`, `SEC-041`, `SEC-043`, `SEC-044` | Secretary boundary | ✅ 🔴 | `secretary.blocked.spec.ts`. `SEC-043` is red on purpose. `SEC-042` is in group 10. |
| `SEN-040`–`SEN-044` | Sensei boundary across five screens | ✅ 🔴 | `sensei.blocked.spec.ts`. `SEN-042` and `SEN-044` are red on purpose. |
| `SEC-001` | My Club nav is visible to a secretary | ✅ | `secretary.allowed.spec.ts`. The positive counterpart to the secretary battery, and it doubles as a positive control for `MEM-005` — it asserts the Members tab IS offered, with the same selector. |
| `SEN-001` | My Club nav is visible to a sensei | ✅ | `sensei.allowed.spec.ts`. Stops before the tab bar deliberately: a sensei being shown the Settings tab is `SEN-042`, already red. |
| `OWS-001` | Co-owner sees the full management surface | ⬜ | Same for co-owner. |
| `SMK-030` | Every primary nav destination loads for the owner | ⬜ | New: a sidebar sweep — Home, Calendar, Message, Progress, Library, Support, Payment, My Club. Catches a dead route in one test. |
| `CHD-001` | Child menu is restricted | ⬜ | Needs a child profile — see group 14. |

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

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `XC-002` | Responsive layout at phone, the ~768px boundary, and desktop | ⬜ | **Needs infrastructure first.** The suite runs one project at 1280×720 (`devices['Desktop Chrome']`). This group needs mobile and tablet projects in `playwright.config.ts`. |

> **This is not a restyle — it is different components.** `MembersTableView`
> renders at ≥1024px (`hidden lg:block`) and a card list renders below it, so a
> selector confirmed on desktop can match nothing on a phone. Any test added
> here has to be written against the branch that actually executes at that
> width, and re-recorded per width (README section 4).

---

## 6. Club creation & club join

*Proves a club can be created and a stranger can get into it.*

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `ONB-005` | Create a club (wizard) | ⬜ | Blocked on a club-creation code from group 2, and **destructive** — every run leaves a club behind. |
| `ONB-011` | Join a club via a share / QR link | 🟡 | The `/join/[clubId]` **link** half is automatable; scanning the QR with a camera is ⛔. Destructive — creates a join request. |
| `ONB-012` | Discover and request a club inside the app | ⬜ | `/dashboard/clubs`. Destructive. |
| `OWP-002` | Generate QR / share link | ⬜ | Read-only for the owner: the share dialog and the Settings QR tab. **A good early smoke test** — the control is already located as `commonLocators.shareClub`. |
| `OWP-040` | Empty-state sweep on a brand-new club | ⬜ | Needs a fresh club, so it pairs with `ONB-005`. |

---

## 7. Join requests

*Proves the club's front door opens and closes.*

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `OWP-010` | Owner approves a join request | ⬜ | Needs a pending request. Destructive. |
| `OWP-011` | Owner rejects a join request | ⬜ | Same. |
| `SEC-002` | Secretary approves / rejects | ⬜ | Same, as secretary. |
| `OWS-002` | Co-owner approves / rejects | ⬜ | Same, as co-owner. |
| `CR-002` | Join request → owner approves → member appears in the roster | ⬜ | Two browser contexts. |
| `CR-003` | Join request → owner rejects → applicant sees the not-approved state | ⬜ | Two browser contexts. |

> **Every row here writes.** They need their own Playwright project and a
> `@destructive` tag excluded from `dev` runs, plus a way to create a pending
> request — probably an API seeding helper. See `COVERAGE.md` Bucket B.

---

## 8. Class creation

*Proves a club can put a class on the calendar.*

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `OWP-003` | Create a site | ⬜ | **Prerequisite** — a class needs a room, a room needs a site. Destructive. |
| `OWP-004` | Create a room in a site | ⬜ | Same. |
| `OWP-006` | Create a class | ⬜ | Destructive. |
| `OWP-007` | Create a recurring class | ⬜ | Destructive, and leaves many events behind. |
| `OWP-008` | Create an exam / workshop / social / tournament | ⬜ | Four event types from one dialog. |
| `SEN-003` | Sensei creates / edits a class or workshop | ⬜ | Staff-side permission check. |

---

## 9. Calendar & scheduling

*Proves the schedule is readable, and editable only by staff.*

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `MEM-042` | Member sees no create-event control on the calendar | ✅ | `member.blocked.spec.ts`. **No positive control** — nothing proves that selector matches for the owner, so it would pass on a wrong selector. `OWP-009` would close it. |
| `MEM-006` | Member views the club calendar read-only | 🟡 | **The demo club has no events** — the page reads "No events scheduled". Only the empty-state frame is automatable now; "real classes shown" and "tap an event" need a seeded event. |
| `OWP-009` | Edit / cancel / reschedule an event | ⬜ | Destructive. |
| `SEN-011` | Teaching-schedule filter on the calendar | ⬜ | Read-only, needs events. |

> The calendar page heading is **the current date**, not the word "calendar".
> The stable anchor is the `Event Types` sidebar heading — already in
> `club-section.locators.ts`.

---

## 10. Attendance & QR flow

*Proves attendance can be taken — by camera and by hand.*

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `SEC-042` | Secretary is turned away from scan-attendance | ✅ | `secretary.blocked.spec.ts`. **No positive control, and none is possible** while the page mounts a live camera — a route broken for everyone would read as correct access control. |
| `OWP-031` | Take room-level attendance by hand | ⬜ | **The automatable half of this group** — marking attendance in the room screen needs no camera. Destructive. |
| `SEN-010` | Sensei takes room-level attendance | ⬜ | Same, as sensei. |
| `SEN-009` | Scan attendance / generate a class QR | ⛔ | Mounts a live camera (`html5-qrcode`, `#qr-reader`) and needs a real rear camera plus a permissions grant. |
| `CR-001` | Member scans the class QR to self-register | ⛔ | Same, from the student side. |
| `OWS-006` | Co-owner uses scan-attendance | ⛔ | Same page, same camera. |

> `/scan-attendance` is **student self-check-in** and opens for a member on
> purpose — it blocks `secretary` only. The instructor-side screen is a
> different route, `site/[siteId]/rooms/[roomId]/attendance`. `MEM-041` step 6
> was wrong about this and has been corrected.

---

## 11. Exams, grading & belt progression

*Proves a student can be assessed and moved up.*

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `MEM-004` | Club-scoped progress renders for a member | 🟡 | `member.read-only.spec.ts`. Step 1 only — the seeded member has **no attendance**, so the number comparisons in steps 2–3 are `0 == 0` and prove nothing. |
| `MEM-002` | Personal belt reference | ✅ | `member.read-only.spec.ts`, paired with `owner.allowed.spec.ts` in the same folder for the Eligible Students absence check. **The sheet has been corrected:** the page shows the club's belts only, not a master set as well. |
| `MEM-003` | Personal progression | 🟡 | Same file. Step 1 only — the seeded member has no attendance, so steps 2–3's number comparisons are `0 == 0`. The route is `personalProgress` in `support/routes.ts`, **not** `progress`: `codegen.mjs` flattens top-level and club-scoped keys into one table, so the club-scoped `progress` would shadow it. |
| `OWP-016` | Define club belts | ⬜ | Destructive. |
| `OWP-017` | Create and assign a curriculum | ⬜ | Destructive. |
| `OWP-018` | View eligible students | ⬜ | Read-only, but needs eligibility data to be meaningful. |
| `OWP-019` | Schedule an exam and grade candidates | ⬜ | Destructive, and the grading half changes belts. |
| `OWP-020` | Run the promotion workflow | ⬜ | **Irreversible** — promotes real members. |
| `SEN-004` / `SEN-005` | Sensei schedules an exam, grades, promotes | ⬜ | Same, as sensei. |
| `SEN-006` / `SEC-005` | Manage curricula / edit club belts as staff | ⬜ | Destructive. |
| `SEN-007` / `SEC-006` | View eligible students as staff | ⬜ | Read-only. |
| `MEM-015` | Member self-enrolls / self-unenrols a curriculum | ⬜ | Destructive but self-reversing. |
| `CR-014` | Exam grade → belt promotion → history reflects it | ⬜ | Two contexts, irreversible. The end-to-end proof for this whole group. |

---

## 12. Profile

*Proves a user can see and change their own details.*

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `MEM-018` | Edit own profile and avatar | 🟡 | The text fields are automatable; the **avatar upload needs a fixture image**. Destructive but self-reversing. |
| `MEM-019` | Account / security / language settings | ⬜ | The language half overlaps group 17. Billing pane is a STUB — see `MEM-043`. |
| `MEM-020` | Forced complete-profile / change-password | ⬜ | Also listed under group 3. |
| `PAR-010` | Parent uses the full standard surface | ⬜ | A sweep, mostly re-running MEM scenarios as the parent account. |

---

## 13. Household creation

*Proves a parent can set up a family.*

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `ONB-020` | Create a household | ⬜ | **Prerequisite for all of group 14.** Destructive. |
| `PAR-001` | View household members | ⬜ | Read-only once a household exists. |

---

## 14. Child profile

*Proves the child experience is locked down as designed.*

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `ONB-021` | Create a child profile (PIN + screen time) | ⬜ | Prerequisite for the rest. Destructive. |
| `PAR-002` | Set / reset a child's PIN | ⬜ | |
| `PAR-003` | Set / change a screen-time limit | ⬜ | |
| `PAR-004` / `PAR-005` | Switch parent → child and back, with PIN | ⬜ | The core of this group. |
| `PAR-007` / `PAR-008` | Approve / deny a screen-time extension | ⬜ | Needs a pending request from `CHD-006`. |
| `PAR-009` | Open child profile detail | ⬜ | Read-only. |
| `PAR-040` / `PAR-041` | Edge: mismatched PIN, very low limit | ⬜ | Form validation, cheap to automate. |
| `CHD-001` | Child menu is restricted | ⬜ | Also listed under group 4. |
| `CHD-002` | Child can use Library, Belts and Progress | ⬜ | Read-only. |
| `CHD-006` | Child sends a screen-time extension request | ⬜ | Destructive. |
| `CHD-007` | Switching back to the parent needs the PIN | ⬜ | |
| `CHD-040` | Hidden pages reachable by typing the URL | ⬜ | KNOWN-GAP: verify, do not file. The "child writes are refused" half is worth asserting. |
| `CR-010` | Screen-time request → parent approves | ⬜ | One account, two profiles. |
| `PAR-006` | PIN lockout escalation | ⛔ | 15 / 30 / 60-minute lockouts with a 24-hour reset. No test should sit waiting an hour. |
| `CHD-003` / `CHD-004` / `CHD-005` | Screen-time warning, lock screen, lock survives reload | ⛔ | Needs the screen-time budget to burn down in real time. |
| `CHD-041` | Clearing browser storage does not unlock | ⛔ | Depends on the lock state above. |

---

## 15. Video library

*Proves the content students come for actually plays.*

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `MEM-011` | Club library is read-only for a member | ✅ | `member.read-only.spec.ts`. Steps 1 and 3; opening a move and playing it stays manual. Its positive control is `owner.allowed.spec.ts` in the same folder. |
| `MEM-009` | Global move library and a move detail | ⬜ | **Check the sheet first:** `/library` auto-redirects to the first club's library unless `?view=master` (`library/page.tsx` ~line 81), so what you land on is `MEM-011`'s screen. One of the two descriptions is wrong. |
| `MEM-010` | Global and club warmups | ⬜ | Read-only. |
| `MEM-022` | Library shows content for your tier and belt | ⬜ | Needs a genuinely free-tier account; new accounts default to premium. |
| `XC-007` | Library content matches the account's tier and belt | ⬜ | Same prerequisite; `XC-007` is the cross-cutting version. |
| `OWP-026` | Manage the club library | ⬜ | Destructive. The manage control is a **link with an aria-label**, not a button. |
| `OWP-027` | Manage club warmups | ⬜ | Destructive. |
| `SEN-008` | Sensei manages library content | ⬜ | **Note an open bug here:** the manage control is gated on `userRole === 'owner'`, so a sensei is offered it — same root cause as `SEN-044`. See `COVERAGE.md` section 6 item 6. |

> Video playback itself is a visual judgement and stays manual everywhere in
> this group. The missing quality switcher is a known limitation — do not file.

---

## 16. Real-time messaging

*Proves messages and notifications arrive without a refresh.*

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `MEM-012` | Notification centre and mark read | 🟡 | Reading the list is automatable; **mark-read is a write** and belongs with the mutating milestone. |
| `MEM-013` | Free tier can contact staff | ⬜ | Destructive — sends a message. |
| `MEM-040` | A plain member cannot start a chat with another plain member | ⬜ | Read-only: the contact picker simply does not offer them. A good absence check — pair it with a positive control. |
| `MEM-023` | Group messaging | ⬜ | Two contexts. |
| `MEM-024` | Urgent / audible messages | ⬜ | The audible half is a human check. |
| `OWP-029` | Send a club broadcast notification | ⬜ | Destructive, and it notifies every member of the shared club. |
| `CR-007` | Live DM between two sessions | ⬜ | Two contexts. **The core realtime proof.** |
| `CR-008` | Live broadcast → the member's bell | ⬜ | Two contexts. |
| `CR-009` | Free-tier messaging gate | ⬜ | Three identities, plus a free-tier account. |
| `CR-016` | Support ticket live thread | ⬜ | Needs the separate admin panel for the support side. |
| `CR-019` | Group chat: staff creates, a member participates | ⬜ | Two contexts. |
| `XC-005` | Live updates over the connection (the realtime backbone) | ⬜ | The umbrella check for the whole group. |

> **The blocker for almost all of this is a second authenticated context.** One
> fixture unlocks eleven of these twelve rows — it is the highest-leverage piece
> of infrastructure left. See `COVERAGE.md` section 6 item 3.

---

## 17. Localization

*Proves nothing is untranslated or hard-coded.*

| ID | Scenario | | Notes |
| --- | --- | :-: | --- |
| `XC-001` | Switch English and French and sweep for broken labels | ⬜ | Automatable as a smoke sweep, and **the infrastructure is already here**: every locator in `locators/` carries an `EN\|FR` alternation, so both languages are already matched. |

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

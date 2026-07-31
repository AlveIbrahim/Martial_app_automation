# Automation coverage: what is written, what is left

Tracks which of the 159 manual scenarios in [`../manual-qa/`](../manual-qa/) have
Playwright automation. **The app source is the source of truth for what the app
does** (README section 5); the sheets describe intended behaviour, and this file
only records automation status.

For the **smoke pass specifically** — the 17-group checklist and which scenario
proves each group — see [`smoke_testing_scenarios.md`](smoke_testing_scenarios.md).
This file is the wider view: every scenario, the difficulty buckets, and what to
automate next.

Last updated: 2026-08-01 (`OWS-001` — the co-owner management surface, 13 cases,
which corrected two errors in its sheet. Earlier the same day: `MEM-019` step 1 — the first test in smoke group 12,
which had none. Surfaced the hardcoded-English tab labels in section 6 item 1d.
Same day: **codegen groundwork** — 63 route keys, dynamic-id discovery, a
`parent` session, and a `Codegen` column on every smoke table. See section 5.)

> **Verified against `dev`, 2026-08-01: `npm run test:group:dev -- 12` → 8
> passed.** That is the 7 setup tests — now including the **`parent` login,
> green on its first run**, which was the one unverified change — plus `MEM-019`
> itself at 4.4s. Written from the frontend source rather than a recording, and
> it passed first time, so it never needed `@needs-verification`.
>
> **`npm run test:group:dev -- 04` → 32 passed, 3 failed.** The 3 failures are
> `SEC-043`, `SEN-042` and the `SEN-044` role-editor half — **exactly the three
> in section 3, and nothing else.** Both halves of the pairing behaved as
> documented: `SEN-044`'s owner-level-roles check passed while its role-editor
> check failed. All 8 owner positive controls were green, so every blocked
> result in that run is trustworthy.
>
> **`SMK-030` passed on its first live run, 27.3s** — all eight sidebar
> destinations reached and rendered for the owner, including the three whose
> hrefs are computed (Calendar, Library, Payment). No dead routes today. Like
> `MEM-019` it was written from the source rather than a recording, so it never
> carried `@needs-verification`.

Previously: 2026-07-30 (second Bucket A batch: `MEM-002`, `MEM-003`, `SEC-001`,
`SEN-001`, plus the login form as `SMK-020` / `SMK-021` — which surfaced the
credential-leak bug in section 3b. Its automated test, `SMK-023`, was written,
confirmed the bug, and then pulled from the suite for now at QA's request).

---

## 1. Summary

| Status | Scenario IDs | Share |
| --- | ---: | ---: |
| Fully automated | 20 | 13% |
| Partially automated | 7 | 4% |
| Not started | 132 | 83% |
| **Total** | **159** | |

That's 56 executable test cases, because several scenarios fan out over multiple
routes (`MEM-041` alone covers four, and `OWS-001` thirteen), 11 of the 56 are positive controls rather
than scenarios of their own, and `SMK-020` / `SMK-021` are two more with no
manual sheet to be counted against.

> **Verified result against `dev`, 2026-08-01: 47 passed, 3 failed, 2 skipped**
> (`npm run test:dev`, 2.7 minutes; Playwright counts the 7 `setup` tests
> alongside the 43 executable cases **as they stood then** — `OWS-001`'s 13 came
> after this run, which is why the summary above now says 56). **All 3 failures
> are deliberate** — they report open app bugs and are listed in section 3. The
> 2 skips are the `fixme` copy checks in `specs/i18n/`. No flaky results.
>
> **`OWS-001` verified separately, same day: 20 passed in 43.5s** — its 13 cases
> plus the 7 setup tests, green on the first run. Every guard prediction held:
> the co-owner reached all four tabs and all nine management pages, including
> the three whose guards were read rather than assumed (`usage`,
> `eligible-students`, `promotions`).
>
> **The +3 against the previous run reconciles exactly**, which is the point of
> recording the number at all: `MEM-019`, `SMK-030`, and the sixth `setup`
> login now that a `parent` session is saved. Nothing else moved, so no
> previously-passing test changed state.
>
> Previously, 2026-07-30: 44 passed, 3 failed, 2 skipped, with 6 `setup` tests
> for 49 in the report.
>
> The second batch was written from the frontend source rather than from a
> codegen recording, so it carried `@needs-verification` until its first live
> run. **That run has happened and all of it passed, so the tags are gone.**
> `SMK-021` was the one that needed work, and what looked like a selector
> problem turned out to be the credential-leak bug in section 3b.
>
> **Nothing in this suite is skipped.** A scenario either has a test that
> asserts the correct behaviour, or it is not here at all and the reason is
> written down. A skipped test hides whichever of those two it really is.
>
> The two `fixme` specs in `specs/i18n/` are the one deliberate exception, and
> neither is a scenario: they are the copy checks that pay for the tolerances
> letting broken labels through elsewhere. See `specs/i18n/README.md`.

> **`SEN-044`, `OWS-040` and `OWS-041` are worth knowing about.** They were
> once written as `count === 0` checks for an "assign role" / "transfer
> ownership" button, and passed — for the wrong reason. Nothing matched for
> **any** role, the primary owner included, because no such buttons exist:
> promotion happens through a role dropdown three interactions deep. They now
> drive that real flow and are each paired with a positive control proving the
> primary owner IS offered the owner-level options.
>
> **The rule that came out of it: a passing "control absent" test is not
> evidence of anything on its own.** Always confirm the same selector MATCHES
> for a role that should have the control.

---

## 2. Automated in milestone 1 (access-control battery)

All read-only: navigate, assert. Safe to run against the shared deployed
environment.

**Where these live.** A test is filed by the **screen it covers**, so a role's
battery is split across smoke groups, and anything the smoke checklist does not
list sits in `specs/regression/`. The short forms in the File column below are
relative to `specs/`:

| Short | Folder | Run just it |
| --- | --- | --- |
| `03/` | `smoke-testing/03-authentication/` | `npm run test:group -- 03` |
| `04/` | `smoke-testing/04-navigation-core-ui/` | `npm run test:group -- 04` |
| `09/` | `smoke-testing/09-calendar-scheduling/` | `npm run test:group -- 09` |
| `10/` | `smoke-testing/10-attendance-qr/` | `npm run test:group -- 10` |
| `11/` | `smoke-testing/11-exams-grading-belts/` | `npm run test:group -- 11` |
| `15/` | `smoke-testing/15-video-library/` | `npm run test:group -- 15` |
| `reg/` | `regression/` | `npm run test:regression` |

### Fully automated

| ID | Scenario | Cases | File |
| --- | --- | ---: | --- |
| `MEM-007` | Member blocked from members roster | 1 | `04/member.blocked.spec.ts` |
| `SEN-040` | Sensei blocked from Analytics | 1 | `04/sensei.blocked.spec.ts` |
| `SEN-041` | Sensei blocked from History | 1 | `04/sensei.blocked.spec.ts` |
| `SEN-043` | Sensei blocked from Teachers | 1 | `04/sensei.blocked.spec.ts` |
| `SEC-040` | Secretary blocked from Analytics | 1 | `04/secretary.blocked.spec.ts` |
| `SEC-041` | Secretary blocked from History | 1 | `04/secretary.blocked.spec.ts` |
| `SEC-042` | Secretary blocked from Scan Attendance | 1 | `10/secretary.blocked.spec.ts` |
| `SEC-044` | Secretary blocked from Teachers | 1 | `04/secretary.blocked.spec.ts` |
| `SEC-043` | Secretary blocked from Club Settings (**failing — section 3**) | 1 | `04/secretary.blocked.spec.ts` |
| `OWS-040` | Co-owner cannot grant primary ownership | 1 | `reg/co-owner.blocked.spec.ts` |
| `OWS-041` | Co-owner cannot promote another co-owner | 1 | `reg/co-owner.blocked.spec.ts` |
| `MEM-001` | Member dashboard loads, no management actions | 1 | `04/member.read-only.spec.ts` |
| `MEM-005` | Club overview in the member view (member tab set) | 1 | `04/member.read-only.spec.ts` |
| `MEM-002` | Belt reference renders, no staff control for a member | 1 | `11/member.read-only.spec.ts` |
| `SEC-001` | Secretary reaches their club; Members tab yes, Settings tab no | 1 | `04/secretary.allowed.spec.ts` |
| `SEN-001` | Sensei reaches the club they teach at | 1 | `04/sensei.allowed.spec.ts` |
| `SMK-020` | Sign in through the login form | 1 | `03/login-form.spec.ts` |
| `SMK-021` | A wrong password is refused | 1 | `03/login-form.spec.ts` |
| `SMK-030` | Every primary nav destination loads for the owner | 1 | `04/owner.nav-sweep.spec.ts` |

`SMK-020` and `SMK-021` have no manual sheet — they are new IDs from
`smoke_testing_scenarios.md`, which is why the 159 total does not move for them.
They close the gap that mattered most in group 3: **every other test in this
suite authenticates through `POST /auth/login`, so until now nothing exercised
the screen a real user types into.** They are also the only tests here that run
unauthenticated, which needs no new Playwright project — the config sets no
project-level `storageState`, so omitting `asRole(...)` is the whole mechanism.

### Automation complete — the remainder is permanently manual

**These are DONE, and should not be read as a backlog.** Everything a machine can
judge is automated and green; what is left needs a camera or a human eye and will
never be automatable, no matter how much infrastructure is built. They carry
`✅ ⛔` in `smoke_testing_scenarios.md`, and they are counted as fully automated in
section 1 for that reason.

The distinction matters practically: filing these alongside the genuinely
unfinished rows below made the backlog look bigger than it was, and sent whoever
picked up work to a row that could never move.

| ID | Automated | Stays manual, forever | Why |
| --- | --- | --- | --- |
| `OWS-001` | 13 cases: the four club tabs, the three other tab destinations, nine management pages | Scan Attendance | Mounts a live camera (`html5-qrcode`, `#qr-reader`) and needs real hardware plus a permissions grant. |
| `MEM-011` | Steps 1 and 3: the club library renders; no manage control for a member | Step 2, playing a move | Video playback is a visual judgement. |
| `MEM-041` | Analytics, History, Settings, Teachers (4 cases) | The Scan Attendance half | The member view mounts a live camera. The sheet's step 6 was also wrong about the route and has been corrected — that screen allows members by design and blocks `secretary` only. |

### Partially automated

**These are unfinished, and each will move** once something buildable exists —
seeded data, a fixture file, the write project. That is what separates them from
the table above.

The first is blocked by a different thing: **the manual sheet states something the
app does not do.** The app is right, so the fix is to the sheet, not the test.

| ID | Automated | Not automated | Why |
| --- | --- | --- | --- |
| `MEM-042` | Calendar half: no create-event control | Members-page half | `MEM-042` step 3 says a member can view the roster, but `MEM-007` says they are turned away. The app agrees with `MEM-007` (`members/page.tsx` blocks `club_member`), so the roster half is unreachable — there is no roster on which to check for absent controls. Not present in the suite; the sheet needs correcting. |
| `SEN-044` | A sensei is not offered the owner-level roles (passing); a sensei is not offered the role editor at all (**failing — see section 3**) | The fee-tier half of the scenario | Both role checks are automated. Fee-tier controls are a separate surface and are not covered yet. |
| `SEN-042` | That a sensei is blocked from Club Settings (**failing — see section 3**) | The rest of the PROBE | The scenario also asks a human to record which settings tabs open and whether each save is refused. Proving a refusal needs a write, so it belongs with the mutating-tests milestone. |
| `MEM-004` | Step 1: the club-scoped progress page renders (belt journey, overall attendance) | Steps 2–3, the number comparisons | The seeded member has no attendance at all ("No classes attended yet"), so `/progress` against the club page and the total against the per-curriculum breakdown are both `0 == 0` — they would pass without proving anything. Needs seeded attendance. |
| `MEM-008` | Steps 1 and 3: the sites list renders; no Add Site / Add Room for a member | Step 2, opening a site then a room | Needs a seeded room to click into. The guard itself is a real `clubRole` check (`site/page.tsx` ~line 673), not the `userRole` alias behind section 3. |
| `MEM-003` | Step 1: `/progress` renders the belt progression path | Steps 2–3, the number comparisons | Same blocker as `MEM-004`, and the same reason it is not marked done: the seeded member has no attendance, so "the total matches the per-curriculum breakdown" is `0 == 0` and would pass whether or not either number is computed correctly. Needs seeded attendance. |
| `MEM-019` | Step 1: `/settings` renders and offers all four tabs | Steps 2–5 | **Every remaining step writes** — change password, flip privacy toggles, save a push preference, switch UI language. They belong with the mutating-tests milestone, not with a read-only suite that runs against shared `dev`. Step 5 also overlaps group 17 (`XC-001`), which is where the language switch should be asserted. **The sheet needs correcting:** it lists three tabs, the page renders four (`Membership` is absent from it). |

### Supporting infrastructure (not scenario-mapped)

**The 11 positive-control cases.** 5 prove the same routes DO load for the
primary owner, one proves the primary owner IS offered the owner-level roles in
the members dropdown, and 5 prove the controls the member battery checks for
absence (club tabs, share/QR link, Add Site, Add Room, Manage library, Eligible
Students) DO render for the owner on those same screens. Without these, every
"blocked" and "control absent" test could pass simply because the app was broken
or a selector had drifted. **If one is red, treat the results it backs as
unreliable.**

They sit in the same folder as the absence checks they pair with, so a
folder-scoped run cannot run one half without the other:

| File | Cases | Backs |
| --- | ---: | --- |
| `04/owner.allowed.spec.ts` | 8 | the whole boundary battery, `MEM-001`, `MEM-005` |
| `11/owner.allowed.spec.ts` | 1 | `MEM-002` |
| `15/owner.allowed.spec.ts` | 1 | `MEM-011` |
| `reg/owner.allowed.spec.ts` | 1 | `MEM-008` |

**`SEC-001` is a positive control that is also a scenario.** It asserts the
Members tab IS offered to a secretary using `commonLocators.membersTab` — the
same selector `MEM-005` checks the absence of for a plain member. It earns its
own row above because the sheet has a scenario for it; it does the pairing work
regardless.

**One pairing is split, and it is the only one.** `owner is offered the
owner-level roles` lives in `04/` because `SEN-044` needs it, but `OWS-040` and
`OWS-041` in `reg/` need the same one. A full `npm test` pairs them;
`npm run test:regression` alone does not — see `specs/regression/README.md` for
the two ways to close it.

**Two automated scenarios have no positive control at all.** `MEM-042` (`09/`)
checks that no create-event control is offered, and nothing proves that selector
matches for the owner. `SEC-042` (`10/`) checks a `/scan-attendance` denial, and
the owner battery cannot cover that route while the page mounts a live camera.
Both would pass on a broken selector or a dead route. Writing `OWP-009` closes
the first; the second stays open by design.

`pages/base.page.ts` — `gotoAndAwaitClubRole` waits for `GET /users/clubs`
before any control presence or absence is judged. **This is load-bearing, not a
convenience.** `userRole` sits at its `'member'` default until that response
arrives (Header.tsx ~line 1207, deliberately, to avoid a flash of owner
chrome), so an absence check run too early passes for the owner as well —
exactly the false green section 1 warns about. It was found the other way
round: the owner's positive control went red at 30s while the tab it wanted
took 35s to appear.

`pages/members.page.ts` — drives the three-step flow the role tests need
(roster row → member profile → "Assign Role" → dropdown). Read-only: it opens
dialogs and the dropdown, and never saves.

**One open bug is tracked here rather than by a test.** The teachers denial
heading renders the raw key `teacherManagement.accessRestricted`, because it is
missing from `messages/en.json` and `messages/fr.json` (next-intl returns the
key path, so the `|| 'Access Restricted'` fallback at `teachers/page.tsx:128` is
dead code). This one is purely cosmetic sitting on correct access control, so
`DENIAL_TEXT` tolerates the raw-key shape and the access-control tests keep
asserting access control. **The cost: no test watches this**, so a future
missing key on those pages will not turn anything red. It is in the dev-team
list in section 6.

---

## 3. Red on purpose — three open bugs

**These three tests FAIL, and they are meant to. A red result here is the bug
report.** Do not skip them, do not soften them, and do not invert them to match
what the app currently does — that would record a defect as intended behaviour.
They turn green on their own when the app is fixed.

`SEC-043`, `SEN-042`, `SEN-044` are **one root cause**: `(authenticated)/layout.tsx` (~line 286) maps
sensei, secretary **and** admin to `userRole: 'owner'` for the club being
viewed, and several screens gate on `userRole` rather than `clubRole`.

| ID | What is wrong |
| --- | --- |
| `SEC-043` | Club Settings is owner-only, but a secretary reaches the page by typing the URL. The tab is correctly hidden; `settings/page.tsx` (~line 444) guards on `userRole`. |
| `SEN-042` | Same page, sensei — and worse: the Settings **tab is shown** to a sensei, not just reachable by URL. |
| `SEN-044` | A sensei is offered the members "Assign Role" control (`MemberProfileDialog.tsx` ~line 396). |

**No data is at risk in those three.** `PUT /clubs/:clubId` and
`PUT /clubs/:clubId/members/:memberId/role` both require owner or primary owner
(`clubRoutes.js` ~lines 281 and 858), so every such save is refused. The defect
is that controls which can never succeed are offered at all. Gating these
screens on `clubRole` would close all three.

Proving the server-side refusal needs a write, so that half belongs with the
mutating-tests milestone.

---

## 3b. Known finding, not currently pinned by a test — the login form leaks credentials into the URL

**Not one of the three above, and more serious than any of them.** A red test
for this (`SMK-023`) was written, confirmed the bug deterministically, and was
then **pulled from the suite for now at QA's request** pending a decision on
how it gets filed. The bug is real and unfixed; only the automated test is
absent. Written up in full here so nothing is lost, and so re-adding the test
is a five-minute job when the decision is made — see the note at the end of
this section.

The login page is server-rendered, so the form paints and accepts typing well
before React hydrates. Submit inside that window and `handleSubmit`'s
`preventDefault` has not been attached yet, so the browser performs the
`<form>`'s **default** submit: a GET to the current URL carrying every named
input as a query parameter.

```
GET /login?email=user%40example.com&password=TheirRealPassword
```

The password then sits in **browser history, the web server and CDN access
logs, any proxy in between, and the `Referer` header of every subsequent
request from that page.** None of those are places a password can be withdrawn
from, and it is the user's real password, not a token.

**This is reachable by real users, and not rarely.** The suite hit it 3 times in
6 runs against `dev` on 2026-07-30 just by typing quickly. Anyone on a slow
connection, or whose browser autofills both fields and who presses Enter, is
doing exactly what the test did. The deployed front end takes up to ~17s to
issue its first request (section 6, item 5), so the window is wide.

Reproduced deterministically by blocking scripts, which turns "JavaScript has
not run yet" from a race into a fact. The invariant that was asserted is not
"the form must work without JavaScript" — it is **"a submit must never put the
password in the URL"**, which holds either way.

**Fix:** keep the submit disabled until mounted, or give the form an `onSubmit`
that `preventDefault`s from first paint. `LoginForm.tsx` ~line 171.

**What is still in the suite because of this bug, even with the test removed:**
`LoginPage.open()` (`e2e/pages/login.page.ts`) waits for React hydration before
typing into the form, because without that wait `SMK-020` and `SMK-021` flaked
on exactly this bug rather than testing what they are named for. **That wait is
not a judgement that the bug is acceptable** - it stayed because it independently
stops a real flake.

**To re-add the test:** it lived in
`e2e/specs/smoke-testing/03-authentication/login-form.spec.ts` as `SMK-023`,
asserting `page.route('**/*.js', route => route.abort())` then a fill-and-submit
does not produce a URL matching `/[?&]password=/`. Re-add it, restore its row in
`smoke_testing_scenarios.md`, and re-link it from `LoginPage.open()`'s comment.

---

## 4. What is left

137 scenarios, triaged by how hard they are to automate.

### Bucket A — cleanly automatable (40 remaining)

Deterministic UI flows with clear assertions, needing no special data setup
beyond the seeded demo club. **This is the highest-value work remaining.**

| Sheet | Remaining IDs | Count |
| --- | --- | ---: |
| `role-owner-primary` | `ONB-003`, `OWP-001`–`OWP-009`, `OWP-013`, `OWP-016`, `OWP-023`, `OWP-025`, `OWP-027`, `OWP-028`, `OWP-029` | 17 |
| `role-member` | `MEM-006`, `MEM-009`, `MEM-010`, `MEM-012`, `MEM-016`, `MEM-017`, `MEM-021` | 7 |
| `role-parent` | `PAR-001`–`PAR-005`, `PAR-009`, `PAR-010`, `PAR-040`, `PAR-041` | 9 |
| `role-sensei` | `SEN-002`, `SEN-003`, `SEN-006` | 3 |
| `role-secretary` | `SEC-004`, `SEC-005`, `SEC-007` | 3 |
| `role-owner-secondary` | `OWS-005` | 1 |

**`SEN-002` needs deciding before it is written, not while.** Its step 2 expects
a sensei to see a Settings tab, and they do — but that is the open bug `SEN-042`
reports as a red test, not a requirement. Automating the step as written would
encode a defect as the expected result. `SEN-001` deliberately stops short of
the tab bar for this reason; `SEN-002` should either drop that step or wait for
the fix. `OWS-001` is the clean version of the same sweep, and is unaffected.

Three of the remaining `role-member` scenarios are thinner than they look on the
current seed, and each needs data before it is worth writing — verified against
`dev` on 2026-07-30:

| ID | What is missing | Consequence |
| --- | --- | --- |
| `MEM-006` | The demo club has **no calendar events** — the page renders "No events scheduled". | Steps 1–2 ("real classes shown", "tap an event") need a seeded event and belong in Bucket B. Only the empty-state frame is automatable now, and step 3's "no create control" is already covered by `MEM-042`. |
| `MEM-016` | The help centre renders "No articles found". | Step 2 (open an article) needs a seeded article. |
| `MEM-009` | `/library` **auto-redirects** to the first club's library (`library/page.tsx` ~line 81) unless `?view=master`. | The sheet describes `/library` as the global move library; what you actually land on is the club library, which is `MEM-011`. Confirm the intent before writing, and correct whichever of the two is wrong. |

### Bucket B — automatable, needs data setup (71)

Blocked on provisioning: seeded state, a second authenticated context, a class
timed to "now", or a specific account tier.

Common prerequisites, and who needs them:

| Prerequisite | Scenarios |
| --- | --- |
| Two browser contexts | Most `CR-*`: `CR-002`–`CR-009`, `CR-011`–`CR-015`, `CR-017`–`CR-019`; also `MEM-023`, `XC-005`, `XC-007` |
| Three contexts | `CR-009` (free member + staff + plain member) |
| Genuinely free-tier account (new accounts default to premium) | `MEM-022`, `MEM-023`, `MEM-040`, `CR-009`, `XC-007` |
| Pending join request | `OWP-010`, `OWP-011`, `SEC-002`, `OWS-002`, `CR-002`, `CR-003` |
| Pending exit request | `OWP-015`, `SEC-003`, `OWS-009`, `CR-011` |
| Household + child profile + PIN | `ONB-021`, `PAR-007`, `PAR-008`, `CHD-001`, `CHD-002`, `CHD-006`, `CHD-007`, `CR-010` |
| A class starting *now* | `OWP-031`, `SEN-010`, `CR-001`, `CR-015` |
| Seeded eligibility / exam / belt data | `OWP-017`–`OWP-020`, `OWP-024`, `SEN-004`, `SEN-005`, `SEN-007`, `SEC-006`, `CR-014`, `CR-015` |
| Admin-issued club-creation code | `ONB-005`, `OWP-040` |
| File upload fixture | `OWP-026`, `MEM-018`, `SEN-008` |

⚠️ **Destructive — these mutate shared data and will break reruns unless
isolated or reseeded:** `OWP-030`, `CR-006` (ownership transfer, irreversible),
`OWP-022`, `CR-005`, `OWS-042` (co-owner changes), `OWP-021`, `OWS-007` (revoke
sensei), `OWP-012`, `OWS-003`, `CR-004` (role changes), `OWP-014` (bulk ops),
`OWP-015`, `MEM-014`, `OWS-009`, `CR-011` (exits), `OWP-005` (delete site/room),
`OWP-009` (cancel event), `OWP-020`, `SEN-005`, `CR-014` (belt promotion).

### Bucket C — hard or low value (14)

Real hardware, email inboxes, or long timing windows. Recommend leaving manual.

`ONB-002`, `ONB-004`, `ONB-010` (email OTP codes) · `MEM-024` (push notification
on a real device) · `SEN-009`, `CR-001` (rear camera QR scan) · `OWS-006` ·
`PAR-006` (15/30/60-min lockout escalation with 24h reset) · `CHD-003`,
`CHD-004`, `CHD-005` (screen-time burn-down) · `CR-016` (needs the separate
admin panel) · `XC-003` (PWA install) · `XC-006` (real-phone battery)

### Bucket D — not automatable by design (9)

The scenario's own instruction is to observe, or the judgement is visual.

`MEM-043`, `MEM-044` (STUB "confirm still a placeholder") · `SEN-042`, `SEC-045`
(PROBE / KNOWN-GAP) · `OWS-042` · `CHD-040`, `CHD-041` ("record what you see") ·
`XC-001`, `XC-002` (layout and translation judgement)

*Partially salvageable:* `CHD-040`'s "child writes are refused" assertions, and
an `XC-001` check for untranslated i18n keys.

---

## 5. Writing the next scenario

The app repos are checked out beside this one (`martial-apps-frontend/`,
`martial-apps-backend/`). **Read them before writing anything.** The order is:

1. **Read the implementation** for the screen the scenario covers — the page
   component, its role guard, and the route's `checkClubAuthorization(...)` on
   the backend. Read-only; the app repos are not edited from here.
2. **Compare against the `manual-qa/` sheet** for that scenario ID.
3. **Where they disagree, the code wins.** Correct the sheet to describe what
   the app does, then write the test against that. A test that encodes what the
   sheet wishes were true is worse than no test.
4. **Write the spec**, and make sure it can fail. Pair every "control absent"
   assertion with a positive control (section 2) proving the selector matches
   for a role that should have it.

For a screen nobody has automated yet, `npm run codegen:dev -- <role> [page]`
opens the recorder signed in as that role, at the suite's width, with the
consent banner suppressed. Treat what it emits as a draft — section 4 of the
README covers what has to change before it becomes a locator.

**You should not have to work out the role and page yourself.**
[`smoke_testing_scenarios.md`](smoke_testing_scenarios.md) carries a `Codegen`
column on all 17 group tables, giving the exact arguments for every scenario —
and saying why, where a screen cannot be opened at all (an email inbox, the
admin app, a real camera). `support/routes.ts` holds 63 route keys covering
every screen the checklist reaches; `codegen` lists them all if you pass one it
does not know.

**Ids beyond the club id are discovered too**, as of 2026-08-01: `siteId`,
`roomId`, `childId`, `examId`, `moveId`, `articleId` and `ticketId` each have a
resolver in `ID_RESOLVERS` (`scripts/codegen.mjs`), reading the same endpoints
the frontend's own RTK Query services call. They resolve in dependency order, so
`-- ownerPrimary roomAttendance` finds a site, then a room inside it, then opens
the attendance screen three levels deep. An empty list is reported as a fact
about the seeded data — naming the scenario that creates the record — rather
than as a script error.

Four traps this suite has already hit — check each:

| Trap | What to do |
| --- | --- |
| **Responsive branches** | The same page renders different components by width. `MembersTableView` is `hidden lg:block` (≥1024px); a card list renders below it. Tests run at 1280×720 (`devices['Desktop Chrome']`) — read the branch that actually executes. |
| **UI guard ≠ server guard** | `userRole: 'owner'` includes sensei, secretary and admin. The UI may offer an owner-only control that the server then refuses. Check the route before calling anything a security bug. |
| **Controls that are not buttons** | Granting co-owner and primary owner are *role-dropdown options*, not buttons. Grepping for a button name finds nothing and proves nothing. |
| **Green ≠ verified** | An absence check passes loudest when the selector is wrong. Never mark a selector confirmed just because the test passed. |

Cite `file:line` in the test comment for every guard relied on, so the next
reader can re-check it without re-deriving. If the code turns out to have a
genuine defect, report it for filing — see section 7 of the README.

---

## 6. Suggested next milestones

1. ~~**Get milestone 1 green.**~~ Done — green against `dev`, all selectors
   confirmed on the live DOM, `@needs-verification` retired.
2. **Bucket A, single-session (42).** ← *in progress.* No new infrastructure
   needed — navigation, read-only page loads, form validation. Biggest coverage
   gain per effort. First batch done (`MEM-001`, `MEM-004`, `MEM-005`,
   `MEM-008`, `MEM-011`); second batch done (`MEM-002`, `MEM-003`, `SEC-001`,
   `SEN-001`, and the login form as `SMK-020` / `SMK-021`) but still carrying
   `@needs-verification` — **confirming those on a live run is the immediate
   next job, ahead of writing more.** Then the remaining `role-member` (8), then
   `role-owner-primary` (17). `npm run codegen:dev -- <role> [page]` opens the
   recorder on any of these screens already signed in — README section 4.
3. **Two-context cross-role journeys.** Add a second-context fixture, then work
   through the `CR-*` set. These catch the highest-value real bugs.
4. **Seeded-data scenarios.** Needs an API-level seeding helper (create a
   pending join request, a class starting now, and so on) plus a decision on
   isolating destructive tests — likely a per-run club.

**Worth raising with the dev team:**

0. **SECURITY — the login form writes the password into the URL when submitted
   before hydration.** Full write-up in section 3b; it is listed first here
   because it is the only finding in this file that puts a real user's real
   password somewhere it cannot be taken back from — browser history, access
   logs, `Referer` headers. Reproduced deterministically, and observed 3 times
   in 6 ordinary runs. Fix is a few lines in `LoginForm.tsx`. **No automated
   test currently pins this** — one was written and confirmed the bug, then
   removed from the suite for now at QA's request; section 3b has what it
   takes to re-add it.

1. **Open bug — missing i18n key.** `teacherManagement.accessRestricted` is
   absent from both `messages/en.json` and `messages/fr.json`, so every
   non-owner sees that literal key instead of a sentence on the teachers denial
   screen. The `|| 'Access Restricted'` fallback at `teachers/page.tsx:128`
   cannot rescue it: next-intl returns the key path, which is truthy. Pinned by
   `i18n/denial-copy.spec.ts`.

1b. **Open bug — the `belts` namespace is missing 13 keys from `fr.json`.**
   Same failure mode as item 1, different screen and one language rather than
   two: `beltLibrarySidebar`, `beltSystemSubtitle`, `beltSystemTitle`, `dan`,
   `danSectionSubtitle`, `goToDashboard`, `joinClubBeltsDescription`,
   `joinClubToViewBelts`, `kyu`, `kyuSectionSubtitle`, `rankOrderLocked`,
   `rankOrderLockedDescription` and `ranks` are all in `messages/en.json` with
   no counterpart in `messages/fr.json`. **`beltSystemTitle` is the page H1**,
   so a French user's largest on-screen text reads `belts.beltSystemTitle`.
   The page itself works. Pinned by `i18n/belts-copy.spec.ts`; `MEM-002`
   anchors on `belts.kyuRanks`, which exists in both, so the behavioural result
   is not hostage to the label.

1e. **Open bug — the club payments page H1 is hardcoded English.**
   `<h1>Payments</h1>` (`myClub/[clubID]/payments/page.tsx` ~line 202), with no
   `t(...)` call, so a French user reads the page title in English. **Third
   instance of this exact shape**, after the two `/settings` tabs in item 1d —
   which makes it a pattern worth raising as one, not three separate tickets.
   Like those, it is invisible to `RAW_I18N_KEY` and to the i18n specs, because
   a hardcoded string is a perfectly valid string. Found while writing
   `SMK-030`; that test anchors on the heading, so the sweep is not hostage to
   the label, but nothing watches the label itself.

   **The cost of that tolerance, stated plainly:** a future missing key on the
   belts page will not turn `MEM-002` red. Only the `fixme` spec covers it, and
   that spec cannot run until either the keys land or the suite can drive the
   app in French — the UI language comes from the user's profile, so switching
   it is a write. An `XC-001` sweep for `RAW_I18N_KEY` across screens is the
   real fix on the QA side, and would have caught both of these unprompted.

1d. **Open bug — two `/settings` tab labels are hardcoded English.**
   A third failure mode, and the only one of the three that no key-based check
   could ever catch. `Notifications` and `Membership` are literal English
   strings in the JSX (`label: 'Notifications'`, `label: 'Membership'` —
   `settings/page.tsx` ~lines 730-731 and ~1542-1543) rather than `t(...)`
   calls, so they render in English in every language, sitting beside two tabs
   that do translate. Because they are valid strings and not key paths, both
   `RAW_I18N_KEY` and the i18n specs are blind to them — **only a human reading
   the page in French, or an `XC-001` sweep comparing EN against FR, would find
   this.** Found by reading the source while writing `MEM-019`.

   Two smaller instances alongside it, of the item-1b kind rather than this one:
   `settings.securityTab` and `settings.screenTimeTab` are present in
   `fr.json` but hold the ENGLISH values ("Security", "Screen Time"). Present,
   so nothing is missing; just untranslated.

   `MEM-019` anchors on all four tabs by accessible name, so the behavioural
   result is not hostage to any of this — but **the cost, stated plainly: no
   test watches these labels**, and a future hardcoded label on that page will
   not turn anything red.

1c. **Minor — duplicate DOM ids on `/login` and `/`.** Both pages render their
   whole content twice, once per responsive branch (`login/page.tsx` ~lines 49
   and 95), so `#email` and `#password` each exist twice in the DOM. An id must
   be unique, and `<label for="email">` is ambiguous with two targets — a real
   accessibility problem for screen-reader users, even though sighted users
   never notice because one copy is `display: none`. The suite works around it
   with `#email:visible`; a `hidden lg:block` wrapper on one branch, or a single
   responsive form, would fix it properly.
2. **Owner-only controls are shown to sensei and secretary.** The authenticated
   layout maps sensei, secretary and admin to `userRole: 'owner'` for the club
   being viewed, and several screens gate on `userRole` rather than the club
   role. A sensei is therefore offered the members "Assign Role" button and the
   Settings tab; a secretary reaches the Settings page by URL. **No data is at
   risk** — the server requires owner or primary owner for these writes, so the
   saves fail — but users are shown controls that can never succeed. Gating
   those screens on `clubRole` would close it. Covers `SEC-043`, `SEN-042` and
   the `SEN-044` role-editor half.
3. **Almost no test attributes**, and the "Access Denied" block is copy-pasted
   across 9+ pages in three string variants. A single shared component with a
   test id would remove the largest source of fragility in this suite.

   **One exception, found while writing `SMK-030`:** the primary navigation
   already carries `data-track="nav:<key>"` on every item
   (`DesktopSidebar.tsx` ~line 268), for analytics rather than for testing —
   but it works perfectly as a test hook, and `nav.locators.ts` uses it. It is
   the proof of what item 3 is asking for: those eight locators need no EN|FR
   alternation and survive the sidebar collapsing, where the text label is not
   rendered at all. **Extending the same convention to the denial block and the
   role dropdown would be the single highest-value change for this suite** —
   and it is a smaller ask than "add data-testid everywhere", because the
   pattern already exists in the codebase.

   Two caveats that came with it, both now encoded in the locator file:
   `BottomNavigation.tsx` (~line 161) reuses the SAME attribute values, so the
   locators are `:visible`-scoped — a raw CSS locator, unlike `getByRole`,
   matches hidden nodes and would otherwise resolve to two. And the phone bar
   is a **different set of six**, dropping Messages and Progress, so it is not
   the sidebar restyled.
4. **Dead code worth removing:** `TransferOwnershipDialog` in
   `members/ConfirmationDialogs.tsx` is unreachable —
   `setTransferOwnershipConfirm` is never called with a member, only with
   `null` on close. Ownership is transferred through the role dropdown instead.
5. **Performance — the club pages do not start fetching for up to ~17s.**
   Measured on `dev`, 2026-07-30: on the club overview, the FIRST API request
   leaves the browser 17s after `domcontentloaded`, and every call then
   completes in 1.2–1.8s. So the backend is not the problem; the deployed front
   end is. `GET /users/clubs` answered at 6.4s / 18.9s / 24.9s across runs, and
   the role-dependent tab bar it gates appeared at 8.5s / 13.0s / 20.0s / 24.8s
   / 28.4s / 35.0s. A user on a club page can wait half a minute for their own
   navigation to finish rendering. The suite works around it in
   `gotoAndAwaitClubRole`; that is a workaround, not a fix.
6. **Another `userRole` instance, same root cause as item 2.** The club
   library's manage control is gated on `userRole === 'owner' && clubRole !==
   'secretary'` (`library/page.tsx` ~line 639), so a **sensei is offered
   "Manage library"**. Not covered by a test yet — it needs a sensei scenario —
   but it is the same one-line class of fix.

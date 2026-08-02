# Playwright automation of the manual QA scenarios

This folder automates scenarios from [`../manual-qa/`](../manual-qa/). Every test
maps back to a manual scenario ID (`SEC-040`, `MEM-041`, ...), so a failure here
can be reported with the same ID you already use in ClickUp.

**The app source is the source of truth.** The sheets lay the groundwork - they
say which scenarios exist, who runs them and what to look at - but they are
written by hand, ahead of the build, and they go stale. Where a sheet and the
code disagree about what the app *does*, **the code wins** — but **ask the sheet's
owner before editing it**, then write the test against the corrected version.
Never write a test against what a sheet wishes were true. See
[Read the code first](#read-the-code-first).

Automation covers the parts a machine can judge; the rest stays manual on
purpose (see [What is not automated](#what-is-not-automated)).

---

## 1. One-time setup

```bash
cd martial-apps-testing
npm install
npx playwright install chromium
cp .env.example .env
```

Then open `.env` and fill in the six account emails plus `DEMO_PASSWORD`. All
test accounts must belong to the **same club**, each holding the role its name
says. Hand-made accounts are fine - set `DEMO_PASSWORD` to whatever they share.
The admin "Demo Clubs" tool also seeds exactly this shape, using emails like
`demo+<clubid>-<role>@martialdemo.test` with the password `Demo@1234` (see
`manual-qa/00-start-here.md` section 3).

`.env` and saved login sessions are gitignored. **Never commit them** - the
session files contain live tokens.

**Allure reporting needs nothing extra.** If you've used Allure elsewhere you
may expect a separate install - a Java runtime, `allure-commandline` via
Homebrew, a downloaded zip. None of that applies here: this project uses
**Allure 3**, a plain JS package (`allure` in `devDependencies`), so the
`npm install` above already gave you the `allure` CLI, wired to
`npm run report:allure`. There is nothing else to set up before that command
works.

---

## 2. Running

```bash
npm test              # everything, against local  (http://localhost:3000)
npm run test:dev      # everything, against dev-testing.martialapps.com
npm run test:ui       # interactive UI mode, best for debugging
npm run report        # open the last Playwright HTML report
npm run report:allure # build and open the Allure report
```

### Running one part of the suite

The suite is laid out so that each pass, and each group inside it, is a folder
you can point at:

```bash
npm run test:smoke            # the whole smoke pass
npm run test:regression       # the depth checks that are not smoke
npm run test:group -- 04      # one smoke group
```

`test:group` takes a group number, its folder name, or any unambiguous part of
it — `04`, `nav` and `04-navigation-core-ui` all mean the same folder, and
`regression` reaches the sibling. Run it with no argument to list every group
and how many spec files it holds. Anything after the group name goes straight to
Playwright:

```bash
npm run test:group:dev -- library --headed
npm run test:group:dev -- 04 --grep @SEN-044
```

Every one of these has a `:dev` twin (`npm run test:smoke:dev`,
`npm run test:group:dev -- ...`) that targets the deployed environment.

Underneath, all of them are `playwright test <path>`, so a bare
`npx playwright test e2e/specs/smoke-testing/09-calendar-scheduling` works just
as well. **The `setup` project still runs either way** — it is a project
dependency, and Playwright runs dependencies in full regardless of a path
filter, so a folder-scoped run signs in exactly as a full run does.

One thing a folder-scoped run does *not* give you: `npm run test:regression` on
its own leaves `OWS-040` / `OWS-041` without their positive control, because the
control they share with `SEN-044` lives in the group-04 folder. See
[`specs/regression/README.md`](specs/regression/README.md).

**Reports.** Two run side by side. The Playwright HTML report is the one to
open when a test fails - it carries the trace and failure screenshot. Video is
attached to every test, pass or fail (`use.video: 'on'` in
`playwright.config.ts`) - trace and screenshot stay failure-only, since
there's nothing to debug on a pass.
Allure is the one to share: it groups by the `@SEC-040` / `@MEM-041` tags, so a
run reads like the manual sheet. Both are gitignored.

To keep a run, **archive `allure-report/`, not `allure-results/`** - the raw
results are wiped at the start of the next run, and keeping them instead is
what produced the blended report described below.

This uses **Allure 3 (the `allure` package), which is JavaScript-native and
needs no Java**. The older `allure-commandline` is a wrapper around a Java jar
and fails with "JAVA_HOME is not set" on a machine without a JDK - if you see
that error, something has pulled the v2 CLI back in.

**Allure 3 has no `--clean` flag, and `generate` does NOT overwrite the output
directory - it nests inside it.** Point it at a directory that already holds a
report and it writes the new one to `allure-report/awesome/`, leaving the old
`allure-report/index.html` untouched at the top. Every regeneration then looks
like it did nothing, because the file you open is still the first report you
ever generated. Verified on 2026-07-30, when `report:allure` had been silently
serving a 17-hour-old report. `report:allure` therefore removes
`allure-report/` before generating; do the same if you ever call `allure
generate` by hand.

**`allure-results/` is emptied at the start of every run**, by the
`globalSetup` in `playwright.config.ts` (`e2e/setup/clean-allure.ts`). The
reporter only appends - every test, retry and attempt adds a file and nothing
removes them - so without that step a report blends every run since the folder
was last cleared. It had reached 1282 files across 17 hours and was reporting
`total 123, skipped 85` for a 50-test suite, including tests that had since
been renamed. **A folder-scoped run therefore replaces the previous results:**
`test:group -- 04` then `report:allure` reports group 04 only. To report on
everything, run everything.

That `globalSetup` only runs for an actual test run, not for `--list` - which
also appends to `allure-results/`, marking every test "skipped". See the
troubleshooting table below ("shows tests that passed for real as skipped")
for how that's handled.

One reporting quirk worth knowing: Allure splits non-passing tests into
**failed** (an assertion returned false) and **broken** (the test threw, which
includes an `expect(...).toBeVisible()` timeout). Both mean the same thing here.
Retries appear as separate entries, so three failing tests with one retry each
show as six.

Run a single scenario by its manual ID:

```bash
npx playwright test --grep @SEC-040
```

Skip the tests whose selectors are not yet confirmed against the live app:

```bash
npx playwright test --grep-invert @needs-verification
```

**The app must already be running.** This project deliberately does not start a
server - point it at a running local dev server or at the deployed environment.

### Environments

|            | Frontend                             | API                                          |
| ---------- | ------------------------------------ | -------------------------------------------- |
| `local`    | `http://localhost:3000`              | `http://localhost:3000/api`                   |
| `dev`      | `https://dev-testing.martialapps.com`| `https://devapi-testing.martialapps.com/api`  |

These are **different hosts** on the deployed environment: the frontend does not
proxy `/api`, so `https://dev-testing.martialapps.com/api` returns a 404 HTML
page. Both defaults are built in; override with `LOCAL_BASE_URL`, `DEV_BASE_URL`,
or `API_BASE_URL` in `.env` if your setup differs (e.g. frontend on `:3001`).

Login sessions are cached per environment under `playwright/.auth/<env>/`. To
force a fresh login, delete that folder and re-run.

---

## 3. How it is put together

Page Object Model, in three layers. **Each layer has one job, and nothing
reaches across:**

```
e2e/
├── locators/                WHAT things are - locators only, no logic
│   ├── common.locators.ts       the denial screen, the login form
│   ├── club-section.locators.ts page markers per club screen
│   └── members.locators.ts      roster, profile dialog, role dropdown
├── pages/                   HOW to drive them - actions + shared assertions
│   ├── base.page.ts             navigation, redirect traps, blocked/not-blocked
│   ├── club-section.page.ts     restricted / granted / controls absent-present
│   ├── dashboard.page.ts        the personal home dashboard (not club-scoped)
│   └── members.page.ts          the roster -> profile -> role editor flow
├── specs/                   WHAT should be true - tests and assertions only
│   ├── smoke-testing/           the smoke pass, one folder per checklist group
│   │   ├── 04-navigation-core-ui/   the role-boundary battery + owner controls
│   │   ├── 09-calendar-scheduling/
│   │   ├── 10-attendance-qr/
│   │   ├── 11-exams-grading-belts/
│   │   ├── 15-video-library/
│   │   └── ...                      17 groups; the rest are not written yet
│   ├── regression/              depth checks that are not part of smoke
│   └── i18n/                    copy checks pinning known label bugs
├── support/
│   ├── roles.ts             role -> credentials (read from .env)
│   ├── routes.ts            every URL shape, in one place
│   └── fixtures.ts          club-id discovery, page objects, `asRole()`
├── config/environments.ts   local vs dev: URLs, cookie names, auth file paths
└── setup/auth.setup.ts      logs each role in ONCE via the API, saves session
```

Two documents sit beside this one and answer different questions:

| | Question it answers |
| --- | --- |
| [`smoke_testing_scenarios.md`](smoke_testing_scenarios.md) | **The smoke pass** - the 17-group checklist, which manual scenario proves each group, and what is automated. Start here for "what should a smoke run cover". |
| [`COVERAGE.md`](COVERAGE.md) | **Automation status overall** - every scenario's state, the A-D difficulty buckets, open app findings, and the ranked next milestones. Start here for "what should I automate next". |

**The rule that keeps this useful: a spec never contains a locator.** If you
find yourself writing `page.getByRole(...)` in a spec, it belongs in
`locators/`, and the steps around it belong in `pages/`. Specs should read like
the manual sheet - what is expected, and for whom.

**Under `specs/`, a test is filed by the screen it covers, not the role it runs
as** - so each folder is a runnable slice (section 2), and a role's battery is
split across folders. `member.blocked.spec.ts` appears in two group folders; the
file name carries the role so a report line still says who was signed in. The
one thing that must not be split is an absence check and its positive control -
see [`specs/smoke-testing/README.md`](specs/smoke-testing/README.md).

Page objects are injected as fixtures, so specs never construct them:

```ts
test('...', async ({ clubSection, membersPage, clubId }) => {
  await clubSection('analytics').expectRestricted(clubRoute(clubId, 'analytics'));
});
```

`clubSection(...)` covers any screen whose question is "does this role get in".
`membersPage` has its own object because there is real interaction behind it.
Add a new page object by creating the two files and registering it in
`support/fixtures.ts`.

`locators/` is the whole migration path for the day the app gains
`data-testid` attributes - nothing else needs to change.

---

## 4. Finding selectors with codegen

Playwright's recorder, wired up so it opens **already signed in as a role, on
the page you name, under the same conditions the suite runs in**:

```bash
npm run codegen:dev -- secretary settings      # a club screen, as the secretary
npm run codegen:dev -- ownerPrimary members    # the roster, as the owner
npm run codegen:dev -- sensei                  # no page -> the dashboard
npm run codegen -- member calendar             # same, against local
```

`<role>` is one of `ownerPrimary`, `coOwner`, `sensei`, `secretary`, `member`,
`parent`. `[page]` is any of the **63 keys in `support/routes.ts`** - run
`npm run codegen:dev` with a bad key to list them all.

**Every id in the URL is discovered, never typed.** `clubId` always was;
`siteId`, `roomId`, `childId`, `examId`, `moveId`, `articleId` and `ticketId`
are too, so `codegen:dev -- ownerPrimary roomAttendance` opens a real room three
levels deep. Each has a resolver in `ID_RESOLVERS` (`scripts/codegen.mjs`) that
reads the same endpoint the app itself calls, and they resolve in dependency
order - a room needs its site first. When the club has no such record, the
script names the scenario that creates one rather than opening a broken URL.

**Every smoke scenario carries its command.** `smoke_testing_scenarios.md` has a
`Codegen` column on all 17 group tables, so you rarely need to work the role and
page out yourself - look the scenario up and copy the line.

Adding a route? `support/routes.ts` has three blocks and a naming rule; read the
comment at the top of it first. Keys are flattened into one table here, so a
duplicate silently opens the wrong page - `codegen` now fails loudly on one
rather than letting it through.

Raw `npx playwright codegen` is not a substitute. Three things have to be right
before a recording is worth anything, and the script is what makes them so:

| It handles | Or else |
| --- | --- |
| Loads the saved role session | You land on `/login` and record the login form |
| Records at 1280x720, the suite's width | Below 1024px the roster is a **different component** - you record selectors that never execute |
| Seeds the consent key | The analytics dialog covers the page and you record clicks on it |

It also refreshes the access token first (they last 15 minutes, so the saved
one is nearly always stale) and writes the session to a temp file it deletes on
exit - that file holds live tokens. If the **refresh** token has expired
instead, it stops and tells you to re-run `npm run test:setup:dev` rather than
dropping you on a login page.

### Turning a recording into a locator

**Codegen output is a starting point. Nothing is pasted into `locators/`
as-is.** The recorder sees one page, in one language, with one set of seeded
data; a locator has to survive all three changing.

- **Strip `.nth(n)` and index chains.** They encode the order of the seeded
  data and break on the next reseed. Filter by something meaningful instead -
  `.filter({ hasText: ... })`, as `plainMemberRow` does.
- **Prefer `getByRole` + accessible name** over recorded text or CSS.
- **Add the `EN|FR` alternation by hand.** Codegen only ever sees the language
  it recorded in; the app takes UI language from the user's profile.
- **Anchor with `^...$`** where a short name could substring-match a longer
  one. `Club Owner` inside `Primary Owner` is the live example - see
  `ROLE_OPTION_TEXT`.
- **Before asserting a control is absent, confirm the selector matches for a
  role that should have it.** An absence check passes loudest when the selector
  is simply wrong. This is the false-green rule from section 7.
- **Re-record at the target width if the scenario covers a phone.** Below
  `lg:` the DOM may be a different component, not the same one restyled.
- **Then put it where it belongs:** the locator in `locators/`, the steps in
  `pages/`, and the spec stays locator-free (section 3).

Two things codegen gets wrong on this app that are worth knowing before you
trust a recording: the calendar page's heading is a **date**, so its stable
anchor is `Event Types` rather than the heading; and the role dropdown is plain
`<button>`s with no ARIA roles, so the `getByRole('option')` codegen reaches for
matches nothing. The existing locators already encode both.

The day the app gains `data-testid` attributes, add
`--test-id-attribute=data-testid` in `scripts/codegen.mjs` and the recorder will
emit `getByTestId` instead of guessing at roles and names.

**Auth.** `auth.setup.ts` runs before everything else, logs each role in through
`POST /auth/login`, and saves the session. Specs then reuse it via
`test.use(asRole('secretary'))` - no logging in through the UI, so tests are
fast and a broken login surfaces as one obvious red setup test instead of 20
confusing failures.

The app's auth cookies are `httpOnly` (invisible to JavaScript). Playwright's
`storageState` captures them anyway because it serializes the request context's
cookie jar rather than reading `document.cookie` - this was verified in
isolation before the suite was built, and `auth.setup.ts` re-asserts it on every
run, so if it ever stops being true you get a precise error rather than a
mystery.

**The club id is discovered, never hardcoded.** Each reseed of the demo club
mints new ids, so the `clubId` fixture looks it up from `GET /users/clubs`. Pin
a specific club with `TEST_CLUB_ID` in `.env` if an account belongs to several.

**Six sessions are saved, not five.** `SESSION_ROLES` in `support/roles.ts` is a
superset of `ACCESS_CONTROL_ROLES`: the battery still runs as five roles, but a
`parent` session is saved as well, because smoke groups 13 and 14 are entirely
parent scenarios and codegen cannot open those screens without one. **The cost
of being on that list:** every spec project depends on `setup`, and Playwright
skips a dependent project when a dependency test fails - so an account that does
not exist in the target environment takes the whole suite down, not just its own
tests. Confirm a new one with `npm run test:setup:dev` before adding it.

---

## 5. Adding a scenario

1. **Read the app source for that screen first** - see below. Not the whole
   codebase; just the page component, its role guard, and the backend route's
   `checkClubAuthorization(...)`.
2. Find the scenario in `../manual-qa/` and read its steps and expected result.
   **Where it disagrees with the code, stop and ask before touching the sheet** -
   quote the code that settles it and wait for an answer. Then correct the sheet
   and write the test against the corrected version.
3. Look up which smoke group it belongs to in
   [`smoke_testing_scenarios.md`](smoke_testing_scenarios.md), and put it in that
   folder under `specs/smoke-testing/`. If the checklist does not list it, it
   belongs in `specs/regression/`.

   **Filed by the screen it covers, not the role it runs as.** A role's battery
   is therefore split across folders, and the file name carries the role
   (`member.blocked.spec.ts`) so a report line still says who was signed in. If
   the scenario asserts a control is *absent*, its positive control goes in the
   same folder — see `specs/smoke-testing/README.md`.
4. Follow the existing shape:

```ts
test('SEC-040 - secretary blocked from Analytics @SEC-040', async ({ page, clubId }) => {
  test.info().annotations.push({
    type: 'manual-scenario',
    description: 'manual-qa/role-secretary.md#SEC-040',
  });
  await expectAccessRestricted(page, clubRoute(clubId, 'analytics'));
});
```

The convention that makes this useful:

- **title** starts with the scenario ID, so reports read like the manual sheet
- **`@SEC-040` tag** makes `--grep @SEC-040` work
- **annotation** shows a link back to the markdown in the HTML report

**Put every new locator in `locators/`, and every new step in `pages/`.**
A spec must contain neither. See section 3 for the layering, and section 4 for
finding the selector in the first place.

### Read the code first

The app repos are checked out beside this one (`martial-apps-frontend/`,
`martial-apps-backend/`) and are **read-only from here** - never edited. Read
them before writing a test, not after it fails.

**Read only what the scenario needs**, not the codebase:

| Read | For |
| --- | --- |
| The page component for that screen | What actually renders, and which controls exist at all |
| Its role guard | Whether it gates on `userRole` or `clubRole` - they are not the same |
| The backend route's `checkClubAuthorization(...)` | Whether the server would really refuse the write |
| `messages/en.json` and `messages/fr.json` | The exact strings, in both languages, for the locator |

**The sheets are groundwork, not evidence.** They are written by hand before or
alongside the build, so they drift: they miss controls that were added, describe
tabs that were removed, and occasionally contradict each other. `MEM-019` is the
worked example - the sheet lists three settings tabs and the page renders four,
so `Membership` was missing from the sheet entirely and the test asserts all
four. `MEM-041` and `MEM-042` are two more; both sheets were corrected.

**When the sheet is wrong, fix the sheet — but ask first.** A test written to
match a stale sheet either fails forever for no reason, or passes while
asserting something the app does not do. Both are worse than no test. Editing
the sheet is still not yours to do unilaterally: it is the human deliverable,
someone else runs it by hand, and they may know why a row says what it says.
Name the disagreement, quote the code, wait for an answer.

The asymmetry is the point. A wrong test is loud and gets fixed. A sheet quietly
rewritten to match a bug erases the requirement that would have caught it, and
nobody reviews a passing test.

> **The one exception, and it matters:** "the code wins" settles what the app
> **does**, never whether that is **correct**. Where the behaviour itself is the
> defect, you assert the behaviour the app is *supposed* to have and leave the
> test **red** - see section 7. `SEC-043`, `SEN-042` and `SEN-044` are all in
> that state today. Copying the code's behaviour into the expected result would
> record a bug as intended, which is the one thing this suite must never do.
>
> The distinction in one line: **read the code to learn what is there; use
> judgement to decide whether it should be.**

---

## 6. Known constraints

**The app has no `data-testid` attributes at all.** Selectors therefore lean on
roles, accessible names, and a handful of element ids. This is the main source
of fragility. Tests whose selectors have not yet been confirmed against a
running app carry the `@needs-verification` tag - expect to adjust those on
first run, and drop the tag once confirmed.

**Denial screens are inconsistent.** There is no shared "Access Denied"
component; the block is copy-pasted across 9+ pages in three variants
(hardcoded English "Access Restricted", translated `accessRestricted`, and
translated `accessDenied`). `DENIAL_TEXT` in `selectors.ts` matches all of them
in English and French. A single shared component with a test id would be the
best thing the dev team could do for this suite.

**The denial matcher tolerates a raw i18n key.** The teachers page renders
`teacherManagement.accessRestricted` literally, because that key is missing from
both `messages/en.json` and `messages/fr.json` in the frontend (next-intl
returns the key path when a key is absent, so the page's `|| 'Access
Restricted'` fallback never fires). `DENIAL_TEXT` matches that shape so the
access-control tests keep asserting access control - the block itself is
correct, only its label is broken. The label is asserted separately in
`specs/i18n/denial-copy.spec.ts`, which is `fixme` until the key is added.

This is an instance of a general rule - see below.

**The analytics consent banner is suppressed, on purpose.** It renders as a
dialog over the page and appeared on roughly 3 of every 4 loads, intermittently
covering the very headings the assertions wait for - it was the cause of
otherwise-inexplicable flaky runs. The `page` fixture seeds
`localStorage.analytics_consent = 'essential'` before any page script runs.
Seeding is deterministic where clicking the banner away would just be a second
race. `'essential'` is exactly what the banner's "Essential only" button
records, so the test accounts are not opted into extra tracking. If flakiness
that looks like "element not found, but the screenshot shows it there" ever
returns, check whether a new overlay has been added.

**Never judge a control before the app knows your role.** `userRole` sits at
its `'member'` default until `GET /users/clubs` answers, on purpose, so the app
does not flash owner chrome at a member (`Header.tsx` ~line 1207). Assert too
early and "the Members tab is absent" is true for the *owner* too - a false
green that no amount of retrying reveals. `gotoAndAwaitClubRole` in
`base.page.ts` waits for that response; use it, not `goto`, whenever the
assertion is about a control being offered or withheld.

The wait is generous because the page is slow, not because the API is: on the
deployed build the first API request leaves the browser up to ~17s after
`domcontentloaded`, and the role-dependent tab bar has taken as long as 35s to
appear. That is recorded as a performance finding in `COVERAGE.md` section 6 -
the constant is a workaround, not an accepted cost.

**Access-control tests are read-only, and must stay that way.** They are safe to
run against the shared deployed environment. When mutating tests arrive, give
them their own project and a `@destructive` tag excluded from `dev` runs.

**Positive controls matter.** `owner.allowed.spec.ts` proves the same routes DO
load for the primary owner. Without it, every "blocked" test could pass simply
because the app was broken. If that file is red, treat every blocked result in
the run as unreliable.

---

## 7. When a test fails on an app bug

This suite lives in the QA repo; the bugs it finds live in the app repos. You
cannot fix those here, so a red test needs a decision, not a patch. **Neither
of the two tempting options is right:** leaving it permanently red trains
everyone to ignore the run, and quietly widening the assertion until it passes
deletes a real defect from the record.

First, read the app source to establish **which half is broken** - the behavior,
or only the copy around it. That single question decides everything:

| What you find | What to do |
| --- | --- |
| Behavior itself is wrong | **Leave the test RED.** Assert the behavior the app is *supposed* to have and let it fail - the red result is the bug report. Never skip it, never soften it, and never invert it to match the defect. It goes green on its own when the app is fixed. Make the failure message carry the whole story: expected, actual, `file:line` cause, and whether data is at risk. |
| Behavior is correct, only the copy/label is broken | Let the behavioral test keep asserting behavior, tolerating the cosmetic defect, so a label cannot break an access-control result. Say out loud what is then unwatched, and record the bug in `COVERAGE.md`. |
| The app is right and the manual sheet is wrong | **Ask before editing the sheet** - quote the code that settles it. Once agreed, correct it; if nothing is left to assert, **delete the test** rather than skipping it, and write the reason in `COVERAGE.md`. See the `MEM-041` and `MEM-042` notes. |

**Do not use `test.skip` / `test.fixme` to keep a run green.** A skip hides
whether a scenario is a known bug or simply finished, and those need very
different responses. Prefer a red test or no test.

Whichever applies, write the finding up so it can be filed as-is: the file and
line, what the user sees, and why any in-code fallback does not rescue it.
Pair every tolerance with a `fixme` that turns green when the bug is fixed, and
say in a comment that the two are removed together.

**State the cost out loud.** A tolerance means a *future* defect of the same
shape will not turn the behavioral test red - only the dedicated `fixme` spec
covers that gap. That trade-off is worth making, but it is the reader's call to
accept, so name it rather than burying it.

The worked reference is the `teacherManagement.accessRestricted` case described
in Known constraints, together with `specs/i18n/denial-copy.spec.ts`.

---

## What is not automated

Nothing here is a `skip` inside the suite - these simply have no test, and this
is where the reason lives. `SEC-043`, `SEN-042` and `SEN-044` ARE automated and
currently **fail on purpose**; see `COVERAGE.md` section 3.

| Scenario  | Why |
| --------- | --- |
| `SEC-045` | PROBE across every owner-only control; observation, not assertion. |
| `MEM-042` (members half) | **Contradicts `MEM-007`.** `MEM-042` step 3 says a member can view the roster; `MEM-007` says they are turned away. The app agrees with `MEM-007` (the members page blocks `club_member`), so there is no roster on which to check for absent controls. The calendar half is automated; the sheet needs correcting. |
| `MEM-041` (scan half) | **The manual sheet was wrong here, and has been corrected.** Step 6 expected a member to be turned away from `/scan-attendance`. That route is student self-check-in and allows members on purpose - it blocks `secretary` only, and its copy is addressed to students ("Ask your instructor to display the attendance QR code"). The instructor-side screen is a different route, `site/[siteId]/rooms/[roomId]/attendance`, which does block plain members. It would stay manual regardless, since the member view mounts a live camera. |
| Scan Attendance (owner) | Mounts a live camera and needs real hardware plus a permissions grant. Stays a manual check. |

Broadly, these stay manual: anything needing real hardware (QR scan, camera
upload, PWA install, push notifications), email OTP codes, visual and layout
judgement, and scenarios tagged STUB or KNOWN-GAP whose instruction is to record
an observation.

---

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| `Missing credentials for role "x"` | `.env` not filled in. Copy `.env.example` and add the emails. |
| `Login failed ... 401` | Wrong password, or the account does not exist in that environment. |
| `Expected to stay on /... but landed on /login` | Saved session rejected. Delete `playwright/.auth/` and re-run. If login itself succeeded (200) and the cookie is present and unexpired, suspect the cookie namespace instead: `APP_ID` must match the target's `NEXT_PUBLIC_APP_ID` or the app ignores a perfectly valid token. Defaults are built in per environment - see the `APP_ID` note in `.env.example`. |
| `... landed on /change-password` | The account is flagged `mustChangePassword`. Clear it or reseed. |
| `... landed on /complete-profile` | Profile incomplete and the account is over 14 days old. Complete it or reseed. |
| `... landed on /dashboard` | That account is not a member of the club being tested. Check `TEST_CLUB_ID`. |
| `GET /users/clubs returned 401` | Session expired mid-run. Re-run `npm run test:setup`. |
| An `@needs-verification` test fails | Expected until confirmed on a live app. Fix the locator in `locators/`, then drop the tag. |
| Allure report is empty, or `allure-results/` stays empty after a run | You passed `--reporter=list` (or any `--reporter`) on the command line. **The CLI flag REPLACES the reporter list from the config**, so `allure-playwright` never runs and writes nothing. Drop the flag - `list` is already the first configured reporter, so you lose nothing by omitting it. |
| Allure report shows an old run, or numbers that match no run you recognise | Three different causes, all fixed but worth recognising. **Stale report:** `allure generate` NESTS inside a non-empty output directory (`allure-report/awesome/`) instead of overwriting, so the top-level `index.html` you open stays as it was. `report:allure` now deletes `allure-report/` first. **Impossible numbers, cause 1:** results used to accumulate across runs; the `globalSetup` in `playwright.config.ts` now empties `allure-results/` at the start of each run. **Impossible numbers, cause 2 - a real run's tests showing "skipped":** see the next row. |
| Allure report shows tests that passed for real as "skipped" | `npx playwright test --list` runs every reporter's onBegin/onEnd without running any test, and allure-playwright reads "nothing started" as "everything was skipped" - it writes a fresh zero-duration `skipped` result for the *entire suite*, and `--list` never runs `globalSetup`, so nothing clears them. Something invokes `--list` against this repo without you running a test - the VS Code Playwright extension's test explorer is the likely source, since it lists tests on every refresh. Allure then treats the newest attempt per test as current, so the phantom skip - written after your real run - wins. Found and fixed 2026-07-31: `playwright.config.ts` now drops `allure-playwright` from the reporter list whenever `--list` is on the command line, so it has nothing left to pollute. `npm run report:allure` also runs `scripts/dedupe-allure-results.mjs` first, which removes any phantom skips already on disk (recognised by: `skipped` status, a duration of a few ms, and a same-`historyId` sibling that actually ran) before generating. A **lone** fast skip with no sibling is a real `test.skip()`/`fixme` result and is left alone. |
| Reported "flaky": failed once, passed on retry | Usually an overlay or a slow page, not a real regression. Open the trace: if the failure snapshot shows a dialog over the content, an overlay is intercepting (see the consent-banner note in Known constraints). If the page simply had not painted, check whether it needs the longer `RENDER_TIMEOUT` budget rather than `NAV_TIMEOUT`. |
| A "control absent" test passes | Not automatically good news. Confirm the same selector MATCHES for a role that should have the control, or the test proves nothing - see section 7. |

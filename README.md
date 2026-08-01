# Playwright automation of the manual QA scenarios

This folder automates scenarios from [`manual-qa/`](manual-qa/). Every test
maps back to a manual scenario ID (`SEC-040`, `MEM-041`, ...), so a failure here
can be reported with the same ID you already use in ClickUp.

**The app source is the source of truth.** The sheets lay the groundwork - they
say which scenarios exist, who runs them and what to look at - but they are
written by hand, ahead of the build, and they go stale. Where a sheet and the
code disagree about what the app *does*, **the code wins: correct the sheet,
then write the test against the corrected version.** Never write a test against
what a sheet wishes were true. See [Read the code first](e2e/README.md#read-the-code-first)
in the authoring guide.

Automation covers the parts a machine can judge; the rest stays manual on
purpose (see [What is not automated](e2e/README.md#what-is-not-automated) in
the authoring guide).

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
[`e2e/specs/regression/README.md`](e2e/specs/regression/README.md).

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

### Finding selectors with codegen

Playwright's recorder, wired up so it opens **already signed in as a role, on
the page you name**, instead of dropping you on a login screen:

```bash
npm run codegen:dev -- secretary settings
```

Worked example, step by step:

1. Run `npm run test:setup:dev` once, if you haven't already, so a session
   exists for every role in `playwright/.auth/dev/`.
2. Run the command above. `secretary` is the role to sign in as; `settings`
   is a page key from `e2e/support/routes.ts`. The script resolves the
   secretary's own club id, opens
   `https://dev-testing.martialapps.com/dashboard/myClub/<clubId>/settings`,
   and a Chrome window opens with the recorder attached, already logged in.
3. Click around the page. Every click and assertion you make in the recorder
   window appears as generated code in the "Playwright Inspector" panel next
   to it.
4. Copy the locator lines you need out of that panel and hand them over (or
   paste them into a `locators/` file yourself) - the recorded code is a
   **draft**, never pasted in as-is. See
   ["Turning a recording into a locator"](e2e/README.md#turning-a-recording-into-a-locator)
   in the authoring guide for what to clean up before it's usable.

A couple more shapes you'll use:

```bash
npm run codegen:dev -- ownerPrimary members    # the roster, as the owner
npm run codegen:dev -- sensei                  # no page -> the dashboard
npm run codegen -- member calendar             # same, against local instead of dev
```

`<role>` is one of `ownerPrimary`, `coOwner`, `sensei`, `secretary`, `member`,
`parent`. `[page]` is any key in `e2e/support/routes.ts` (63 of them); run
`npm run codegen:dev` with a bad key to print the full list. Every id in the
URL - `clubId`, `siteId`, `roomId`, and the rest - is looked up from the real
API, never typed by hand.

The full mechanics (how the saved session is refreshed, what codegen gets
wrong on this app, how to turn a recording into a real locator) are in
[`e2e/README.md` §4](e2e/README.md#4-finding-selectors-with-codegen).

---

## 3. Project structure

Every test is built from three layers stacked on top of each other. Each layer
answers exactly one question, and nothing reaches across:

```
   ┌──────────────────────────────────────────────────────────────┐
   │  specs/       "WHAT should be true?"                         │
   │               A secretary must not get into Analytics.       │
   │               ── reads like the manual sheet ──              │
   └───────────────────────────┬──────────────────────────────────┘
                               │ calls
   ┌───────────────────────────▼──────────────────────────────────┐
   │  pages/       "HOW do I do that?"                            │
   │               Go to the URL, wait for it to load, then       │
   │               check the 'Access Denied' heading is showing.  │
   └───────────────────────────┬──────────────────────────────────┘
                               │ uses
   ┌───────────────────────────▼──────────────────────────────────┐
   │  locators/    "WHERE is that thing on screen?"               │
   │               The heading whose text matches                 │
   │               'Access Restricted' / 'Accès refusé' / ...     │
   └──────────────────────────────────────────────────────────────┘
```

| Layer | Kitchen equivalent | Example from this repo |
| --- | --- | --- |
| `locators/` | The **ingredients list** - names things, does nothing | "the Members tab is the button labelled `Members` or `Membres`" |
| `pages/` | The **recipe steps** - actions and doneness checks | "open the roster, click a member row, open the role dropdown, read the options" |
| `specs/` | The **menu** - what the diner ordered | "a sensei must not be offered owner-level roles" |

**The rule that keeps this useful: a spec never contains a locator.** If you
find yourself writing `page.getByRole(...)` in a spec, it belongs in
`locators/`, and the steps around it belong in `pages/`.

The folders, as they exist today:

```
martial_app_testing/
│
├── playwright.config.ts      the rulebook: timeouts, browser, reporters, run order
│
└── e2e/
    ├── locators/     WHAT things are - pure names, zero logic
    │   ├── common.locators.ts        denial screen, login form, tabs, nav
    │   ├── club-section.locators.ts  one "proof marker" per club screen
    │   ├── members.locators.ts       roster rows, role dropdown
    │   ├── dashboard.locators.ts     the personal home cards
    │   ├── personal.locators.ts      settings, messages, support desk
    │   └── nav.locators.ts           the sidebar's data-track links
    │
    ├── pages/        HOW to drive them - actions + reusable assertions
    │   ├── base.page.ts              navigation, redirect traps, blocked/not-blocked
    │   ├── club-section.page.ts      restricted / granted / control present-absent
    │   ├── members.page.ts           roster -> profile dialog -> role dropdown
    │   ├── dashboard.page.ts         the personal home dashboard
    │   ├── login.page.ts             the actual login form
    │   ├── personal-section.page.ts  settings / messages / support (not club-scoped)
    │   └── navigation.page.ts        clicking through every sidebar destination
    │
    ├── specs/        WHAT should be true - tests and assertions only
    │   ├── smoke-testing/     the thin "is the app alive" pass, 17 numbered groups
    │   │   ├── 03-authentication/
    │   │   ├── 04-navigation-core-ui/    the role-boundary battery + owner controls
    │   │   ├── 09-calendar-scheduling/
    │   │   ├── 10-attendance-qr/
    │   │   ├── 11-exams-grading-belts/
    │   │   ├── 15-video-library/
    │   │   └── ...                       17 groups; the rest are not written yet
    │   ├── regression/        depth checks that are NOT part of a smoke run
    │   └── i18n/               copy checks pinning known broken-label bugs
    │
    ├── support/
    │   ├── roles.ts           role -> credentials, read from .env
    │   ├── routes.ts          every URL shape in the app, in one place
    │   └── fixtures.ts        club-id discovery, page objects, `asRole()`
    │
    ├── config/environments.ts  local vs dev: URLs, cookie names, auth file paths
    └── setup/auth.setup.ts     logs each role in ONCE via the API, saves the session
```

**Specs are filed by the screen they cover, not the role they run as.** That is
why `member.blocked.spec.ts` exists in two different group folders - the file
*name* carries the role so a report line still says who was signed in.

Page objects are injected as fixtures, so specs never construct them:

```ts
test('...', async ({ clubSection, membersPage, clubId }) => {
  await clubSection('analytics').expectRestricted(clubRoute(clubId, 'analytics'));
});
```

`locators/` is also the whole migration path for the day the app gains
`data-testid` attributes - nothing else in the suite would need to change.

---

## 4. Where to go from here

This file covers getting the suite running. Three other documents answer the
questions that come after that:

| | Question it answers |
| --- | --- |
| [`e2e/README.md`](e2e/README.md) | **The authoring guide** - finding selectors with codegen, adding a new scenario, known app constraints, what to do when a test fails on a real app bug, troubleshooting. Start here before writing or debugging a test. |
| [`e2e/smoke_testing_scenarios.md`](e2e/smoke_testing_scenarios.md) | **The smoke pass** - the 17-group checklist, which manual scenario proves each group, and the exact `codegen` command for each one. |
| [`e2e/COVERAGE.md`](e2e/COVERAGE.md) | **Automation status overall** - every scenario's state, the difficulty buckets, open app findings, and the ranked next milestones. |
| [`CLAUDE.md`](CLAUDE.md) | The non-negotiable rules, condensed, for anyone (or anything) picking this repo up cold. |

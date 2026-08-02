# CLAUDE.md — Martial Apps QA automation

Playwright automation of the manual scenarios in `manual-qa/`. Every test maps
back to a scenario ID (`SEC-040`, `MEM-019`, …), so a failure is reported with the
ID already used in ClickUp. The suite is **read-only** and safe against shared `dev`.

## Non-negotiables

1. **The app source is the source of truth.** Read the page component, its role
   guard, and the backend route before writing a test — only the parts that
   scenario needs, not the codebase. Where a `manual-qa/` sheet disagrees with the
   code, **the code wins** — but **STOP AND ASK before editing the sheet.** Say
   what disagrees, quote the code that settles it, and wait. Only then correct
   the sheet and write against the corrected version. Exception: where the
   *behaviour itself* is the defect, assert what the app is supposed to do and
   leave the test red (see 4) — that is a red test, not a sheet edit, and needs
   no permission.

   **Why the pause:** a sheet edit is the one action here that destroys the
   original intent. A wrong test is visible and gets fixed; a sheet quietly
   rewritten to match a bug erases the requirement that would have caught it,
   and nobody reviews a passing test. The QA sheets are also the human
   deliverable — someone else runs them by hand and may know why a row says what
   it says. Asking costs a message. Being wrong costs a requirement, silently.
2. **A spec never contains a locator.** Locator → `e2e/locators/`, steps →
   `e2e/pages/`, expectation → `e2e/specs/`. Nothing reaches across.
3. **Every "control absent" check needs a positive control** proving the same
   selector matches for a role that should have it. An absence check passes
   loudest when the selector is simply wrong.
4. **Five tests are red on purpose** — `SEC-043`, `SEN-042`, the `SEN-044`
   role-editor half, and the `CHD-001` Messages and My Club halves. They report
   open app bugs and go green when the app is fixed. Never skip, soften, or
   invert them. **A full run is correct when those five, and only those five,
   fail.** Two unrelated causes; both are written up in `COVERAGE.md` §3.
5. **Never use `test.skip` / `fixme` to keep a run green.** A skip hides whether a
   scenario is a known bug or simply unfinished. Prefer a red test, or no test.
6. **Use `gotoAndAwaitClubRole`, not `goto`,** whenever the assertion is about a
   control being offered or withheld. `userRole` sits at its `'member'` default
   until `GET /users/clubs` answers, so an early check passes for every role —
   including the owner.
7. **Run the tests and report the real result.** Don't hand over a command and
   wait. Long runs go in a background Bash call.

## Where to read what

| Question | File |
| --- | --- |
| How it is built, how to run it, how to add a test | `README.md` §3–5 |
| What a smoke run covers, **plus the codegen command for every scenario** | `e2e/smoke_testing_scenarios.md` |
| What is automated, what to do next, open app findings | `e2e/COVERAGE.md` |
| Every URL shape — 63 keys, three blocks, the naming rules | `e2e/support/routes.ts` |

**Do not summarise those files here.** Two copies of a checklist drift within a
week; this file routes, it does not restate.

## Commands

```bash
npm run test:dev                       # everything, against deployed dev
npm run test:group:dev -- 04           # one smoke group (number or name)
npm run codegen:dev -- <role> <page>   # recorder, signed in, ids auto-discovered
npm run typecheck
```

Roles: `ownerPrimary`, `coOwner`, `sensei`, `secretary`, `member`, `parent`.
Page keys come from `e2e/support/routes.ts`; pass a bad one to list them all.

## Workspace

Sibling repos, **read-only from here** — never edited: `../martial-apps-frontend`,
`../martial-apps-backend`. `../martial_app_admin_frontend` is not cloned yet; it is
the blocker for smoke group 2 (`SMK-010`–`SMK-014`).

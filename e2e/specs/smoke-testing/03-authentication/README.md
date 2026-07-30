# 03. Authentication

*Every role can get in, and the wrong credentials cannot.*

**Scenarios, status and reasons: [`smoke_testing_scenarios.md`](../../../smoke_testing_scenarios.md#3-authentication).**
That file is the single source of truth for this group - do not restate the
list here.

**`ONB-003` is already covered** - `e2e/setup/auth.setup.ts` signs in all five
roles and asserts each lands on `/dashboard`. It runs before every suite
execution, so a broken login is one red setup test rather than thirty confusing
failures.

**`SMK-020` and `SMK-021` close the gap that mattered here** - `login-form.spec.ts`
is the only place in the suite that types into the login page. Everything else
authenticates via `POST /auth/login` for speed, which is the right trade and
leaves exactly this screen untested. Do not "simplify" those two by reusing a
saved session: the session is what they exist to avoid.

Three things about that file are worth knowing before editing it:

- **It runs unauthenticated, and that needs no separate project.**
  `playwright.config.ts` sets no project-level `storageState`, so omitting
  `test.use(asRole(...))` IS the unauthenticated context.
- **The login page renders `<LoginForm />` twice**, once per responsive branch,
  so `#email` and `#password` are duplicated in the DOM. The locators use
  `:visible` for that reason - a bare CSS locator fails strict mode.
- **A rejected sign-in is a toast**, not inline form copy, and it auto-closes
  after 4 seconds. "Still on `/login`" is the assertion that carries the result.

**The most serious finding in this suite lives here, but currently has NO
test.** Before React hydrates, the form does a native GET submit that writes
the user's email and password into the URL - and from there into browser
history, access logs and `Referer` headers. A test for it (`SMK-023`) was
written, reproduced it deterministically by blocking scripts, and was then
**pulled from the suite for now at QA's request** pending a filing decision.
The bug is unfixed; only the test is gone. Full write-up, and what it takes to
re-add the test, is in `COVERAGE.md` section 3b.

That bug is also why `LoginPage.open()` still waits for hydration, even with
the test removed. **The wait is not a verdict that the bug is acceptable** - it
is what lets `SMK-020` and `SMK-021` assert the thing they are named for
instead of flaking on it, and it stays regardless of whether `SMK-023` is in
the suite.

`SMK-022` (sign out) and `MEM-020` (the forced-redirect accounts) are what is
left here. Sign-up remains manual-only - email OTP, as in group 01.

---

Conventions for anything written in this folder are in
[`../README.md`](../README.md).

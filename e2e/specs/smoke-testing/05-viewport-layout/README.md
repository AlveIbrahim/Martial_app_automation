# 05. Viewport & layout

*The app is usable at the sizes people actually hold.*

**Scenarios, status and reasons: [`smoke_testing_scenarios.md`](../../../smoke_testing_scenarios.md#5-viewport--layout).**
That file is the single source of truth for this group - do not restate the
list here.

**Needs a config change before a single test can be written.** The suite runs
one project at 1280x720 (`devices['Desktop Chrome']`); this group needs mobile
and tablet projects in `playwright.config.ts`.

**Treat this as different components, not a restyle.** `MembersTableView`
renders at >=1024px (`hidden lg:block`) and a card list renders below it, so a
selector confirmed on desktop can match nothing on a phone. Re-record per width
with codegen - README section 4.

---

Conventions for anything written in this folder are in
[`../README.md`](../README.md).

# 02. Club onboarding (admin app)

*A club can be brought into existence at all.*

**Scenarios, status and reasons: [`smoke_testing_scenarios.md`](../../../smoke_testing_scenarios.md#2-club-onboarding-admin-app).**
That file is the single source of truth for this group - do not restate the
list here.

**Blocked on infrastructure, not on difficulty.** These test
`martial-apps-admin-frontend`, a separate deployment with its own login - so
before anything lands here the suite needs an admin entry in
`e2e/config/targets.json`, an admin account in `.env`, and its own auth setup
project.

None of the manual sheets cover the admin app, so every scenario in this group
is new (`SMK-010`-`SMK-014`).

Start with `SMK-013`, the Demo Clubs tool: every account this suite runs as
comes from it, so when it breaks, QA stops.

---

Conventions for anything written in this folder are in
[`../README.md`](../README.md).

# 06. Club creation & club join

*A club can be created and a stranger can get into it.*

**Scenarios, status and reasons: [`smoke_testing_scenarios.md`](../../../smoke_testing_scenarios.md#6-club-creation--club-join).**
That file is the single source of truth for this group - do not restate the
list here.

**`OWP-002` (generate QR / share link) is the one read-only row here** and the
sensible place to start - the control is already located as
`commonLocators.shareClub`, used by the member absence tests.

Everything else writes. `ONB-005` additionally needs a club-creation code from
the admin app (group 02), and leaves a club behind on every run.

`ONB-011` splits: the `/join/[clubId]` **link** is automatable, scanning the QR
is not.

---

Conventions for anything written in this folder are in
[`../README.md`](../README.md).

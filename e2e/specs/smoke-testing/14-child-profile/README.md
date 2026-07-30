# 14. Child profile

*The child experience is locked down as designed.*

**Scenarios, status and reasons: [`smoke_testing_scenarios.md`](../../../smoke_testing_scenarios.md#14-child-profile).**
That file is the single source of truth for this group - do not restate the
list here.

**The largest group in the checklist, and the most gated.** Everything needs a
household and a child profile first (group 13).

**Four rows can never be automated**, all for the same reason - they need real
time to pass: `PAR-006` (15/30/60-minute lockout escalation with a 24-hour
reset) and `CHD-003`/`CHD-004`/`CHD-005` (the screen-time budget burning down).
No test should sit waiting an hour.

The cheap wins are the form-validation edges, `PAR-040` and `PAR-041`.

---

Conventions for anything written in this folder are in
[`../README.md`](../README.md).

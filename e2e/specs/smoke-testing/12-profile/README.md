# 12. Profile

*A user can see and change their own details.*

**Scenarios, status and reasons: [`smoke_testing_scenarios.md`](../../../smoke_testing_scenarios.md#12-profile).**
That file is the single source of truth for this group - do not restate the
list here.

Text fields in `MEM-018` are automatable; the **avatar upload needs a fixture
image** committed to the repo.

The language half of `MEM-019` overlaps group 17 - assert it in one place, not
both. The billing pane is a STUB (`MEM-043`); there is nothing to assert there.

Writes here are self-reversing, which makes this a gentler place to start on
mutating tests than groups 06-08.

---

Conventions for anything written in this folder are in
[`../README.md`](../README.md).

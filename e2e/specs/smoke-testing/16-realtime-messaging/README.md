# 16. Real-time messaging

*Messages and notifications arrive without a refresh.*

**Scenarios, status and reasons: [`smoke_testing_scenarios.md`](../../../smoke_testing_scenarios.md#16-real-time-messaging).**
That file is the single source of truth for this group - do not restate the
list here.

**One fixture unblocks eleven of the twelve rows here: a second authenticated
browser context.** It is the highest-leverage piece of infrastructure left in
the suite - see `COVERAGE.md` section 6 item 3.

Until then the only rows that need no writes are `MEM-040` (a plain member is
not offered another plain member in the contact picker - pair it with a
positive control) and the read half of `MEM-012`.

`OWP-029` notifies **every member of the shared club**. Do not run it casually
against `dev`.

---

Conventions for anything written in this folder are in
[`../README.md`](../README.md).

# 12. Profile

*A user can see and change their own details.*

**Scenarios, status and reasons: [`smoke_testing_scenarios.md`](../../../smoke_testing_scenarios.md#12-profile).**
That file is the single source of truth for this group - do not restate the
list here.

`member.read-only.spec.ts` holds `MEM-019` **step 1 only** — the settings page
loads and offers its four tabs. Everything else in that scenario writes.

Two things the sheet gets wrong about this screen, both confirmed in the source:
the page renders **four** tabs for an adult profile, not the three the sheet
lists (`Membership` is missing from it), and two of those labels are hardcoded
English rather than translation keys (`COVERAGE.md` section 6 item 1d).

Text fields in `MEM-018` are automatable; the **avatar upload needs a fixture
image** committed to the repo.

The language half of `MEM-019` overlaps group 17 - assert it in one place, not
both. The billing pane is a STUB (`MEM-043`); there is nothing to assert there.

Writes here are self-reversing, which makes this a gentler place to start on
mutating tests than groups 06-08.

---

Conventions for anything written in this folder are in
[`../README.md`](../README.md).

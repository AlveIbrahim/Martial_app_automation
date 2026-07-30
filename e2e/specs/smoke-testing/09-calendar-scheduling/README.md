# 09. Calendar & scheduling

*The schedule is readable, and editable only by staff.*

**Scenarios, status and reasons: [`smoke_testing_scenarios.md`](../../../smoke_testing_scenarios.md#9-calendar--scheduling).**
That file is the single source of truth for this group - do not restate the
list here.

`MEM-042` (a member is offered no create-event control) is automated in
`member.blocked.spec.ts`. The rest of the member boundary battery is in
`../04-navigation-core-ui/`.

**`MEM-042` has no positive control.** Nothing in the suite proves
`clubSectionLocators.createEvent` matches for a role that *should* have it, so
that test would pass just as well if the selector were wrong - the false-green
case in README section 7. `OWP-009` is the natural place to close it: write the
owner half first, then `MEM-042` means something.

**The demo club has no events** - the calendar reads "No events scheduled". So
`MEM-006` can only assert the empty-state frame today; "real classes shown" and
"tap an event" need a seeded event.

The calendar page heading is **the current date**, not the word "calendar". The
stable anchor is the `Event Types` sidebar heading, already in
`club-section.locators.ts`.

---

Conventions for anything written in this folder are in
[`../README.md`](../README.md).

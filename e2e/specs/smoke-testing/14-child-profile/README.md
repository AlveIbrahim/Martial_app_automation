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

## Two things that cost time to find out

**There is no child URL.** `/portal` looks like the child surface and is not -
it is a static placeholder with no navigation on it (that is what `MEM-044`
records). A child sees **the same `/dashboard`**, re-rendered once
`currentProfileType` flips. So every scenario here starts by signing in as the
parent and switching profile; `ProfileSwitchPage` does it.

**Two switch-profile implementations exist and only one runs.**
`components/household/SwitchProfileModal.tsx` is clean, self-contained, and
imported by nothing. The live one is inline in `Header.tsx` with different
markup. Locators recorded against the dead component match nothing.

## Test data

`ROLE_PARENT_CHILD_NAME` and `ROLE_PARENT_CHILD_PIN` in `.env` must match a
child profile that exists in the target environment. The PIN is the one piece
of data this suite cannot discover from the API - it is stored hashed - so
unlike every id here it has to be written down and kept in step with whatever
`ONB-021` created.

A wrong PIN is worse than a plain failure: repeated bad attempts lock the
profile for 15 minutes (`PAR-006`), and the lockout outlives the run.

---

Conventions for anything written in this folder are in
[`../README.md`](../README.md).

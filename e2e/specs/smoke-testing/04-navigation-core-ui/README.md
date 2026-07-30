# 04. Navigation & core UI

*Every role lands somewhere sensible and is offered only what their role allows.*

**Scenarios, status and reasons: [`smoke_testing_scenarios.md`](../../../smoke_testing_scenarios.md#4-navigation--core-ui).**
That file is the single source of truth for this group - do not restate the
list here.

**The best-covered group in the checklist**, and the home of the role-boundary
battery:

```
04-navigation-core-ui/
├── member.blocked.spec.ts       MEM-007, MEM-041 x4
├── member.read-only.spec.ts     MEM-001, MEM-005
├── secretary.blocked.spec.ts    SEC-040, SEC-041, SEC-044, SEC-043 (red)
├── secretary.allowed.spec.ts    SEC-001
├── sensei.blocked.spec.ts       SEN-040, SEN-041, SEN-043, SEN-044 x2, SEN-042 (red)
├── sensei.allowed.spec.ts       SEN-001
└── owner.allowed.spec.ts        8 positive controls for all of the above
```

`npm run test:group -- 04` runs the lot.

**`owner.allowed.spec.ts` is load-bearing.** Every other file here asserts that
a screen is refused or a control is withheld; those assertions all pass if the
app is simply broken for everyone. That file proves the same routes and
selectors work for the primary owner. **If it is red, treat every result in this
folder as unreliable** until it is fixed.

It also carries the positive control for `OWS-040` / `OWS-041` in
`../../regression/`, which is the one pairing a folder-scoped run can split -
see [`../../regression/README.md`](../../regression/README.md).

**The `*.allowed.spec.ts` files are the positive side for staff**, and they earn
their keep twice: `SEC-001` asserts the Members tab IS offered to a secretary
using the same selector `MEM-005` checks the absence of for a member.

**`SEN-001` stops before the tab bar on purpose.** A sensei being shown the
Settings tab is the open bug `SEN-042` already reports as red - asserting the
tab set here would either duplicate that red or record the defect as expected.
The same trap is waiting in `SEN-002`, whose step 2 describes exactly that
behaviour as correct; see `COVERAGE.md` Bucket A before writing it.

Two things about `/dashboard/myClub` those files depend on: it is **not** a club
picker - it redirects to the first club (`myClub/page.tsx` ~line 13), which is
why they use `expectReachedVia` rather than `goto` - and the My Club nav entry
is gated on belonging to any club at all, **not** on holding a staff role, so it
is not a staff-only marker.

Still missing: `OWS-001` (the co-owner's version of the same sweep) and
`SMK-030`, a sidebar sweep proving every primary nav destination loads.

Before touching a boundary test, read `COVERAGE.md` section 1. Three of these
once passed for the wrong reason: nothing matched for **any** role.

---

Conventions for anything written in this folder are in
[`../README.md`](../README.md).

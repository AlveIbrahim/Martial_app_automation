# 15. Video library

*The content students come for actually plays.*

**Scenarios, status and reasons: [`smoke_testing_scenarios.md`](../../../smoke_testing_scenarios.md#15-video-library).**
That file is the single source of truth for this group - do not restate the
list here.

`MEM-011` is automated in `member.read-only.spec.ts` - steps 1 and 3. The rest
of the member read-only battery is in `../04-navigation-core-ui/`.

`owner.allowed.spec.ts` beside it is `MEM-011`'s positive control: it proves the
manage link DOES render for the primary owner on the same screen. The two are a
pair - if the owner test is red, `MEM-011` proves nothing.

**Settle `MEM-009` against the sheet before writing it.** `/library`
auto-redirects to the first club's library unless `?view=master`
(`library/page.tsx` ~line 81), so what you land on is `MEM-011`'s screen. One of
the two sheet descriptions is wrong.

**Open bug in `SEN-008`:** the library manage control is gated on `userRole ===
'owner'`, so a sensei is offered it - same root cause as `SEN-044`. See
`COVERAGE.md` section 6 item 6.

Video playback itself is a visual judgement and stays manual.

---

Conventions for anything written in this folder are in
[`../README.md`](../README.md).

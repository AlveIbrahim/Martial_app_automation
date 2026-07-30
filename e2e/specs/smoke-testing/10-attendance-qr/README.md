# 10. Attendance & QR flow

*Attendance can be taken - by camera and by hand.*

**Scenarios, status and reasons: [`smoke_testing_scenarios.md`](../../../smoke_testing_scenarios.md#10-attendance--qr-flow).**
That file is the single source of truth for this group - do not restate the
list here.

**Split the group by whether a camera is involved.** `OWP-031` and `SEN-010`
take attendance by hand in the room screen and need no hardware - that is the
automatable half. `SEN-009`, `CR-001` and `OWS-006` mount a live camera
(`html5-qrcode`, `#qr-reader`) and stay manual forever.

`SEC-042` (secretary turned away from scan-attendance) is automated in
`secretary.blocked.spec.ts`. The rest of the secretary boundary battery is in
`../04-navigation-core-ui/`.

**`SEC-042` has no positive control**, and cannot have one while the camera
stays: the owner battery omits `/scan-attendance` because a headless pass on a
page that mounts `html5-qrcode` says nothing useful. So a route that broke for
everyone would read here as correct access control. Worth knowing before you
trust a green `SEC-042` on its own.

`/scan-attendance` is **student self-check-in** and opens for a member on
purpose. The instructor-side screen is a different route,
`site/[siteId]/rooms/[roomId]/attendance`.

---

Conventions for anything written in this folder are in
[`../README.md`](../README.md).

# 01. Club owner registration (website)

*A stranger can become an account holder.*

**Scenarios, status and reasons: [`smoke_testing_scenarios.md`](../../../smoke_testing_scenarios.md#1-club-owner-registration-website).**
That file is the single source of truth for this group - do not restate the
list here.

**Nothing here is automatable today.** Sign-up, email verification and password
reset all complete via a code mailed to a real inbox, so `ONB-001`, `ONB-002`
and `ONB-004` stay human checks until there is a mail-catcher service.

The one thing you *can* write is `SMK-001`: the public site loads and its
sign-up call to action reaches `/register`. It needs no session at all, which
makes it the cheapest test in the whole checklist.

The `/register` **form** is also automatable on its own - required fields,
password rules, duplicate email - even though the flow behind it is not.

---

Conventions for anything written in this folder are in
[`../README.md`](../README.md).

# 17. Localization

*Nothing is untranslated or hard-coded.*

**Scenarios, status and reasons: [`smoke_testing_scenarios.md`](../../../smoke_testing_scenarios.md#17-localization).**
That file is the single source of truth for this group - do not restate the
list here.

**The infrastructure already exists**: every locator in `e2e/locators/` carries
an `EN|FR` alternation, so both languages are matched today.

There is a live example of what a sweep here would catch.
`teacherManagement.accessRestricted` is missing from both `messages/en.json`
and `messages/fr.json`, so next-intl renders the raw key path to users on the
teachers denial screen. A sweep for headings matching `/^[a-z]+\.[a-zA-Z]+$/`
would find it.

The app takes UI language from the user's **profile**, not the browser locale,
so switching it is a profile change, not a context option.

---

Conventions for anything written in this folder are in
[`../README.md`](../README.md).

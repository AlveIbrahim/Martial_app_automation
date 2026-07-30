# Regression

Automated scenarios that are **not part of the smoke pass**. Smoke asks "does
the product work at all"; these go deeper into one area, so they belong in a
full run rather than a quick one.

The selection comes from the *Outside the smoke checklist* table in
[`../../smoke_testing_scenarios.md`](../../smoke_testing_scenarios.md#outside-the-smoke-checklist),
which names the co-owner boundary and the sites roster as regression concerns.

```
regression/
├── co-owner.blocked.spec.ts    OWS-040, OWS-041   co-owner boundary
├── member.read-only.spec.ts    MEM-008            sites roster, read-only
└── owner.allowed.spec.ts       positive control for MEM-008
```

Run it with `npm run test:regression` (or `:dev`). A full `npm test` includes it.

## One gap to know about before trusting a regression-only run

`OWS-040` and `OWS-041` assert that the members role dropdown does **not** offer
the two owner-level options to a co-owner. Their positive control — `owner is
offered the owner-level roles` — lives in
[`../smoke-testing/04-navigation-core-ui/owner.allowed.spec.ts`](../smoke-testing/04-navigation-core-ui/owner.allowed.spec.ts),
because `SEN-044` needs the same one and duplicating it would mean two copies to
keep in step.

So `npm run test:regression` on its own runs those two without their pair, and a
green result there is **not** evidence that the dropdown selector still matches
anything — the false-green case README section 7 is about. Two ways to close it:

```bash
npm test                     # full run: the pair is included
npx playwright test e2e/specs/regression \
  e2e/specs/smoke-testing/04-navigation-core-ui/owner.allowed.spec.ts
```

`MEM-008`'s positive control is in this folder, so it is unaffected.

---

Conventions for anything written here are in
[`../smoke-testing/README.md`](../smoke-testing/README.md) — the layering rules
are the same everywhere in this suite.

# Copy checks

Specs here assert **what a screen says**, not what it does. They exist because
the rest of the suite deliberately tolerates broken copy: an access-control test
must not turn red because a label is wrong, or a missing translation could
delete an access-control result from the record.

That tolerance has a cost — with it in place, nothing watches the label. These
specs are what pays it. Each one pins a known copy bug and is `fixme` until the
bug is fixed. See `../../README.md` section 7.

| Spec | Pins | Why it is `fixme` |
| --- | --- | --- |
| `denial-copy.spec.ts` | `teacherManagement.accessRestricted` missing from **both** `messages/en.json` and `messages/fr.json`, so the teachers denial screen shows the raw key | The key is still missing. This one fails today if run — that is the bug |
| `belts-copy.spec.ts` | 13 `belts.*` keys missing from `messages/fr.json`, including `beltSystemTitle`, the belts page H1 | The defect is only visible in French, and the app takes UI language from the user's **profile**. Switching it is a write, so it belongs with the mutating-tests milestone |

**A `fixme` here is not the same as a skip elsewhere.** The suite's rule is that
a scenario either has a test asserting correct behaviour or is not present at
all, because a skip hides which of the two it is. These are neither: the
behaviour they sit on **is** asserted, by the behavioural spec that tolerates
the label. What is `fixme` is only the cosmetic half, and the tolerance and the
`fixme` are removed together.

## Running these

```bash
npx playwright test e2e/specs/i18n
npm test                              # a full run includes this folder
```

**`npm run test:group` and `npm run test:smoke` do not reach this folder.**
`scripts/run-group.mjs` resolves groups from the smoke and regression
directories only (~lines 36-37), and `test:smoke` is a path filter on
`specs/smoke-testing`. This folder is a third sibling, so a full `npm test` is
what covers it. Add it to `run-group.mjs` if that becomes inconvenient.

## Adding one

The one worth writing next is a **sweep** rather than another pin: walk a set of
screens and fail on any heading matching `RAW_I18N_KEY` in
`locators/common.locators.ts`. That is `XC-001` in the smoke checklist, and it
would have caught both bugs above without anyone knowing to look for them. The
infrastructure is already here — every locator carries an `EN|FR` alternation.

# 11. Exams, grading & belt progression

*A student can be assessed and moved up.*

**Scenarios, status and reasons: [`smoke_testing_scenarios.md`](../../../smoke_testing_scenarios.md#11-exams-grading--belt-progression).**
That file is the single source of truth for this group - do not restate the
list here.

`MEM-002`, `MEM-003` and `MEM-004` are automated in `member.read-only.spec.ts`.
The rest of the member read-only battery is in `../04-navigation-core-ui/`.

**`MEM-003` and `MEM-004` are both partial, for the same reason:** the seeded
member has **no attendance**, so the number comparisons in their later steps
are `0 == 0` and would pass whether or not the app computes either number
correctly. Only step 1 of each is automated. They need seeded attendance -
`COVERAGE.md` Bucket B. Neither needs a positive control: both assert that
content is *present*, so a selector matching nothing turns them red rather than
green.

**`MEM-002` does need one, and it is `owner.allowed.spec.ts` in this folder.**
It asserts an absence - that a member is not offered Eligible Students - and an
absence check passes loudest when the selector is simply wrong. The two must
stay in this folder together so `npm run test:group -- 11` cannot run one
without the other.

Two things about the belts page that cost time to work out:

- **It shows the club's belts only**, not a master set as well. The `MEM-002`
  sheet said both; the page is fed by `useGetBeltsByClubQuery` and never
  fetches a master list. The sheet has been corrected.
- **Do not anchor on its H1.** `belts.beltSystemTitle` is missing from
  `messages/fr.json`, so in French that heading is the literal key. The specs
  here anchor on `belts.kyuRanks`, which exists in both languages; the label
  bug is pinned separately in `../../i18n/belts-copy.spec.ts`.

`OWP-020` and `CR-014` are **irreversible** - they promote real members. Do not
run them against the shared environment without the isolation decision.

---

Conventions for anything written in this folder are in
[`../README.md`](../README.md).

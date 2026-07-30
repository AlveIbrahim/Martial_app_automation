import fs from 'node:fs';
import path from 'node:path';

/**
 * Empty `allure-results/` before a run, so a report describes ONE run.
 *
 * The Allure reporter only ever appends: every test, retry and attempt writes a
 * new `<uuid>-result.json` and nothing removes the old ones. Left alone the
 * directory becomes a rolling archive, and `allure generate` faithfully reports
 * the whole pile as though it were a single execution.
 *
 * It is not a cosmetic problem. Measured on 2026-07-30 before this existed:
 * 1282 result files spanning 17 hours produced a summary of
 * `total 123, passed 37, failed 1, skipped 85, retries 91` for a suite of 50
 * tests whose actual result was 44 passed / 4 failed / 2 skipped. Every number
 * was wrong, and 22 of those files still described tests that had since been
 * renamed - so the report listed scenarios that no longer existed.
 *
 * A report that blends runs is worse than no report: it is confidently wrong,
 * and it is the artefact this project shares with other people.
 *
 * This is `globalSetup`, which runs once per `playwright test` invocation,
 * because that is the only place that catches every entry point - `npm test`,
 * `test:dev`, `test:smoke`, `test:group`, and a bare `npx playwright test path`
 * alike. Doing it in the npm scripts would mean remembering it in ten of them.
 *
 * CONSEQUENCE WORTH KNOWING: a folder-scoped run replaces the results of the
 * previous one, so `npm run test:group -- 04` followed by `report:allure`
 * reports group 04 and nothing else. That is the intended meaning of a report.
 * For a report covering everything, run everything.
 *
 * History across runs is NOT kept here, and the results directory is not where
 * it would live - Allure carries history in the generated report, not in the
 * raw results. Archive `allure-report/` if you want to keep a run.
 */
export default function cleanAllureResults(): void {
  const resultsDir = path.resolve(__dirname, '../../allure-results');

  /**
   * EMPTY THE DIRECTORY, DO NOT REPLACE IT.
   *
   * Reporters are constructed before globalSetup runs, so the Allure reporter
   * has already resolved this path by the time we get here. Unlinking the
   * contents leaves the directory it is holding in place; `fs.rmSync(dir)`
   * followed by a fresh `mkdir` would swap the inode underneath it and make
   * the run depend on how the reporter copes with that. Nothing is gained by
   * finding out.
   */
  fs.mkdirSync(resultsDir, { recursive: true });
  for (const entry of fs.readdirSync(resultsDir)) {
    fs.rmSync(path.join(resultsDir, entry), { recursive: true, force: true });
  }
}

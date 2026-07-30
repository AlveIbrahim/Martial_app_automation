#!/usr/bin/env node
/**
 * Removes phantom `skipped` result files from allure-results/ before a report
 * is generated.
 *
 * WHY THESE EXIST. `npx playwright test --list` runs every configured
 * reporter's onBegin/onEnd even though no test executes. allure-playwright
 * reads that as "every discovered test was skipped" and writes a fresh
 * zero-duration `<uuid>-result.json` for the whole suite - and `--list` never
 * runs `globalSetup`, so `clean-allure.ts` never gets a chance to stop it.
 * `playwright.config.ts` now gives `--list` a reporter array with no
 * allure-playwright in it, which stops new ones. This script cleans up
 * anything written before that fix, or by any other tool that lists tests
 * against this config without going through `playwright test`.
 *
 * HOW A PHANTOM IS RECOGNISED. Every real attempt - pass, fail, or a genuine
 * `test.skip()` - takes at least tens of milliseconds, because Playwright has
 * to spin up a page. A phantom has `status: "skipped"` and a duration of a
 * few milliseconds, and it always has an earlier, non-phantom sibling with the
 * same `historyId` (the same test, actually run). A *lone* fast skip - no
 * sibling - is a real `test.skip()`/`fixme` result and is left alone.
 *
 * Run automatically by `npm run report:allure`, before `allure generate`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RESULTS_DIR = path.join(ROOT, 'allure-results');

const PHANTOM_MAX_DURATION_MS = 5;

function main() {
  if (!fs.existsSync(RESULTS_DIR)) {
    console.log('[dedupe-allure-results] allure-results/ does not exist yet - nothing to do.');
    return;
  }

  const resultFiles = fs.readdirSync(RESULTS_DIR).filter((f) => f.endsWith('-result.json'));
  const groups = new Map();

  for (const file of resultFiles) {
    const fullPath = path.join(RESULTS_DIR, file);
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    const key = data.historyId ?? data.testCaseId ?? file;
    const entry = { file, data, duration: (data.stop ?? 0) - (data.start ?? 0) };
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  }

  let removed = 0;

  for (const entries of groups.values()) {
    if (entries.length === 1) continue;

    entries.sort((a, b) => a.data.start - b.data.start);
    const hasRealSibling = entries.some((e) => e.data.status !== 'skipped' || e.duration > PHANTOM_MAX_DURATION_MS);

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const isPhantomShape = entry.data.status === 'skipped' && entry.duration <= PHANTOM_MAX_DURATION_MS;
      if (!isPhantomShape) continue;

      // A group that is ENTIRELY fast skips is a genuine skip duplicated by
      // --list, not a real result buried under phantoms. Keep the earliest
      // (the one from the actually-scheduled run) and drop the rest.
      const isPhantom = hasRealSibling || i > 0;
      if (!isPhantom) continue;

      fs.rmSync(path.join(RESULTS_DIR, entry.file), { force: true });
      removed++;
    }
  }

  console.log(`[dedupe-allure-results] removed ${removed} phantom skipped result(s) from ${resultFiles.length} total.`);
}

main();

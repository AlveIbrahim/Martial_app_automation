#!/usr/bin/env node
/**
 * Runs ONE folder of the suite instead of all of it.
 *
 *   npm run test:group -- auth              03-authentication
 *   npm run test:group:dev -- 04            04-navigation-core-ui, against dev
 *   npm run test:group:dev -- library       15-video-library
 *   npm run test:group -- regression        the regression sibling
 *   npm run test:group                      lists every group and stops
 *
 * Extra arguments go straight to Playwright:
 *
 *   npm run test:group:dev -- 04 --headed
 *   npm run test:group:dev -- 04 --grep @SEN-044
 *
 * WHY A SCRIPT AND NOT 17 npm SCRIPTS. `playwright test <path>` already does
 * folder-wise running on its own - this adds nothing to how it runs, only how
 * you name the folder. It resolves the folder from the filesystem, so a group
 * that gains its first spec needs no change here, and there is no list of
 * seventeen names to keep in step with the checklist.
 *
 * The `setup` project still runs. It is a project dependency, and Playwright
 * runs dependencies in full regardless of a path filter, so a folder-scoped run
 * signs in exactly as a full run does.
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SMOKE_DIR = 'e2e/specs/smoke-testing';
const REGRESSION_DIR = 'e2e/specs/regression';

/** Print a readable error and stop. Every failure here should say how to fix it. */
function fail(message) {
  console.error(`\ntest:group: ${message}\n`);
  process.exit(1);
}

/* ------------------------------------------------------------------ groups */

/** How many `*.spec.ts` files a folder holds, so the listing shows what is written. */
function countSpecs(dir) {
  return fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith('.spec.ts')).length
    : 0;
}

/**
 * The numbered smoke folders, read off disk rather than listed here. The
 * checklist in e2e/smoke_testing_scenarios.md is the source of truth for what
 * each group means; this only needs to know which folders exist.
 */
function loadGroups() {
  const smokeRoot = path.join(ROOT, SMOKE_DIR);
  if (!fs.existsSync(smokeRoot)) {
    fail(`No ${SMOKE_DIR} folder. Run this from the martial-apps-testing checkout.`);
  }

  const groups = fs
    .readdirSync(smokeRoot, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d\d-/.test(e.name))
    .map((e) => ({
      name: e.name,
      number: e.name.slice(0, 2),
      relPath: `${SMOKE_DIR}/${e.name}`,
      specs: countSpecs(path.join(smokeRoot, e.name)),
    }))
    .sort((a, b) => a.number.localeCompare(b.number));

  groups.push({
    name: 'regression',
    number: '--',
    relPath: REGRESSION_DIR,
    specs: countSpecs(path.join(ROOT, REGRESSION_DIR)),
  });

  return groups;
}

function listing(groups) {
  const width = Math.max(...groups.map((g) => g.name.length));
  const rows = groups
    .map(
      (g) =>
        `  ${g.name.padEnd(width)}  ${
          g.specs === 0 ? 'no specs yet' : `${g.specs} spec file${g.specs === 1 ? '' : 's'}`
        }`,
    )
    .join('\n');

  return `Usage: npm run test:group[:dev] -- <group> [playwright args]

Match a group by number, by folder name, or by any unambiguous part of it:

  npm run test:group:dev -- 04
  npm run test:group:dev -- nav
  npm run test:group:dev -- 04-navigation-core-ui
  npm run test:group:dev -- regression

Groups:

${rows}

Whole passes:  npm run test:smoke   npm run test:regression   npm test
The scenario list for each group is in e2e/smoke_testing_scenarios.md.`;
}

/**
 * Resolve one group from what the caller typed. Exact matches win over partial
 * ones, so `12-profile` picks itself even though `profile` alone is ambiguous
 * with `14-child-profile`.
 */
function resolveGroup(query, groups) {
  const q = query.toLowerCase();

  const exact = groups.find((g) => g.name.toLowerCase() === q || g.number === q.padStart(2, '0'));
  if (exact) return exact;

  const partial = groups.filter((g) => g.name.toLowerCase().includes(q));
  if (partial.length === 1) return partial[0];

  if (partial.length > 1) {
    fail(
      `"${query}" matches ${partial.length} groups: ${partial.map((g) => g.name).join(', ')}.\n` +
        `Use the number, or enough of the name to be unambiguous.`,
    );
  }
  fail(`No group matches "${query}".\n\n${listing(groups)}`);
}

/* -------------------------------------------------------------------- main */

const groups = loadGroups();
const [query, ...passthrough] = process.argv.slice(2);

if (!query || query === '--help' || query === '-h') {
  console.log(listing(groups));
  process.exit(query ? 0 : 1);
}

const group = resolveGroup(query, groups);
const target = process.env.TEST_ENV ?? 'local';

/**
 * An empty folder is not an error - most of the 17 groups have no specs yet, and
 * the checklist says why. Playwright would exit non-zero on "no tests found", so
 * say what happened instead of returning a confusing failure.
 */
if (group.specs === 0) {
  console.log(
    `\nNothing to run: ${group.relPath} has no spec files yet.\n` +
      `What this group should cover, and what blocks it, is in ` +
      `e2e/smoke_testing_scenarios.md.\n`,
  );
  process.exit(0);
}

console.log(`\ntest:group  ${target}  ${group.name}  ->  ${group.relPath}\n`);

const cli = path.join(path.dirname(require.resolve('@playwright/test')), 'cli.js');
const child = spawn(process.execPath, [cli, 'test', group.relPath, ...passthrough], {
  stdio: 'inherit',
  cwd: ROOT,
});

// Forward signals rather than exiting straight away, so Ctrl-C does not leave a
// browser running with nobody to close it.
for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => child.kill(signal));
}

child.on('error', (err) => fail(`Could not start Playwright: ${err.message}\nTry "npm install".`));
child.on('close', (code, signal) => process.exit(signal ? 1 : (code ?? 0)));

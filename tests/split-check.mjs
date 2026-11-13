#!/usr/bin/env node
// Read-only proof for the v4 split (docs/specs/v4-split-map.md).
//
// Compares the rules file as it stood before the split (from git, BASELINE) with the set
// that replaces it: standards/project-rules.md and every file under standards/rules/.
//
//   1. Every non-blank line of the baseline is in the set exactly as many times as it was
//      in the baseline: none lost, none twice.
//   2. Any other difference is on the list of intended changes, tests/split-intended.json.
//   3. Each section, and each part of a section that divides, is in the file the map names.
//
// Blank lines and `---` rules are layout and are not compared. It writes nothing.
// Runs from tests/run.mjs until v4.0.0 is released.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const BASELINE = "1379baa";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const standards = join(root, "standards");

// Where the map puts each section. A line that starts with the text must be in the file.
const PLACEMENT = [
  // The core
  ["## §SCOPE ", "project-rules.md"],
  ["## §DOCS ", "project-rules.md"],
  ["## §ASK ", "project-rules.md"],
  ["## §AGENTS ", "project-rules.md"],
  ["## §GIT ", "project-rules.md"],
  ["## §OWNER ", "project-rules.md"],
  ["## §SPECS ", "project-rules.md"],
  ["## §TOOLS ", "project-rules.md"],
  ["## §SCALE ", "project-rules.md"],
  ["## §SECURITY ", "project-rules.md"],
  ["## §TESTING ", "project-rules.md"],
  ["- A green build is not evidence an interface works.", "project-rules.md"],
  ["- **Motion is checked on film.**", "project-rules.md"],
  ["- No end-to-end suite by default.", "project-rules.md"],
  // Engineering
  ["## §GROWTH ", "rules/app.md"],
  ["## §MODULES ", "rules/app.md"],
  ["## §NAMING ", "rules/app.md"],
  ["The words in the interface, the code and the documentation", "rules/app.md"],
  ["## §DATA ", "rules/app.md"],
  ["## §LIFECYCLE ", "rules/app.md"],
  ["## §SHORTCUTS ", "rules/app.md"],
  ["## §BUILD ", "rules/app.md"],
  ["- Comment non-obvious decisions", "rules/app.md"],
  ["- Nothing ships with a failing build", "rules/app.md"],
  // Interface
  ["## §DESIGN ", "rules/ui.md"],
  ["## §COMPONENTS ", "rules/ui.md"],
  ["## §QOL ", "rules/ui.md"],
  ["## §PATTERNS ", "rules/ui.md"],
  ["## §MOTION ", "rules/ui.md"],
  ["Three things hold regardless:", "rules/ui.md"],
  // Node and TypeScript
  ["## §NAMING ", "rules/node.md"],
  ["| Files and folders | kebab-case |", "rules/node.md"],
  ["- **Renaming on Windows: always `git mv`.**", "rules/node.md"],
  ["## §TS ", "rules/node.md"],
  ["## §PACKAGES ", "rules/node.md"],
  ["## §NPM ", "rules/node.md"],
  ["## §RUNTIME ", "rules/node.md"],
  ["## §BUILD ", "rules/node.md"],
  ["- **During work:** `npx tsc --noEmit`", "rules/node.md"],
  ["- **`npm run build` before every checkpoint", "rules/node.md"],
  ["## §TESTING ", "rules/node.md"],
  ["- **Unit tests with Vitest**", "rules/node.md"],
  // Next.js
  ["## §STRUCTURE ", "rules/web.md"],
  ["## §STATE ", "rules/web.md"],
  ["## §FORMS ", "rules/web.md"],
  ["## §HOOKS ", "rules/web.md"],
  ["## §STYLING ", "rules/web.md"],
  ["## §SHADCN ", "rules/web.md"],
  ["## §MOTION ", "rules/web.md"],
  ["**Library.** `motion`", "rules/web.md"],
  ["## §TESTING ", "rules/web.md"],
  ["- **Interface changes are checked in a real browser", "rules/web.md"],
  ["## Checklist — new project", "rules/web.md"],
  // Profiles
  ["**Game-engine projects.**", "rules/game.md"],
  ["**Repositories without application code.**", "rules/non-application.md"],
  // Options
  ["## §CREDIT ", "rules/options/credit.md"],
  ["## §TRELLO ", "rules/options/trello.md"],
  ["## §FIREBASE ", "rules/options/firebase.md"],
  ["## §AI ", "rules/options/ai.md"],
];

const compared = (text) =>
  text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line !== "" && line !== "---");

const count = (list) => {
  const counts = new Map();
  for (const line of list) counts.set(line, (counts.get(line) ?? 0) + 1);
  return counts;
};

const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
        entry.isDirectory() ? walk(join(dir, entry.name)) : entry.name.endsWith(".md") ? [join(dir, entry.name)] : [],
      )
    : [];

let baseline;
try {
  baseline = execFileSync("git", ["show", `${BASELINE}:standards/project-rules.md`], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    maxBuffer: 16 * 1024 * 1024,
  });
} catch {
  // A shallow clone (CI's default checkout) does not hold the baseline commit.
  console.log(`split-check: SKIPPED. Commit ${BASELINE} is not in this clone; run it in a full clone.`);
  process.exit(0);
}

const intended = JSON.parse(readFileSync(join(root, "tests", "split-intended.json"), "utf8"));
const tally = (entries) => count(entries.flatMap((entry) => (Array.isArray(entry) ? Array(entry[1]).fill(entry[0]) : [entry])));
const added = tally(intended.added);
const removed = tally(intended.removed);

const files = [join(standards, "project-rules.md"), ...walk(join(standards, "rules"))];
const name = (file) => relative(standards, file).replace(/\\/g, "/");
const linesOf = new Map(files.map((file) => [name(file), compared(readFileSync(file, "utf8"))]));

const before = count(compared(baseline));
const after = count([...linesOf.values()].flat());
const where = (line) => [...linesOf].filter(([, lines]) => lines.includes(line)).map(([file]) => file).join(", ") || "nowhere";

const failures = [];
for (const line of new Set([...before.keys(), ...after.keys()])) {
  const was = before.get(line) ?? 0;
  const is = after.get(line) ?? 0;
  const expected = was + (added.get(line) ?? 0) - (removed.get(line) ?? 0);
  if (is === expected) continue;
  const what =
    is < expected
      ? was === 0
        ? "listed as added, but not in the set"
        : "missing"
      : was === 0
        ? "new, and not on the intended list"
        : "more often than in the baseline";
  failures.push(`${what} (was ${was}, expected ${expected}, found ${is}; in ${where(line)}):\n      ${line}`);
}

for (const [text, file] of PLACEMENT) {
  const lines = linesOf.get(file);
  if (!lines) failures.push(`placement: ${file} does not exist (needs "${text}")`);
  else if (!lines.some((line) => line.startsWith(text))) failures.push(`placement: "${text}" is not in ${file}`);
}

const total = (counts) => [...counts.values()].reduce((sum, n) => sum + n, 0);
if (failures.length) {
  console.log(`split-check: FAILED, ${failures.length} problem(s).\n`);
  for (const failure of failures) console.log(`  - ${failure}`);
  process.exit(1);
}

console.log(
  `split-check: passed. ${total(before)} baseline lines, each in exactly one of ${files.length} files; ` +
    `${total(removed)} removed and ${total(added)} added on purpose (tests/split-intended.json).`,
);

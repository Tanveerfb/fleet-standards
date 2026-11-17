#!/usr/bin/env node
// Reports which project-rules.md version each project runs. Read only: it copies nothing.
// Usage: node standards/scripts/sync-rules.mjs [projectsDir]
//   projectsDir defaults to $PROJECTS_DIR, then E:\Projects.
// Bringing a project up to date is sync-standards' job, run inside that project: it translates
// section references, writes the imports and the skill copies, and asks first. This script is
// the fleet-wide overview. (It had an --apply that copied files without any of that; dropped
// in v4, audit I3.)
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { rulesProblems } from "./rules-line.mjs";
import { compareVersions, versionIn } from "./standard.mjs";

const standards = join(dirname(fileURLToPath(import.meta.url)), "..");
const master = join(standards, "project-rules.md");
const args = process.argv.slice(2);
const root = resolve(args.find((a) => !a.startsWith("--")) ?? process.env.PROJECTS_DIR ?? "E:\\Projects");
const commonDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

const versionOf = (file) => versionIn(readFileSync(file, "utf8"));
const compare = compareVersions;

if (!existsSync(root)) {
  console.error(`Projects folder not found: ${root}`);
  process.exit(1);
}

const current = versionOf(master);
console.log(`Master: v${current}  (${root})\n`);
for (const name of readdirSync(root)) {
  const dir = join(root, name);
  if (resolve(dir) === commonDir || !statSync(dir).isDirectory()) continue;
  const file = join(dir, "project-rules.md");
  const version = existsSync(file) ? versionOf(file) ?? "unknown" : null;
  const state =
    version === null ? "none"
    : version === "unknown" ? "unknown version"
    : compare(version, current) < 0 ? "behind"
    : compare(version, current) > 0 ? "AHEAD of master — copy it back"
    : "current";
  console.log(`${name.padEnd(32)} ${(version ?? "-").padEnd(8)} ${state}`);
  // The declared set (rules-line.mjs): a name it cannot match, a declared file missing or
  // not imported, an import not declared. Each is printed, never dropped.
  const claude = join(dir, "CLAUDE.md");
  if (version && existsSync(claude)) {
    const problems = rulesProblems(
      readFileSync(claude, "utf8"),
      (f) => existsSync(join(dir, f)),
      (f) => existsSync(join(standards, f)),
    );
    for (const p of problems) console.log(`${"".padEnd(42)}! ${p}`);
  }
}
console.log("\nTo bring a project up to date, run sync-standards inside it.");

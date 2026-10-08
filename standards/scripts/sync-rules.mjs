#!/usr/bin/env node
// Reports which project-rules.md version each project runs, and optionally copies the master in.
// Usage: node standards/scripts/sync-rules.mjs [projectsDir] [--apply]
//   projectsDir defaults to $PROJECTS_DIR, then E:\Projects.
//   --apply asks per out-of-date repo before copying. Projects with no copy are reported, never
//   touched — adopting the standard is a migration (adopting-the-standard.md), not a file copy.
// Copying does not commit. The new copy must be committed in each repo, and the repo's
// conventions.md re-audited: a v2 -> v3 copy changes every section reference (CHANGELOG.md).
import { copyFileSync, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";

const master = join(dirname(fileURLToPath(import.meta.url)), "..", "project-rules.md");
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const root = resolve(args.find((a) => !a.startsWith("--")) ?? process.env.PROJECTS_DIR ?? "E:\\Projects");
const commonDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Reads the `**Version:** x.y.z` line from a rules file, or null if absent. */
function versionOf(file) {
  const match = readFileSync(file, "utf8").match(/\*\*Version:\*\*\s*([\d.]+)/);
  return match ? match[1] : null;
}

/** Compares dotted versions numerically. */
function compare(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

if (!existsSync(root)) {
  console.error(`Projects folder not found: ${root}`);
  process.exit(1);
}

const current = versionOf(master);
const rows = [];
for (const name of readdirSync(root)) {
  const dir = join(root, name);
  if (resolve(dir) === commonDir || !statSync(dir).isDirectory()) continue;
  const file = join(dir, "project-rules.md");
  const version = existsSync(file) ? versionOf(file) ?? "unknown" : null;
  rows.push({ name, dir, file, version });
}

console.log(`Master: v${current}  (${root})\n`);
for (const r of rows) {
  const state =
    r.version === null ? "none"
    : r.version === "unknown" ? "unknown version"
    : compare(r.version, current) < 0 ? "behind"
    : compare(r.version, current) > 0 ? "AHEAD of master — copy it back"
    : "current";
  console.log(`${r.name.padEnd(32)} ${(r.version ?? "-").padEnd(8)} ${state}`);
}

if (apply) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const behind = rows.filter((r) => r.version && r.version !== "unknown" && compare(r.version, current) < 0);
  for (const r of behind) {
    const answer = await rl.question(`\nCopy v${current} over ${r.name}'s v${r.version}? [y/N] `);
    if (answer.trim().toLowerCase() !== "y") continue;
    copyFileSync(master, r.file);
    console.log(`  copied. Commit it in ${r.name} and re-audit its conventions.md.`);
  }
  rl.close();
}

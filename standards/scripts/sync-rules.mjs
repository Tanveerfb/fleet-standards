#!/usr/bin/env node
// Reports which project-rules.md version each project runs, and optionally copies the master in.
// Usage: node standards/scripts/sync-rules.mjs [projectsDir] [--apply]
//   projectsDir defaults to $PROJECTS_DIR, then E:\Projects.
//   --apply asks per out-of-date repo before copying the core and the files under rules/ the
//   project declares on its CLAUDE.md `Rules:` line. A project with no such line is skipped:
//   moving it onto the v4 set is sync-standards' job. Projects with no copy are reported, never
//   touched — adopting the standard is a migration (adopting-the-standard.md), not a file copy.
// Copying does not commit. The new copy must be committed in each repo, and the repo's
// conventions.md re-audited: a v2 -> v3 copy changes every section reference (CHANGELOG.md).
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";

const standards = join(dirname(fileURLToPath(import.meta.url)), "..");
const master = join(standards, "project-rules.md");
const args = process.argv.slice(2);
const apply = args.includes("--apply");
const root = resolve(args.find((a) => !a.startsWith("--")) ?? process.env.PROJECTS_DIR ?? "E:\\Projects");
const commonDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Reads the `**Version:** x.y.z` line from a rules file, or null if absent. */
function versionOf(file) {
  const match = readFileSync(file, "utf8").match(/\*\*Version:\*\*\s*([\d.]+)/);
  return match ? match[1] : null;
}

/**
 * The files under rules/ a project declares in its CLAUDE.md
 * (`Rules: app, ui, node, web · Options: firebase, trello`), or null when it has no such line.
 */
function declaredFiles(dir) {
  const file = join(dir, "CLAUDE.md");
  if (!existsSync(file)) return null;
  const line = readFileSync(file, "utf8").match(/^[-*\s]*\**Rules\**:\**\s*([^\n·]*)(?:·\s*\**Options\**:\**\s*([^\n]*))?/m);
  if (!line) return null;
  const names = (part) =>
    (part ?? "")
      .split(",")
      .map((name) => name.trim().replace(/[`*.]/g, ""))
      .filter((name) => /^[a-z-]+$/.test(name) && name !== "none");
  return [...names(line[1]).map((n) => `rules/${n}.md`), ...names(line[2]).map((n) => `rules/options/${n}.md`)];
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
    // From v4 the standard is a set: the core plus the files under rules/ a project declares
    // on the `Rules:` line of its CLAUDE.md. Copying the core alone over a single-file copy
    // would drop every section that moved out of it, so a project with no such line is left
    // for sync-standards, which asks what kind of project it is.
    const declared = declaredFiles(r.dir);
    if (!declared) {
      console.log(`  skipped: ${r.name}'s CLAUDE.md has no "Rules:" line. Run sync-standards in the project.`);
      continue;
    }
    const missing = declared.filter((f) => !existsSync(join(standards, f)));
    if (missing.length) {
      console.log(`  skipped: the master has no ${missing.join(", ")}. Fix the "Rules:" line in ${r.name}.`);
      continue;
    }
    copyFileSync(master, r.file);
    for (const f of declared) {
      mkdirSync(dirname(join(r.dir, f)), { recursive: true });
      copyFileSync(join(standards, f), join(r.dir, f));
    }
    console.log(`  copied the core and ${declared.length} file(s) under rules/. Commit them in ${r.name} and re-audit its conventions.md.`);
  }
  rl.close();
}

#!/usr/bin/env node
// Installs the fleet standard for coding agents other than Claude Code (Claude Code uses the
// `fleet` plugin instead — see README).
//   skills            -> ~/.agents/skills/<name>/  (Gemini CLI, GitHub Copilot, Cursor)
//                     -> ~/.codex/skills/<name>/   (OpenAI Codex)
//   rules, templates  -> ~/.agents/fleet/          (the skills read the standard from here)
// Usage: node standards/scripts/install-skills.mjs [--yes]
// Without --yes, asks before overwriting an installed skill that differs from this checkout.
// To update: `git pull` in this repo, then run this again.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";

const standards = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repo = resolve(standards, "..");
const skillTargets = [join(homedir(), ".agents", "skills"), join(homedir(), ".codex", "skills")];
const fleetRoot = join(homedir(), ".agents", "fleet");
const reference = ["project-rules.md", "rules", "motifs.md", "motif-gallery.html", "CHANGELOG.md", "adopting-the-standard.md", "process-x.md", "templates"];
const yes = process.argv.includes("--yes");
const rl = createInterface({ input: process.stdin, output: process.stdout });

// Inside the installed skills, `${CLAUDE_PLUGIN_ROOT}/` becomes `~/.agents/fleet/`, where this
// script puts the standard, as copy-skills-to-project.mjs does for a project's copies: only
// plugin skills get the variable substituted. A bare `${CLAUDE_PLUGIN_ROOT}` with no slash
// after it is left alone; the skills use it to tell a plugin session from a copy.
const rewrite = (text) => text.replaceAll("${CLAUDE_PLUGIN_ROOT}/", "~/.agents/fleet/");

/** Every file under `dir`, as paths relative to it. */
function filesIn(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? filesIn(join(dir, e.name)).map((f) => join(e.name, f)) : [e.name],
  );
}

/** True when the installed skill matches what this checkout would install. */
function sameSkill(a, b) {
  const target = join(b, "SKILL.md");
  return existsSync(target) && rewrite(readFileSync(join(a, "SKILL.md"), "utf8")) === readFileSync(target, "utf8");
}

/** Copies a skill folder, rewriting the plugin path in its Markdown. */
function installSkill(from, to) {
  for (const f of filesIn(from)) {
    mkdirSync(dirname(join(to, f)), { recursive: true });
    const text = readFileSync(join(from, f), "utf8");
    writeFileSync(join(to, f), f.endsWith(".md") ? rewrite(text) : text);
  }
}

// Reference files are overwritten without asking: they are copies of this repo by definition.
mkdirSync(fleetRoot, { recursive: true });
for (const item of reference) {
  cpSync(join(standards, item), join(fleetRoot, item), { recursive: true });
}

let commit = "unknown";
try {
  commit = execFileSync("git", ["-C", repo, "rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
} catch {
  // Not a git checkout (a downloaded zip); the skills fall back to "freshness unknown".
}
// The skills read this to find the checkout to `git pull` when checking for updates.
writeFileSync(
  join(fleetRoot, "INSTALLED_FROM.json"),
  JSON.stringify({ repo, commit, installedAt: new Date().toISOString() }, null, 2) + "\n",
);
console.log(`+ standard: ${fleetRoot} (commit ${commit})`);

for (const target of skillTargets) {
  mkdirSync(target, { recursive: true });
  for (const name of readdirSync(join(standards, "skills"))) {
    const from = join(standards, "skills", name);
    const to = join(target, name);
    if (existsSync(to) && sameSkill(from, to)) {
      console.log(`= ${to}: already current`);
      continue;
    }
    if (existsSync(to) && !yes) {
      // A local copy that differs may hold an edit that should go back as a proposal.
      const answer = await rl.question(`? ${to} differs from this checkout. Overwrite? [y/N] `);
      if (answer.trim().toLowerCase() !== "y") {
        console.log(`- ${to}: skipped`);
        continue;
      }
    }
    installSkill(from, to);
    console.log(`+ ${to}`);
  }
}
rl.close();
console.log("\nRestart your agent so it picks the skills up.");

#!/usr/bin/env node
// Copies the fleet skills into a project, so they load where the plugin does not: cloud
// sessions (Claude Code on the web) install no plugins, but they do load a repository's own
// `.claude/skills/`. Run by sync-standards (Step 5); not meant to be run by hand.
//
//   skills (all but new-project) -> <project>/.claude/skills/<name>/
//   files the skills read        -> <project>/.claude/fleet/
//   the two hooks                -> <project>/.claude/fleet/scripts/block-shell-writes.mjs and
//                                   after-compact.mjs, registered in
//                                   <project>/.claude/settings.json (merged: nothing else in
//                                   that file changes)
//
// Inside the copies, `${CLAUDE_PLUGIN_ROOT}/` becomes `.claude/fleet/`, a path relative to the
// project root, because only plugin skills get that variable substituted. A bare
// `${CLAUDE_PLUGIN_ROOT}` with no slash after it is left alone on purpose: the skills use it
// to tell a plugin session from a project copy.
//
// Usage: node copy-skills-to-project.mjs <projectDir> [--check]
//   --check  writes nothing; lists what would change and exits 1 if anything would.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const standards = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const check = args.includes("--check");
const projectArg = args.find((a) => !a.startsWith("--"));
if (!projectArg) {
  console.error("usage: copy-skills-to-project.mjs <projectDir> [--check]");
  process.exit(2);
}
const project = resolve(projectArg);
if (!existsSync(join(project, "project-rules.md"))) {
  console.error(`${project} has no project-rules.md: adopt the standard first.`);
  process.exit(2);
}

const SKIP_SKILLS = new Set(["new-project"]); // a project that exists is past setup
const REFERENCE = ["project-rules.md", "motifs.md", "CHANGELOG.md", "adopting-the-standard.md", "process-x.md", "templates"];
const rewrite = (text) => text.replaceAll("${CLAUDE_PLUGIN_ROOT}/", ".claude/fleet/");
const version = (readFileSync(join(standards, "project-rules.md"), "utf8").match(/^\*\*Version:\*\*\s*(\S+)/m) ?? [])[1] ?? "unknown";

/** Every file under `dir`, as paths relative to it. */
function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? files(full).map((f) => join(name, f)) : [name];
  });
}

const planned = []; // [target, content]
for (const name of readdirSync(join(standards, "skills"))) {
  if (SKIP_SKILLS.has(name)) continue;
  const from = join(standards, "skills", name);
  for (const f of files(from)) {
    const text = readFileSync(join(from, f), "utf8");
    planned.push([join(project, ".claude", "skills", name, f), f.endsWith(".md") ? rewrite(text) : text]);
  }
}
for (const item of REFERENCE) {
  const from = join(standards, item);
  const list = statSync(from).isDirectory() ? files(from).map((f) => join(item, f)) : [item];
  for (const f of list) planned.push([join(project, ".claude", "fleet", f), readFileSync(join(standards, f), "utf8")]);
}
planned.push([
  join(project, ".claude", "fleet", "README.md"),
  `# Fleet standard — project copy\n\nCopied from the fleet standard v${version} by \`sync-standards\`, together with the\nskills in \`.claude/skills/\`, so they load in cloud sessions, which install no plugins.\n\`scripts/block-shell-writes.mjs\` is the §AGENTS shell-write hook and\n\`scripts/after-compact.mjs\` asks for relay after a compact or a resume; both are registered\nin \`.claude/settings.json\`.\n\n**Do not edit these files.** The next sync overwrites them. A fix goes back to\n\`Tanveerfb/fleet-standards\` through \`propose-standard\`.\n\nThis folder is what the last sync copied, **not the master**: never compare the project's\nrules against \`.claude/fleet/project-rules.md\` to decide whether it is current.\n`,
]);

// The hooks a project carries for itself, because cloud sessions install no plugins:
//   block-shell-writes.mjs  the §AGENTS shell-write guard. Locally the plugin registers it
//                           too; both run, and a refusal from either is the same refusal.
//   after-compact.mjs       relay first after a compact or a resume. The plugin's copy stays
//                           silent when the project registers this one.
const HOOKS = [
  { file: "block-shell-writes.mjs", event: "PreToolUse", matcher: "Bash" },
  { file: "after-compact.mjs", event: "SessionStart", matcher: "compact|resume" },
];
const commandOf = (file) => `node "$CLAUDE_PROJECT_DIR/.claude/fleet/scripts/${file}"`;
for (const { file } of HOOKS) {
  planned.push([join(project, ".claude", "fleet", "scripts", file), readFileSync(join(standards, "scripts", file), "utf8")]);
}
const settingsPath = join(project, ".claude", "settings.json");
let settings = {};
let settingsReadable = true;
if (existsSync(settingsPath)) {
  try {
    settings = JSON.parse(readFileSync(settingsPath, "utf8"));
  } catch {
    settingsReadable = false;
    console.log(`! .claude/settings.json is not valid JSON: register the hooks by hand — ${HOOKS.map((h) => `${h.event} (${h.matcher}): ${commandOf(h.file)}`).join("; ")}`);
  }
}
if (settingsReadable) {
  let added = false;
  for (const { file, event, matcher } of HOOKS) {
    const command = commandOf(file);
    const registered = settings?.hooks?.[event]?.some((entry) => entry?.hooks?.some((h) => h?.command === command));
    if (registered) continue;
    settings.hooks ??= {};
    settings.hooks[event] ??= [];
    settings.hooks[event].push({ matcher, hooks: [{ type: "command", command, timeout: 10 }] });
    added = true;
  }
  if (added) planned.push([settingsPath, JSON.stringify(settings, null, 2) + "\n"]);
}

let changed = 0;
for (const [target, content] of planned) {
  const rel = relative(project, target);
  const before = existsSync(target) ? readFileSync(target, "utf8") : null;
  if (before === content) continue;
  changed++;
  console.log(`${before === null ? "+ new    " : "~ changed"} ${rel}`);
  if (!check) {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
}
console.log(changed ? `${changed} file(s) ${check ? "would change" : "written"} (fleet v${version}).` : `All copies current (fleet v${version}).`);
process.exit(check && changed ? 1 : 0);

#!/usr/bin/env node
// Copies the fleet skills into a project, so they load where the plugin does not: cloud
// sessions (Claude Code on the web) install no plugins, but they do load a repository's own
// `.claude/skills/`. Run by sync-standards (Step 5); not meant to be run by hand.
//
//   skills (all but those in SKIP_SKILLS)     -> <project>/.claude/skills/<name>/
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
// Usage: node copy-skills-to-project.mjs <projectDir> [--check | --remove-stale] [--hooks-only]
//   --check         writes nothing; lists what would change and exits 1 if anything would,
//                   a stale copy included.
//   --remove-stale  also deletes the stale copies. sync-standards runs it on the owner's yes.
//   --hooks-only    the two hooks and their registration only, for a project that declined
//                   the skill copies but keeps the hooks current. Nothing is listed as stale.
//
// A stale copy is one the standard no longer has: a file under .claude/fleet/ (the folder is
// wholly the sync's), or a file .claude/fleet/copied.json says an earlier sync wrote. That
// manifest is how a removed skill is told from the project's own skills beside it.
//
// A skill folder of the same name that no sync wrote is the project's own: it is skipped and
// listed as `= own`, never overwritten.
//
// The manifest also keeps a hash of each file as written. A copy that no longer matches its
// hash was edited in this project since the last sync, and is listed as `! edited` rather
// than `~ changed`, so a local edit is never mistaken for an update from the master.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { REFERENCE, versionIn } from "./standard.mjs";

const standards = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const check = args.includes("--check");
const hooksOnly = args.includes("--hooks-only");
const removeStale = args.includes("--remove-stale") && !check && !hooksOnly;
const projectArg = args.find((a) => !a.startsWith("--"));
if (!projectArg) {
  console.error("usage: copy-skills-to-project.mjs <projectDir> [--check | --remove-stale] [--hooks-only]");
  process.exit(2);
}
const project = resolve(projectArg);
if (!existsSync(join(project, "project-rules.md"))) {
  console.error(`${project} has no project-rules.md: adopt the standard first.`);
  process.exit(2);
}

// new-project: a project that exists is past setup. machine-inventory: the copies are for
// cloud sessions, which have no machine of the owner's to inventory. session-family: a
// family is local sessions only, and never messages a cloud one.
const SKIP_SKILLS = new Set(["new-project", "machine-inventory", "session-family"]);
const rewrite = (text) => text.replaceAll("${CLAUDE_PLUGIN_ROOT}/", ".claude/fleet/");
const version = versionIn(readFileSync(join(standards, "project-rules.md"), "utf8")) ?? "unknown";

/** Every file under `dir`, as paths relative to it. */
function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? files(full).map((f) => join(name, f)) : [name];
  });
}

// What the last sync wrote (.claude/fleet/copied.json), read first: it tells a fleet copy from
// a skill the project wrote itself under the same name.
const manifestPath = join(project, ".claude", "fleet", "copied.json");
let previous = [];
let previousHashes = {};
try {
  const parsed = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (Array.isArray(parsed?.files)) previous = parsed.files.filter((f) => typeof f === "string");
  if (parsed?.hashes && typeof parsed.hashes === "object" && !Array.isArray(parsed.hashes)) previousHashes = parsed.hashes;
} catch {}

// A skill folder of the same name that no sync recorded, and whose SKILL.md carries none of
// the paths a copy has (`.claude/fleet/`), is the project's own (a project that keeps its own
// relay or checkpoint). It is never overwritten: the owner decides what to do with it.
const ownSkills = [];
function isOwnSkill(name) {
  const dir = join(project, ".claude", "skills", name);
  if (!existsSync(dir)) return false;
  if (previous.some((f) => f.startsWith(`.claude/skills/${name}/`))) return false;
  const skillFile = join(dir, "SKILL.md");
  return !existsSync(skillFile) || !readFileSync(skillFile, "utf8").includes(".claude/fleet/");
}

const planned = []; // [target, content]
for (const name of hooksOnly ? [] : readdirSync(join(standards, "skills"))) {
  // Folders only: a stray file in skills/ is not a skill.
  if (SKIP_SKILLS.has(name) || !statSync(join(standards, "skills", name)).isDirectory()) continue;
  if (isOwnSkill(name)) {
    ownSkills.push(name);
    continue;
  }
  const from = join(standards, "skills", name);
  for (const f of files(from)) {
    const text = readFileSync(join(from, f), "utf8");
    planned.push([join(project, ".claude", "skills", name, f), f.endsWith(".md") ? rewrite(text) : text]);
  }
}
for (const item of hooksOnly ? [] : REFERENCE) {
  const from = join(standards, item);
  const list = statSync(from).isDirectory() ? files(from).map((f) => join(item, f)) : [item];
  for (const f of list) planned.push([join(project, ".claude", "fleet", f), readFileSync(join(standards, f), "utf8")]);
}
if (!hooksOnly) planned.push([
  join(project, ".claude", "fleet", "README.md"),
  `# Fleet standard — project copy\n\nCopied from the fleet standard v${version} by \`sync-standards\`, together with the\nskills in \`.claude/skills/\`, so they load in cloud sessions, which install no plugins.\n\`scripts/block-shell-writes.mjs\` is the §AGENTS shell-write hook and\n\`scripts/after-compact.mjs\` asks for relay after a compact or a resume; both are registered\nin \`.claude/settings.json\`.\n\n**Do not edit these files.** The next sync overwrites them. A fix goes back to\n\`Tanveerfb/fleet-standards\` through \`propose-standard\`.\n\nThis folder is what the last sync copied, **not the master**: never compare the project's\nrules against \`.claude/fleet/project-rules.md\` to decide whether it is current.\n`,
]);

// The hooks a project carries for itself, because cloud sessions install no plugins:
//   block-shell-writes.mjs  the §AGENTS shell-write guard. Locally the plugin registers it
//                           too; both run, and a refusal from either is the same refusal.
//   after-compact.mjs       relay first after a compact or a resume. The plugin's copy stays
//                           silent when the project registers this one.
const HOOKS = [
  { file: "block-shell-writes.mjs", event: "PreToolUse", matcher: "Bash|PowerShell" },
  // --project-copy: the script cannot always tell from paths that it is the project's copy.
  { file: "after-compact.mjs", event: "SessionStart", matcher: "compact|resume", args: " --project-copy" },
];
const commandOf = (file, args = "") => `node "$CLAUDE_PROJECT_DIR/.claude/fleet/scripts/${file}"${args}`;
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
  }
  // Valid JSON that is not an object (`null`, a list) is as unusable as invalid JSON.
  if (!settings || typeof settings !== "object" || Array.isArray(settings)) settingsReadable = false;
  if (!settingsReadable) {
    settings = {};
    console.log(`! .claude/settings.json is not a JSON object: register the hooks by hand — ${HOOKS.map((h) => `${h.event} (${h.matcher}): ${commandOf(h.file, h.args)}`).join("; ")}`);
  }
}
if (settingsReadable) {
  let added = false;
  for (const { file, event, matcher, args } of HOOKS) {
    const command = commandOf(file, args);
    const script = `.claude/fleet/scripts/${file}`;
    const list = Array.isArray(settings?.hooks?.[event]) ? settings.hooks[event] : null;
    const registered = list?.find((entry) => Array.isArray(entry?.hooks) && entry.hooks.some((h) => typeof h?.command === "string" && h.command.includes(script)));
    if (registered) {
      // An older sync registered the guard for Bash alone, or the hook without its flag:
      // bring the registration up to date in place, never add a second one.
      if (registered.matcher !== matcher) {
        registered.matcher = matcher;
        added = true;
      }
      for (const h of registered.hooks) {
        if (typeof h?.command === "string" && h.command.includes(script) && h.command !== command) {
          h.command = command;
          added = true;
        }
      }
      continue;
    }
    settings.hooks ??= {};
    const hooksOk = typeof settings.hooks === "object" && settings.hooks !== null && !Array.isArray(settings.hooks);
    if (hooksOk) settings.hooks[event] ??= [];
    if (!hooksOk || !Array.isArray(settings.hooks[event])) {
      console.log(`! .claude/settings.json has an unexpected hooks.${event}: register it by hand — ${matcher}: ${command}`);
      continue;
    }
    settings.hooks[event].push({ matcher, hooks: [{ type: "command", command, timeout: 10 }] });
    added = true;
  }
  if (added) planned.push([settingsPath, JSON.stringify(settings, null, 2) + "\n"]);
}

// What this sync writes, recorded so the next one can tell what the standard has since dropped.
const slash = (p) => p.replace(/\\/g, "/");
const plannedRel = new Set(planned.map(([target]) => slash(relative(project, target))));
plannedRel.add(slash(relative(project, manifestPath)));
const hash = (text) => createHash("sha256").update(text).digest("hex");
const fleetDir = join(project, ".claude", "fleet");
const onDisk = existsSync(fleetDir) ? files(fleetDir).map((f) => slash(join(".claude", "fleet", f))) : [];
const stale = hooksOnly ? [] : [...new Set([...onDisk, ...previous])]
  // Only inside .claude/: the manifest is a file in the repository, so never trust a path in it.
  .filter((rel) => rel.startsWith(".claude/") && !rel.split("/").includes("..") && !plannedRel.has(rel) && existsSync(join(project, rel)))
  .sort();
const settingsRel = slash(relative(project, settingsPath));
// A stale copy left in place stays on the list, so the next run still finds it.
// --hooks-only adds to what earlier syncs recorded instead of replacing it.
const recorded = [...(hooksOnly ? previous : []), ...plannedRel, ...(removeStale ? [] : stale)].filter((f) => f !== settingsRel);
// Hashes of the copies as this run writes them; settings.json is merged, so it has none.
const hashes = hooksOnly ? { ...previousHashes } : {};
for (const [target, content] of planned) {
  const rel = slash(relative(project, target));
  if (rel !== settingsRel) hashes[rel] = hash(content);
}
planned.push([manifestPath, JSON.stringify({ version, files: [...new Set(recorded)].sort(), hashes }, null, 2) + "\n"]);
const manifestRel = slash(relative(project, manifestPath));

for (const name of ownSkills) {
  console.log(`= own     .claude/skills/${name} (the project's own skill of that name: not overwritten)`);
}
let changed = 0;
for (const [target, content] of planned) {
  const rel = relative(project, target);
  const before = existsSync(target) ? readFileSync(target, "utf8") : null;
  if (before === content) continue;
  changed++;
  const known = previousHashes[slash(rel)];
  const edited = before !== null && typeof known === "string" && hash(before) !== known && slash(rel) !== manifestRel;
  console.log(`${before === null ? "+ new    " : edited ? "! edited " : "~ changed"} ${rel}${edited ? " (edited in this project since the last sync)" : ""}`);
  if (!check) {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
}
for (const rel of stale) {
  console.log(`- stale   ${rel}${removeStale ? " (removed)" : ""}`);
  if (removeStale) {
    rmSync(join(project, rel), { force: true });
    // Drop the folders the removal emptied, up to .claude/.
    for (let dir = dirname(join(project, rel)); relative(join(project, ".claude"), dir) && !relative(join(project, ".claude"), dir).startsWith(".."); dir = dirname(dir)) {
      if (readdirSync(dir).length) break;
      rmSync(dir, { recursive: true, force: true });
    }
  }
}
if (stale.length && !removeStale) {
  console.log(`${stale.length} stale cop${stale.length === 1 ? "y" : "ies"}: the standard no longer has ${stale.length === 1 ? "it" : "them"}. Ask the owner, then run again with --remove-stale.`);
}
console.log(changed ? `${changed} file(s) ${check ? "would change" : "written"} (fleet v${version}).` : `All copies current (fleet v${version}).`);
process.exit(check && (changed || stale.length) ? 1 : 0);

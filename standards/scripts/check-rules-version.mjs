#!/usr/bin/env node
// Fleet plugin update check (hooks/hooks.json, SessionStart: "startup", and "compact|resume").
//
// Tells the agent when the project's project-rules.md is older than the plugin's copy, so it
// can offer sync-standards; when a newer standard than the plugin's has been released (it
// asks GitHub for main's version line once a day: the plugin does not update itself unless
// the marketplace's auto-update is on, so without this a release reaches nobody); and when
// the files the project declares on the Rules line of its CLAUDE.md are missing or not
// imported (rules-line.mjs). Silent when the project is current and whole, when it is not on
// the standard at all, and when the owner already declined this version for this project. A
// new session is always checked; a resumed or compacted one at most once a day per project.
// Never blocks a session: any error ends in silence, and so does being offline.
//
//   node check-rules-version.mjs
//       Hook mode. Reads CLAUDE_PROJECT_DIR, CLAUDE_PLUGIN_ROOT and CLAUDE_PLUGIN_DATA.
//   node check-rules-version.mjs --decline <stateFile> <projectDir> <x.y.z>
//       Records that the owner declined <x.y.z> for <projectDir>. The hook prints the exact
//       command, with the paths filled in, because the agent's shell does not get the
//       plugin's environment variables.

import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { rulesProblems } from "./rules-line.mjs";
import { compareVersions, versionIn } from "./standard.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const parse = (s) => (/^\d+\.\d+\.\d+$/.test(s ?? "") ? s : null);
const cmp = compareVersions;
const show = (v) => v;

function readVersion(file) {
  try {
    return versionIn(readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function readState(file) {
  try {
    const state = JSON.parse(readFileSync(file, "utf8"));
    // Valid JSON that is not an object (`null`, a list) would throw on the first lookup.
    return state && typeof state === "object" && !Array.isArray(state) ? state : {};
  } catch {
    return {};
  }
}

const args = process.argv.slice(2);

if (args[0] === "--decline") {
  const [, stateFile, projectDir, version] = args;
  if (!stateFile || !projectDir || !parse(version)) {
    console.error("usage: check-rules-version.mjs --decline <stateFile> <projectDir> <x.y.z>");
    process.exit(1);
  }
  const key = resolve(projectDir);
  const state = readState(stateFile);
  state[key] = version;
  mkdirSync(dirname(stateFile), { recursive: true });
  writeFileSync(stateFile, JSON.stringify(state, null, 2) + "\n");
  console.log(`Recorded: v${version} declined for ${key}. No reminder until a newer version ships.`);
  process.exit(0);
}

const DAY = 24 * 60 * 60 * 1000;
const MASTER_URL = "https://raw.githubusercontent.com/Tanveerfb/fleet-standards/main/standards/project-rules.md";

/**
 * The version released on main, asked for at most once a day and remembered in the plugin's
 * data folder. One small public file is fetched; nothing about the project is sent. Null on
 * any failure, with no data folder to remember the answer in, or when FLEET_MASTER_URL is
 * "off". FLEET_MASTER_URL may also name a local file (the tests do).
 */
async function releasedVersion(dataDir, now) {
  const source = process.env.FLEET_MASTER_URL || MASTER_URL;
  if (source === "off" || !dataDir) return null;
  const file = join(dataDir, "update-check.json");
  const state = readState(file);
  if (parse(state.latest) && typeof state.checkedAt === "number" && now - state.checkedAt < DAY) return state.latest;
  let latest = null;
  try {
    if (/^https?:/.test(source)) {
      const response = await fetch(source, { signal: AbortSignal.timeout(3000) });
      if (response.ok) latest = versionIn(await response.text());
    } else {
      latest = readVersion(source);
    }
  } catch {}
  try {
    // A failed check is remembered too, so an offline machine is not made to wait every time.
    mkdirSync(dataDir, { recursive: true });
    writeFileSync(file, JSON.stringify({ ...state, checkedAt: now, latest: latest ?? parse(state.latest) }, null, 2) + "\n");
  } catch {}
  return latest ?? parse(state.latest);
}

/** How the session started: "startup", "resume" or "compact". Startup when it cannot be read. */
function sessionSource() {
  if (process.stdin.isTTY) return "startup";
  try {
    return JSON.parse(readFileSync(0, "utf8"))?.source ?? "startup";
  } catch {
    return "startup";
  }
}

try {
  const projectDir = resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());
  const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || resolve(here, "..");
  const project = readVersion(join(projectDir, "project-rules.md"));
  const master = readVersion(join(pluginRoot, "project-rules.md"));
  const dataDir = process.env.CLAUDE_PLUGIN_DATA;
  const now = Date.now();
  const lines = [];

  // A session that is resumed or compacted is asked at most once a day per project; a new
  // session is asked every time, as before.
  const source = sessionSource();
  const spokeFile = dataDir ? join(dataDir, "update-check.json") : null;
  const quiet = source !== "startup" && (!spokeFile || now - (readState(spokeFile).spoke?.[projectDir] ?? 0) < DAY);

  const released = project && master && !quiet ? await releasedVersion(dataDir, now) : null;
  const pluginBehind = released && cmp(master, released) < 0;
  const target = pluginBehind ? released : master;

  if (project && master && !quiet && cmp(project, target) < 0) {
    const stateFile = dataDir ? join(dataDir, "sync-declined.json") : null;
    const declined = stateFile ? parse(readState(stateFile)[projectDir]) : null;

    if (!declined || cmp(declined, target) < 0) {
      lines.push(
        ...(pluginBehind
          ? [
              `Fleet standard: v${show(released)} is released. The installed fleet plugin carries v${show(master)}, and this project's project-rules.md is v${show(project)}.`,
              "Before other work, ask the owner with the question tool whether to update now (first option, recommended: update the plugin, then sync this project; second: not now).",
              "On yes: run `claude plugin marketplace update tanveerfb`, ask the owner to run /reload-plugins, then run the sync-standards skill. It explains what changed and asks again before copying anything.",
            ]
          : [
              `Fleet standard: this project's project-rules.md is v${show(project)}; the fleet plugin carries v${show(master)}.`,
              "Before other work, ask the owner with the question tool whether to sync now (first option, recommended: run sync-standards now; second: not now).",
              "On yes, run the sync-standards skill. It explains what changed and asks again before copying anything.",
            ]),
        stateFile
          ? `On no, record it so this is not raised again until a newer version ships: node "${join(here, "check-rules-version.mjs")}" --decline "${stateFile}" "${projectDir}" ${show(target)}`
          : "On no, carry on. This reminder returns next session.",
      );
    }
  }

  // The declared set (§SCOPE): a project on the current core can still be missing a file it
  // declares, or import one it does not. Not declinable: it is a fault, not a newer version.
  if (project && !quiet) {
    let claude = null;
    try {
      claude = readFileSync(join(projectDir, "CLAUDE.md"), "utf8");
    } catch {}
    // The standard's files sitting in the project's rules/ folder, declared or not.
    const present = [];
    for (const dir of ["rules", "rules/options"]) {
      try {
        for (const name of readdirSync(join(projectDir, dir))) if (name.endsWith(".md")) present.push(`${dir}/${name}`);
      } catch {}
    }
    const problems = claude
      ? rulesProblems(
          claude,
          (file) => existsSync(join(projectDir, file)),
          (file) => existsSync(join(pluginRoot, file)),
          present,
        )
      : [];
    if (problems.length) {
      lines.push(
        "Fleet standard: this project's rules set does not match the Rules line in its CLAUDE.md:",
        ...problems.map((p) => `- ${p}`),
        "Tell the owner in one line before other work, and offer sync-standards, which puts the declared set in place.",
      );
    }
  }

  if (lines.length) {
    // Remember having spoken, so a resumed or compacted session is not asked again today.
    if (spokeFile) {
      try {
        const state = readState(spokeFile);
        mkdirSync(dirname(spokeFile), { recursive: true });
        writeFileSync(spokeFile, JSON.stringify({ ...state, spoke: { ...(state.spoke ?? {}), [projectDir]: now } }, null, 2) + "\n");
      } catch {}
    }
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: lines.join("\n") },
      }),
    );
  }
} catch {
  // Never block a session over a reminder.
}
process.exit(0);

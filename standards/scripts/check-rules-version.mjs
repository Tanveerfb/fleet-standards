#!/usr/bin/env node
// Fleet plugin startup check (hooks/hooks.json, SessionStart "startup").
//
// Tells the agent when the project's project-rules.md is older than the plugin's copy, so it
// can offer sync-standards. Silent when the project is current, when it is not on the standard
// at all, and when the owner already declined this version for this project. Never blocks a
// session: any error ends in silence.
//
//   node check-rules-version.mjs
//       Hook mode. Reads CLAUDE_PROJECT_DIR, CLAUDE_PLUGIN_ROOT and CLAUDE_PLUGIN_DATA.
//   node check-rules-version.mjs --decline <stateFile> <projectDir> <x.y.z>
//       Records that the owner declined <x.y.z> for <projectDir>. The hook prints the exact
//       command, with the paths filled in, because the agent's shell does not get the
//       plugin's environment variables.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const VERSION_LINE = /^\*\*Version:\*\*\s*(\d+)\.(\d+)\.(\d+)/m;

const parse = (s) => {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(s ?? "");
  return m ? m.slice(1).map(Number) : null;
};
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
const show = (v) => v.join(".");

function readVersion(file) {
  try {
    const m = readFileSync(file, "utf8").match(VERSION_LINE);
    return m ? m.slice(1, 4).map(Number) : null;
  } catch {
    return null;
  }
}

function readState(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
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

try {
  const projectDir = resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());
  const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || resolve(here, "..");
  const project = readVersion(join(projectDir, "project-rules.md"));
  const master = readVersion(join(pluginRoot, "project-rules.md"));

  if (project && master && cmp(project, master) < 0) {
    const dataDir = process.env.CLAUDE_PLUGIN_DATA;
    const stateFile = dataDir ? join(dataDir, "sync-declined.json") : null;
    const declined = stateFile ? parse(readState(stateFile)[projectDir]) : null;

    if (!declined || cmp(declined, master) < 0) {
      const lines = [
        `Fleet standard: this project's project-rules.md is v${show(project)}; the fleet plugin carries v${show(master)}.`,
        "Before other work, ask the owner with the question tool whether to sync now (first option, recommended: run sync-standards now; second: not now).",
        "On yes, run the sync-standards skill. It explains what changed and asks again before copying anything.",
        stateFile
          ? `On no, record it so this is not raised again until a newer version ships: node "${join(here, "check-rules-version.mjs")}" --decline "${stateFile}" "${projectDir}" ${show(master)}`
          : "On no, carry on. This reminder returns next session.",
      ];
      process.stdout.write(
        JSON.stringify({
          hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: lines.join("\n") },
        }),
      );
    }
  }
} catch {
  // Never block a session over a reminder.
}
process.exit(0);

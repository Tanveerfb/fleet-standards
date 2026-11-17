#!/usr/bin/env node
// Fleet plugin startup check (hooks/hooks.json, SessionStart "startup").
//
// Tells the agent when the project's project-rules.md is older than the plugin's copy, so it
// can offer sync-standards, and when the files the project declares on the Rules line of its
// CLAUDE.md are missing or not imported (rules-line.mjs). Silent when the project is current
// and whole, when it is not on the standard at all, and when the owner already declined this
// version for this project. Never blocks a session: any error ends in silence.
//
//   node check-rules-version.mjs
//       Hook mode. Reads CLAUDE_PROJECT_DIR, CLAUDE_PLUGIN_ROOT and CLAUDE_PLUGIN_DATA.
//   node check-rules-version.mjs --decline <stateFile> <projectDir> <x.y.z>
//       Records that the owner declined <x.y.z> for <projectDir>. The hook prints the exact
//       command, with the paths filled in, because the agent's shell does not get the
//       plugin's environment variables.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
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

try {
  const projectDir = resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd());
  const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || resolve(here, "..");
  const project = readVersion(join(projectDir, "project-rules.md"));
  const master = readVersion(join(pluginRoot, "project-rules.md"));
  const lines = [];

  if (project && master && cmp(project, master) < 0) {
    const dataDir = process.env.CLAUDE_PLUGIN_DATA;
    const stateFile = dataDir ? join(dataDir, "sync-declined.json") : null;
    const declined = stateFile ? parse(readState(stateFile)[projectDir]) : null;

    if (!declined || cmp(declined, master) < 0) {
      lines.push(
        `Fleet standard: this project's project-rules.md is v${show(project)}; the fleet plugin carries v${show(master)}.`,
        "Before other work, ask the owner with the question tool whether to sync now (first option, recommended: run sync-standards now; second: not now).",
        "On yes, run the sync-standards skill. It explains what changed and asks again before copying anything.",
        stateFile
          ? `On no, record it so this is not raised again until a newer version ships: node "${join(here, "check-rules-version.mjs")}" --decline "${stateFile}" "${projectDir}" ${show(master)}`
          : "On no, carry on. This reminder returns next session.",
      );
    }
  }

  // The declared set (§SCOPE): a project on the current core can still be missing a file it
  // declares, or import one it does not. Not declinable: it is a fault, not a newer version.
  if (project) {
    let claude = null;
    try {
      claude = readFileSync(join(projectDir, "CLAUDE.md"), "utf8");
    } catch {}
    const problems = claude
      ? rulesProblems(
          claude,
          (file) => existsSync(join(projectDir, file)),
          (file) => existsSync(join(pluginRoot, file)),
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

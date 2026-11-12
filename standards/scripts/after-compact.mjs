#!/usr/bin/env node
// Fleet relay-after-compact hook (hooks/hooks.json, SessionStart "compact|resume").
//
// A session picked up after a compact or a resume has lost, or may have lost, the state that
// was only in the conversation. The checkpoint skill keeps that state in the status doc's
// `Start here` block (its Live line), so this hook tells the new session to run relay first,
// even when a request from the owner is already waiting.
//
// Silent when the project keeps no fleet record (no docs/STATUS.md and no project-rules.md),
// on any other session source, and on every error: it never blocks a session.
//
// Two copies can be registered for one project: the plugin's, and the project's own copy that
// sync-standards adds for cloud sessions, which install no plugins. The plugin's copy stays
// silent when the project registers its own, so the instruction arrives once.
//
// Reads the hook's JSON from stdin ({ source, cwd, ... }) and CLAUDE_PROJECT_DIR.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const SOURCES = new Set(["compact", "resume"]);

try {
  const input = JSON.parse(readFileSync(0, "utf8"));
  const source = input?.source;
  if (SOURCES.has(source)) {
    const projectDir = resolve(process.env.CLAUDE_PROJECT_DIR || input?.cwd || process.cwd());
    const onTheStandard = existsSync(join(projectDir, "docs", "STATUS.md")) || existsSync(join(projectDir, "project-rules.md"));

    // Is this the plugin's copy, and does the project register one of its own?
    const projectCopy = join(projectDir, ".claude", "fleet", "scripts");
    const isProjectCopy = here === projectCopy || here.startsWith(projectCopy + sep);
    let projectRegistersIt = false;
    if (!isProjectCopy) {
      try {
        projectRegistersIt = readFileSync(join(projectDir, ".claude", "settings.json"), "utf8").includes(".claude/fleet/scripts/after-compact.mjs");
      } catch {
        // No settings file: the plugin's copy speaks.
      }
    }

    if (onTheStandard && !projectRegistersIt) {
      const lines = [
        `This session was picked up after a ${source}. Before anything else, run the full relay skill: it reads the status doc's Start here, including its Live line, the tail of decisions.md and git.`,
        "This comes first even when a request from the owner is already waiting: never skip or shorten relay for it.",
        "Give relay's report, then handle the request; if there is no request, wait for the owner's go-ahead.",
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

#!/usr/bin/env node
// PreToolUse hook for Bash — enforces project-rules.md §AGENTS: files change through the
// editor tools, never the shell. Refuses (exit 2, with the reason on stderr for the agent):
//
//   1. inline interpreter code — `python -c`, `node -e` / `--eval` / `-p` / `--print`, or
//      Python or Node reading its program from a heredoc or here-string (`python3 - <<EOF`);
//   2. a heredoc or here-string in a command that writes a file — a `>` or `>>` redirect to
//      anything but /dev/null, or `tee` with a file.
//
// A heredoc that only feeds a command's input (`git commit -F - <<'EOF'`) is allowed, as
// §AGENTS says. Heredoc bodies and quoted strings are ignored when looking, so a commit
// message or a grep pattern that mentions these things is not refused — except inside
// `sh -c` / `bash -c` / `eval`, whose quoted argument is itself a command.
//
// Registered by the plugin (hooks/hooks.json) and, for cloud sessions, which install no
// plugins, copied into each project by copy-skills-to-project.mjs. Fails open: anything it
// cannot read exits 0, because a broken guard must never stop a session.

import { readFileSync } from "node:fs";

const INTERPRETER_PY = String.raw`(?:python(?:\d+(?:\.\d+)?)?|py)(?:\.exe)?`;
const INTERPRETER_ANY = String.raw`(?:python(?:\d+(?:\.\d+)?)?|py|node)(?:\.exe)?`;
const START = String.raw`(?:^|[\s;&|(\x60$"'])(?:\S*\/)?`; // command position, optional path

const RULES = {
  python: new RegExp(`${START}${INTERPRETER_PY}\\s+(?:-[A-Za-z0-9]+\\s+)*-[A-Za-z0-9]*c\\b`, "m"),
  node: new RegExp(`${START}node(?:\\.exe)?\\s+(?:--?[A-Za-z][\\w-]*\\s+)*(?:-e|--eval|-p|--print|-pe)\\b`, "m"),
  // With a heredoc present: an interpreter given `-` or no script at all reads stdin.
  stdinProgram: new RegExp(`${START}${INTERPRETER_ANY}(?:\\s+-[A-Za-z0-9]+)*(?:\\s+-(?=\\s|$)|\\s*<<|(?=\\s*(?:$|[;&|)])))`, "m"),
  redirect: /(?:^|[^<>&\d=-])(?:\d|&)?>>?(?![&>])\s*([^\s;&|)]+)/g,
  tee: /(?:^|[\s;&|(])tee(?:\s+-\w+)*\s+(?!\/dev\/null\b)[^\s;&|)-]/m,
  shellWrapper: /(?:^|[\s;&|(])(?:(?:ba|z|da)?sh\s+(?:-\w+\s+)*-c|eval)\b/m,
};

/** Removes heredoc bodies; reports whether the command has a heredoc or here-string. */
function stripHeredocs(command) {
  const lines = command.split(/\r?\n/);
  const kept = [];
  const pending = []; // delimiters still to close, in order
  let found = false;
  for (const line of lines) {
    if (pending.length) {
      const { word, tabs } = pending[0];
      if ((tabs ? line.replace(/^\t+/, "") : line).trim() === word) pending.shift();
      continue;
    }
    kept.push(line);
    for (const m of line.matchAll(/(?<!<)<<(?!<)(-?)\s*(['"]?)([A-Za-z_][A-Za-z0-9_]*)\2/g)) {
      pending.push({ word: m[3], tabs: m[1] === "-" });
      found = true;
    }
    if (/<<</.test(line)) found = true;
  }
  return { text: kept.join("\n"), heredoc: found };
}

/** Replaces the contents of quoted strings with nothing, keeping the quotes. */
function stripQuotes(text) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "\\") {
      out += text.slice(i, i + 2);
      i++;
    } else if (c === "'") {
      const end = text.indexOf("'", i + 1);
      if (end === -1) return out + "''";
      out += "''";
      i = end;
    } else if (c === '"') {
      let j = i + 1;
      while (j < text.length && text[j] !== '"') j += text[j] === "\\" ? 2 : 1;
      out += '""';
      i = j;
    } else out += c;
  }
  return out;
}

/** The reason a command is refused, or null if it is allowed. */
function refusal(command) {
  const { text, heredoc } = stripHeredocs(command);
  const bare = stripQuotes(text);
  const looked = RULES.shellWrapper.test(bare) ? text : bare;

  if (RULES.python.test(looked)) return "inline Python code (`python -c`)";
  if (RULES.node.test(looked)) return "inline Node code (`node -e`, `--eval`, `-p`, `--print`)";
  if (heredoc && RULES.stdinProgram.test(bare)) return "Python or Node reading its program from a heredoc";
  if (heredoc) {
    const writes = [...bare.matchAll(RULES.redirect)].some((m) => !/^\/dev\/(null|stdout|stderr)$/.test(m[1]));
    if (writes || RULES.tee.test(bare)) return "a heredoc in a command that writes a file (a `>` redirect or `tee`)";
  }
  return null;
}

const MESSAGE = (why) =>
  `Refused by the fleet standard (project-rules.md §AGENTS): ${why}. Files change through ` +
  "the editor tools — Edit for an existing file, Write for a new one. A script that is " +
  "genuinely needed goes in a file (the scratchpad, or the project's tools folder) and runs " +
  "as `python path/to/script.py` or `node path/to/script.mjs`. A heredoc may still feed a " +
  "command's input, such as `git commit -F - <<'EOF'`; text that only mentions these " +
  "commands belongs in quotes or in a file (`git commit -F <file>`, the Grep tool).";

let why = null;
try {
  const input = JSON.parse(readFileSync(0, "utf8"));
  const command = input?.tool_input?.command;
  if (input?.tool_name === "Bash" && typeof command === "string") why = refusal(command);
} catch {
  process.exit(0);
}
if (why) {
  process.stderr.write(MESSAGE(why) + "\n");
  process.exit(2);
}
process.exit(0);

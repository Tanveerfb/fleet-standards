#!/usr/bin/env node
// PreToolUse hook for the Bash and PowerShell tools. Enforces §AGENTS: files change through
// the editor tools, never the shell. Refuses (exit 2, with the reason on stderr for the agent):
//
//   1. inline interpreter code: `python -c`, `node -e` / `--eval` / `-p` / `--print`, the
//      same in perl, ruby, php, bun, deno and tsx, and an interpreter given no script that
//      reads its program from a heredoc, a here-string or a pipe;
//   2. text written to a file from the shell: a heredoc or here-string in a pipeline that
//      redirects to a file or feeds `tee`, `dd of=` or `cp /dev/stdin`; `echo` or `printf`
//      redirected to a file; in PowerShell, a string or here-string sent to `Set-Content`,
//      `Add-Content`, `Out-File` or a `>` redirect, and `[IO.File]::WriteAll…`;
//   3. a file edited in place: `sed -i`, `perl -i`, `awk -i inplace`; in PowerShell,
//      `-replace` piped to `Set-Content` or `Out-File`.
//
// Allowed, as §AGENTS says: a heredoc that only feeds a command's input
// (`git commit -F - <<'EOF'`), and a command's own output captured to a file
// (`npm test > out.log`). Quoted text and heredoc bodies are not read as commands, so a
// commit message or a grep pattern that mentions these things is not refused. The exceptions
// are text the shell does run: `$(…)` and backticks inside double quotes, the argument of
// `sh -c`, `bash -lc`, `eval`, `pwsh -Command` and `Invoke-Expression`, and a heredoc fed to
// a shell.
//
// What it does not catch, and §AGENTS still forbids: an interpreter reached through `xargs`,
// `find -exec` or a variable; a script file that itself writes files; `awk … > file`; tools
// this list does not name. It is a guard against the habit, not a sandbox.
//
// Registered by the plugin (hooks/hooks.json) and, for cloud sessions, which install no
// plugins, copied into each project by copy-skills-to-project.mjs. Fails open: anything it
// cannot read exits 0, because a broken guard must never stop a session.

import { readFileSync } from "node:fs";

const NULL_DEVICE = /^(?:\/dev\/(?:null|stdout|stderr|tty|fd\/\d+)|nul|\$null)$/i;
// A shell given a command string: the quoted argument that follows is itself a command.
const SH_WRAPPER = /(?:^|\s)(?:\S*[\\/])?(?:(?:(?:ba|z|da|k)?sh(?:\.exe)?)(?:\s+-[A-Za-z-]+)*\s+-[A-Za-z]*c|eval)\s+$/;
const PS_WRAPPER = /(?:^|[\s;|({&])(?:(?:\S*[\\/])?(?:pwsh|powershell)(?:\.exe)?(?:\s+-\w+)*\s+-(?:c|command)|iex|invoke-expression)\s+$/i;
const CMD_WRAPPER = /(?:^|[\s;|({&])(?:\S*[\\/])?cmd(?:\.exe)?\s+\/c\s+$/i;
// A shell with no command string, fed a heredoc: the body is the program.
const FED_SHELL = /(?:^|\s)(?:\S*[\\/])?(?:ba|z|da|k)?sh(?:\.exe)?(?:\s+-[A-Za-z-]+)*\s*$/;
// Words that come before the command they run.
const PREFIX = new Set(["sudo", "env", "time", "command", "exec", "nohup", "winpty", "npx", "bunx", "then", "do", "else", "elif", "if", "while", "until", "!", "&", "."]);

/** What kind of command string, if any, the text before a quote says the quote holds. */
function wrapperKind(before) {
  if (SH_WRAPPER.test(before)) return "sh";
  if (PS_WRAPPER.test(before)) return "ps";
  if (CMD_WRAPPER.test(before)) return "sh";
  return null;
}

/** The contents of every `$(…)` and backtick span in a double-quoted string. */
function substitutions(text) {
  const found = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\\") {
      i++;
    } else if (text[i] === "`") {
      const end = text.indexOf("`", i + 1);
      if (end === -1) break;
      found.push(text.slice(i + 1, end));
      i = end;
    } else if (text[i] === "$" && text[i + 1] === "(" && text[i + 2] !== "(") {
      let depth = 1;
      let j = i + 2;
      for (; j < text.length && depth; j++) depth += text[j] === "(" ? 1 : text[j] === ")" ? -1 : 0;
      found.push(text.slice(i + 2, j - 1));
      i = j - 1;
    }
  }
  return found;
}

/**
 * Reads a POSIX shell command. Returns the command with quoted text blanked and heredoc
 * bodies removed, whether it has a heredoc, and every piece of text the shell would run
 * that was inside quotes or a heredoc, each tagged with the shell that runs it.
 */
function scanSh(src) {
  let code = "";
  let before = ""; // the current simple command so far, for spotting a wrapper
  let heredoc = false;
  const inner = []; // [kind, text]
  const pending = []; // heredocs whose bodies start at the next newline
  const push = (s) => {
    code += s;
    before += s;
  };
  for (let i = 0; i < src.length; ) {
    const c = src[i];
    if (c === "\\") {
      push(src.slice(i, i + 2));
      i += 2;
    } else if (c === "\n") {
      code += "\n";
      before = "";
      i++;
      while (pending.length) {
        const { word, tabs, shell } = pending.shift();
        let body = "";
        while (i < src.length) {
          let end = src.indexOf("\n", i);
          if (end === -1) end = src.length;
          const line = src.slice(i, end).replace(/\r$/, "");
          i = Math.min(end + 1, src.length);
          if ((tabs ? line.replace(/^\t+/, "") : line).trim() === word) break;
          body += line + "\n";
        }
        if (shell) inner.push(["sh", body]);
      }
    } else if (c === "'") {
      const end = src.indexOf("'", i + 1);
      const text = end === -1 ? src.slice(i + 1) : src.slice(i + 1, end);
      const kind = wrapperKind(before);
      if (kind) inner.push([kind, text]);
      push("''");
      i = end === -1 ? src.length : end + 1;
    } else if (c === '"') {
      let j = i + 1;
      let text = "";
      while (j < src.length && src[j] !== '"') {
        if (src[j] === "\\") text += src.slice(j, (j += 2));
        else text += src[j++];
      }
      const kind = wrapperKind(before);
      if (kind) inner.push([kind, text.replace(/\\(["$`\\])/g, "$1")]);
      else for (const s of substitutions(text)) inner.push(["sh", s]);
      push('""');
      i = j + 1;
    } else if (src.startsWith("$((", i)) {
      const end = src.indexOf("))", i);
      const stop = end === -1 ? src.length : end + 2;
      push(src.slice(i, stop).replace(/</g, " "));
      i = stop;
    } else if (src.startsWith("<<<", i)) {
      heredoc = true;
      push("<<<");
      i += 3;
    } else if (src.startsWith("<<", i)) {
      const m = /^<<(-?)[ \t]*(?:(['"])([^'"\n]+)\2|\\?([A-Za-z_][\w.-]*))/.exec(src.slice(i));
      if (m) {
        heredoc = true;
        pending.push({ word: m[3] ?? m[4], tabs: m[1] === "-", shell: FED_SHELL.test(before) });
        push("<<HEREDOC");
        i += m[0].length;
      } else {
        push("<<");
        i += 2;
      }
    } else if (c === "#" && (i === 0 || /\s/.test(src[i - 1]))) {
      const end = src.indexOf("\n", i);
      i = end === -1 ? src.length : end;
    } else if (c === ";" || c === "|" || c === "(" || c === ")" || c === "`" || (c === "&" && src[i - 1] !== ">" && src[i + 1] !== ">")) {
      code += c;
      before = "";
      i++;
    } else {
      push(c);
      i++;
    }
  }
  return { code, heredoc, inner };
}

/** The same for PowerShell: here-strings, its two kinds of quote, and backtick escapes. */
function scanPs(src) {
  const text = src.replace(/@(['"])[ \t]*\r?\n[\s\S]*?\r?\n[ \t]*\1@/g, " @HERE ");
  let code = "";
  let before = "";
  const inner = [];
  const push = (s) => {
    code += s;
    before += s;
  };
  for (let i = 0; i < text.length; ) {
    const c = text[i];
    if (c === "`") {
      push(text.slice(i, i + 2));
      i += 2;
    } else if (c === "'" || c === '"') {
      let j = i + 1;
      let body = "";
      while (j < text.length) {
        if (text[j] === c && text[j + 1] === c) {
          body += c;
          j += 2;
        } else if (c === '"' && text[j] === "`") {
          body += text[j + 1] ?? "";
          j += 2;
        } else if (text[j] === c) break;
        else body += text[j++];
      }
      const kind = wrapperKind(before);
      if (kind) inner.push([kind, body]);
      else if (c === '"') for (const s of substitutions(body)) inner.push(["ps", s]);
      push(c + c);
      i = j + 1;
    } else if (c === "#" && (i === 0 || /\s/.test(text[i - 1]))) {
      const end = text.indexOf("\n", i);
      i = end === -1 ? text.length : end;
    } else if (c === ";" || c === "|" || c === "\n" || c === "(" || c === ")" || c === "{" || c === "}") {
      code += c;
      before = "";
      i++;
    } else {
      push(c);
      i++;
    }
  }
  return { code, inner };
}

/** The words of one simple command, with assignments and prefix words removed. */
function words(command) {
  const all = command.trim().split(/\s+/).filter(Boolean);
  while (all.length && (/^[A-Za-z_]\w*=/.test(all[0]) || PREFIX.has(all[0].toLowerCase()) || all[0] === "{" || all[0] === "}")) all.shift();
  const name = (all[0] ?? "").replace(/^.*[\\/]/, "").replace(/\.exe$/i, "").toLowerCase();
  return { name, args: all.slice(1) };
}

// For each interpreter: the options that run inline code, the options that take a value, and
// the option after which the rest is not ours to read (`python -m module …`).
const INTERPRETERS = [
  { is: /^(?:python(?:\d+(?:\.\d+)?)?|py|pypy3?)$/, label: "Python (`python -c`)", inline: /^-[A-Za-z0-9]*c$/, valued: /^-[WX]$/, stop: /^-m$/ },
  { is: /^node(?:js)?$/, label: "Node (`node -e`, `--eval`, `-p`, `--print`)", inline: /^(?:-e|-p|-pe|-ep|--eval|--print)(?:=|$)/, valued: /^(?:-r|--require|--import|--loader|--experimental-loader|-C|--conditions)$/ },
  { is: /^(?:bun|tsx|ts-node)$/, label: "JavaScript (`-e`, `--eval`, `-p`)", inline: /^(?:-e|-p|--eval|--print)(?:=|$)/ },
  { is: /^(?:perl|ruby)$/, label: "Perl or Ruby (`-e`)", inline: /^-[A-Za-z0-9]*[eE]$/ },
  { is: /^php$/, label: "PHP (`-r`)", inline: /^-r$/ },
  { is: /^deno$/, label: "Deno (`deno eval`)", subcommand: "eval" },
];

/** Why one simple command is refused for running inline code, or null. */
function inlineCode(name, args, { fed }) {
  const lang = INTERPRETERS.find((l) => l.is.test(name));
  if (!lang) return null;
  if (lang.subcommand) return args[0] === lang.subcommand ? `inline ${lang.label} code` : null;
  let script = false;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (lang.inline.test(a)) return `inline ${lang.label} code`;
    if (lang.stop?.test(a)) return null;
    if (lang.valued?.test(a)) i++;
    else if (a === "-") break; // the program is on stdin
    else if (!a.startsWith("-") && !/^\d*[<>]/.test(a)) {
      script = true;
      break;
    }
  }
  return !script && fed ? "an interpreter reading its program from a heredoc, a here-string or a pipe" : null;
}

/** The files a simple command redirects its output to. */
function redirectsTo(command) {
  return [...command.matchAll(/(?:^|[^<>&\d=-])(?:\d|&|\*)?>>?\|?(?![&>])\s*([^\s;&|)]+)/g)].map((m) => m[1]).filter((target) => !NULL_DEVICE.test(target));
}

/** Why a POSIX shell command is refused, or null if it is allowed. */
function refusalSh(src, depth = 0) {
  if (depth > 5) return null;
  const { code, inner } = scanSh(src);
  for (const [kind, text] of inner) {
    const why = kind === "ps" ? refusalPs(text, depth + 1) : refusalSh(text, depth + 1);
    if (why) return why;
  }
  const flat = code.replace(/[()`]/g, ";").replace(/(^|\s)[{}](?=\s|$)/g, "$1;");
  for (const pipeline of flat.split(/&&|\|\||;|\n|(?<![>&|])&(?![>&])/)) {
    const fedText = /<<HEREDOC|<<</.test(pipeline);
    const commands = pipeline.split(/(?<!>)\|/);
    let writes = false;
    for (const [index, command] of commands.entries()) {
      const { name, args } = words(command);
      if (!name) continue;
      const fed = index > 0 || /<<HEREDOC|<<</.test(command);
      const inline = inlineCode(name, args, { fed });
      if (inline) return inline;
      if (/^g?sed$/.test(name) && args.some((a) => /^-[A-Za-z]*i/.test(a) || a.startsWith("--in-place"))) return "a file edited in place (`sed -i`)";
      if (name === "perl" && args.some((a) => /^-[A-Za-z0-9]*i/.test(a))) return "a file edited in place (`perl -i`)";
      if (/^g?awk$/.test(name) && args.some((a, i) => a === "-i" && args[i + 1] === "inplace")) return "a file edited in place (`awk -i inplace`)";
      const targets = redirectsTo(command);
      if ((name === "echo" || name === "printf") && targets.length) return "text written to a file with `echo` or `printf` and a redirect";
      if (targets.length) writes = true;
      if (name === "tee" && args.some((a) => !a.startsWith("-") && !NULL_DEVICE.test(a))) writes = true;
      if (name === "dd" && args.some((a) => a.startsWith("of=") && !NULL_DEVICE.test(a.slice(3)))) writes = true;
      if (/^(?:cp|mv|install)$/.test(name) && args.includes("/dev/stdin")) writes = true;
    }
    if (fedText && writes) return "a heredoc in a command that writes a file (a `>` redirect, `tee`, `dd` or `cp`)";
    if (writes && /^(?:echo|printf)$/.test(words(commands[0]).name)) return "text written to a file with `echo` or `printf` through a pipe";
  }
  return null;
}

/** Why a PowerShell command is refused, or null if it is allowed. */
function refusalPs(src, depth = 0) {
  if (depth > 5) return null;
  if (/(?:^|\s)-e(?:nc|ncodedcommand)?\s+[A-Za-z0-9+/=]{16,}/i.test(src) && /(?:pwsh|powershell)/i.test(src)) return "an encoded PowerShell command";
  const { code, inner } = scanPs(src);
  for (const [kind, text] of inner) {
    const why = kind === "ps" ? refusalPs(text, depth + 1) : refusalSh(text, depth + 1);
    if (why) return why;
  }
  if (/\[(?:System\.)?IO\.File\]::(?:WriteAll|AppendAll)/i.test(code)) return "a file written from PowerShell (`[IO.File]::WriteAll…`)";
  for (const pipeline of code.split(/&&|\|\||;|\n|[(){}]/)) {
    const commands = pipeline.split("|");
    const first = commands[0].trim();
    const literal = /^(?:""|''|@HERE)/.test(first) || /^(?:echo|write-output|write-host)\b/i.test(first) || pipeline.includes("@HERE");
    let writes = false;
    const replaces = /(?:^|\s)-c?replace\b/i.test(pipeline);
    for (const [index, command] of commands.entries()) {
      const { name, args } = words(command);
      if (!name) continue;
      const inline = inlineCode(name, args, { fed: index > 0 || command.includes("@HERE") });
      if (inline) return inline;
      const lower = args.map((a) => a.toLowerCase());
      const writer = /^(?:set-content|add-content|out-file|sc|ac)$/.test(name);
      if (writer && (index === 0 || lower.some((a) => /^-(?:value|inputobject)$/.test(a)))) return "text written to a file from PowerShell (`Set-Content`, `Add-Content`, `Out-File`)";
      if (/^(?:new-item|ni)$/.test(name) && lower.includes("-value")) return "a file written from PowerShell (`New-Item -Value`)";
      if (writer || (/^(?:tee-object|tee)$/.test(name) && args.length) || redirectsTo(command).length) writes = true;
    }
    if (writes && replaces) return "a file edited in place (`-replace` sent to `Set-Content` or `Out-File`)";
    if (writes && literal) return "text written to a file from PowerShell (a string, `echo` or a here-string sent to a file)";
  }
  return null;
}

const MESSAGE = (why) =>
  `Refused by the fleet standard (§AGENTS): ${why}. Files change through ` +
  "the editor tools — Edit for an existing file, Write for a new one. A script that is " +
  "genuinely needed goes in a file (the scratchpad, or the project's tools folder) and runs " +
  "as `python path/to/script.py` or `node path/to/script.mjs`. A heredoc may still feed a " +
  "command's input, such as `git commit -F - <<'EOF'`, and a command's own output may still " +
  "go to a file; text that only mentions these commands belongs in quotes or in a file " +
  "(`git commit -F <file>`, the Grep tool).";

let why = null;
try {
  const input = JSON.parse(readFileSync(0, "utf8"));
  const command = input?.tool_input?.command;
  if (typeof command === "string") {
    if (input?.tool_name === "Bash") why = refusalSh(command);
    else if (input?.tool_name === "PowerShell") why = refusalPs(command);
  }
} catch {
  process.exit(0);
}
if (why) {
  process.stderr.write(MESSAGE(why) + "\n");
  process.exit(2);
}
process.exit(0);

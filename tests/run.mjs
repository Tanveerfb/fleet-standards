#!/usr/bin/env node
// fleet-standards checks. CI runs this on every push and pull request
// (.github/workflows/checks.yml); run it yourself before a release:
//
//   node tests/run.mjs
//
// No dependencies. Needs git and a POSIX sh (Git for Windows has one). Prints one line per
// check and exits 1 if any failed. Behaviour evals (does an agent follow the skills?) are a
// separate, paid suite: standards/evals/README.md.

import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const S = join(repo, "standards");
const read = (p) => readFileSync(join(repo, p), "utf8");
const scratch = mkdtempSync(join(tmpdir(), "fleet-checks-"));

let failed = 0;
function check(name, pass, why = "") {
  if (pass) console.log(`ok   ${name}`);
  else {
    failed++;
    console.log(`FAIL ${name}${why ? ` — ${why}` : ""}`);
  }
}
function section(title) {
  console.log(`\n# ${title}`);
}
const run = (cmd, args, opts = {}) => spawnSync(cmd, args, { encoding: "utf8", ...opts });

/** Every git-tracked file, so ignored and generated files never count. */
const tracked = run("git", ["-C", repo, "ls-files", "-z"]).stdout.split("\0").filter(Boolean);

// ---------------------------------------------------------------------------------------------
section("Manifests parse");
for (const f of [".claude-plugin/marketplace.json", "standards/.claude-plugin/plugin.json", "standards/hooks/hooks.json"]) {
  let err = "";
  try {
    JSON.parse(read(f));
  } catch (e) {
    err = e.message;
  }
  check(f, !err, err);
}

// ---------------------------------------------------------------------------------------------
section("Skill frontmatter");
// Codex skips a skill whose description is over 1,024 characters, silently. The budget keeps
// headroom so one more trigger phrase cannot push a skill over the edge.
const DESCRIPTION_BUDGET = 800;
for (const name of readdirSync(join(S, "skills"))) {
  // A Windows checkout with autocrlf has CRLF in the working tree; the frontmatter is the same.
  const text = readFileSync(join(S, "skills", name, "SKILL.md"), "utf8").replace(/\r\n/g, "\n");
  const front = /^---\n([\s\S]*?)\n---\n/.exec(text)?.[1] ?? "";
  const skillName = /^name:\s*(.+)$/m.exec(front)?.[1]?.trim();
  const description = /^description:\s*(.+)$/m.exec(front)?.[1]?.trim() ?? "";
  check(`${name}: name matches its folder`, skillName === name, `name is "${skillName}"`);
  check(
    `${name}: description ${description.length} chars, budget ${DESCRIPTION_BUDGET}`,
    description.length > 0 && description.length <= DESCRIPTION_BUDGET,
    description.length > 1024 ? "over Codex's 1,024 limit" : "trim it",
  );
  // An unquoted YAML value cannot hold ": " or " #", or start with a quote or an indicator.
  // Claude Code then loads the skill with empty metadata, silently: it never appears in a
  // session's skill list. checkpoint and relay shipped that way until v3.9.0.
  const unsafe = /: | #/.exec(description)?.[0] ?? /^["'`@%&*!|>{\[]/.exec(description)?.[0];
  check(`${name}: description is a plain YAML value`, !unsafe, `contains ${JSON.stringify(unsafe)} — reword it`);
}

// ---------------------------------------------------------------------------------------------
section("Version agrees everywhere");
const rulesVersion = /^\*\*Version:\*\*\s*(\S+)/m.exec(read("standards/project-rules.md"))?.[1];
const [, logVersion, logDate] = /^## (\d+\.\d+\.\d+) — (\d{4}-\d{2}-\d{2})/m.exec(read("standards/CHANGELOG.md")) ?? [];
const [, readmeVersion, readmeDate] = /Current: \*\*v(\d+\.\d+\.\d+)\*\* \((\d{4}-\d{2}-\d{2})\)/.exec(read("README.md")) ?? [];
check(`rules ${rulesVersion} = changelog ${logVersion}`, rulesVersion && rulesVersion === logVersion);
check(`README ${readmeVersion} (${readmeDate}) = changelog ${logVersion} (${logDate})`, readmeVersion === logVersion && readmeDate === logDate);

// ---------------------------------------------------------------------------------------------
section("The rules set (standards/project-rules.md and standards/rules/)");
{
  // One version covers the set, and it lives in the core's header.
  const ruleFiles = tracked.filter((p) => p.startsWith("standards/rules/") && p.endsWith(".md"));
  check(`${ruleFiles.length} files under rules/`, ruleFiles.length > 0);
  const versioned = ruleFiles.filter((f) => /^\*\*Version:\*\*/m.test(read(f)));
  check("no file under rules/ carries its own version", versioned.length === 0, versioned.join(", "));

  // §SCOPE's table and the folder name the same files.
  const core = read("standards/project-rules.md");
  const named = new Set();
  for (const row of core.matchAll(/^\| (`rules\/[^|]*) \|/gm)) {
    const cells = [...row[1].matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    const folder = cells[0].slice(0, cells[0].lastIndexOf("/") + 1);
    for (const cell of cells) named.add(`standards/${cell.includes("/") ? cell : folder + cell}`);
  }
  const unlisted = ruleFiles.filter((f) => !named.has(f));
  const absent = [...named].filter((f) => !ruleFiles.includes(f));
  check("every file under rules/ is in §SCOPE's table", unlisted.length === 0, unlisted.join(", "));
  check("every file in §SCOPE's table exists", absent.length === 0, absent.join(", "));

  // Each section heading is in the set, and only a section that divides appears twice.
  const DIVIDED = new Set(["§NAMING", "§MOTION", "§BUILD", "§TESTING"]);
  const headings = ["standards/project-rules.md", ...ruleFiles].flatMap((f) => [...read(f).matchAll(/^## (§[A-Z]+) /gm)].map((m) => m[1]));
  const repeated = [...new Set(headings.filter((h, i) => headings.indexOf(h) !== i))].filter((h) => !DIVIDED.has(h));
  check(`${new Set(headings).size} sections, none repeated but the four that divide`, repeated.length === 0, repeated.join(", "));

  // The CLAUDE.md template imports only files that exist.
  const imports = [...read("standards/templates/CLAUDE.template.md").matchAll(/^@(\S+\.md)$/gm)].map((m) => m[1]);
  const dangling = imports.filter((f) => !existsSync(join(S, f)));
  check(`the CLAUDE.md template's ${imports.length} imports exist`, imports.length > 1 && dangling.length === 0, dangling.join(", "));

  // The word-for-word proof of the v4 split. Remove with tests/split-check.mjs and
  // tests/split-intended.json once v4.0.0 is released.
  const split = run("node", [join(repo, "tests", "split-check.mjs")]);
  check(split.stdout.trim().split("\n")[0], split.status === 0, split.stdout.trim().split("\n").slice(1, 6).join(" "));
}

// ---------------------------------------------------------------------------------------------
section("Motif gallery (standards/motif-gallery.html)");
{
  // motifs.md is the source: every family in its catalogue has a tile, in the same group,
  // and the gallery holds no tile for a family the catalogue does not have.
  const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const motifs = read("standards/motifs.md").replace(/\r\n/g, "\n");
  const catalogue = motifs.slice(motifs.indexOf("\n## The catalogue"), motifs.indexOf("\n## Universe-inspired"));
  const families = []; // [name, group]
  let group = "";
  for (const line of catalogue.split("\n")) {
    const heading = /^### (.+)$/.exec(line);
    if (heading) group = heading[1];
    const family = /^\*\*([^*]+)\*\* — /.exec(line);
    if (family) families.push([family[1], group]);
  }
  const stated = Number(/^(\d+) families in/m.exec(catalogue)?.[1]);
  check(`motifs.md lists ${families.length} families, as its own count says`, families.length > 0 && families.length === stated, `it says ${stated}`);

  const gallery = read("standards/motif-gallery.html");
  const tiles = [...gallery.matchAll(/\{ name: "([^"]+)", group: "([^"]+)", line: "[^"]+" \}/g)].map((m) => [m[1], m[2]]);
  const key = ([name, grp]) => `${name} (${grp})`;
  const missing = families.filter((f) => !tiles.some((t) => key(t) === key(f))).map(key);
  const extra = tiles.filter((t) => !families.some((f) => key(f) === key(t))).map(key);
  check("every family in motifs.md has a tile, in its group", missing.length === 0, missing.join(", "));
  check("no tile without a family in motifs.md", extra.length === 0, extra.join(", "));
  check("tiles are in the catalogue's order", tiles.map(key).join("|") === families.map(key).join("|"));
  const unstyled = tiles.filter(([name]) => !["light", "dark"].every((scheme) => gallery.includes(`.m-${slug(name)} .${scheme} {`))).map(([name]) => name);
  check("every tile has a light and a dark style", unstyled.length === 0, unstyled.join(", "));
}

// ---------------------------------------------------------------------------------------------
section("Links and comments in Markdown");
// Templates are skipped for links: their links point at files in the project they are copied to.
for (const f of tracked.filter((p) => p.endsWith(".md"))) {
  const text = read(f);
  if (!f.startsWith("standards/templates/")) {
    const broken = [...text.matchAll(/\]\(([^)\s]+)\)/g)]
      .map((m) => m[1])
      .filter((l) => !/^(https?:|mailto:|#)/.test(l) && !l.includes("<") && !l.includes("$"))
      .map((l) => l.split("#")[0])
      .filter((l) => l && !existsSync(resolve(dirname(join(repo, f)), l)));
    if (broken.length) check(`${f}: relative links resolve`, false, broken.join(", "));
  }
  const opens = (text.match(/<!--/g) ?? []).length;
  const closes = (text.match(/-->/g) ?? []).length;
  if (opens !== closes || text.includes("-->>")) check(`${f}: HTML comments well formed`, false, `${opens} opened, ${closes} closed`);
}
check("every Markdown file's links and comments", true);

// ---------------------------------------------------------------------------------------------
section("Credential hook (standards/templates/pre-commit)");
{
  const dir = join(scratch, "hook");
  mkdirSync(dir);
  run("git", ["init", "-q", dir]);
  const hook = join(S, "templates", "pre-commit");
  const runHook = () => run("sh", [hook], { cwd: dir }).status;

  // Every tracked file in this repository — the hook's own docs quote its trigger words.
  for (const f of tracked) {
    mkdirSync(dirname(join(dir, f)), { recursive: true });
    cpSync(join(repo, f), join(dir, f));
  }
  run("git", ["add", "-A"], { cwd: dir });
  check("passes this repository's own files", runHook() === 0, "a doc or template trips the pattern");
  run("git", ["rm", "-r", "-q", "--cached", "."], { cwd: dir });

  // Fakes are assembled here, so no credential-shaped text sits in this file.
  const k = (n, c = "a") => c.repeat(n);
  const fakes = {
    "service-account JSON with a PEM value": `{"type": "service_account", "private` + `_key": "-----BEGIN ` + `PRIVATE KEY-----\\nMIIE${k(24, "Q")}"}`,
    "key field with a 30-char value": `{"private` + `_key": "${k(30)}"}`,
    "PEM header": "-----BEGIN RSA " + "PRIVATE KEY-----",
    "stream key": "stream_key" + ` = "live_${k(16)}"`,
    "API_KEY= assignment": "API_KEY" + `=${k(20)}`,
    "apiKey in code": "const apiKey" + ` = '${k(20)}';`,
    "sk- token": "OPENAI=" + "sk" + `-${k(24)}`,
    "Google API key": "key: " + "AI" + `za${k(35, "B")}`,
    "Discord webhook URL": "hook = https://discord" + `.com/api/webhooks/${k(18, "1")}/${k(40)}`,
    "Discord webhook URL, old domain": "https://discordapp" + `.com/api/webhooks/${k(18, "1")}/${k(40)}`,
    "Google OAuth client secret": "secret: " + "GOC" + `SPX-${k(28)}`,
  };
  for (const [label, line] of Object.entries(fakes)) {
    writeFileSync(join(dir, "fake.txt"), line + "\n");
    run("git", ["add", "fake.txt"], { cwd: dir });
    check(`blocks: ${label}`, runHook() === 1);
    run("git", ["rm", "-q", "--cached", "fake.txt"], { cwd: dir });
  }
  writeFileSync(join(dir, "prose.md"), 'A fake "private' + '_key": JSON tested the hook; "private_key": "short".\n');
  run("git", ["add", "prose.md"], { cwd: dir });
  check("passes: prose describing the hook", runHook() === 0);
  writeFileSync(join(dir, "prose.md"), "Invite: https://discord.com/invite/abc and the docs at discord.com/developers/docs/resources/webhook.\n");
  run("git", ["add", "prose.md"], { cwd: dir });
  check("passes: a Discord link that is not a webhook", runHook() === 0);
}

// ---------------------------------------------------------------------------------------------
section("Relay after compact (standards/scripts/after-compact.mjs)");
{
  const script = join(S, "scripts", "after-compact.mjs");
  const project = (name, files = {}) => {
    const dir = join(scratch, name);
    for (const [f, text] of Object.entries(files)) {
      mkdirSync(dirname(join(dir, f)), { recursive: true });
      writeFileSync(join(dir, f), text);
    }
    mkdirSync(dir, { recursive: true });
    return dir;
  };
  const hook = (dir, input, from = script) => run("node", [from], { input, env: { ...process.env, CLAUDE_PROJECT_DIR: dir } });
  const context = (r) => {
    try {
      return JSON.parse(r.stdout).hookSpecificOutput.additionalContext;
    } catch {
      return "";
    }
  };
  const withStatus = project("compact-status", { "docs/STATUS.md": "# status\n" });
  const withRules = project("compact-rules", { "project-rules.md": "**Version:** 3.9.0\n" });
  const bare = project("compact-bare");

  const compact = hook(withStatus, JSON.stringify({ source: "compact" }));
  check("compact: emits valid SessionStart JSON asking for the full relay", context(compact).includes("after a compact") && context(compact).includes("full relay skill"));
  check("compact: says relay comes before a waiting request", context(compact).includes("even when a request from the owner is already waiting"));
  check("resume: names the resume", context(hook(withRules, JSON.stringify({ source: "resume" }))).includes("after a resume"));
  check("startup: silent", hook(withStatus, JSON.stringify({ source: "startup" })).stdout === "");
  check("clear: silent", hook(withStatus, JSON.stringify({ source: "clear" })).stdout === "");
  check("a project with no status doc and no rules: silent", hook(bare, JSON.stringify({ source: "compact" })).stdout === "");
  const broken = hook(withStatus, "{not json");
  check("unreadable input: silent, exit 0", broken.stdout === "" && broken.status === 0);

  // The plugin's copy defers to a copy the project registers for itself; that copy speaks.
  const own = project("compact-own", {
    "docs/STATUS.md": "# status\n",
    ".claude/settings.json": JSON.stringify({ hooks: { SessionStart: [{ matcher: "compact|resume", hooks: [{ type: "command", command: 'node "$CLAUDE_PROJECT_DIR/.claude/fleet/scripts/after-compact.mjs"' }] }] } }),
  });
  const ownScript = join(own, ".claude", "fleet", "scripts", "after-compact.mjs");
  mkdirSync(dirname(ownScript), { recursive: true });
  cpSync(script, ownScript);
  check("the plugin's copy is silent where the project registers its own", hook(own, JSON.stringify({ source: "compact" })).stdout === "");
  check("the project's own copy speaks", context(hook(own, JSON.stringify({ source: "compact" }), ownScript)).includes("full relay skill"));
}

// ---------------------------------------------------------------------------------------------
section("Startup check (standards/scripts/check-rules-version.mjs)");
{
  const script = join(S, "scripts", "check-rules-version.mjs");
  const rules = (dir, v) => {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "project-rules.md"), `# Project Rules\n**Version:** ${v}\n`);
    return dir;
  };
  const behind = rules(join(scratch, "behind"), "3.4.0");
  const current = rules(join(scratch, "current"), rulesVersion);
  const none = join(scratch, "none");
  mkdirSync(none);
  const data = join(scratch, "data");
  const state = join(data, "sync-declined.json");
  const hook = (project, withData = true) =>
    run("node", [script], {
      env: { ...process.env, CLAUDE_PROJECT_DIR: project, CLAUDE_PLUGIN_ROOT: S, ...(withData ? { CLAUDE_PLUGIN_DATA: data } : {}) },
    });
  const decline = (v) => run("node", [script, "--decline", state, behind, v]);

  const out = hook(behind);
  let ctx = "";
  try {
    ctx = JSON.parse(out.stdout).hookSpecificOutput.additionalContext;
  } catch {}
  check("behind: emits valid SessionStart JSON naming both versions", ctx.includes("v3.4.0") && ctx.includes(`v${rulesVersion}`));
  check("current: silent", hook(current).stdout === "" && hook(current).status === 0);
  check("not on the standard: silent", hook(none).stdout === "");
  check("decline is recorded", decline(rulesVersion).status === 0 && JSON.parse(readFileSync(state, "utf8"))[behind] === rulesVersion);
  check("declined version: silent", hook(behind).stdout === "");
  decline("3.5.0");
  check("newer than the declined version: speaks again", hook(behind).stdout.includes("additionalContext"));
  check("no data folder: falls back to asking every session", hook(behind, false).stdout.includes("This reminder returns next session"));
  check("bad --decline arguments: exit 1", run("node", [script, "--decline", "x", "y"]).status === 1);
  writeFileSync(state, "{not json");
  check("corrupt state file: still speaks, never crashes", hook(behind).status === 0 && hook(behind).stdout.includes("additionalContext"));
}

// ---------------------------------------------------------------------------------------------
section("Shell-write hook (standards/scripts/block-shell-writes.mjs)");
{
  const script = join(S, "scripts", "block-shell-writes.mjs");
  const hook = (command, tool = "Bash") => run("node", [script], { input: JSON.stringify({ tool_name: tool, tool_input: { command } }) });
  const blocked = {
    "python -c": `python3 -c "open('a','w').write('x')"`,
    "python with combined flags": "python -Bc 'print(1)'",
    "py launcher": "py -3 -c 'print(1)'",
    "node -e": `node -e "require('fs').writeFileSync('a','x')"`,
    "node --eval": "node --eval 'x'",
    "node -p after a cd": "cd app && node -p 1",
    "python reading a heredoc": "python3 - <<'EOF'\nprint(1)\nEOF",
    "node fed a heredoc through a pipe": "cat <<EOF | node\nconsole.log(1)\nEOF",
    "heredoc into a file": "cat > notes.md <<'EOF'\n# hi\nEOF",
    "heredoc appended to a file": "cat <<EOF >> log.txt\nx\nEOF",
    "heredoc into tee": "tee out.txt <<EOF\nx\nEOF",
    "here-string into a file": `cat <<< "x" > f.txt`,
    "python -c inside bash -c": `bash -c "python -c 'print(1)'"`,
    // Found by the v4 audit (2026-11-13): each of these passed the guard.
    "a shell wrapper with combined flags": `bash -lc "node -e 1"`,
    "eval of a quoted command": `eval "python3 -c 1"`,
    "a flag with a value before -c": "python -W ignore -c 1",
    "the py launcher with a dotted version": "py -3.12 -c 1",
    "node with an = option before -e": "node --input-type=module -e 1",
    "node with a valued option before -e": "node --require ./a.js -e 1",
    "a substitution inside double quotes": `x="$(python3 -c 1)"`,
    "a substitution inside an echo": `echo "$(node -e 1)"`,
    "backticks inside double quotes": 'echo "`node -e 1`"',
    "a quoted << does not hide the next line": `echo "a <<X"\nnode -e "1"`,
    "an arithmetic shift does not hide the next line": "echo $((a<<b))\npython3 -c 1",
    "a shell fed a heredoc": "sh <<EOF\npython3 -c 1\nEOF",
    "a heredoc with an escaped delimiter into a file": "cat <<\\EOF > out.txt\nx\nEOF",
    "a heredoc forced over a file": "cat <<EOF >| out.txt\nx\nEOF",
    "a heredoc into dd": "cat <<EOF | dd of=out.txt\nx\nEOF",
    "a heredoc into cp": "cat <<EOF | cp /dev/stdin out.txt\nx\nEOF",
    "node fed by a pipe": "echo 1 | node",
    "perl -e": "perl -e 'print 1'",
    "ruby -e": "ruby -e 'puts 1'",
    "bun -e": "bun -e 1",
    "tsx through npx": "npx tsx -e 1",
    "deno eval": "deno eval 1",
    "sed -i": "sed -i s/a/b/ file.txt",
    "sed with a combined -i": "sed -Ei.bak s/a/b/ file.txt",
    "perl -pi": "perl -pi -e s/a/b/ file.txt",
    "awk in place": "awk -i inplace '{print}' file.txt",
    "printf redirected to a file": `printf "x\\n" > notes.md`,
    "echo appended to a file": "echo hello >> notes.md",
    "echo through tee": "echo hello | tee notes.md",
    "PowerShell run from Bash": `pwsh -Command "node -e 1"`,
  };
  for (const [label, command] of Object.entries(blocked)) {
    const r = hook(command);
    check(`blocks: ${label}`, r.status === 2 && r.stderr.includes("§AGENTS"), `exit ${r.status}`);
  }
  const allowed = {
    "a heredoc commit message that mentions both": "git commit -F - <<'EOF'\nfeat: no python -c > never node -e\nEOF",
    "a heredoc commit message, output discarded": "git commit -q -F - <<EOF > /dev/null\nmsg\nEOF",
    "a quoted commit message": `git commit -m "no more node -e or python -c"`,
    "a grep for the pattern": `grep -rn "python -c" .`,
    "a script file": "python tools/x.py && node scripts/sync.mjs --check",
    "a script fed a heredoc": "python3 script.py <<EOF\ninput\nEOF",
    "a redirect with no heredoc": "npm test 2>&1 | tail -5 > /dev/null",
    "version checks": "node --version && python3 --version",
    // Found by the v4 audit: each of these was wrongly refused.
    "a commit heredoc run from a folder named python": "cd services/python && git commit -F - <<EOF\nmsg\nEOF",
    "a commit heredoc, then a grep for node": "git commit -F - <<EOF && git log --oneline | grep node\nmsg\nEOF",
    "eval of something harmless, then a quoted mention": `eval "$(ssh-agent)" && git commit -m "no python -c"`,
    "a grep for a heredoc marker, output kept": `grep -rn "<<EOF" . > hits.txt`,
    "a commit heredoc, then another command's output kept": "git commit -F - <<EOF\nmsg\nEOF\nnpm test > out.log",
    "a heredoc command with its output sent to NUL": "gh pr create --body-file - <<EOF > NUL\nbody\nEOF",
    "a command's own output kept": "git diff > changes.patch",
    "a module run": "python -m http.server 8000",
    "a script with a -c of its own": "python tools/build.py -c release",
    "node's test runner": "node --test",
    "echo to stderr": `echo "failed" >&2`,
    "echo with its errors discarded": "echo ok 2>/dev/null",
    "sed without -i": "sed -n 1,5p file.txt",
    "a function and a loop": `t(){ printf '%s' "$1" | node tools/x.mjs >/dev/null 2>&1; }; for f in a b; do t "$f"; done`,
    "a comment that mentions it": "ls # then never node -e",
  };
  for (const [label, command] of Object.entries(allowed)) {
    const r = hook(command);
    check(`allows: ${label}`, r.status === 0, `exit ${r.status}: ${r.stderr.trim()}`);
  }

  // PowerShell is the primary shell on Windows and was not guarded at all before v4.
  const blockedPs = {
    "node -e": "node -e 1",
    "python -c after a cd": "cd app; python -c 'print(1)'",
    "a substitution inside double quotes": `Write-Host "$(node -e 1)"`,
    "Invoke-Expression": `iex "python -c 1"`,
    "a nested PowerShell": `powershell -NoProfile -Command "node -e 1"`,
    "Bash run from PowerShell": `bash -lc "node -e 1"`,
    "a here-string into a file": "@'\nhello\n'@ | Set-Content notes.md",
    "a here-string redirected": '@"\nhello\n"@ > notes.md',
    "a here-string into node": "@'\nconsole.log(1)\n'@ | node",
    "a string piped to Out-File": `"hello" | Out-File notes.md`,
    "a string redirected": `"hello" > notes.md`,
    "echo redirected": "echo hello >> notes.md",
    "Set-Content with a value": `Set-Content -Path notes.md -Value "hello"`,
    "Add-Content with a positional value": `Add-Content notes.md "hello"`,
    "New-Item with a value": `New-Item notes.md -Value "hello"`,
    "an in-place replace": `(Get-Content a.txt) -replace 'a','b' | Set-Content a.txt`,
    "the .NET file API": `[System.IO.File]::WriteAllText("a.txt", "x")`,
  };
  for (const [label, command] of Object.entries(blockedPs)) {
    const r = hook(command, "PowerShell");
    check(`PowerShell blocks: ${label}`, r.status === 2 && r.stderr.includes("§AGENTS"), `exit ${r.status}`);
  }
  const allowedPs = {
    "a command's own output kept": "git diff | Out-File changes.patch",
    "all streams of a test run kept": "npm test *> out.log",
    "output discarded": "node tools/x.mjs > $null",
    "a quoted mention": `git commit -m "no more node -e or Set-Content"`,
    "a search for the pattern": `Select-String -Pattern "python -c" -Path *.md`,
    "a here-string as a commit message": "git commit -m @'\nfeat: never node -e > file\n'@",
    "reading a file": "Get-Content notes.md -TotalCount 5",
    "a new folder": "New-Item -ItemType Directory -Force out",
    "a script file": "python tools/x.py; node scripts/sync.mjs --check",
    "version checks": "node --version; python --version",
    "a replace that is only shown": `(Get-Content a.txt) -replace 'a','b' | Select-Object -First 3`,
  };
  for (const [label, command] of Object.entries(allowedPs)) {
    const r = hook(command, "PowerShell");
    check(`PowerShell allows: ${label}`, r.status === 0, `exit ${r.status}: ${r.stderr.trim()}`);
  }
  check("ignores other tools", hook("python -c 1", "Write").status === 0);
  check("the plugin registers it for both shells", read("standards/hooks/hooks.json").includes('"matcher": "Bash|PowerShell"'));
  check("unreadable input: fails open", run("node", [script], { input: "{not json" }).status === 0);
}

// ---------------------------------------------------------------------------------------------
section("Skill copies (standards/scripts/copy-skills-to-project.mjs)");
{
  const script = join(S, "scripts", "copy-skills-to-project.mjs");
  const project = join(scratch, "project");
  mkdirSync(project);
  writeFileSync(join(project, "project-rules.md"), `**Version:** ${rulesVersion}\n`);
  const copy = (...a) => run("node", [script, project, ...a]);

  check("--check on a fresh project: reports changes, exit 1, writes nothing", copy("--check").status === 1 && !existsSync(join(project, ".claude")));
  check("write: exit 0", copy().status === 0);
  check("--check after writing: exit 0", copy("--check").status === 0);
  check("new-project is not copied", !existsSync(join(project, ".claude", "skills", "new-project")));
  const skills = readdirSync(join(project, ".claude", "skills"));
  const texts = skills.map((s) => readFileSync(join(project, ".claude", "skills", s, "SKILL.md"), "utf8"));
  check("no ${CLAUDE_PLUGIN_ROOT}/ path survives the rewrite", texts.every((t) => !t.includes("${CLAUDE_PLUGIN_ROOT}/")));
  const paths = [...new Set(texts.flatMap((t) => [...t.matchAll(/\.claude\/fleet\/[A-Za-z0-9./_-]*[A-Za-z0-9]/g)].map((m) => m[0])))];
  const missing = paths.filter((p) => !p.startsWith(".claude/fleet/scripts/") && !existsSync(join(project, p)));
  check(`every rewritten path exists (${paths.length} checked; scripts run from the clone by design)`, missing.length === 0, missing.join(", "));
  appendFileSync(join(project, ".claude", "skills", "relay", "SKILL.md"), "local edit\n");
  check("a copy edited in place is caught by --check", copy("--check").status === 1);
  check("a project with no rules file: exit 2", run("node", [script, join(scratch, "none")]).status === 2);

  const settingsOf = (p) => JSON.parse(readFileSync(join(p, ".claude", "settings.json"), "utf8"));
  const hookEntries = (p) => (settingsOf(p).hooks?.PreToolUse ?? []).filter((e) => e.hooks?.some((h) => h.command.includes("block-shell-writes.mjs")));
  check("the shell-write hook is copied", existsSync(join(project, ".claude", "fleet", "scripts", "block-shell-writes.mjs")));
  check("the hook is registered once in .claude/settings.json", hookEntries(project).length === 1);
  check("for both shells", hookEntries(project)[0]?.matcher === "Bash|PowerShell");
  {
    // A project synced before v4 has the guard on Bash alone: the next sync widens it.
    const file = join(project, ".claude", "settings.json");
    const old = settingsOf(project);
    old.hooks.PreToolUse.find((e) => e.hooks?.some((h) => h.command.includes("block-shell-writes.mjs"))).matcher = "Bash";
    writeFileSync(file, JSON.stringify(old, null, 2) + "\n");
    check("an older Bash-only registration is reported by --check", copy("--check").status === 1);
    copy();
    check("and widened to both shells, still registered once", hookEntries(project).length === 1 && hookEntries(project)[0].matcher === "Bash|PowerShell");
  }
  const compactEntries = (p) => (settingsOf(p).hooks?.SessionStart ?? []).filter((e) => e.hooks?.some((h) => h.command.includes("after-compact.mjs")));
  check("the relay-after-compact hook is copied", existsSync(join(project, ".claude", "fleet", "scripts", "after-compact.mjs")));
  check("it is registered once, on compact|resume", compactEntries(project).length === 1 && compactEntries(project)[0].matcher === "compact|resume");
  check("process-x.md is copied for the rules to point at", existsSync(join(project, ".claude", "fleet", "process-x.md")));
  copy();
  check("a second run does not register either twice", hookEntries(project).length === 1 && compactEntries(project).length === 1);

  const existing = join(scratch, "existing");
  mkdirSync(join(existing, ".claude"), { recursive: true });
  writeFileSync(join(existing, "project-rules.md"), `**Version:** ${rulesVersion}\n`);
  const before = { enabledPlugins: { "fleet@tanveerfb": true }, hooks: { PreToolUse: [{ matcher: "Write", hooks: [{ type: "command", command: "x" }] }] } };
  writeFileSync(join(existing, ".claude", "settings.json"), JSON.stringify(before));
  run("node", [script, existing]);
  const after = settingsOf(existing);
  check(
    "existing settings are kept when the hooks are merged in",
    after.enabledPlugins["fleet@tanveerfb"] === true && after.hooks.PreToolUse.length === 2 && hookEntries(existing).length === 1 && compactEntries(existing).length === 1,
  );
  writeFileSync(join(existing, ".claude", "settings.json"), "{not json");
  const broken = run("node", [script, existing]);
  check("unreadable settings are left alone, with a warning", readFileSync(join(existing, ".claude", "settings.json"), "utf8") === "{not json" && broken.stdout.includes("register the hooks by hand"));
}

rmSync(scratch, { recursive: true, force: true });
console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);

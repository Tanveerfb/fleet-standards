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
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

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
// A hook that says nothing on purpose exits 0; one that crashed also says nothing, so a
// silence check that ignores the exit status passes on a crash (audit B9).
const silent = (result) => result.stdout === "" && result.status === 0;

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
  const DIVIDED = new Set(["§NAMING", "§MOTION", "§BUILD", "§TESTING", "§RUNTIME", "§STATE", "§PACKAGES"]);
  const headings = ["standards/project-rules.md", ...ruleFiles].flatMap((f) => [...read(f).matchAll(/^## (§[A-Z]+) /gm)].map((m) => m[1]));
  const repeated = [...new Set(headings.filter((h, i) => headings.indexOf(h) !== i))].filter((h) => !DIVIDED.has(h));
  check(`${new Set(headings).size} sections, none repeated but the ${DIVIDED.size} that divide`, repeated.length === 0, repeated.join(", "));

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
  check("startup: silent", silent(hook(withStatus, JSON.stringify({ source: "startup" }))));
  check("clear: silent", silent(hook(withStatus, JSON.stringify({ source: "clear" }))));
  check("a project with no status doc and no rules: silent", silent(hook(bare, JSON.stringify({ source: "compact" }))));
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
  check("the plugin's copy is silent where the project registers its own", silent(hook(own, JSON.stringify({ source: "compact" }))));
  check("the project's own copy speaks", context(hook(own, JSON.stringify({ source: "compact" }), ownScript)).includes("full relay skill"));
  // Through a symlink or junction the path check can fail; the registered flag still says
  // which copy this is (audit B12). Run from the plugin's path, so only the flag can tell.
  const flagged = run("node", [script, "--project-copy"], { input: JSON.stringify({ source: "compact" }), env: { ...process.env, CLAUDE_PROJECT_DIR: own } });
  check("--project-copy speaks where the paths do not show it is the project's copy", context(flagged).includes("full relay skill"));
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
  check("current: silent", silent(hook(current)));
  check("not on the standard: silent", silent(hook(none)));
  check("decline is recorded", decline(rulesVersion).status === 0 && JSON.parse(readFileSync(state, "utf8"))[behind] === rulesVersion);
  check("declined version: silent", silent(hook(behind)));
  decline("3.5.0");
  check("newer than the declined version: speaks again", hook(behind).stdout.includes("additionalContext"));
  check("no data folder: falls back to asking every session", hook(behind, false).stdout.includes("This reminder returns next session"));
  check("bad --decline arguments: exit 1", run("node", [script, "--decline", "x", "y"]).status === 1);
  writeFileSync(state, "{not json");
  check("corrupt state file: still speaks, never crashes", hook(behind).status === 0 && hook(behind).stdout.includes("additionalContext"));
  writeFileSync(state, "null");
  check("a state file holding null: still speaks", hook(behind).stdout.includes("additionalContext"));
  check("and --decline over it records the version", decline(rulesVersion).status === 0 && JSON.parse(readFileSync(state, "utf8"))[behind] === rulesVersion);

  // The declared set (rules-line.mjs): a current core with the set wrong is not silent.
  const setProject = (name, claude, files) => {
    const dir = rules(join(scratch, name), rulesVersion);
    writeFileSync(join(dir, "CLAUDE.md"), claude);
    for (const f of files) {
      mkdirSync(dirname(join(dir, f)), { recursive: true });
      writeFileSync(join(dir, f), "x\n");
    }
    return dir;
  };
  const whole = setProject(
    "set-whole",
    "@project-rules.md\n@rules/app.md\n@rules/node.md\n- **Rules**: app, node · Options: ai\nRead `rules/options/ai.md` before AI work.\n",
    ["rules/app.md", "rules/node.md", "rules/options/ai.md"],
  );
  check("declared set whole, ai read on demand: silent", silent(hook(whole)));
  const credit = setProject("set-credit", "@rules/app.md\n- **Rules**: app · Options: credit\n", ["rules/app.md", "rules/options/credit.md"]);
  check("the credit option, not imported and not named: silent (the skills read it)", silent(hook(credit)));
  const creditImported = setProject("set-credit-imported", "@rules/app.md\n@rules/options/credit.md\n- **Rules**: app · Options: credit\n", ["rules/app.md", "rules/options/credit.md"]);
  check("the credit option imported: speaks (it is read on demand)", hook(creditImported).stdout.includes("read on demand, not imported"));
  const missing = setProject("set-missing", "@rules/app.md\n@rules/web.md\n- **Rules**: app, web\n", ["rules/app.md"]);
  const said = hook(missing).stdout;
  check("a declared file missing on a current core: speaks", said.includes("rules/web.md is declared but missing"));
  const stray = setProject("set-stray", "@rules/app.md\n@rules/ui.md\n- **Rules**: app\n", ["rules/app.md", "rules/ui.md"]);
  check("an import the Rules line does not declare: speaks", hook(stray).stdout.includes("imports rules/ui.md, which the Rules line does not declare"));
  const unimported = setProject("set-unimported", "@rules/app.md\n- **Rules**: app, node\n", ["rules/app.md", "rules/node.md"]);
  check("a declared file not imported: speaks", hook(unimported).stdout.includes("rules/node.md is declared but not imported"));
  const unknownName = setProject("set-unknown", "@rules/app.md\n- **Rules**: app, gaem\n", ["rules/app.md"]);
  check("a name the standard has no file for: speaks", hook(unknownName).stdout.includes("rules/gaem.md, which the standard does not have"));
  const noLine = setProject("set-no-line", "# A v3 project\n", []);
  check("no Rules line: silent (the version check covers it)", silent(hook(noLine)));
}

// ---------------------------------------------------------------------------------------------
section("One reference list, one version reader, the manifests (standards/scripts/standard.mjs)");
{
  const { REFERENCE, versionIn, compareVersions } = await import(pathToFileURL(join(S, "scripts", "standard.mjs")).href);
  const missingRef = REFERENCE.filter((f) => !existsSync(join(S, f)));
  check(`the ${REFERENCE.length} reference files and folders exist`, missingRef.length === 0, missingRef.join(", "));
  check("versionIn reads the line", versionIn("# Rules\n**Version:** 3.10.2\n") === "3.10.2");
  check("versionIn ignores a version that does not start a line", versionIn("see **Version:** 1.2.3") === null);
  check("versionIn rejects a four-part version", versionIn("**Version:** 3.9.0.1") === null);
  check("compareVersions is numeric (3.10.0 after 3.9.9)", compareVersions("3.10.0", "3.9.9") > 0 && compareVersions("4.0.0", "4.0.0") === 0);
  const skills = readdirSync(join(S, "skills")).sort();
  for (const manifest of [".claude-plugin/marketplace.json", "standards/.claude-plugin/plugin.json"]) {
    const text = read(manifest);
    const unnamed = skills.filter((s) => !text.includes(s));
    check(`${manifest} names all ${skills.length} skills`, unnamed.length === 0, unnamed.join(", "));
  }
  const scriptsUsingAList = ["copy-skills-to-project.mjs", "install-skills.mjs"].filter((f) => /\[\s*"project-rules\.md",/.test(read(`standards/scripts/${f}`)));
  check("no script keeps its own copy of the reference list", scriptsUsingAList.length === 0, scriptsUsingAList.join(", "));
}

// ---------------------------------------------------------------------------------------------
section("The Rules line reader (standards/scripts/rules-line.mjs)");
{
  const { parseRulesLine, rulesImports } = await import(pathToFileURL(join(S, "scripts", "rules-line.mjs")).href);
  const p = parseRulesLine("- **Rules**: app, UI, node, web · Options: Firebase, trello\n");
  check(
    "names are lower-cased, options under rules/options/",
    JSON.stringify(p?.files) ===
      JSON.stringify(["rules/app.md", "rules/ui.md", "rules/node.md", "rules/web.md", "rules/options/firebase.md", "rules/options/trello.md"]),
    JSON.stringify(p),
  );
  check("Options: none is no options", JSON.stringify(parseRulesLine("Rules: non-application · Options: none")?.files) === JSON.stringify(["rules/non-application.md"]));
  check("a name that is not a file name is reported, not dropped", JSON.stringify(parseRulesLine("Rules: app, ui/x")?.unknown) === JSON.stringify(["ui/x"]));
  check("no line: null", parseRulesLine("# nothing here") === null);
  const declined = parseRulesLine("Rules: app, node · Options: trello, no-firebase, No-AI");
  check(
    "a declined option (no-<name>) is recorded, not read as a file",
    JSON.stringify(declined?.files) === JSON.stringify(["rules/app.md", "rules/node.md", "rules/options/trello.md"]) && JSON.stringify(declined?.declined) === JSON.stringify(["firebase", "ai"]),
    JSON.stringify(declined),
  );
  check("imports read one per line", JSON.stringify(rulesImports("@project-rules.md\n@rules/app.md\n@./rules/ui.md\ntext @rules/no.md\n")) === JSON.stringify(["rules/app.md", "rules/ui.md"]));
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
    // Found by the Fable review (2026-11-18): each of these passed the guard.
    "python -c through uv run": "uv run python -c 1",
    "python -c through uv run with an option": "uv run --with rich python -c 1",
    "python -c through timeout": "timeout 15 python -c 1",
    "node -e through pnpm exec": "pnpm exec node -e 1",
    "a quoted interpreter path": `"C:/Program Files/Python314/python.exe" -c 1`,
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
    // Found by the Fable review (2026-11-18): each of these was wrongly refused.
    "perl with an include path": "perl -Ilib script.pl",
    "ruby with a required library ending in e": "ruby -rbundle x.rb",
    "a runner running a script": "uv run python tools/x.py && pnpm exec vitest run",
    "a quoted script path": `"C:/Program Files/nodejs/node.exe" tools/x.mjs`,
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
    // Found by the Fable review (2026-11-18): each of these passed the guard.
    "a replace inside a script block": `Get-Content a.txt | % { $_ -replace 'a','b' } | Set-Content a.txt`,
    "a quoted interpreter after the call operator": `& "C:\\Program Files\\Python314\\python.exe" -c 1`,
    "python -c through uv run": "uv run python -c 1",
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
    // Found by the Fable review (2026-11-18): wrongly refused as Set-Content's alias.
    "the service controller": "sc.exe query wuauserv",
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
  check("with --project-copy, so the script knows which copy it is", compactEntries(project)[0].hooks[0].command.endsWith(" --project-copy"));
  {
    // A project synced before the flag: the next sync updates the command, never adds one.
    const file = join(project, ".claude", "settings.json");
    const old = settingsOf(project);
    old.hooks.SessionStart.find((e) => e.hooks?.some((h) => h.command.includes("after-compact.mjs"))).hooks[0].command =
      'node "$CLAUDE_PROJECT_DIR/.claude/fleet/scripts/after-compact.mjs"';
    writeFileSync(file, JSON.stringify(old, null, 2) + "\n");
    check("a registration without the flag is reported by --check", copy("--check").status === 1);
    copy();
    check("and updated in place, still registered once", compactEntries(project).length === 1 && compactEntries(project)[0].hooks[0].command.endsWith(" --project-copy"));
  }
  check("process-x.md is copied for the rules to point at", existsSync(join(project, ".claude", "fleet", "process-x.md")));
  copy();
  check("a second run does not register either twice", hookEntries(project).length === 1 && compactEntries(project).length === 1);

  // A local edit told from a master update (Fable's review, R7).
  {
    const manifest = join(project, ".claude", "fleet", "copied.json");
    const relay = join(project, ".claude", "skills", "relay", "SKILL.md");
    const original = readFileSync(relay, "utf8");
    check("copied.json keeps a hash per copy", typeof JSON.parse(readFileSync(manifest, "utf8")).hashes?.[".claude/skills/relay/SKILL.md"] === "string");
    writeFileSync(relay, original + "\nA local edit.\n");
    const edited = copy("--check");
    check("a copy edited in the project: listed as edited", edited.stdout.replaceAll("\\", "/").includes("! edited  .claude/skills/relay/SKILL.md"), edited.stdout);
    // As if the last sync had written this text: then the master moved, not the project.
    const m = JSON.parse(readFileSync(manifest, "utf8"));
    m.hashes[".claude/skills/relay/SKILL.md"] = createHash("sha256").update(readFileSync(relay, "utf8")).digest("hex");
    writeFileSync(manifest, JSON.stringify(m));
    const updated = copy("--check");
    check("a copy the master changed: listed as changed", updated.stdout.replaceAll("\\", "/").includes("~ changed .claude/skills/relay/SKILL.md"), updated.stdout);
    writeFileSync(relay, original);
    copy();
  }

  // Copies the standard has since dropped (audit B10).
  {
    const manifest = join(project, ".claude", "fleet", "copied.json");
    const listed = JSON.parse(readFileSync(manifest, "utf8")).files;
    check("copied.json lists what the sync wrote, settings.json excluded", listed.includes(".claude/skills/relay/SKILL.md") && !listed.includes(".claude/settings.json"));
    const gone = join(project, ".claude", "skills", "retired-skill");
    mkdirSync(gone, { recursive: true });
    writeFileSync(join(gone, "SKILL.md"), "old\n");
    const own = join(project, ".claude", "skills", "projects-own");
    mkdirSync(own, { recursive: true });
    writeFileSync(join(own, "SKILL.md"), "mine\n");
    writeFileSync(join(project, ".claude", "fleet", "old-reference.md"), "old\n");
    writeFileSync(join(project, "outside.md"), "keep\n");
    const m = JSON.parse(readFileSync(manifest, "utf8"));
    m.files.push(".claude/skills/retired-skill/SKILL.md", "outside.md", ".claude/../outside.md");
    writeFileSync(manifest, JSON.stringify(m));
    const report = copy("--check");
    check(
      "--check names a dropped skill and a dropped fleet file, exit 1",
      report.status === 1 && report.stdout.includes("stale   .claude/skills/retired-skill/SKILL.md") && report.stdout.includes("stale   .claude/fleet/old-reference.md"),
      report.stdout,
    );
    check("a skill of the project's own is never stale", !report.stdout.includes("projects-own"));
    check("a manifest path outside .claude/ is ignored", !report.stdout.includes("outside.md"));
    const plain = copy();
    check("a plain run reports them and removes nothing", plain.stdout.includes("--remove-stale") && existsSync(join(gone, "SKILL.md")));
    copy("--remove-stale");
    check("--remove-stale removes them and the folders they emptied", !existsSync(gone) && !existsSync(join(project, ".claude", "fleet", "old-reference.md")));
    check("and leaves the project's own files", existsSync(join(own, "SKILL.md")) && existsSync(join(project, "outside.md")));
    check("--check is clean afterwards", copy("--check").status === 0);
  }

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
  writeFileSync(join(existing, ".claude", "settings.json"), "null");
  const nulled = run("node", [script, existing]);
  check("settings holding null: a warning, no crash, the file left alone", nulled.status === 0 && nulled.stdout.includes("register the hooks by hand") && readFileSync(join(existing, ".claude", "settings.json"), "utf8") === "null", nulled.stderr);
  writeFileSync(join(existing, ".claude", "settings.json"), JSON.stringify({ hooks: "x" }));
  const oddHooks = run("node", [script, existing]);
  check("a hooks value that is not an object: a warning, no crash", oddHooks.status === 0 && oddHooks.stdout.includes("register it by hand"), oddHooks.stderr);
}

// ---------------------------------------------------------------------------------------------
section("Every registered hook names a script that exists");
{
  // Rename a script and every other test still passes; these do not.
  const scriptsIn = (text) => [...text.matchAll(/scripts\/([\w-]+\.mjs)/g)].map((m) => m[1]);
  const plugin = scriptsIn(read("standards/hooks/hooks.json"));
  check(`hooks.json: ${plugin.length} commands, each script in standards/scripts/`, plugin.length >= 3 && plugin.every((f) => existsSync(join(S, "scripts", f))), plugin.join(", "));
  const own = scriptsIn(read(".claude/settings.json"));
  check(`this repository's .claude/settings.json: ${own.length} command(s), each script exists`, own.length >= 1 && own.every((f) => existsSync(join(S, "scripts", f))), own.join(", "));
  const hooksBlock = /const HOOKS = \[([\s\S]*?)\];/.exec(read("standards/scripts/copy-skills-to-project.mjs"))?.[1] ?? "";
  const copied = [...hooksBlock.matchAll(/file: "([\w-]+\.mjs)"/g)].map((m) => m[1]);
  check(`the copy script's ${copied.length} hooks each exist`, copied.length >= 2 && copied.every((f) => existsSync(join(S, "scripts", f))), copied.join(", "));
}

// ---------------------------------------------------------------------------------------------
section("Fleet-wide report (standards/scripts/sync-rules.mjs)");
{
  const script = join(S, "scripts", "sync-rules.mjs");
  const projects = join(scratch, "projects");
  const make = (name, version, claude) => {
    const dir = join(projects, name);
    mkdirSync(dir, { recursive: true });
    if (version) writeFileSync(join(dir, "project-rules.md"), `**Version:** ${version}\n`);
    if (claude) writeFileSync(join(dir, "CLAUDE.md"), claude);
    return dir;
  };
  const declared = make("a-declared", "3.0.0", "@rules/app.md\n@rules/ui.md\n- **Rules**: app, UI, ga me · Options: none\n");
  mkdirSync(join(declared, "rules"));
  writeFileSync(join(declared, "rules", "app.md"), "x\n");
  const undeclared = make("b-undeclared", "3.0.0", "# no rules line\n");
  make("c-current", rulesVersion);
  make("d-none");
  const report = run("node", [script, projects]);
  const row = (name) => report.stdout.split("\n").find((l) => l.startsWith(name)) ?? "";
  check("report: exit 0", report.status === 0, report.stderr);
  check("report: behind, current and none told apart", row("a-declared").includes("behind") && row("c-current").includes("current") && row("d-none").includes("none"));
  check("report: copies nothing", readFileSync(join(declared, "project-rules.md"), "utf8").includes("3.0.0") && !existsSync(join(undeclared, "rules")));
  check("report: an upper-case name is read as the file (UI is rules/ui.md, missing here)", report.stdout.includes("rules/ui.md is declared but missing"), report.stdout);
  check("report: a name it cannot match is printed, not dropped", report.stdout.includes('names "ga me"'));
  run("node", [script, projects, "--apply"], { input: "y\ny\n" });
  check("--apply is gone: it copies nothing either", readFileSync(join(declared, "project-rules.md"), "utf8").includes("3.0.0") && !existsSync(join(declared, "rules", "ui.md")));
  check("a missing projects folder: exit 1", run("node", [script, join(scratch, "no-such-folder")]).status === 1);
}

// ---------------------------------------------------------------------------------------------
section("Install for other agents (standards/scripts/install-skills.mjs)");
{
  const script = join(S, "scripts", "install-skills.mjs");
  const home = join(scratch, "home");
  mkdirSync(home);
  const install = () => run("node", [script, "--yes"], { env: { ...process.env, HOME: home, USERPROFILE: home } });
  const first = install();
  const fleet = join(home, ".agents", "fleet");
  const skills = readdirSync(join(S, "skills"));
  check("exit 0", first.status === 0, first.stderr);
  check("the core and the rules files land in ~/.agents/fleet", existsSync(join(fleet, "project-rules.md")) && existsSync(join(fleet, "rules", "web.md")) && existsSync(join(fleet, "rules", "options", "ai.md")));
  check("INSTALLED_FROM.json names this checkout", JSON.parse(readFileSync(join(fleet, "INSTALLED_FROM.json"), "utf8")).repo === repo);
  check(
    `all ${skills.length} skills land in both skill folders`,
    skills.every((n) => existsSync(join(home, ".agents", "skills", n, "SKILL.md")) && existsSync(join(home, ".codex", "skills", n, "SKILL.md"))),
  );
  const installed = readFileSync(join(home, ".agents", "skills", "sync-standards", "SKILL.md"), "utf8");
  // Absolute, not `~/`: the skills quote their paths, and a quoted ~ is never expanded.
  const fleetPath = fleet.replaceAll("\\", "/");
  check("the plugin path is rewritten to the absolute ~/.agents/fleet/", !installed.includes("${CLAUDE_PLUGIN_ROOT}/") && !installed.includes("~/.agents/fleet/project-rules.md") && installed.includes(`${fleetPath}/project-rules.md`));
  check("the scripts and the master skills land beside the rules", existsSync(join(fleet, "scripts", "copy-skills-to-project.mjs")) && existsSync(join(fleet, "skills", "sync-standards", "SKILL.md")));
  const second = install();
  check("a second run finds every skill current", (second.stdout.match(/already current/g) ?? []).length === skills.length * 2, second.stdout);
  // With no terminal (an agent's shell), a skill that differs is skipped and said, never a hang.
  writeFileSync(join(home, ".agents", "skills", "relay", "SKILL.md"), "edited here\n");
  const noTerminal = run("node", [script], { input: "", env: { ...process.env, HOME: home, USERPROFILE: home } });
  check("no terminal: a differing skill is skipped and said", noTerminal.status === 0 && noTerminal.stdout.includes("skipped (no terminal") && readFileSync(join(home, ".agents", "skills", "relay", "SKILL.md"), "utf8") === "edited here\n", noTerminal.stdout + noTerminal.stderr);
}

rmSync(scratch, { recursive: true, force: true });
console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);

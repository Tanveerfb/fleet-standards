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
  const text = readFileSync(join(S, "skills", name, "SKILL.md"), "utf8");
  const front = /^---\n([\s\S]*?)\n---\n/.exec(text)?.[1] ?? "";
  const skillName = /^name:\s*(.+)$/m.exec(front)?.[1]?.trim();
  const description = /^description:\s*(.+)$/m.exec(front)?.[1]?.trim() ?? "";
  check(`${name}: name matches its folder`, skillName === name, `name is "${skillName}"`);
  check(
    `${name}: description ${description.length} chars, budget ${DESCRIPTION_BUDGET}`,
    description.length > 0 && description.length <= DESCRIPTION_BUDGET,
    description.length > 1024 ? "over Codex's 1,024 limit" : "trim it",
  );
}

// ---------------------------------------------------------------------------------------------
section("Version agrees everywhere");
const rulesVersion = /^\*\*Version:\*\*\s*(\S+)/m.exec(read("standards/project-rules.md"))?.[1];
const [, logVersion, logDate] = /^## (\d+\.\d+\.\d+) — (\d{4}-\d{2}-\d{2})/m.exec(read("standards/CHANGELOG.md")) ?? [];
const [, readmeVersion, readmeDate] = /Current: \*\*v(\d+\.\d+\.\d+)\*\* \((\d{4}-\d{2}-\d{2})\)/.exec(read("README.md")) ?? [];
check(`rules ${rulesVersion} = changelog ${logVersion}`, rulesVersion && rulesVersion === logVersion);
check(`README ${readmeVersion} (${readmeDate}) = changelog ${logVersion} (${logDate})`, readmeVersion === logVersion && readmeDate === logDate);

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
}

rmSync(scratch, { recursive: true, force: true });
console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);

# Maintaining fleet-standards

Notes for the maintainer. Users of the standard need only the [README](../README.md).

## The rule that keeps this repo worth having

A file under `standards/` is the master; a copy in a project is a copy, and copies go stale.
**Improve a file here, bump the rules version, then let projects sync.** Never fix a copy in
place in one project and leave this one behind — that is how the fleet once ran three
versions of the same rules file at once.

## Releasing a change

- **`project-rules.md`** — bump `**Version:**` (patch for wording, minor for an addition or
  loosening, major for a removal or anything that breaks section references) and add a
  `CHANGELOG.md` entry saying *why*. Never rename or renumber a section anchor as a side
  effect.
- **Skills, templates** — no version bump. The plugin has no `version` field on purpose, so
  every commit to `main` is an update for anyone with auto-update on.
- **`motifs.md`** — adding or changing a family or variant needs no rules version bump, but
  gets a line in `CHANGELOG.md` and the counts in the README kept true.
- **Adding a skill** — a folder under `standards/skills/` is picked up by the plugin and by
  `install-skills.mjs` automatically. Also: the skills table in the README, the skill list in
  both plugin descriptions (`.claude-plugin/marketplace.json`,
  `standards/.claude-plugin/plugin.json`), and — if the skill reads a new file from the
  standard — that file in the `reference` list in `install-skills.mjs`. Keep the description
  under 1,024 characters; Codex skips longer ones.
- **The startup check** — `standards/hooks/hooks.json` runs
  `standards/scripts/check-rules-version.mjs` when a session starts. It prints only when the
  project's rules are behind the plugin's copy and the owner has not declined that version;
  declines live in `${CLAUDE_PLUGIN_DATA}/sync-declined.json`, keyed by project path. It
  must stay silent on every error and never block a session. Test it by pointing
  `CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT` and `CLAUDE_PLUGIN_DATA` at a scratch folder.
  Claude Code only: cloud sessions and other agents rely on `relay` Step 4.6 instead.
- **Skill copies** — `standards/scripts/copy-skills-to-project.mjs` copies the skills into a
  project for cloud sessions, rewriting `${CLAUDE_PLUGIN_ROOT}/` to `.claude/fleet/`. Keep
  every reference to a standard file in a skill in that `${CLAUDE_PLUGIN_ROOT}/<file>` form
  so the rewrite catches it. A bare `${CLAUDE_PLUGIN_ROOT}` with no slash is left alone; the
  skills use it to tell a plugin session from a project copy.
- Run `claude plugin validate .` before pushing. Its one expected warning is the missing
  `version`.

## Checks

- **`node tests/run.mjs`** — manifests parse; skill names match their folders and
  descriptions stay within an 800-character budget (Codex skips one over 1,024, silently);
  the version agrees in the rules file, the changelog and the README; relative links resolve
  and HTML comments close; the credential hook passes every tracked file and blocks eight
  fake key shapes; both scripts behave in every case. **CI runs it on every push and pull
  request** (`.github/workflows/checks.yml`), with `claude plugin validate .`.
- **Behaviour evals** — `standards/evals/`, six cases on the riskiest behaviour (relay's
  trigger, the git step per *Deploys* value, skill proposals). They cost model usage, so they
  are run by hand before releasing a change to a skill or to §GIT; the README there has the
  command. A failing case is a skill that reads ambiguously or a case asking the wrong
  question — never loosen a grader to get green.
- **This repo runs its own credential hook.** In each clone, once:
  `git config core.hooksPath standards/templates`.
- **Status and decisions.** `docs/STATUS.md` is where the work is; `decisions.md` at the root
  records why, with the alternatives turned down. `relay` and `checkpoint` read and write
  them here as in any project.

## Fleet-wide drift report

```
node standards/scripts/sync-rules.mjs [projectsDir]
```

Lists the rules version in every project folder under `projectsDir` (default
`$PROJECTS_DIR`, then `E:\Projects`). `--apply` offers to copy the master over each
out-of-date copy. It never commits, and never touches a project with no copy — adopting the
standard is a migration, not a file copy. Per project, `sync-standards` does the same job with
more care; this script is for the overview.

## Known drift

The survey of which of the maintainer's projects run which rules version is kept privately,
with the project plans. The lessons from it apply to anyone running the standard across
several projects:

- **v3 references sections by name (`§GIT`), not number.** Every v2.x copy uses numbers, and
  v2.0.0 numbers differ again from v2.2.0+. Translate with the map in
  `standards/CHANGELOG.md` when a project is next audited.
- **Newer is not automatically a superset.** v2.1.0 dropped a Firebase section and a package
  manager section that v2.0.0 had. Before copying the rules over an older copy, check what
  the newer version *dropped*, not just what it added.
- **The drift detector** is each project's `conventions.md`, whose first line names the
  version it was audited against. Versions differ ⇒ the audit is stale, visible at a glance.

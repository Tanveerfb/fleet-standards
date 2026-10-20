---
name: sync-standards
description: Use inside a project to bring it up to the latest fleet standard from the fleet-standards repo — e.g. "sync standards", "sync to the latest standard", "update project rules", "are we on the latest rules", "check standards drift". Compares the project's project-rules.md with the fleet plugin's copy, explains what changed and what was dropped, then on approval copies the new rules in, translates section references, and wires the project to the fleet plugin. Never commits.
---

# Sync standards

> **Outside Claude Code** (Codex, Copilot, Cursor, Gemini CLI): this skill is written in
> Claude Code's terms; map them to your own. If `${CLAUDE_PLUGIN_ROOT}` appears unsubstituted
> anywhere below, the standard's files are in `~/.agents/fleet/` instead. "The question tool"
> means your own ask-the-user tool, or a short question with numbered options in plain text.
> Named MCP tools (`mcp__github__*`, `mcp__Trello__*`) mean whatever GitHub or Trello
> integration you have — an MCP server, `gh` — and with none, say so and skip that step.
> Never skip a step silently because a Claude-specific name did not match.

Brings one project up to the fleet standard. The master copies ship inside this plugin:

- Rules: `${CLAUDE_PLUGIN_ROOT}/project-rules.md`
- History and the v2 → v3 section map: `${CLAUDE_PLUGIN_ROOT}/CHANGELOG.md`
- Templates: `${CLAUDE_PLUGIN_ROOT}/templates/`
- Adoption guide: `${CLAUDE_PLUGIN_ROOT}/adopting-the-standard.md`

Skills come from the plugin and update with it — **except in cloud sessions, which install
no plugins.** So Step 5 also copies the skills into the project's own `.claude/skills/`, and
the files they read into `.claude/fleet/`. Those copies are refreshed on every sync.

**This skill never commits.** Git follows §GIT — the owner calls it with `git checkpoint`.

## Step 0 — Make sure the plugin copy is current

**First: are you running the project's own copy of this skill?** If the paths above read
`.claude/fleet/` rather than an absolute plugin path, you are (a cloud session, or a machine
without the plugin). `.claude/fleet/` holds what the last sync copied, **not the master** —
comparing against it always says "current". Shallow-clone the master instead:

```bash
git clone --depth 1 https://github.com/Tanveerfb/fleet-standards "<a temporary folder>"
```

For the rest of this run, read every `.claude/fleet/` path in this skill from that clone's
`standards/` folder, and run its scripts from there. If the clone fails, say the master is
unreachable from this session and stop. Then skip to Step 1.

The plugin copy is only as fresh as the last plugin update. Run, in Bash:

```bash
claude plugin marketplace update tanveerfb
```

If it reports an update, this session is still running the old copy: tell the owner to run
`/reload-plugins` and invoke this skill again, then stop. If the command is unavailable (a
cloud session, an SDK host), say the freshness of the plugin copy is unverified and carry on.

**Outside Claude Code**, the standard was installed by `install-skills.mjs`. Read
`~/.agents/fleet/INSTALLED_FROM.json` for the `fleet-standards` checkout it came from, then run
`git -C <repo> pull` and `node <repo>/standards/scripts/install-skills.mjs`. If either
changed anything, tell the owner to restart the agent and invoke this skill again, then stop.

## Step 1 — Read both versions

- The master's version: the `**Version:**` line of `${CLAUDE_PLUGIN_ROOT}/project-rules.md`.
- The project's: the same line of `project-rules.md` at the project root.

Then branch:

| Project copy | Meaning | Do |
| --- | --- | --- |
| **None** | Not on the standard at all | Stop. This is an adoption, not a sync — a migration that writes `conventions.md` and changes no code. Point at `adopting-the-standard.md` and ask whether to start it. |
| **Same version, same content** | Current | Say so, then Step 5 only. |
| **Same version, different content** | Edited in place inside this project | Show the diff. That edit is either a fix the master should get — offer `propose-standard` — or a local divergence that belongs in `conventions.md`. Never overwrite it silently. |
| **Older** | Behind | Steps 2–6. |
| **Newer than the master** | The master is behind, or the plugin copy is stale | Stop and say which. Never downgrade. |

## Step 2 — Explain what changes

Read the `CHANGELOG.md` entries between the two versions and tell the owner, briefly:

- **What was added or changed** that affects this project specifically. Skip what does not.
- **What was dropped** — newer is not automatically a superset. A dropped rule this project
  relied on is the one thing a sync can silently break.
- **Section references.** If the jump crosses v2 → v3, every `§<number>` in this project's
  docs becomes a name. Count them: `grep -rn "§[0-9]" --include=*.md .`
- **Granted exceptions this touches.** Read `conventions.md`: an exception against a rule
  that changed may now be moot, or may now need restating.

## Step 3 — Ask once

Put the plan to the owner with the question tool: apply the sync, or not. One question,
with the summary from Step 2 as context. On a no, stop and leave everything untouched.

## Step 4 — Apply

1. Copy `${CLAUDE_PLUGIN_ROOT}/project-rules.md` over the project's copy.
2. Translate numeric section references with the map in `CHANGELOG.md`, in `CLAUDE.md` and
   `conventions.md`. **Never edit `decisions.md`** — it is append-only, and an old entry's
   reference is history, readable through the map.
3. Do **not** change `conventions.md`'s `Audited against` line. The audit has not been
   redone; the version mismatch is the drift detector telling the truth. Offer the re-audit
   as a separate piece of work (`adopting-the-standard.md`, section 1).
4. Apply what the new version asks of project files, asking where a value is the owner's —
   for v3: a `Trello board: <url or none>` line in `CLAUDE.md` (§TRELLO), and removing
   working-agreement bullets from `CLAUDE.md` that now live in §OWNER. For v3.1: a `Motif:`
   line in `CLAUDE.md`, and — if `design-system.md` records no motif — offer to run
   `design-motif`, which records the project's existing look rather than re-choosing it.
   For v3.5: if the owner names a studio in `~/.claude/CLAUDE.md` and the project is deployed
   with a shareable link, ask once whether it carries the studio credit (§CREDIT) and record
   a `Studio credit:` line in `CLAUDE.md`; a local-only project gets `local only — not asked`.

## Step 5 — Wire the project to every agent

**Claude Code on the owner's machine.** Check `.claude/settings.json` registers the
marketplace and enables the plugin, so local sessions load the skills and the startup check.
Add what is missing, merging with whatever the file already holds:

```json
{
  "extraKnownMarketplaces": {
    "tanveerfb": { "source": { "source": "github", "repo": "Tanveerfb/fleet-standards" } }
  },
  "enabledPlugins": { "fleet@tanveerfb": true }
}
```

**Cloud sessions.** They install no plugins, so copy the skills into the project:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/copy-skills-to-project.mjs" "<project root>" --check
```

`--check` writes nothing and lists what would change. **A copy that changed although the
master did not was edited in place** — treat it like an edited rules file (Step 1): show the
diff, offer `propose-standard`, never overwrite it silently. Otherwise run the same command
without `--check`. It writes every skill but `new-project` to `.claude/skills/` and the files
they read to `.claude/fleet/`. On the owner's machine each skill then appears twice, as
`/checkpoint` and `/fleet:checkpoint`; that is expected, and they behave the same.

**Other agents.** Check the project root has `AGENTS.md` (read by Codex, Copilot and Cursor)
and `GEMINI.md` (Gemini CLI), each holding the pointer from
`${CLAUDE_PLUGIN_ROOT}/templates/AGENTS.template.md`. `CLAUDE.md` stays the one file with
content; these only point at it. If a tool already generated an `AGENTS.md` (Next.js does,
inside a `<!-- BEGIN:… -->` block), add the pointer above the block and never edit inside it.

## Step 6 — Report

- Version moved from → to, or "already current".
- Files changed, with the count of references translated, and the skill copies written.
- Anything left for the owner: re-audit offered, exceptions to revisit, values asked for.
- **Not committed.** It lands at the next checkpoint.

## Common mistakes

- Running a sync on a project with no rules copy. That is an adoption and needs the audit.
- Overwriting a copy that was edited in place. That edit is information — propose it or
  record it, never lose it.
- Bumping `Audited against` because the rules file was copied. Copying is not auditing.
- Rewriting `decisions.md` references. Append-only means append-only.
- Comparing the project against `.claude/fleet/project-rules.md`. That is the project's own
  copy from the last sync, so it always matches. The master is the plugin or the clone.

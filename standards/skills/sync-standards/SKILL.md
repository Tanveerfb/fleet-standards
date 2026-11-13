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

- Rules: `${CLAUDE_PLUGIN_ROOT}/project-rules.md` (the core) and the files under
  `${CLAUDE_PLUGIN_ROOT}/rules/`. One version, in the core's header, covers the set
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
- The files the project loads: the `Rules:` line in its `CLAUDE.md`
  (`Rules: app, ui, node, web · Options: firebase, trello`) names them, as `rules/<name>.md`
  and `rules/options/<name>.md`. "Content" below means the core and each of those files,
  compared with the master's. No `Rules:` line means the project is still on the single
  file from before v4: Step 4 moves it onto the set.

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

1. Copy `${CLAUDE_PLUGIN_ROOT}/project-rules.md` over the project's copy, and each file the
   `Rules:` line declares from `${CLAUDE_PLUGIN_ROOT}/rules/` into the project's `rules/`.
   Copy only what is declared. **A project with no `Rules:` line** is coming from the single
   file: do the v4 step below first, so nothing that moved out of the core is lost.
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
   For v3.8 (replacing v3.5's credit step): if the owner's `~/.claude/CLAUDE.md` has a
   `Studio credit:` line and the project's `CLAUDE.md` lacks either the `Studio credit:` or
   the `Studio showcase:` line — or says `local only — not asked` — ask the missing §CREDIT
   questions once (credit; showcase, if the owner's line names one) and record the answers
   in `CLAUDE.md` and `decisions.md`. A showcase yes files the request issue as `new-project`
   Step 1 describes. With no `Studio credit:` line in the owner's file, write `no studio
   configured` and ask nothing.
   For v3.9:
   - **`.gitattributes` (§GIT).** If the project has `.sh` files or a `.githooks/` folder and
     nothing pins them to LF, add the lines from
     `${CLAUDE_PLUGIN_ROOT}/templates/.gitattributes` — to the project's own `.gitattributes`
     if it has one, never over it.
   - **The *Deploys* line names the working branch** on a multi-branch project. If it does
     not, ask which branch it is and write it in; never work it out from the branches that
     exist.
   - **History out of the files agents read (§DOCS).** Do not move anything here. Say what
     the next checkpoint will do — the session log moves from `docs/STATUS.md` to
     `docs/log.md` — and, if `CLAUDE.md` or an area file carries history ("was", superseded
     numbers, dated runs), offer the split to `docs/record/` as its own piece of work.
   - **`decisions.md`'s "declined, never again" index.** Offer to add it at the top, built
     from the entries that record something the owner ruled out. The entries are not edited.
   - **A game in an engine** still carrying its own profile block in `conventions.md`: offer
     to replace it with the game-engine profile block from the conventions template (§SCOPE),
     keeping anything the project's block says that the profile does not.

   For v4 (the rules file became a set; §SCOPE has the tables):
   - **Which files the project loads.** Work out its kind from the repository (a Next.js
     app, a Node tool, a tool in another language, a game in an engine, no application code)
     and whether it has a visual surface, then **confirm it with the owner in one question**
     before copying. Write the `Rules:` line beside *Deploys* in `CLAUDE.md` and one
     `@rules/<name>.md` import per file under `@project-rules.md`
     (`${CLAUDE_PLUGIN_ROOT}/templates/CLAUDE.template.md` shows both).
   - **The options, asked once each.** Studio credit and Trello follow the lines `CLAUDE.md`
     already has (a board URL, a credit or showcase yes): those projects get the option
     without a question. Firebase and AI: say what the repository shows (a `firebase`
     dependency, a `lib/ai/` folder) and ask. Record each answer on the `Rules:` line's
     `Options:` part, `none` if none. An option is imported like any other file, except
     `ai`, which is read on demand: add the template's "read `rules/options/ai.md` before
     any work on an AI feature" line instead of an import, and the same line in
     `src/lib/ai/CLAUDE.md` (create it if the folder exists and the file does not), which
     loads by itself when AI code is read.
   - **A profile project** (non-application or game-engine) that references the rules file
     instead of importing it now imports the core and its files like any other project.
     Replace the "referenced, not imported" paragraph in `CLAUDE.md` with the import lines.
   - **Section references keep working.** No section was renamed; `§GIT` still means `§GIT`.
     A reference that names the file (`project-rules.md §FIREBASE`) for a section that moved
     is corrected to the section name alone. Never in `decisions.md`.

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

**Cloud sessions.** They install no plugins, so copy the skills into the project. **Skip this
if `CLAUDE.md`'s *Deploys* line says local only** — with no remote, no cloud session can
open the repository, and the copies would be dead weight:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/copy-skills-to-project.mjs" "<project root>" --check
```

`--check` writes nothing and lists what would change. **A copy that changed although the
master did not was edited in place** — treat it like an edited rules file (Step 1): show the
diff, offer `propose-standard`, never overwrite it silently. Otherwise run the same command
without `--check`. It writes every skill but `new-project` to `.claude/skills/` and the files
they read to `.claude/fleet/`, and adds two hooks to `.claude/settings.json`, merged with
whatever the file already holds: the §AGENTS shell-write hook
(`.claude/fleet/scripts/block-shell-writes.mjs`) and the relay-after-compact hook
(`.claude/fleet/scripts/after-compact.mjs`, `SessionStart` on `compact|resume`). On the
owner's machine each skill then appears twice, as `/checkpoint` and `/fleet:checkpoint`, and
the shell-write hook runs twice, once from the plugin; that is expected, and both behave the
same. The plugin's relay-after-compact hook stays silent where the project registers its
own, so that instruction arrives once. A local-only project, skipped here, gets both hooks
from the plugin. **A project with its own relay-after-compact hook** from before v3.9 can
drop it now: offer that, never remove it unasked.

**Other agents.** Check the project root has `AGENTS.md` (read by Codex, Copilot and Cursor)
and `GEMINI.md` (Gemini CLI), each holding the pointer from
`${CLAUDE_PLUGIN_ROOT}/templates/AGENTS.template.md`. `CLAUDE.md` stays the one file with
content; these only point at it. If a tool already generated an `AGENTS.md` (Next.js does,
inside a `<!-- BEGIN:… -->` block), add the pointer above the block and never edit inside it.

**The credential hook (§SECURITY).** If `.githooks/pre-commit` is missing, or differs from
`${CLAUDE_PLUGIN_ROOT}/templates/pre-commit`, show the difference and ask before copying —
a project may have narrowed the pattern on purpose, which is a `propose-standard` candidate
rather than something to overwrite. Copy with `cp` (never retype it), then:

```bash
git add --chmod=+x .githooks/pre-commit
git config core.hooksPath .githooks
```

If the project uses husky (a `.husky/` folder), leave `core.hooksPath` to husky and add
`.githooks/pre-commit || exit 1` to `.husky/pre-commit` instead.

**Imports match the `Rules:` line (§SCOPE).** Check `CLAUDE.md` has one import line for the
core and one for each declared file (`ai` excepted: it is read on demand), that each
imported file exists in the project, and that nothing is imported that the line does not
declare. Say what differs and fix it on a yes.

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

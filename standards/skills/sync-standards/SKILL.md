---
name: sync-standards
description: Use inside a project to bring it up to the latest fleet standard from the fleet-standards repo — e.g. "sync standards", "upgrade standards", "migrate to the new standard", "sync to the latest standard", "update project rules", "are we on the latest rules", "check standards drift", "add the Trello option", "this project uses Firebase now", "add the studio credit". Compares the project's rules set with the fleet plugin's copy, explains what changed and what was dropped, audits the transition into one report, then on approval copies the new rules in, translates section references, and wires the project to the fleet plugin; also adds or drops an option on a project already current. Never commits.
---

# Sync standards

> **Outside Claude Code:** map this skill's Claude Code terms to your own, as
> `project-rules.md` §TOOLS lists them, and never skip a step silently because a name did not
> match.

Brings one project up to the fleet standard. The master copies ship inside this plugin:

- Rules: `${CLAUDE_PLUGIN_ROOT}/project-rules.md` (the core) and the files under
  `${CLAUDE_PLUGIN_ROOT}/rules/`. One version, in the core's header, covers the set
- History and the v2 → v3 section map: `${CLAUDE_PLUGIN_ROOT}/CHANGELOG.md`
- Templates: `${CLAUDE_PLUGIN_ROOT}/templates/`
- Adoption guide: `${CLAUDE_PLUGIN_ROOT}/adopting-the-standard.md`

Skills come from the plugin and update with it — **except in cloud sessions, which install
no plugins.** So Step 5 also copies the skills into the project's own `.claude/skills/`, and
the files they read into `.claude/fleet/`. Those copies are refreshed on every sync.

**This skill makes no commit of its own.** Git follows §GIT and the project's *Deploys*
line: on a single-branch project the tree is left for the owner's `git checkpoint`; on a
working branch, and in a cloud session, the sync is committed and pushed with the rest of
the session's work.

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
`git -C <repo> pull` and `node <repo>/standards/scripts/install-skills.mjs`. With no terminal
it skips any installed skill that differs from the checkout and says so: show the owner the
difference (it may be a local edit worth proposing) and, on a yes, run it again with
`--yes`. If anything changed, tell the owner to restart the agent and invoke this skill
again, then stop.

## Step 1 — Read both versions

- The master's version: the `**Version:**` line of `${CLAUDE_PLUGIN_ROOT}/project-rules.md`.
- The project's: the same line of `project-rules.md` at the project root.
- The files the project loads: the *Rules* line in its `CLAUDE.md`
  (`Rules: app, ui, node, web · Options: firebase, trello`) names them, as `rules/<name>.md`
  and `rules/options/<name>.md`. **Every `CLAUDE.md` line this skill reads is found bold or
  not:** the template writes `- **Rules**: …`, `- **Trello board**: …`, `- **Deploys**: …`,
  and a hand-written file may not. "Content" below means the core and each of those files,
  compared with the master's. No *Rules* line means the project is still on the single
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
  that changed may now be moot, or may now need restating. **A moot one is offered for
  removal**, quoted with the rule that made it moot, and removed on the owner's yes in Step 4
  (a line in `decisions.md` says why). Known case: exceptions against §MOTION, moot since
  v4 left animation to the owner at the mockup stage. An exception against §FIREBASE in a
  project that does not load the Firebase option is moot the same way.

**Then audit the transition, read-only.** Run every check in Step 4 (item 4, a to l) against
the project without changing anything, and add each *What a project must change* item from
the changelog entries it is behind. The result is **one upgrade report**, a line per item:
what is there now, what the sync will do, or what is left for later and to whom (history in
`docs/STATUS.md` goes at the next checkpoint: say how many entries). Items that need the
owner's value are marked. An item that does not apply is left out; an empty report is a fine
answer and says so.

## Step 3 — Ask once

Put the plan to the owner with the question tool: apply the sync, or not. One question,
with the summary and the upgrade report from Step 2 as context. On a no, stop and leave
everything untouched.

## Step 4 — Apply

0. **Is `rules/` free?** Before anything is copied into it: a project's `rules/` folder is
   the standard's only if every file in it is one the master has, opening with
   `# Fleet rules —`. A folder that holds anything else — a game's rules, Firestore or
   storage rules, lint rules — **stops the sync**: say what is there and ask the owner how to
   proceed. Never write into it, move it or rename it unasked.
1. Copy `${CLAUDE_PLUGIN_ROOT}/project-rules.md` over the project's copy, and each file the
   *Rules* line declares from `${CLAUDE_PLUGIN_ROOT}/rules/` into the project's `rules/`.
   Copy only what is declared. **A project with no *Rules* line** is coming from the single
   file: do check (a) in item 4 first, so nothing that moved out of the core is lost.
2. Translate numeric section references with the map in `CHANGELOG.md`, in `CLAUDE.md` and
   `conventions.md`. **Never edit `decisions.md`** — it is append-only, and an old entry's
   reference is history, readable through the map.
3. Do **not** change `conventions.md`'s `Audited against` line. The audit has not been
   redone; the version mismatch is the drift detector telling the truth. Offer the re-audit
   as a separate piece of work (`adopting-the-standard.md`, section 1).
4. **Bring the project's files up to the standard: the checks below, in this order.** Each
   looks for what the standard now expects and acts only where it is missing, so a project
   jumping from 2.x and one a minor version behind take the same path, and a project that
   already has a thing is not asked about it again. Ask where a value is the owner's.

   **a. The rules set (v4; §SCOPE has the tables).** *If `CLAUDE.md` has no *Rules* line:*
   - **First, a decision against it.** Search `decisions.md` (and its declined index) for an
     entry declining the rules import or the skill copies — some projects did, for a reason
     of their own: "a fleet sync must not put the import back", 70 KB of Next.js rules that
     did not apply. **Never restore either unasked.** Quote the entry, say what changed (the
     core is about 31 KB, all of it applies to every kind, and the kind's files are the only
     others loaded), and ask. A no stands: leave the import and the *Rules* line out (the
     startup check would report a declared file not imported every session), record the
     answer in `decisions.md`, and say in the report that the project reads its rules by
     reference. A later sync that finds that answer recorded asks nothing. The same holds
     for the skill copies in Step 5.
   - **Which files the project loads.** Work out its kind from the repository (a Next.js
     app, a Node tool, a tool in another language — `python` for Python, and its shape,
     package or folder of scripts, from `conventions.md` — a game in an engine, no
     application code)
     and whether it has a visual surface, then **confirm it with the owner in one question**
     before copying. Write the *Rules* line beside *Deploys* in `CLAUDE.md` and one
     `@rules/<name>.md` import per file under `@project-rules.md`
     (`${CLAUDE_PLUGIN_ROOT}/templates/CLAUDE.template.md` shows both).
   - **A profile project** (non-application or game-engine) that references the rules file
     instead of importing it now imports the core and its files like any other project.
     Replace the "referenced, not imported" paragraph in `CLAUDE.md` with the import lines.
   - **Section references that name the file** (`project-rules.md §FIREBASE`) for a section
     that moved are corrected to the section name alone. No section was renamed. Never in
     `decisions.md`.

   **b. The *Deploys* line (§GIT).** *If it does not say single-branch, multi-branch or local
   only,* ask once and write the answer. *If it says multi-branch without naming the working
   branch,* ask which branch it is and write it in; never work either out from the branches
   that exist.

   **c. The options, each asked once (§SCOPE).** *For each option with no answer recorded
   on the *Rules* line's `Options:` part:*
   - **Studio credit** — if the owner's `~/.claude/CLAUDE.md` has a `Studio credit:` line and
     the project's `CLAUDE.md` lacks either the `Studio credit:` or the `Studio showcase:`
     line — or says `local only — not asked` — read `rules/options/credit.md` from the
     master and ask its missing questions once, as it says. With no `Studio credit:` line in
     the owner's file, write `no studio
     configured` and ask nothing. A project already crediting the studio gets the option
     without a question.
   - **Trello** — a `Trello board: <url or none>` line in `CLAUDE.md` (§TRELLO); a project
     with a board URL gets the option without a question.
   - **Firebase, SQLite and AI** — say what the repository shows (a `firebase` dependency,
     a SQLite driver such as `better-sqlite3` or `sqlite3`, a `lib/ai/` folder) and ask. A
     project on SQLite that carries a §FIREBASE exception gets the SQLite option instead,
     and the exception is offered for removal (Step 2).

   Record each answer on the `Options:` part, `none` if none. An option is copied and
   imported like any other file, except two that are read on demand (§SCOPE): `credit`,
   which is copied but never imported — the skills read it when they reach its step, so
   read it before asking the credit questions — and `ai`: add the template's
   "read `rules/options/ai.md` before any work on an AI feature" line instead of an import,
   and the same line in `src/lib/ai/CLAUDE.md` (create it if the folder exists and the file
   does not), which loads by itself when AI code is read.

   **d. The motif, where the project loads `rules/ui.md`.** *If `CLAUDE.md` has no `Motif:`
   line,* add it. *If `design-system.md` records no motif,* offer to run `design-motif`, which
   records the project's existing look rather than re-choosing it.

   **e. `CLAUDE.md`'s working agreement.** *If it restates bullets §OWNER now holds,* offer to
   remove them.

   **f. `.gitattributes` (§GIT).** *If the project has `.sh` files or a `.githooks/` folder
   and nothing pins them to LF,* add the lines from
   `${CLAUDE_PLUGIN_ROOT}/templates/.gitattributes` — to the project's own `.gitattributes`
   if it has one, never over it.

   **g. The profile block in `conventions.md`.** *If a game or a repository without
   application code carries a block of its own, or one that still speaks of "Part A",
   "Parts B to E" or the rules being "referenced, not imported"* (the words before v4), offer
   to replace it with the block for its kind from the conventions template (§SCOPE), keeping
   anything the project's block says that the profile does not. "Part" wording elsewhere in
   `CLAUDE.md` or `conventions.md` is corrected to the section names it meant; never in
   `decisions.md`.

   **h. History out of the files agents read (§DOCS).** *If `docs/STATUS.md` still holds the
   session log,* do not move it here: say the next checkpoint moves it to `docs/log.md`. *If
   `CLAUDE.md` or an area file carries history* ("was", superseded numbers, dated runs),
   offer the split to `docs/record/` as its own piece of work.

   **i. `decisions.md`'s "declined, never again" index.** *If it has none,* offer to add it
   at the top, built from the entries that record something the owner ruled out. The entries
   are not edited.

   **j. One package manager (§NPM).** *If the project has two lockfiles,* say which, and
   remove one on the owner's word about which goes. *If `CLAUDE.md`'s *Commands* do not name
   the manager the lockfile shows,* correct them. Never switch the manager unasked.

   **k. Python's shape (§PYTHON).** *If the project loads `python` and `conventions.md` does
   not say whether it is a package or a folder of scripts,* ask once and write it in.

   **l. Moot exceptions.** The ones Step 2 offered and the owner approved are removed from
   `conventions.md`, with a line in `decisions.md` saying which rule made each moot.

   **A release that needs a new check adds it here**, as the next letter, and names it in its
   changelog entry's *What a project must change* list, so every later sync runs it and a
   project several versions behind takes the same path.

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
open the repository, and the copies would be dead weight — **or if `decisions.md` records
the owner declining the copies**: ask as Step 4 (a) says, and never copy them unasked.

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/copy-skills-to-project.mjs" "<project root>" --check
```

`--check` writes nothing and lists what would change: `~ changed` is the master's update,
**`! edited` is a copy edited in this project since the last sync** (its hash in
`copied.json` no longer matches). Treat an edited one like an edited rules file (Step 1): show
the diff, offer `propose-standard`, never overwrite it silently. A sync from before the
hashes cannot tell the two apart once: read the diff. **A `- stale` line** is a copy
the standard has since dropped — a retired skill, a reference file that went: name each to
the owner, and on their yes run the command once more with `--remove-stale`. A project's own
skills are never on that list (`.claude/fleet/copied.json` records what the sync wrote).
Otherwise run the same command without `--check`. It writes every skill but `new-project` and `machine-inventory` to `.claude/skills/` and the files
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
git config core.hooksPath .githooks
```

Marking it executable is a staging step (`git add --chmod=+x .githooks/pre-commit`), so it
waits for the commit: the owner's checkpoint on a single-branch or local-only project, which
§GIT does not let a sync pre-empt; with the session's work on a working branch. Say so in
Step 6.

If the project uses husky (a `.husky/` folder), leave `core.hooksPath` to husky and add
`.githooks/pre-commit || exit 1` to `.husky/pre-commit` instead.

**Imports match the *Rules* line (§SCOPE).** Check `CLAUDE.md` has one import line for the
core and one for each declared file (`ai` excepted: it is read on demand), that each
imported file exists in the project, and that nothing is imported that the line does not
declare. Say what differs and fix it on a yes.

## Adding an option to a project already on the set

**Run on its own** when a project that is current wants an option it did not choose — "add
Trello", "this project uses Firebase now", the studio credit after a studio appeared — and
from Step 4 (c). Steps 0 and 1 still run first, so the option comes from a current master.

1. Read the option's file in the master (`${CLAUDE_PLUGIN_ROOT}/rules/options/<name>.md`)
   and say in two lines what taking it on means for this project.
2. On the owner's yes: copy it into `rules/options/`, add `<name>` to the *Rules* line's
   `Options:` part (dropping `none`), and add its `@rules/options/<name>.md` import under the
   others. **Two are not imported** (§SCOPE): the credit is copied with no import line, and
   AI goes to `ai-setup`, which copies the file and writes the two read-on-demand lines.
3. Write what the option needs on `CLAUDE.md`'s own lines: `Trello board: <url>`; the
   `Studio credit:` and `Studio showcase:` lines, as §CREDIT says; nothing more for
   Firebase until a credential exists
   (§DOCS).
4. One line in `decisions.md`: the option, the date, why.

Dropping an option is the same in reverse, on the owner's word: the file, the import and the
name go; `decisions.md` says why. Git follows §GIT, as for a sync.

## Step 6 — Check, then report

**Run the upgrade report's checks again, read-only**, on the project as it now is. Every
item the sync was to do should be gone; anything still there is reported plainly as not
done, with why, never left out.

- Version moved from → to, or "already current".
- The upgrade report's items: done, left for later (and to whom), or still failing.
- Files changed, with the count of references translated, and the skill copies written.
- Anything left for the owner: re-audit offered, exceptions to revisit, values asked for.
- **Git, as §GIT has it for this project:** left uncommitted on a single-branch project,
  for the next checkpoint; committed and pushed with the session's work on a working branch
  or in a cloud session.

## Common mistakes

- Running a sync on a project with no rules copy. That is an adoption and needs the audit.
- Overwriting a copy that was edited in place. That edit is information — propose it or
  record it, never lose it.
- Bumping `Audited against` because the rules file was copied. Copying is not auditing.
- Rewriting `decisions.md` references. Append-only means append-only.
- Comparing the project against `.claude/fleet/project-rules.md`. That is the project's own
  copy from the last sync, so it always matches. The master is the plugin or the clone.

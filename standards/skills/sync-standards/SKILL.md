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

**A master folder named by the owner wins.** To pilot a release before it ships, the owner
may name a checkout of `fleet-standards` on its branch ("sync against
`E:\…\fleet-standards`"). Then read every `${CLAUDE_PLUGIN_ROOT}/` and `.claude/fleet/` path
in this skill from that checkout's `standards/` folder, run its scripts from there, say in
the report which folder and branch it was, and skip the rest of this step.

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

**Compare content, never line endings.** A Windows checkout with `core.autocrlf` holds CRLF,
so a plain diff shows a whole file changed. Diff with
`git diff --no-index --ignore-cr-at-eol` (or `diff --strip-trailing-cr`); the scripts already
compare this way.

**On Windows, run the scripts from PowerShell** if Git Bash prints a Node version manager's
environment error or turns `/e/...` into a wrong path: `node "<full Windows path>" …`.

Then branch:

| Project copy | Meaning | Do |
| --- | --- | --- |
| **None** | Not on the standard at all | Stop. This is an adoption, not a sync — a migration that writes `conventions.md` and changes no code. Point at `adopting-the-standard.md` and ask whether to start it. |
| **Same version, same content** | Current | Say so, then Step 5 only. |
| **Same version, different content** | Edited in place inside this project | Show the diff. That edit is either a fix the master should get — offer `propose-standard` — or a local divergence that belongs in `conventions.md`. Never overwrite it silently. |
| **Same version, different content, and the master is a named folder whose changelog's top entry says `unreleased`** | A pilot of the next release: its version line is not bumped until it ships | Tell the two apart first: compare the project's files with the master's **last release** (`git -C <master> show <the release's commit>:standards/<file>`, the commit that dated the newest released changelog entry). No difference: the project is unedited and behind the pilot, so Steps 2–6, and say in the report that the version line will not move until the release. A difference: the row above, for those lines. |
| **Older** | Behind | Steps 2–6. |
| **Newer than the master** | The master is behind, or the plugin copy is stale | Stop and say which. Never downgrade. |

**Then the project's git, read-only, before anything else is read.** `git status -sb`, and
`git fetch` then the count behind the remote. Say each of these first, and stop for the
owner's word on it:

- **Uncommitted changes** a sync would land on top of: the owner commits or sets them aside
  first, or says to go on knowing the sync's changes will be mixed in.
- **Behind the remote:** pull first, on the owner's yes, so the sync does not start from an
  old tree.
- **A branch other than the one the *Deploys* line works on** (a multi-branch project on
  `main`, or on a feature branch): say which, and ask where the sync belongs.

## Step 2 — Explain what changes

Read the `CHANGELOG.md` entries between the two versions and tell the owner, briefly:

- **What was added or changed** that affects this project specifically. Skip what does not.
- **What was dropped** — newer is not automatically a superset. A dropped rule this project
  relied on is the one thing a sync can silently break.
- **Section references.** If the jump crosses v2 → v3, every `§<number>` in this project's
  docs becomes a name. Count them in the project's own tracked files, never in copies,
  clones or archives: `git grep -n "§[0-9]" -- '*.md' ':!.claude/' ':!docs/archive/'`. A
  document's own numbered sections (a spec's §2) are not the standard's: count only
  references to it.
- **Granted exceptions this touches.** Read `conventions.md`: an exception against a rule
  that changed may now be moot, or may now need restating. **A moot one is offered for
  removal**, quoted with the rule that made it moot, and removed on the owner's yes in Step 4
  (a line in `decisions.md` says why). Known case: exceptions against §MOTION, moot since
  v4 left animation to the owner at the mockup stage. An exception against §FIREBASE in a
  project that does not load the Firebase option is moot the same way.

**Then audit the transition, read-only.** Run Step 4's item 0 (a `rules/` folder that is not
the standard's) and every check in item 4, from (a) to the last, against the project without changing
anything; a `rules/` stop goes at the top of the report, so the owner sees it before saying
yes. Add each *What a project must change* item from the changelog entries it is behind
(entries before 4.0.0 have no such list: their "What a project does" lines, where they have
them, serve). The result is **one upgrade report**, a line per item:
what is there now, what the sync will do, or what is left for later and to whom (history in
`docs/STATUS.md` goes at the next checkpoint: say how many entries). Items that need the
owner's value are marked. An item that does not apply is left out; an empty report is a fine
answer and says so.

## Step 3 — Ask once

Put the plan to the owner with the question tool: apply the sync, or not, with the summary
and the upgrade report from Step 2 as context. **Gather the report's questions into this
round**: the kind, each option, the Python shape, each moot exception, branch protection.
Ask them with the go-ahead in one call (four questions to a call; a second call for the
rest), so Step 4 applies answers it already has instead of stopping for each. On a no, stop and leave
everything untouched but one line appended to `decisions.md`: the sync to `<master version>`
declined, and why if the owner said. Relay reads it and stops offering that version.

## Step 4 — Apply

0. **Is `rules/` free?** Before anything is copied into it: a project's `rules/` folder is
   the standard's only if every file in it is one the master has, opening with
   `# Fleet rules —`. A folder that holds anything else — a game's rules, Firestore or
   storage rules, lint rules — **stops the sync**: say what is there and ask the owner how to
   proceed. Never write into it, move it or rename it unasked. **Find what writes the folder,
   not only what reads it:** search the repository's scripts, `package.json` scripts, the
   hooks in `.claude/settings.json` and `.githooks/`, and CI for the path `rules/`. A file
   regenerated each session (a mirror from another project) comes back after a move unless
   its writer changes too. The way forward to offer: move the project's own files to a
   folder named for what they are (`game-rules/`, `firestore/`), with `git mv`; change each
   writer and every path that points at them (configs, imports, `CLAUDE.md`, the README);
   then run the writers and build or run what reads them, and check nothing reappeared in
   `rules/`, before the sync goes on.
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
   - **First, a decision against it.** Search `decisions.md` (and its declined index) and the
     granted exceptions in `conventions.md` for any refusal of something this sync would add:
     the rules import ("copied, not imported", "referenced, not imported"), the skill copies,
     the hooks, the plugin wiring, `AGENTS.md` or `GEMINI.md`, the credential hook. Some
     projects refused, for a reason of their own: "a fleet sync must not put the import
     back", 70 KB of Next.js rules that did not apply. **Never restore any of them unasked**;
     Step 5 checks the same list before each of its items. Quote the entry, say what changed (the
     core is about 31 KB, all of it applies to every kind, and the kind's files are the only
     others loaded), and ask. A no stands: leave the imports out, but **still write the
     *Rules* line, ending `· read, not imported`** (`Rules: app, ui, game · Options:
     no-trello · read, not imported`), so this sync and the next know which files to copy
     and the startup check knows they are read, not imported. Record the answer in
     `decisions.md`, and say in the report that the project reads its rules by reference. A
     later sync that finds that answer recorded asks nothing. The same holds for the skill
     copies in Step 5.
   - **Which files the project loads.** Work out its kind from the repository (a Next.js
     app, a Node tool, a tool in another language — `python` for Python, and its shape,
     package or folder of scripts, from `conventions.md` or asked in the same question and
     written in by (k) — a game in an engine, no application code) and whether it has a
     visual surface, then **confirm it with the owner in one question** before copying. **A
     project may be two kinds** (§SCOPE): a Next.js interface over a Python package loads
     both sets. A documents repository with tool scripts is asked which it is, with §SCOPE's
     test: scripts that only maintain its documents keep it non-application. Write the *Rules* line beside *Deploys* in `CLAUDE.md` and one
     `@rules/<name>.md` import per file under `@project-rules.md`
     (`${CLAUDE_PLUGIN_ROOT}/templates/CLAUDE.template.md` shows both).
   - **A profile project** (non-application or game-engine) that references the rules file
     instead of importing it now imports the core and its files like any other project.
     Replace the "referenced, not imported" paragraph in `CLAUDE.md` with the import lines.
   - **Section references that name the file** (`project-rules.md §FIREBASE`) for a section
     that moved are corrected to the section name alone, as a project's documents cite it
     (§SCOPE; only the standard's own files name a section's file). No section was renamed.
     Never in `decisions.md`.

   **b. The *Deploys* line (§GIT).** *If it does not say single-branch, multi-branch or local
   only,* ask once and write the answer. *If it says multi-branch without naming the working
   branch,* ask which branch it is and write it in; never work either out from the branches
   that exist.

   **c. The options, each asked once (§SCOPE).** *For each option with no answer recorded
   on the *Rules* line's `Options:` part:*
   - **Studio credit** — if the owner's `~/.claude/CLAUDE.md` has a `Studio credit:` line and
     the project's `CLAUDE.md` lacks either the `Studio credit:` or the `Studio showcase:`
     line — or says `local only — not asked`, or `no studio configured` while the owner's
     file now names a studio — read `rules/options/credit.md` from the master and ask its
     missing questions once, as it says. With no `Studio credit:` line in the owner's file,
     write `no studio configured` and ask nothing. A project already crediting the studio
     gets the option without a question, and so does **the studio's own site** (the
     repository the owner's line names as its showcase, or the site at its URL): record
     `credit` with "the studio's own site", and ask nothing.
   - **Trello** — a `Trello board: <url or none>` line in `CLAUDE.md` (§TRELLO); a project
     with a board URL gets the option without a question.
   - **Firebase, SQLite and AI** — only for a kind with application code; a repository
     without it is asked about Firebase only if it holds Firebase configuration, and never
     about SQLite or AI (as `new-project` asks). Say what the repository shows and ask:
     Firebase by a `firebase` dependency **or** a `firebase.json`, `.firebaserc`,
     `firestore.rules` or code calling Firestore in any language (a game's GDScript); SQLite
     by a driver such as `better-sqlite3`, `sqlite3` or Python's `sqlite3`; AI by a
     `lib/ai/` folder or a model SDK in the dependencies. A
     project on SQLite that carries a §FIREBASE exception gets the SQLite option instead,
     and the exception is offered for removal (Step 2).

   Record each answer on the `Options:` part: a chosen option by name, **a declined one as
   `no-<name>`** (`Options: trello, credit, no-firebase, no-sqlite, no-ai`), so no later sync
   asks it again. **Every option goes there, Trello and the credit included** (`trello` or
   `no-trello`, `credit` or `no-credit`): item 1 copies what this part declares, so an option
   missing from it is never copied or updated. Those two also keep their details on their own
   lines (`Trello board:`; `Studio credit:` and `Studio showcase:`). With no studio in the
   owner's file the credit is not asked and not listed. **`family` is never asked about**
   (§SCOPE): where `Options:` already declares it, its file is copied and updated like any
   other; where it does not, say nothing of it. An option is copied and
   imported like any other file, except two that are read on demand (§SCOPE): `credit`,
   which is copied but never imported — the skills read it when they reach its step, so
   read it before asking the credit questions — and `ai`: add the template's
   "read `rules/options/ai.md` before any work on an AI feature" line instead of an import,
   and the same line in `src/lib/ai/CLAUDE.md` (create it if the folder exists and the file
   does not), which loads by itself when AI code is read.

   **d. The motif, where the project loads `rules/ui.md`.** *If `CLAUDE.md` has no `Motif:`
   line,* add it. *If `design-system.md` (or the file the project keeps its design in, such
   as `DESIGN.md`) records no motif,* offer to run `design-motif`, which
   records the project's existing look rather than re-choosing it.

   **e. `CLAUDE.md`'s working agreement.** *If it restates bullets §OWNER now holds,* offer to
   remove them.

   **f. `.gitattributes` (§GIT).** *If the project has `.sh` files or a `.githooks/` folder
   and nothing pins them to LF,* add the lines from
   `${CLAUDE_PLUGIN_ROOT}/templates/.gitattributes` — to the project's own `.gitattributes`
   if it has one, never over it.

   **g. The profile block in `conventions.md`.** *If a game or a repository without
   application code carries a block of its own, or one that still speaks of "Part A",
   "Parts B to E" or the rules being "referenced, not imported" or "copied, not imported"*
   (the words before v4), offer
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

   **j. One package manager (§NPM).** *If the project has two lockfiles of one ecosystem*
   (for JavaScript, two of `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock`;
   a `uv.lock` or `poetry.lock` beside one of them is a second language, not a second
   manager), say which, and
   remove one on the owner's word about which goes. *If `CLAUDE.md`'s *Commands* do not name
   the manager the lockfile shows,* correct them. Never switch the manager unasked.

   **k. Python's shape (§PYTHON).** *If the project loads `python` and `conventions.md` does
   not say whether it is a package or a folder of scripts,* ask once and write it in.

   **l. Moot exceptions.** The ones Step 2 offered and the owner approved are removed from
   `conventions.md`, with a line in `decisions.md` saying which rule made each moot.

   **m. The repository's security settings (§SECURITY).** Read first, change nothing
   without the owner's yes for that item; each is a setting or a workflow, never a guess.
   - *Branch protection.* *If the project has a GitHub remote and `conventions.md` records
     no protection gap,* read the default branch's protection (`gh api
     repos/<owner>/<repo>/branches/<branch>/protection`) **and the rulesets that apply to it**
     (`gh api repos/<owner>/<repo>/rules/branches/<branch>`): a branch guarded by a ruleset
     answers 404 on the first call and is protected all the same. `deletion` and
     `non_fast_forward` rules there are the two the standard asks for everywhere, and
     `pull_request` the one a multi-branch project needs. A 404 with no such rules means none: if force pushes
     or deletion are allowed, or a multi-branch project does not require pull requests, say
     so and offer to turn it on (the owner's yes; the same call `new-project` Step 4.5 makes).
     **A 403 saying the feature needs another plan** (a private repository on a free plan)
     means it cannot be had: record the gap in `conventions.md`, so no later sync asks. A 403
     for missing permission is the token's, not the plan's: say so and ask nothing more.
   - *Tokens.* A token here is a credential that grants access to an account or a service:
     a personal access token, an API key, a deploy or service-account key. *If
     `environment.md` names one without its scope and expiry,* ask the owner for them and
     write them in. A public configuration value (a Firebase web key) is not one. Names,
     scopes and dates only; never open a credential file or ask for a value.
   - *Workflows.* *If a file under `.github/workflows/` has no `permissions:` block,* say
     which, and offer the least it needs; changing a workflow is the owner's yes, every time.
     *If the repository has Actions secrets* (`gh secret list`, names only) *and no workflow
     uses one,* say which; removing them is the owner's.
   A project with no GitHub remote skips this check and says so.

   **n. CI runs the gates (§BUILD).** *If the project has a GitHub remote, gates to run (a
   Node or web project, a Python package) and no workflow that runs them,* offer the
   template for its kind: `${CLAUDE_PLUGIN_ROOT}/templates/gates.yml`, or
   `gates-python.yml`, copied to `.github/workflows/` with `cp` on the owner's yes, as for
   any workflow. Say what it needs first: `.nvmrc` and a committed lockfile for Node,
   `uv.lock` for Python. *If a workflow already runs some of the gates,* name the ones it
   lacks and leave the file to the owner. A build that needs secrets is said, not solved
   here: the template's comment says how.

   **o. Findings from newer rules: look and list, change no code.** A rule that asks for
   code in a project already live cannot be applied by a sync. Read for each, and put what
   is found in the upgrade report as work for the project, with the rule it comes from:
   - *Public writes (`rules/web.md` §FORMS).* A form, Server Action or route handler a
     visitor can submit without signing in, with no rate limit or no maximum length on its
     free-text fields.
   - *Security headers (`rules/web.md` §RUNTIME).* No `headers()` in `next.config`, and no
     middleware or host configuration setting them; an `images.remotePatterns` entry that is
     a wildcard over a shared service.
   - *Legal pages (§SECURITY).* A privacy policy, terms or cookie notice whose promises
     (what is kept, for how long, how it is deleted) `data-model.md` does not record. Only
     the comparison: whether the code keeps a promise is the project's own audit.

   Only where the project loads the file the rule is in. Finding nothing is said in a line.
   Nothing here is fixed by the sync, and none of it stops the sync.

   **A release that needs a new check adds it here**, as the next letter, and names it in its
   changelog entry's *What a project must change* list, so every later sync runs it and a
   project several versions behind takes the same path.

## Step 5 — Wire the project to every agent

**Each item below is skipped where the project recorded a refusal of it** (Step 4 (a)'s
search: `decisions.md` or a `conventions.md` exception). Say which, and ask only if what
changed since might change the answer.

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
**Declining the skill copies is not declining the hooks.** A project that declined them,
and is not local only, is still offered the two hooks on their own: the same commands with
`--hooks-only` added, which copies and registers the hooks and nothing else (a hand copy of
the shell-write guard from an older sync is brought up to date the same way). A no is
recorded in `decisions.md` like any refusal.

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/copy-skills-to-project.mjs" "<project root>" --check
```

**The hook scripts are shown before they are copied.** They run unattended, on every shell
command and after every compact, from a master copied off `main`. For each
`.claude/fleet/scripts/` line `--check` lists as new or changed, show the owner the diff
(`git diff --no-index --ignore-cr-at-eol <the project's copy> <the master's>`, or the master file whole when
it is new) and say what the change does, before the run that writes it. A change nobody can
explain is not copied; raise it as §SECURITY says.

`--check` writes nothing and lists what would change: `~ changed` is the master's update,
**`! edited` is a copy edited in this project since the last sync** (its hash in
`copied.json` no longer matches). Treat an edited one like an edited rules file (Step 1): show
the diff, offer `propose-standard`, never overwrite it silently. A sync from before the
hashes cannot tell the two apart once: read the diff. **A `- stale` line** is a copy
the standard has since dropped — a retired skill, a reference file that went: name each to
the owner, and on their yes run the command once more with `--remove-stale`. A project's own
skills are never on that list (`.claude/fleet/copied.json` records what the sync wrote).
**An `= own` line** is a skill folder of the project's own under a fleet skill's name (its own
`relay` or `checkpoint`): the script never overwrites it and copies the rest. Name it to the
owner; keeping it is a granted divergence for `conventions.md`, and taking the fleet skill
means the owner renames or retires theirs first.
Otherwise run the same command without `--check`. It writes every skill but `new-project`, `machine-inventory` and `session-family` to `.claude/skills/` and the files
they read to `.claude/fleet/`, and adds two hooks to `.claude/settings.json`, merged with
whatever the file already holds: the §AGENTS shell-write hook
(`.claude/fleet/scripts/block-shell-writes.mjs`) and the relay-after-compact hook
(`.claude/fleet/scripts/after-compact.mjs`, `SessionStart` on `compact|resume`). On the
owner's machine each skill then appears twice, as `/checkpoint` and `/fleet:checkpoint`, and
the shell-write hook runs twice, once from the plugin; that is expected, and both behave the
same. A project that keeps a stricter hook of its own (one refusing every `<<`) keeps it
beside this one. The plugin's relay-after-compact hook stays silent where the project registers its
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
rather than something to overwrite. Copy it with the script, never `cp` and never retyped:
`node "${CLAUDE_PLUGIN_ROOT}/scripts/copy-skills-to-project.mjs" "<project root>"
--credential-hook` writes it with LF line endings whatever the master checkout holds (a
CRLF hook does not run). Then:

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
declare. Say what differs and fix it on a yes. A line ending `· read, not imported` has no
import lines by the owner's decision: check only that each declared file exists.

## Adding an option to a project already on the set

**Run on its own** when a project that is current wants an option it did not choose — "add
Trello", "this project uses Firebase now", the studio credit after a studio appeared — and
from Step 4 (c). Steps 0 and 1 still run first, so the option comes from a current master.

1. Read the option's file in the master (`${CLAUDE_PLUGIN_ROOT}/rules/options/<name>.md`)
   and say in two lines what taking it on means for this project.
2. On the owner's yes: copy it into `rules/options/`, add `<name>` to the *Rules* line's
   `Options:` part (in place of its `no-<name>`, or of an old `none`), and add its `@rules/options/<name>.md` import under the
   others. **Two are not imported** (§SCOPE): the credit is copied with no import line, and
   AI goes to `ai-setup`, which copies the file and writes the two read-on-demand lines.
3. Write what the option needs on `CLAUDE.md`'s own lines: `Trello board: <url>`; the
   `Studio credit:` and `Studio showcase:` lines, as §CREDIT says; nothing more for
   Firebase until a credential exists
   (§DOCS).
4. One line in `decisions.md`: the option, the date, why.

**A kind's file is added the same way** when a project outgrows its *Rules* line: a tool that
gained an interface takes `ui`; a second language takes its file (`python` beside a web
app, §SCOPE: a project of two kinds loads both); a repository that gained application code
takes `app` and its language's file in place of `non-application`. Copy the file into
`rules/`, add its name to the *Rules* part and its import, and for a kind change replace the
profile block in `conventions.md`. The checkpoint offers this when a session made it true.

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

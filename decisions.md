# Decisions — fleet-standards

Why each non-obvious choice about the standard was made. **Append only.** A decision that
turns out wrong gets a new entry reversing it, not an edit.

Started 2026-10-21. Before that, `standards/CHANGELOG.md` records why each release changed
what it did; this file adds the alternatives that were considered and turned down, which a
changelog does not keep.

---

## 2026-10-20 — §GIT: the cloud-session rule folds into the working-branch rule

A harness branch is a working branch. Alternatives: keep the cloud paragraph beside the new
rule (the same permission stated twice), or keep cloud sessions on their narrower rule (a
cloud session on a multi-branch project would behave differently from the PC). Issue #6.

## 2026-10-20 — §GIT: single- or multi-branch is declared, never inferred

The *Deploys* line declares it; undeclared means single-branch until the owner answers once.
Alternatives: undeclared means single-branch with no question asked (projects stay on phrases
until someone adds the line); infer from the branches that exist (the agent guessing the thing
that decides whether it may push).

## 2026-10-20 — §SCOPE profile: a short named list from Parts D and E

§DESIGN and §TESTING's seen-working rule, nothing else. Alternatives: section by section with
partial rules kept (more coverage, harder to follow); none, each project decides (every
profile project re-decides it). Issue #7.

## 2026-10-20 — §NAMING in the profile: vocabulary and file names only

One sentence in the profile rather than splitting §NAMING, which would leave projects citing
§NAMING for file naming pointing at the wrong section. Issue #7.

## 2026-10-20 — Sync reminders: a plugin startup hook plus a relay check

A `SessionStart` hook compares versions and stays silent when current; relay checks too,
because cloud sessions install no plugins. Alternatives: also a hook committed in every
project (each carries a script and needs network); relay only (heard only when relay runs).

## 2026-10-20 — A declined sync is remembered until a newer version ships

Per project, in the plugin's data folder. Alternatives: ask again after a week; ask every
session until synced.

## 2026-10-20 — Cloud sessions get the skills as copies in each project

`sync-standards` copies them into `.claude/skills/`, with the files they read in
`.claude/fleet/`. Alternatives: a startup hook in each project downloading the skills (every
session needs GitHub access and starts slower); leave it and attach fleet-standards to cloud
sessions by hand (works only when someone remembers). Accepted cost: locally each skill is
listed twice, `/checkpoint` and `/fleet:checkpoint`.

## 2026-10-21 — checkpoint proposes skills; it no longer edits them unasked

The owner's proposal. A new skill only for a procedure done twice or rediscovered, at most one
per checkpoint (alternatives: any multi-step procedure — noise; only in MAX checkpoints — easy
to forget). Project-scoped first (alternatives: the agent picks per skill; project only).
Written in the same checkpoint on a yes (alternative: next session, when the details have
faded).

## 2026-10-21 — Media: frames plus measurements stand in for watching video

Alternatives: frames only (misses a silent track or a wrong length); stills only, with all
moving content left to the owner. Issue #9.

## 2026-10-21 — Profile projects reference the rules file instead of importing it

Option A of issue #10. Option B, splitting the file into a core and an application part, is
deferred until a second profile type appears: it changes sync, the startup check and every
project's import line.

## 2026-10-21 — The credential hook lives in a committed `.githooks/` folder

Enabled per clone with `core.hooksPath`. Alternatives: copy into `.git/hooks` as issue #12
proposed (every new clone silently lacks it); husky (a dependency, and nothing for profile
projects). Projects already on husky call it from their own hook.

## 2026-10-21 — Quality: CI, a description budget, behaviour evals, and this file

Raised by the agent when the owner asked for suggestions. Accepted: CI running
`tests/run.mjs` and the plugin validator; an 800-character budget for skill descriptions
(checkpoint's was at 1,007 of Codex's 1,024 limit); six behaviour evals; a status file, this
decisions log, and the credential hook enabled on this repository itself. **Declined for
now:** a size budget and pruning pass for `project-rules.md`, which grew from 56 KB at v3.4.0
to 66 KB at v3.7.0. Raise it again if the file keeps growing.

## 2026-11-02 — v3.8.0: issues #15 to #18 together

The owner chose all four in one release (alternatives: #15 and #17 now, the rest later; pick
per issue). Each issue's own wording was taken, with the agent's additions below.

## 2026-11-02 — Cloud `git CPR`: a refused push falls back to a pull request

Added to issue #15's wording: a harness or branch protection can refuse the push to the main
branch, and the issue's text would then simply fail. On a refusal the agent says so and
offers a pull request. Never a force push, as before.

## 2026-11-02 — §CREDIT: the config line keeps its README name; unreachable requests are kept

Issue #16 proposed a `Studio:` line; the README already documented `Studio credit:`, so the
showcase was added to that line as an optional `showcase <owner/repo> <file>` part, sparing
anyone who had written it a rename. Added to the issue: the showcase needs the client's
agreement like the credit does; a request the session cannot file (no GitHub access, or the
studio repository not attached to a cloud session) is written into `docs/STATUS.md` instead
of being dropped; nothing private in a request, since the studio repository may be public.

## 2026-11-02 — Checkpoint asks one question, at the end

The owner's choice: skill proposals (issue #16's showcase update too) join issue #17's pause
question in one prompt at the end, over each issue asking separately. Consequence: Step 1.5's
proposals are no longer asked before Step 2, and approved changes land in a follow-up commit
under the git answer the checkpoint already had; after a `git CPR` they ship with the next
release rather than repeating it. Asking before the git step was considered and rejected: a
checkpoint is often "save state before I go", and a question before the commit would leave
the work uncommitted if the owner walked away.

## 2026-11-02 — The shell-write hook: everywhere, and every inline script

Issue #18's hook ships in the plugin, and — the owner's choice, over plugin only — is also
copied into each project's `.claude/settings.json`, because cloud sessions install no
plugins and the slips happened there too. Locally it runs twice, harmlessly. It blocks every
inline Python or Node script, the owner's choice over blocking only those that look like they
write: a guess about what code does is easy to slip past. Written fresh rather than from
toll-kits' reference hook, which was not reachable from this session; it strips heredoc
bodies and quoted text before looking, so the commit-message false positive the issue
describes does not occur. This repository registers it for itself too.

## 2026-11-12 — v3.9.0: all fourteen proposals, #20 to #33, in one release

The owner's choice, over the small ones now and the large later, or going through them one
by one. Issue #25 is folded into #28: the same game profile, #28 the later and fuller
wording after Process X. Each issue's wording was taken, with the agent's additions below.

## 2026-11-12 — The game-engine profile: what the two issues left unplaced

§SHORTCUTS applies in full; §PATTERNS joins the "where the game has the thing" group;
§PACKAGES is read as add-ons. Neither issue placed them. §GIT, §DOCS and §SPECS are not
listed, because "Part A in full" already covers them. The rules file is referenced, not
imported, following the 2026-10-21 decision for profile projects — the issues did not say.
One project's evidence, on one engine.

## 2026-11-12 — Relay after compact: projects carry the hook too, and it arrives once

Issue #26 says cloud sessions load the plugin's hooks; this repository's record says they
install no plugins (2026-10-20, 2026-11-02), so `sync-standards` copies the hook into each
project, as it does the shell-write hook. Two copies would print the instruction twice, so
the plugin's copy stays silent where the project's settings register its own. Added to the
issue: the hook is silent in a project with neither `docs/STATUS.md` nor `project-rules.md`,
since the plugin is enabled in folders that keep no fleet record. Alternative turned down:
plugin only, trusting the issue's line about cloud sessions — unverified, and a miss there
is silent. If the owner asks for compact instructions anyway, the answer is one line, as the
issue proposed.

## 2026-11-12 — History apart: the checkpoint migrates, and the fold moves to the log

Added to issue #33: who moves an existing session log. The next checkpoint does, verbatim,
rather than `sync-standards` (a sync changes rules, not records, and never commits) or a
script (§AGENTS: files change through the editor tools). The ~800-line fold now applies to
`docs/log.md`; dropping it was considered, since nothing auto-reads the log, but relay still
opens that file for its newest entry. The root brief's record is `docs/record/root.md`; the
issue named only `<area>`. The briefs' split is offered by `sync-standards` as its own piece
of work, never done as a side effect.

## 2026-11-12 — Process X: short form in §OWNER, the steps in their own file

The issue offered §OWNER or §GIT; §OWNER, because it is the owner's process and not a git
trigger. The seven steps as run in `godot-toll` are in `standards/process-x.md`, kept out of
the rules file, which every session loads (69 KB at v3.8.0). The file is copied to projects
through both reference lists so the rule's pointer resolves in a cloud session.

## 2026-11-12 — `.gitattributes`: the hook folder too, and this repository

Issue #20 covered `*.sh`. The credential hook is a shell script with no extension, so the
template also pins `.githooks/*`. This repository gets a `.gitattributes` for its own hook.
Found while testing: `tests/run.mjs` failed 14 frontmatter checks on a Windows checkout with
`core.autocrlf` on, before any change; it now normalises line endings before reading.

## 2026-11-12 — Skill descriptions stay plain YAML values, reworded rather than quoted

`checkpoint` and `relay` did not load: "Goal: " in an unquoted description breaks the
frontmatter. Reworded to drop the colon, and `tests/run.mjs` enforces it. Alternative turned
down: quoting the whole description — every description is full of double quotes and
apostrophes, each needing an escape, and `tests/run.mjs` and other agents' loaders read the
line as plain text. CI's `claude plugin validate .` did not catch it; adding
`claude plugin validate standards` to the workflow is left for the owner, since the workflow
file was the target of the CI attack and is not changed without being asked.

## 2026-11-12 — v4.0.0 planned: core and profiles

The owner's four choices, planning v4 (`docs/specs/v4.md`):

- **The rules file splits into a core and profiles** (web, game engine, non-application),
  over keeping one file with all fourteen open issues in it, or a documentation overhaul
  only. This reverses nothing from 2026-10-21: that entry declined a size budget, not a split.
- **Issues #20 to #33 all ship inside v4.** The agent recommended the five small fixes as a
  v3.9.0 first; the owner chose one release and one sync per project.
- **§SECURITY gains rules from the 11–12 November token attack**, over a relay check alone.
  A stolen token pushed a secret-stealing workflow to this repository's `main` three times
  (`fd454a6`, `d8d0206`, `8898dc3`), each followed by a "restore"; `main`'s content is
  identical to the v3.8.0 merge. The wording is a draft in the spec until the owner approves it.
- **Issue #26's after-compact hook is also written into each project's settings**, because
  cloud sessions load no plugin hooks, over keeping a short compact block for cloud.

Five more, the same day, closing the spec's open questions:

- **`project-rules.md` stays at the project root, profiles in `rules/` beside it**, over
  moving everything under `.claude/fleet/`.
- **Procedure moves from the core into skills in a later phase 5**, section by section on
  the owner's yes, over doing it during the split or not at all.
- **Process X is a process document**, as issue #29 proposes. The agent recommended a skill
  plus two lines in §OWNER, since a document has no trigger phrase and cannot be evaluated;
  the owner chose the document.
- **Branch protection on the default branch is a rule where the GitHub plan allows it**,
  over a recommendation.
- **§FIREBASE stays in the web profile; only §AI is read on demand.**

## 2026-11-12 — v4 also audits the standard, and motifs can be seen before they are picked

Two additions from the owner, the same day:

- **The standard gets its own Process X**, a whole audit of what exists, run **after the
  split**. The agent recommended auditing first, so the split would move only what survives;
  the owner chose split first. It replaces the "procedure into skills" phase recorded above,
  which becomes one kind of audit finding. Whether it ships inside v4.0.0 or as v4.1.0 is
  open in the spec.
- **`design-motif` gains "Show me"**: the owner's point is that motif names mean little
  until seen. Live sample tiles of three or four candidates on the project's own content,
  plus a static gallery of the catalogue; over live drafts alone or a gallery alone. A
  sample is a tile, over a hero section or a full page each, to keep a round cheap.

## 2026-11-12 — Major versions carry a theme, from v4

The owner's idea: each major version gets a codename and a look, as Android releases did,
and the README is designed in it. Themes need not share a series or follow the number. v4's
is not chosen. Also the owner, the same day: v4 is not in a hurry and is to be planned
properly. The agent's advice on where a theme may and may not appear is in the spec, as
advice, until the owner rules on it.

## 2026-11-12 — v4: three layers, quality over size, the audit inside the release

- **Three layers of files**: `project-rules.md` (how we work, every repository),
  `rules/app.md` (engineering for any application code), then the stack (`rules/web.md`,
  `rules/game.md`). Over one bigger core holding both, or a separate `rules/node.md`. It came
  from a gap the split map found: local Node tools are a fourth kind of repository, beside
  web projects, games and non-application repositories, and had no profile.
- **Quality over size.** The owner: "a compromise on size is okay if it means better
  workflow in the long run." So a non-application repository now imports the core, where it
  used to read sections on demand; and v4 has no size target. This replaces the spec's
  earlier size figures as an acceptance test; sizes are still recorded.
- **The Process X audit is inside v4.0.0.** The owner's order: handle every open proposal,
  then the audit and the adjustments it brings, then release. This settles the question left
  open earlier today (it had been written as v4.1.0).
- **Why v4 and no v3.9.0**: the owner's reason is that this is several updates in one, plus
  the audit, taken slowly and done properly.

## 2026-11-12 — v4 split map, rounds 1 to 3 with the owner

The owner's standing instruction for v4: quality for the long term; suggestions look at the
broader picture, not the short-term goal. Walked layer by layer (`docs/specs/v4-split-map.md`):

- **The files split by concern, not into three layers**: core, `rules/app.md`, `rules/ui.md`,
  `rules/node.md`, `rules/web.md`, `rules/game.md`, `rules/non-application.md` and
  `rules/options/`. This refines the "three layers" entry above.
- **`rules/node.md` is separate**, so `rules/app.md` stays true in any language; the owner's
  tools are not all Node. Over putting the Node sections in `app.md` (the agent's first
  recommendation) or leaving them in `web.md`.
- **`rules/ui.md` is separate.** The owner: agents lacking UI awareness has been an issue in
  a couple of projects.
- **§CREDIT and §TRELLO leave the core for a new category, options** (the owner's idea):
  things a project opts into at setup. §AI is filed there too.
- **§FIREBASE becomes an option**, reversing the earlier entry that kept it in the web
  profile. The owner: not every project needs Firebase; some may use Supabase or another
  backend. godot-toll, a game, already uses it.
- **§TESTING's universal lines go in the core** (the owner: every project needs testing),
  over `app.md` and `ui.md`.
- Every call that needs a rewording waits for the Process X audit, by the owner's ruling.
  Raised by the owner and parked there: a more robust package manager than npm, and
  JavaScript as a named choice for niche local projects.
- **Round 4 approved**: the seven structural wording changes, the `Rules:` / `Options:`
  line a project declares its files with, and a committed read-only script as the proof
  that no line was lost.
- **A machine inventory** (the owner's idea): `~/.claude/machine.md`, kept by a skill, so a
  project knows what tools the machine has before it proposes one. In the owner's own files,
  like the studio credit line, over a file in each project, which would repeat and drift.

## 2026-11-13 — v3.9.0 is not released: its work folds into v4.0.0

Two sessions ran apart on 2026-11-12. A cloud session planned v4 with the owner
(`docs/specs/v4.md`, the five entries above, written about 21:00) and decided all fourteen
issues ship inside v4 with no v3.9.0 first. A local session that had not fetched that branch
then built v3.9.0 with the same fourteen issues (the eight entries above it, from 21:30). The
owner's choice on finding both: **fold**. The built work stays, as v4's issue work done
ahead of the split; no v3.9.0 pull request is opened, and issues #20 to #33 close with v4.
Alternative turned down: release v3.9.0 first so the split starts from a released version
and `godot-toll` gets its profile now (the agent's recommendation) — two syncs per project,
against the plan's "one release, one sync".

What follows from it:

- **The split's baseline is the rules file as built** (76 KB, commit `1379baa`), not v3.8.0
  (`bbe46d6`). The split still changes no wording.
- **The version line reads 3.9.0 until phase 7**, where it becomes 4.0.0 and the changelog's
  3.9.0 entry is folded into 4.0.0's. Renaming it now was considered: it would put a release
  date on a version that is seven phases from release, and the map says not to touch the
  version before phase 7. Nothing reads the line from this branch; projects compare against
  `main`.
- **Where the plan and the built work differ, the built work stands**, each already recorded
  above: Process X's short form is in §OWNER; the game-engine profile is a block in §SCOPE,
  which the split moves to `rules/game.md` instead of phase 2 writing it new.
- The two branches are merged on the local branch, renamed `v4.0.0`. This file took both
  sides whole; the v3.9.0 entries sit above the v4 plan's although they were written after.

**The mistake worth keeping.** A session that starts work on a release fetches every remote
branch first and reads any status newer than its own. "No open work" was true of the clone,
not of the repository.

## 2026-11-13 — v4 phase 1: three calls made while splitting

- **§SCALE goes to the core.** The owner: "Yes, core". The alternative was `rules/app.md`.
- **The non-application profile keeps its §NAMING and §TESTING lines.** The split map
  replaced the profile's whole list with the `rules/ui.md` import, which would have dropped
  both rules, since neither is in a file the profile loads. Kept word for word by the agent;
  the owner: "Keep".
- **CI fetches full history** so `tests/split-check.mjs` can read the baseline commit. The
  owner's yes, after checking that `checks.yml` is the repository's own workflow from
  2026-10-21 and not the one the attack pushed. Alternative: a copy of the baseline file
  committed under `tests/` (76 KB of duplicate text, and a second thing to delete at the
  release).

## 2026-11-13 — `rules/options/ai.md` is read through an area file, not on memory

The owner's choice. A project that chose AI carries the "read it before any AI work" line
in the root `CLAUDE.md` and again in `src/lib/ai/CLAUDE.md`, which loads by itself when AI
code is read; `ai-setup` writes both and `sync-standards` adds them at the v4 sync.
Alternatives: the root line only (a line read at the start of a session is the thing §SCALE
says gets forgotten); importing the file like the other options (6.6 KB in every session,
reversing 2026-11-12). The area file holds an instruction, not an `@` import, so it reads
the same for agents that do not follow imports.

## 2026-11-13 — The game-engine profile, reworded for the split

`rules/game.md` now says what a game loads (the core, `app`, `ui`, `game`) instead of
listing Parts. Three things changed in substance, each because of where the split put a
section: its "not applicable" list shrinks to §LIFECYCLE and §DATA, since the Node and
Next.js files are simply not loaded; §PACKAGES is restated for add-ons in the file itself,
because a game no longer loads the section it pointed at; and "referenced, not imported"
goes, as it did for the non-application profile. One project's evidence still, on one engine.

## 2026-11-13 — The motif gallery: the bigger tile, locked

`standards/motif-gallery.html`, one tile for each of the 35 families: the same five pieces
(a heading, a paragraph, a button, a card, an input) in light, then in dark. Shown a
four-tile draft with light and dark side by side, the owner chose "Bigger tiles", one
scheme per row, so each sample is wider and shows more texture; the page is about twice as
long. Shown all 35, the owner: "Locked". The gallery is the deliverable, so it is its own
locked design and no copy is kept under `docs/design/`.

The agent's calls inside it: the page's own chrome is neutral, left for v4's theme in phase
7; tiles are drawn by a script from one list, so a family is one entry and one style block
(the alternative, 70 hand-written samples, drifts the first time the sample changes); the
sample text is neutral bookkeeping copy. Web fonts come from Google Fonts and fall back to
system fonts offline. Changing a tile now takes a new round with the owner.

## 2026-11-13 — §SECURITY: five rules from the token attack, as drafted

The owner: "Approve as worded", for the five sentences in `docs/specs/v4.md`. They are in
the core, so every repository loads them. The agent raised two points before the answer,
and neither was taken; both go to the phase 6 audit rather than being decided here:

- The branch-protection rule says "where the plan allows it" and stops. The 2026-11-12
  decision also had: where it does not, the gap is recorded in `conventions.md`.
- "Changes arrive by pull request" sits against §GIT, under which a single-branch project
  pushes to `main`.

With it, `relay` Step 4 lists commits that touch `.github/workflows/` or
`.claude/settings.json`. The agent added the remote's production branch to that check: the
attack pushed straight to `main`, where a look at the clone alone would not have seen it.

## 2026-11-13 — The machine inventory: a skill, a rule in §AGENTS, nothing in projects

Built as agreed on 2026-11-12. The agent's calls: the rule is a bullet in §AGENTS, beside
the other things an agent does before acting (alternatives: §TOOLS, which is about other
agents; its own section, for one rule). The skill is not copied into projects: the copies
exist for cloud sessions, which have no machine of the owner's. It asks before adding the
import line to `~/.claude/CLAUDE.md`, which is the owner's own file. It has no eval case:
its behaviour is a probe of a real machine, which a read-only eval cannot run.

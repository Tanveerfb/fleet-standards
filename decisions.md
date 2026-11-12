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

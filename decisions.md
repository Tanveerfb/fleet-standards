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

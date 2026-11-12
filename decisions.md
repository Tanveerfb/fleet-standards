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

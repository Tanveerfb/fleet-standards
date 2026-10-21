# fleet-standards — status

*The `checkpoint` skill's format (`standards/templates/STATUS.template.md`): the snapshot
above the session log is rewritten in place; the log is newest first.*

---

## Start here

**State:** v3.7.0 released to `main` by this checkpoint's `git CPR`, closing issues #9 to
#12. No open issues or pull requests.
**Next:** nothing queued. Wait for the next `[proposal]` issue; the open items below are
deferred, not pending.
**Blocked on:** nothing.
**Don't trust:** the behaviour evals ran once per case; one run is a baseline, not proof.

> **Things that will save a session:**
> - Cloud sessions do not install plugins. A cloud session on this repo has no fleet skills
>   loaded: read them from `standards/skills/` directly.
> - Files change through the editor tools, never the shell (§AGENTS) — this repo included.
> - `node tests/run.mjs` before every push; CI runs it too. `claude plugin validate .` passes
>   with one expected warning (no `version`).
> - Turn the credential hook on in each clone: `git config core.hooksPath standards/templates`.
> - Evals cost money; they are run by hand (`standards/evals/README.md`).

---

## What this project is

The fleet standard: one rules file (`standards/project-rules.md`) copied into each of the
owner's projects, the `fleet` Claude Code plugin that carries it with seven skills, templates
and a startup check, and an installer for other agents. Changes arrive as `[proposal]` issues
from projects, usually raised by `propose-standard`, and ship as versioned releases recorded
in `standards/CHANGELOG.md`. Why choices were made, with the alternatives, is in
[`decisions.md`](../decisions.md).

---

## Open items

1. **Rules file size** — 66 KB and growing; a budget and pruning pass was declined for now
   (`decisions.md`, 2026-10-21). Renumbered: the release item closed with this checkpoint.

---

## Verified this checkpoint, by measurement

- `node tests/run.mjs` — all checks pass on the v3.7.0 branch.
- `claude plugin validate .` — passes, one expected warning; also passes with no credentials
  and an empty home folder, so CI can run it.
- Behaviour evals — six cases, one run each: all scored 1.00; total cost $0.48.
- Credential hook — passes every tracked file in this repo and the plans repo; blocks eight
  fake key shapes under `sh` and `bash`; a real commit with a fake key was refused.

**The mistake worth keeping.** The first draft of `tests/run.mjs` tripped the hook it tests:
one fake key wrote the field name and the start of its value in a single string. The suite
caught it before the commit. Every fake is assembled from pieces for that reason — keep it so.

---

- CI on GitHub — the first run (push of `fced90b`) completed with success.

## Assumed, not verified

- Nothing carried forward on an earlier session's word.

---

## Confidence and gaps

The scripts and the hook are tested; the skills' prose is tested only by the evals, which
cover six behaviours. Anything outside those six — design-motif, ai-setup, new-project — is
reviewed by reading, not by running.

---

## Session log

### 2026-10-21 — v3.7.0, and the standard follows itself

Built v3.7.0: checkpoint proposes skills (the owner's proposal), local-only repos, the
credential hook, and the two profile fixes (issues #9 to #12). Then, on the owner's request
for suggestions: CI, the description budget, six behaviour evals, this file, `decisions.md`,
and the hook enabled on this repo. Declined: a rules-file size budget. Released with
`git CPR`; what a release means here is now written down in `docs/maintainer.md`, after it
had been worked out from history twice (v3.6.0, v3.7.0). That was the session's one repeated
procedure; a note covers it, so no skill was proposed.

### 2026-10-20 — v3.6.0 released (pull request #8)

Working branches commit on their own; the non-application profile; the startup sync check;
skill copies for cloud sessions; relay on "let's continue". Closed issues #6 and #7.

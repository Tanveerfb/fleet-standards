# fleet-standards — status

*The `checkpoint` skill's format (`standards/templates/STATUS.template.md`): the snapshot
above the session log is rewritten in place; the log is newest first.*

---

## Start here

**State:** v3.8.0 released to `main` by this checkpoint's `git CPR`, closing issues #15 to
#18 (cloud `git CPR`, §CREDIT showcase, the checkpoint pause, the shell-write hook). No open
issues.
**Next:** nothing queued. Wait for the next `[proposal]` issue.
**Blocked on:** the owner adding the `Studio credit:` line to `~/.claude/CLAUDE.md` on the PC,
before §CREDIT's questions can fire. The exact line, checked against the studio repo, is kept
in the owner's plans repo (`owner-setup.md`).
**Don't trust:** the behaviour evals ran once per case; one run is a baseline, not proof. The
shell-write hook is tested by `tests/run.mjs`, not yet in a live Windows session.

> **Things that will save a session:**
> - Cloud sessions do not install plugins. A cloud session on this repo has no fleet skills
>   loaded: read them from `standards/skills/` directly.
> - Files change through the editor tools, never the shell (§AGENTS) — this repo included.
> - `node tests/run.mjs` before every push; CI runs it too. `claude plugin validate .` passes
>   with one expected warning (no `version`).
> - Turn the credential hook on in each clone: `git config core.hooksPath standards/templates`.
> - Evals cost money; they are run by hand (`standards/evals/README.md`).
> - This repo registers the shell-write hook in `.claude/settings.json`: no `python -c`,
>   `node -e` or file-writing heredocs here either. A commit message heredoc is fine.

---

## What this project is

The fleet standard: one rules file (`standards/project-rules.md`) copied into each of the
owner's projects, the `fleet` Claude Code plugin that carries it with seven skills, templates,
a startup check and a shell-write guard, and an installer for other agents. Changes arrive as `[proposal]` issues
from projects, usually raised by `propose-standard`, and ship as versioned releases recorded
in `standards/CHANGELOG.md`. Why choices were made, with the alternatives, is in
[`decisions.md`](../decisions.md).

---

## Open items

1. **Rules file size** — 69 KB after v3.8.0, from 66 KB; a budget and pruning pass was
   declined for now (`decisions.md`, 2026-10-21).
2. **toll-kits and toll-the-game keep their own heredoc hooks** beside the fleet one. Worth
   checking at their next sync whether the stricter block is still wanted.

---

## Verified this checkpoint, by measurement

- `node tests/run.mjs` — all checks pass on the v3.8.0 branch, including 23 shell-write hook
  cases and the settings merge.
- `claude plugin validate .` — passes, one expected warning (no `version`).
- Behaviour evals — eight cases, all scored 1.00 with the skill and 0.00 or below without it
  (`checkpoint-local-only` passes without it too). Two needed their case fixed, not the skill: `cpr-single-branch`'s
  grader read the new closing question and the "production is updating" line as release
  steps, and `checkpoint-pause` let the agent skip the skill (it now checks the skill fired,
  and its grader says what is not a failure). Total cost this session: $1.35.

**The mistake worth keeping.** A judge model reads a grader literally. When a skill gains a
step, every grader that says "then stops" needs to say what may still follow — or a correct
answer fails, as `cpr-single-branch` did here.

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

### 2026-11-02 — v3.8.0 built: issues #15 to #18

Cloud `git CPR` on single-branch projects fast-forwards the main branch (#15); §CREDIT asks
every project about the credit and a studio-site showcase, filed as issues (#16); checkpoint
ends with one pause question (#17, with #16's update and the skill proposals in the same
prompt, by the owner's choice); the shell-write hook enforces §AGENTS, in the plugin and in
each project's settings (#18). Additions to the issues' wording are in `decisions.md`. The
agent used `sed -i` once while writing the hook — the very slip #18 exists for. The studio
credit line was written from the Tinker Together repo (attached read-only for it) and kept in
the plans repo's `owner-setup.md` for the owner to add on the PC. Two eval cases were fixed
(*Verified*, above). Released with `git CPR`.

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

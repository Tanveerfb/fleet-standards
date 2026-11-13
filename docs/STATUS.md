# fleet-standards — status

*The `checkpoint` skill's format (`standards/templates/STATUS.template.md`): the snapshot
above the session log is rewritten in place; the log is newest first.*

---

## Start here

**State:** v3.8.0 is on `main`. **v4.0.0: the fourteen issues are built and phase 1, the
split, is done** (`docs/specs/v4.md`, 2026-11-13). The rules file is now a core
(`project-rules.md`, 29 KB) and ten files under `standards/rules/`; `tests/split-check.mjs`
proves every line of the file as built is in exactly one of them. Issues #20 to #33 ship
with v4, and the standard gets its own Process X audit before the release. The issues were built as "v3.9.0" by a local session that had not seen
the plan; the owner folded that work into v4 on 2026-11-13, so **no v3.9.0 is released** and
the rules file's version line reads 3.9.0 until phase 7 (`decisions.md`, 2026-11-13). Plan
and built work are merged on the local branch `v4.0.0`, **not pushed**; the plan alone is on
`origin/claude/new-project-mockup-zp2h2z`. `main` is untouched.
**Next:** **phase 2, profiles** (`docs/specs/v4.md`, *Built ahead of the split* says what
is left of it): reword `rules/game.md` and the game block in the conventions template, which
still speak of Part A and of referencing the rules; the same for
`rules/non-application.md`; the on-demand trigger for `rules/options/ai.md`. Two things
from phase 1 wait for the owner, both in `docs/specs/v4-split-map.md` under *Phase 1, as
built*: whether the non-application profile keeps its §NAMING and §TESTING lines, and the
split check in CI.
**What each kind loads after the split** (before: 76.5 KB, or nothing for a profile project
that only referenced the file): web 59.9 KB plus its options; Node tool 42.0; game 44.4;
non-application 32.0, or 39.5 with a visual surface. Options: credit 4.2, Firebase 3.0,
Trello 1.5; AI 6.6, read on demand.
**Blocked on:** nothing. Open in the spec, needed only later: the §SECURITY wording (phase
5) and v4's theme name (phase 7).
**The owner's rule for v4:** quality for the long term, over speed and over size. No hurry.
Suggestions look at the broader picture. Every call that needs a rewording waits for the
audit (the list is at the end of the split map).
**Confirmed 2026-11-13, on the PC:** the `Studio credit:` line is in the owner's
`~/.claude/CLAUDE.md`. **Not confirmed from here:** `main` is to be protected by the owner
(the steps are in the plans repo's `owner-setup.md`).
**Security, 2026-11-12:** a stolen GitHub token pushed a secret-stealing workflow to `main`
three times on 11–12 November, each followed by a "restore". `main`'s content equals the
v3.8.0 merge (`bbe46d6`); the three workflow runs are gone from the Actions list. The owner's
incident record is in Drive. Not confirmed from here: whether this repo held Actions secrets.
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

1. **Rules file size** — 76.5 KB as built for v4, from 69 KB at v3.8.0. No budget: the
   owner ruled quality over size (`docs/specs/v4.md`); the phase 6 audit records sizes.
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

### 2026-11-12 — v4 planned with the owner; nothing built

Relay found fourteen open proposals and the token attack's three pushes to `main` (content
unchanged; the owner confirms the incident is closed). Then v4 was planned end to end with
the owner: `docs/specs/v4.md` (seven phases) and `docs/specs/v4-split-map.md` (where every
section goes, walked through in four rounds). The owner added, beyond the issues: a Process
X audit of the standard inside v4, motif previews ("Show me" and a gallery), a theme for
each major version, options as a category (credit, Trello, Firebase, AI), and a machine
inventory. Parked for the audit: a package manager beyond npm, JavaScript as a named choice.
Every decision and its alternatives is in `decisions.md` under this date. No rule, skill or
script changed; the tests pass as before.

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

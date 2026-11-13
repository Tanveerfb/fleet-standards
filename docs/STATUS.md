# fleet-standards — status

*The `checkpoint` skill's format (`standards/templates/STATUS.template.md`): this file is the
snapshot, rewritten in place: what is true now, never a stack. **History lives in
[`docs/log.md`](./log.md)**, which nothing loads by default.*

---

## Start here

**State:** v3.8.0 is on `main`. **v4.0.0 is in progress: phases 1 to 3 of seven are done**
(`docs/specs/v4.md`). The rules file is a core (`standards/project-rules.md`, 29 KB) and ten
files under `standards/rules/`; the fourteen issues (#20 to #33) are built; the game and
non-application profiles are reworded for the split; eleven behaviour evals exist and the three new ones pass. **No v3.9.0
is released**: that work is folded into v4, and the rules file's version line reads 3.9.0
until phase 7 (`decisions.md`, 2026-11-13). All of it is pushed to the working branch
`origin/claude/new-project-mockup-zp2h2z`; on the PC the local branch tracking it is named
`v4.0.0`. `main` is untouched.
**Phase 4, motif previews, is done** (2026-11-13): "Show me" is a fifth way into
`design-motif`, and `standards/motif-gallery.html` has a sample tile for all 35 families.
The gallery is **locked** by the owner (`decisions.md`, 2026-11-13): changing a tile takes
a new round.
**Next:** **phase 5** (`docs/specs/v4.md`). Done of it: relay's workflow check (Step 4).
Left: the §SECURITY additions, whose wording needs the owner's approval before it is
written in; the machine inventory (a new skill, a core rule, the README).
**Live:** the §SECURITY wording is in front of the owner. The owner works on the PC in the
desktop app and answers choices through the question prompt.
**Blocked on:** nothing. Open in the spec, needed only later: the §SECURITY wording (phase
5) and v4's theme name (phase 7).
**The owner's rule for v4:** quality for the long term, over speed and over size. No hurry.
Suggestions look at the broader picture. Every call that needs a rewording waits for the
audit (the list is at the end of the split map).
**What each kind loads** (before the split: 76.5 KB, or nothing for a profile project that
only referenced the file): web 59.9 KB plus its options; Node tool 42.0; game 44.4;
non-application 32.0, or 39.5 with a visual surface. Options: credit 4.2, Firebase 3.0,
Trello 1.5; AI 6.6, read on demand.
**Security:** a stolen GitHub token pushed a secret-stealing workflow to `main` three times
on 11–12 November 2026, each followed by a "restore". `main`'s content equals the v3.8.0
merge (`bbe46d6`) plus `SECURITY.md`. `.github/workflows/` holds only `checks.yml`, the
repository's own workflow from `fced90b` (2026-10-21), identical on `main` but for one line
on the working branch (`fetch-depth: 0`, the owner's yes); it is the only workflow GitHub
lists, and no Actions secrets are set. The owner's incident record is in Drive.
**Not confirmed from here:** whether `main` is protected yet (the steps are in the plans
repo's `owner-setup.md`); whether the repository held Actions secrets during the attack.
**Don't trust:** each behaviour eval ran once; one run is a baseline, not proof. The eight
older cases last ran on 2026-11-12, before the split changed `sync-standards`, `ai-setup`
and `new-project`; none of the ten cases covers those three skills.

> **Things that will save a session:**
> - **Fetch every remote branch before starting release work**, and read any status newer
>   than the clone's. Two sessions built apart on 2026-11-12 because one did not.
> - Cloud sessions do not install plugins. A cloud session on this repo has no fleet skills
>   loaded: read them from `standards/skills/` directly.
> - Files change through the editor tools, never the shell (§AGENTS) — this repo included.
>   The shell-write hook is registered in `.claude/settings.json` and refuses `python -c`,
>   `node -e` and file-writing heredocs. A commit message heredoc is fine.
> - `node tests/run.mjs` before every push; CI runs it too. `claude plugin validate .` and
>   `claude plugin validate standards` pass with one expected warning each.
> - `tests/split-check.mjs` fails on any change to a rules file that is not listed in
>   `tests/split-intended.json`. Until v4 is released, a wording change adds its old and new
>   lines there.
> - Turn the credential hook on in each clone: `git config core.hooksPath standards/templates`.
> - Evals cost money; they are run by hand, one `--case` at a time
>   (`standards/evals/README.md`). The runner takes no brace list.

---

## What this project is

The fleet standard: a core rules file (`standards/project-rules.md`) and the files under
`standards/rules/`, copied into each of the owner's projects according to what the project
is; the `fleet` Claude Code plugin that carries them with seven skills, templates, a startup
check, a relay-after-compact hook and a shell-write guard; and an installer for other
agents. Changes arrive as `[proposal]` issues from projects, usually raised by
`propose-standard`, and ship as versioned releases recorded in `standards/CHANGELOG.md`.
Why choices were made, with the alternatives, is in [`decisions.md`](../decisions.md).

---

## Open items

1. **v4 phases 5 to 7** — security rules, the machine inventory and relay's workflow check; the Process X audit of the standard; theme, pilot syncs and release
   (`docs/specs/v4.md`).
2. **Documents that still describe one rules file**, left for phase 7: `README.md`,
   `standards/adopting-the-standard.md`, `docs/maintainer.md`, and `standards/CHANGELOG.md`,
   which has a dated 3.9.0 entry for a version that was never released.
3. **`claude plugin validate standards` is not in CI.** Only that form parses each skill's
   frontmatter. Left for the owner: it changes the workflow file.
4. **toll-kits and toll-the-game keep their own heredoc hooks** beside the fleet one. Worth
   checking at their next sync whether the stricter block is still wanted.

---

## Verified, by measurement (2026-11-13)

- `node tests/run.mjs` — all checks pass, including the rules set (one version, §SCOPE's
  table against the folder, no section repeated but the four that divide) and the split
  check: 1035 baseline lines, each in exactly one of 11 files; 31 removed and 105 added on
  purpose.
- `claude plugin validate .` and `claude plugin validate standards` — pass, one expected
  warning each.
- CI — success on the working branch, with the split check running in full.
- Behaviour evals — the two new cases, `relay-after-compact` and `checkpoint-log-split`,
  score 1.00 with the skill and 0.00 without.
- The shell-write hook refused a real inline script in a live Windows session.
- `sync-rules.mjs --apply` on two scratch projects: a declared set is copied, a project with
  no `Rules:` line is skipped.

## Assumed, not verified

- The eight older eval cases still pass. They were not re-run after the split.
- `sync-standards`' v4 step, `ai-setup`'s area file and `new-project`'s copy of the set are
  written and read through, never run against a project. The pilot syncs in phase 7 are
  their first real use.

---

## Confidence and gaps

The scripts, the hooks and the split are tested. The skills' prose is tested only by the
evals, which cover relay's triggers, the git step, skill proposals, the pause and the log
split. Anything outside those — design-motif, ai-setup, new-project, sync-standards — is
reviewed by reading, not by running.

---

*The session log is [`docs/log.md`](./log.md), newest first. The latest entry there names
this checkpoint's commits.*

# fleet-standards — status

*The `checkpoint` skill's format (`standards/templates/STATUS.template.md`): this file is the
snapshot, rewritten in place: what is true now, never a stack. **History lives in
[`docs/log.md`](./log.md)**, which nothing loads by default.*

---

## Start here

**State:** **v4.0.0 · Satluj is released to `main`** by the 2026-11-18 checkpoint's
`git CPR max`, as a merge pull request from the working branch
`claude/new-project-mockup-zp2h2z` (local branch `v4.0.0`). The newest entry of
`docs/log.md` names the pull request; if `main` does not hold `standards/rules/`, the release
did not land and that entry says why. All seven phases of v4 are done.
**Next:** nothing is in flight. Projects sync to v4 when their owner next works in them
(`decisions.md`, 2026-11-18: real pilot syncs after the release); the dry run's reports for
five of them are in `docs/audits/2026-11-18-pilot-dry-run.md`, a head start for those syncs.
The open items below are the owner's.
**Blocked on:** nothing.
**Don't trust:** no `sync-standards` has run against a real project on v4 — only the
read-only dry run; the pilot fixes (P1 to P17) are written and, where they touch a script,
tested, never seen on a project. `new-project` for any kind has never run. The installer's
three crash fixes were read, not tested. The PowerShell half of the shell-write guard is
tested, never seen live.
**Live:** the owner follows over Remote Control as well as on the PC, answers choices in a
line, and keeps one session going: checkpoint, compact, continue. The release ran overnight
on the agent's calls, each recorded in `decisions.md` ("The release ran overnight"): read
them first. **After a compact nothing runs relay by itself here** until the plugin is
updated (below), so read this file and the newest entry of `docs/log.md` before anything else.

> **Things that will save a session:**
> - **Update the installed `fleet` plugin** (`/plugin marketplace update tanveerfb`, then
>   `/reload-plugins`). Until then the PC runs v3.8.0's copy, whose `checkpoint` and `relay`
>   do not load (a frontmatter fault fixed in v4) and which has no relay-after-compact hook.
>   This repository has no `CLAUDE.md` of its own.
> - **Fetch every remote branch before starting release work**, and read any status newer
>   than the clone's. Two sessions built apart on 2026-11-12 because one did not.
> - Files change through the editor tools, never the shell (§AGENTS) — this repo included.
>   The shell-write hook is registered in `.claude/settings.json` for Bash and PowerShell and
>   refuses inline scripts (`node -e`, `python -c`), `echo` or `printf` to a file, `sed -i`
>   and file-writing heredocs. A commit message heredoc is fine, and so is a command's own
>   output sent to a file.
> - `node tests/run.mjs` before every push; CI runs it too. `claude plugin validate .` and
>   `claude plugin validate standards` pass with one expected warning each (no `version`).
> - After a push, wait for CI: `gh run watch <id> --exit-status` on the run whose head is
>   the pushed commit.
> - Turn the credential hook on in each clone: `git config core.hooksPath standards/templates`.
> - Evals cost money; they are run by hand, one `--case` at a time
>   (`standards/evals/README.md`). The runner takes no brace list, and runs a no-plugin arm
>   beside each case, so a case costs about $0.20 to $0.30.
> - Cloud sessions do not install plugins. A cloud session on this repo has no fleet skills
>   loaded: read them from `standards/skills/` directly.

---

## What this project is

The fleet standard: a core rules file (`standards/project-rules.md`) every repository loads,
and the files under `standards/rules/` a project loads by its kind and options; the `fleet`
Claude Code plugin that carries them with eight skills, templates, a startup check, a
relay-after-compact hook and a shell-write guard; and an installer for other agents. Changes
arrive as `[proposal]` issues from projects, usually raised by `propose-standard`, and ship as
versioned, named releases recorded in `standards/CHANGELOG.md` (v4 Satluj, then Beas, Ravi,
Chenab, Jhelum). Why choices were made, with the alternatives, is in
[`decisions.md`](../decisions.md).

---

## Current state

**v4.0.0 · Satluj**, released 2026-11-18. The plan was `docs/specs/v4.md`; what each kind
loads, measured at this checkpoint (bytes): core 32,426; web project 62,721; Node tool
46,611; Python tool 42,584; game 47,895; non-application 35,402, or 42,386 with a visual
surface. Options: Firebase 3,344; AI 6,637 and credit 4,306, both read on demand. Skills:
`checkpoint` 38,650, `sync-standards` 31,144, `new-project` 16,891, `relay` 16,836.

| Phase | State |
| --- | --- |
| 1. The split | Done; proved word for word by `tests/split-check.mjs` until the release, which removed it (I4) |
| 2. Profiles | Done: `rules/game.md` §GAME, `rules/non-application.md` §NONAPP; AI read through an area file |
| 3. Documents and sessions | Done: two evals; this file split from `docs/log.md` |
| 4. Motif previews | Done: "Show me", `standards/motif-gallery.html`, 35 tiles, locked |
| 5. Security, machine inventory | Done: five §SECURITY rules; relay's check for unexplained workflow and settings changes; `machine-inventory` |
| 6. Process X on the standard | Done: `docs/specs/v4-audit.md`, every pick built (I4 at the release); Fable's review, R1 to R15 built (`docs/audits/`) |
| 7. Theme and release | Done: the README banner (`docs/assets/`), the 4.0.0 changelog with its section table and *What a project must change* (15 items, sync checks a to m), group G's documents, the pilot dry run and its fourteen fixes, all fifteen evals, the version bump, I4, the release |

---

## Security

A stolen GitHub token pushed a secret-stealing workflow to `main` three times on 11–12
November 2026, each followed by a "restore". `.github/workflows/` holds only `checks.yml`,
the repository's own workflow; the release removed its one v4 line (`fetch-depth: 0`, on the
owner's yes). No Actions secrets are set. The owner's incident record is in Drive.

**`main` is not protected** (checked 2026-11-18: the API answers 404, "Branch not
protected", so the plan allows it). §SECURITY says it should be; turning it on is the
owner's setting (the steps are in the plans repo's `owner-setup.md`, and `sync-standards`
check m now offers it in projects).

**The owner was told, and it is theirs to act on:** a file named `comfy_api_key.txt` sits in
plain text in `E:\Installed`. It was not opened.

---

## Open items

1. **Protect `main`** (above). The owner's setting.
2. **Update the installed plugin** on the PC (above), then let projects sync to v4 as they
   are next worked on; the dry-run reports are a head start. `toll-kits` stops at its
   `rules/` folder (a hook mirrors files into it), and `godot-toll` and `toll-kits` keep their
   own `relay` and `checkpoint`.
3. **GitHub's private vulnerability reporting is off** on the repository (checked
   2026-11-18), so `SECURITY.md` names the owner as the channel. Turning it on is the
   owner's setting; then that line can point at it.
4. **`ai-setup` and `machine-inventory` have no eval case.** The other fifteen ran
   2026-11-18.
5. **A second Fable review** to see whether the score moved from 7 out of 10: offered, not
   asked for (about $1.50 to $3 with the cache cold).
6. **The machine file's local-models section is empty**: Ollama was not running when
   `machine-inventory` ran. Start Ollama and run the skill again.
7. **toll-kits and toll-the-game keep their own heredoc hooks** beside the fleet one. Worth
   checking at their next sync whether the stricter block is still wanted.
8. **Not decided:** whether a minor release repeats its major's river name.
   `docs/maintainer.md` treats the name as the major version's.

---

## Confidence and gaps

**Verified at this checkpoint (2026-11-18):**
- `node tests/run.mjs`: all checks pass. `claude plugin validate .` and
  `claude plugin validate standards`: pass, one warning each (no `version`).
- CI: success on the working branch at `dde8008`, the release's last commit before this
  checkpoint.
- **Behaviour evals, all fifteen, with the plugin: 1.00 each.** Thirteen on the first run;
  `sync-asks-first` after its grader was brought in line with R10 and P13;
  `relay-after-compact` on a rerun with nothing changed. Without the plugin, most score 0;
  `checkpoint-multi-branch`, `checkpoint-local-only` and `checkpoint-log-split` 0.67, and
  `relay-after-compact` 0.67 on the rerun. About $4.60 in all, the two reruns included.
- The sizes in *Current state*, by `wc -c`.
- The branch merged into `main` cleanly before the release (`git merge-tree`).
- The pilot dry run read five real projects and changed nothing in them.
- The banner renders: ਸਤਲੁਜ's vowel sign sits under ਲ (seen at 3.5×).

**Assumed, not verified:**
- That `sync-standards`, `new-project` for each kind, `ai-setup` and `design-motif` behave on
  real projects as written; the evals are single prompts in an empty folder.
- That the banner and badges look right on GitHub itself.
- That `~/.claude/machine.md` loads (it takes a new session to see).

**First thing to check coming back cold:** that `main` holds v4.0.0 (`git log origin/main -3`
and `standards/rules/` on `main`), and that CI passed there.

---

*The session log is [`docs/log.md`](./log.md), newest first. The latest entry there names
this checkpoint's commits.*

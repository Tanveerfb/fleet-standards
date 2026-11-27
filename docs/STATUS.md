# fleet-standards — status

*The `checkpoint` skill's format (`standards/templates/STATUS.template.md`): this file is the
snapshot, rewritten in place: what is true now, never a stack. **History lives in
[`docs/log.md`](./log.md)**, which nothing loads by default.*

---

## Start here

**State:** **v4.1.0 · Satluj is released to `main`** by the 2026-11-27 checkpoint's
`git CPR max`, as a merge pull request from the working branch
`claude/new-project-mockup-zp2h2z` (local branch `v4.0.0`, its name from the earlier
release). The newest entry of `docs/log.md` names the pull request; if `main`'s version line
does not read 4.1.0, the release did not land and that entry says why.
**Next:** nothing is in flight. The two repositories the pilot synced
(`tinker-together` and its admin) hold copies from before the pilot's own fixes, uncommitted
until their owner's checkpoint there: a second sync after the plugin updates brings them the
fixes. Other projects sync as they are next worked on; the update check now tells them.
**Blocked on:** nothing.
**Don't trust:** the pilot's fixes T1 to T9 have tests where they are script changes (LF
comparison, `--credential-hook`, the leftover-file report) and are wording elsewhere; no
sync has run since them. The update check ran live once, from this checkout, never from an
installed plugin after a resume. `new-project` for any kind has never run. The two gates
templates have never run in a repository. `session-family` as a fleet skill has never set a
family up.
**Live:** the owner follows over Remote Control as well as on the PC, answers choices in a
line, and keeps one session going: checkpoint, compact, continue. They asked that a better
option, where one is seen, be put to them with the question tool. Other local sessions can
be messaged when the owner says so ("Tinker Together Main" ran the pilot); a message there
carries no approval.

> **Things that will save a session:**
> - **Update the installed `fleet` plugin after a release**
>   (`claude plugin marketplace update tanveerfb`, then `/reload-plugins`): the marketplace's
>   auto-update is off on this PC. From v4.1 the update check says so by itself. This
>   repository has no `CLAUDE.md` of its own.
> - **Fetch every remote branch before starting release work**, and read any status newer
>   than the clone's.
> - Files change through the editor tools, never the shell (§AGENTS) — this repo included.
>   The shell-write hook refuses inline scripts (`node -e`, `python -c`), `echo` or `printf`
>   to a file, `sed -i` and file-writing heredocs. A commit message heredoc is fine, and so
>   is a command's own output sent to a file.
> - **Git Bash here gives Node `/e/...` paths that resolve wrongly, and `cd` into a temp
>   folder breaks fnm.** Run `node` from the repository root with `E:/...` or `C:/...` paths.
> - `node tests/run.mjs` before every push; CI runs it too. `claude plugin validate .` and
>   `claude plugin validate standards` pass with one expected warning each (no `version`).
> - After a push, wait for CI: `gh run watch <id> --exit-status` on the run whose head is
>   the pushed commit.
> - Turn the credential hook on in each clone: `git config core.hooksPath standards/templates`.
> - Evals cost money; they are run by hand, one `--case` at a time
>   (`standards/evals/README.md`): about $0.27 a case, with its no-plugin arm. **Do not edit
>   anything under `standards/` while they run**: they load the plugin from this folder.
> - **A release rebuilds the banner** with its version (`docs/assets/make-banner.mjs`); the
>   fonts and the tool are downloaded to a scratch folder on the owner's yes, and the
>   scratchpad does not last between sessions.
> - Cloud sessions do not install plugins: read the skills from `standards/skills/` directly.

---

## What this project is

The fleet standard: a core rules file (`standards/project-rules.md`) every repository loads,
and the files under `standards/rules/` a project loads by its kind and options; the `fleet`
Claude Code plugin that carries them with nine skills, templates, an update check, a
relay-after-compact hook and a shell-write guard; and an installer for other agents. Changes
arrive as `[proposal]` issues from projects, usually raised by `propose-standard`, and ship as
versioned, named releases recorded in `standards/CHANGELOG.md` (v4 Satluj, then Beas, Ravi,
Chenab, Jhelum; a minor release carries its major's name). Why choices were made, with the
alternatives, is in [`decisions.md`](../decisions.md).

---

## Current state

**v4.1.0 · Satluj**, released 2026-11-27 (`docs/specs/v4.1.md`; v4.0.0 was 2026-11-18,
`docs/specs/v4.md`). What each kind loads, measured at this checkpoint (bytes): core 34,099;
web project 67,180; Node tool 48,781; Python tool 44,488; game 50,040; non-application
37,075, or 44,531 with a visual surface. The family option is 2,387. Skills: `checkpoint`
44,175, `sync-standards` 37,795, `relay` 19,696, `new-project` 17,515, `session-family`
9,942.

- **Rules:** a core and seven kind files; options Firebase, SQLite, Trello (imported), AI
  and the credit (read on demand), and a family of sessions (only when the owner asks).
- **Skills (nine):** `checkpoint`, `relay`, `new-project`, `design-motif`, `ai-setup`,
  `sync-standards` (checks a to o), `propose-standard`, `machine-inventory`,
  `session-family`.
- **Scripts:** the update check (asks GitHub once a day; runs on startup, resume and
  compact), relay after a compact, the shell-write guard, the skill copier (LF throughout;
  `--hooks-only`, `--credential-hook`, `--remove-stale`), the installer, the fleet report,
  the *Rules* line's reader.
- **Templates:** the project documents, the credential hook, `.gitattributes`, and two CI
  workflows (`gates.yml`, `gates-python.yml`).
- **Evals:** seventeen cases.

---

## Security

A stolen GitHub token pushed a secret-stealing workflow to `main` three times on 11–12
November 2026. `.github/workflows/` holds only `checks.yml`, the repository's own workflow.
No Actions secrets are set. The owner's incident record is in Drive.

**`main` is protected by a ruleset** ("Main", the owner's, read back 2026-11-27: deletion
and force pushes refused; pull requests are not required).

**The owner was told, and it is theirs to act on:** a file named `comfy_api_key.txt` sits in
plain text in `E:\Installed`. It was not opened.

---

## Open items

1. **The owner's machine-wide `session-family` skill** (`~/.claude/skills/session-family/`)
   now has a fleet twin. Removing the machine-wide one, once the plugin is updated, is the
   owner's.
2. **Sync the two pilot repositories again** after the plugin updates, to pick up T1 to T9;
   it is also the first test of those fixes.
3. **G6 was not picked:** relay's credential-hook check is wrong on a husky project, and in
   a cloud session would switch husky off (`docs/specs/v4.1.md`).
4. **This repository's own `checks.yml` pins `checkout` and `setup-node` at v4.4.0**; the
   templates moved to v7. A workflow edit, so the owner's yes.
5. **GitHub's private vulnerability reporting is off** (checked 2026-11-18), so `SECURITY.md`
   names the owner as the channel.
6. **`ai-setup`, `machine-inventory` and `session-family` have no eval case.**
7. **A second Fable review** of the standard: offered on 2026-11-18, not asked for.
8. **The machine file's local-models section is empty** (Ollama was not running).
9. **toll-kits and toll-the-game keep their own heredoc hooks** beside the fleet one.

---

## Confidence and gaps

**Verified at this checkpoint (2026-11-27):**
- `node tests/run.mjs`: all checks pass, among them the version agreement (rules 4.1.0,
  changelog 4.1.0 dated 2026-11-27, README the same). Both plugin validations pass, one
  warning each.
- CI: success on the working branch at `0bc80a7`, the last push before the release commits.
- **All seventeen evals, with the plugin: 1.00** on the skills as released.
- Two real syncs, by the project's own session, on the owner's answers.
- The update check fetched `main`'s version from GitHub and cached it (4.0.0 at the time).
- The banner renders with `v4.1.0` and ਸਤਲੁਜ intact (seen in the browser).
- The sizes in *Current state*, by `wc -c`; the README's two size claims corrected to match.
- The branch merges into `main` cleanly (`git merge-tree`, before the release commits).

**Assumed, not verified:**
- That the pilot's fixes behave on a real project; that `new-project`, the gates templates
  and `session-family` work as written.
- That the update check speaks from an installed plugin on a resumed session: tested by
  script, not seen in a session.
- Nine of the twelve checkpoint and relay findings were built from the auditor's line
  references; each was read against the skill text as it was fixed, none by a run.

**First thing to check coming back cold:** `git log origin/main -3` and `main`'s version
line (4.1.0), and that the nine proposal issues closed.

---

*The session log is [`docs/log.md`](./log.md), newest first. The latest entry there names
this checkpoint's commits.*

# fleet-standards — status

*The `checkpoint` skill's format (`standards/templates/STATUS.template.md`): this file is the
snapshot, rewritten in place: what is true now, never a stack. **History lives in
[`docs/log.md`](./log.md)**, which nothing loads by default.*

---

## Start here

**State:** v3.8.0 is on `main`. **v4.0.0 is in progress on the working branch
`origin/claude/new-project-mockup-zp2h2z`** (local branch `v4.0.0`): phases 1 to 5 of seven
are done and phase 6, the audit of the standard, is picked and partly built. `main` is
untouched; nothing is released.
**Next:** **build the rest of the audit's picks.** Open `docs/specs/v4-audit.md`, go to
*Picks and outcomes*, and take the next unbuilt finding: one commit per finding, named
`audit <id>`. Groups A, B and C are built; start with D1.
**Blocked on:** nothing. Group K in the audit is seven questions only the owner can answer.
**Don't trust:** the PowerShell half of the shell-write guard is tested by `tests/run.mjs`
only, never seen refusing in a live session. Each behaviour eval ran once; the eight older
ones last ran before the split.
**Live:** the owner is on the PC in the desktop app, answers choices through the question
prompt, and means to compact this session and continue in it. **After the compact nothing
runs relay by itself here** (the installed plugin is `main`'s: see the first line under
*Things that will save a session*), so read this file and the newest entry of `docs/log.md`
before anything else.

> **Things that will save a session:**
> - **On the PC, the installed `fleet` plugin is `main`'s (v3.8.0).** Its `checkpoint` and
>   `relay` do not load (a frontmatter fault fixed on this branch) and it has no
>   relay-after-compact hook. Read both skills from `standards/skills/` and follow them by
>   hand. This repository has no `CLAUDE.md` of its own.
> - **Fetch every remote branch before starting release work**, and read any status newer
>   than the clone's. Two sessions built apart on 2026-11-12 because one did not.
> - **A change to a rules file** adds its old and new lines to `tests/split-intended.json`,
>   or `tests/split-check.mjs` fails. Until v4 is released.
> - Files change through the editor tools, never the shell (§AGENTS) — this repo included.
>   The shell-write hook is registered in `.claude/settings.json` for Bash and PowerShell and
>   refuses inline scripts, `echo` or `printf` to a file, `sed -i` and file-writing heredocs.
>   A commit message heredoc is fine, and so is a command's own output sent to a file.
> - `node tests/run.mjs` before every push; CI runs it too. `claude plugin validate .` and
>   `claude plugin validate standards` pass with one expected warning each.
> - After a push, wait for CI: `gh run watch <id> --exit-status` on the newest run of the
>   branch.
> - Turn the credential hook on in each clone: `git config core.hooksPath standards/templates`.
> - Evals cost money; they are run by hand, one `--case` at a time
>   (`standards/evals/README.md`). The runner takes no brace list.
> - Cloud sessions do not install plugins. A cloud session on this repo has no fleet skills
>   loaded: read them from `standards/skills/` directly.

---

## What this project is

The fleet standard: a core rules file (`standards/project-rules.md`) and the files under
`standards/rules/`, copied into each of the owner's projects according to what the project
is; the `fleet` Claude Code plugin that carries them with eight skills, templates, a startup
check, a relay-after-compact hook and a shell-write guard; and an installer for other
agents. Changes arrive as `[proposal]` issues from projects, usually raised by
`propose-standard`, and ship as versioned releases recorded in `standards/CHANGELOG.md`.
Why choices were made, with the alternatives, is in [`decisions.md`](../decisions.md).

---

## Where v4 stands

The plan is `docs/specs/v4.md`; its *Built ahead of the split* section says what each phase
left. **No v3.9.0 is released**: that work is folded into v4, and the rules file's version
line reads 3.9.0 until phase 7 (`decisions.md`, 2026-11-13).

| Phase | State |
| --- | --- |
| 1. The split | Done. A core (31 KB) and ten files under `standards/rules/`; `tests/split-check.mjs` proves every line of the file as built is in exactly one of them, or on the list of intended changes |
| 2. Profiles | Done. `rules/game.md` and `rules/non-application.md` reworded; `rules/options/ai.md` is read through a line in the root `CLAUDE.md` and in `src/lib/ai/CLAUDE.md` |
| 3. Documents and sessions | Done. Two evals; this file split from `docs/log.md` |
| 4. Motif previews | Done. "Show me" in `design-motif`; `standards/motif-gallery.html`, 35 tiles, **locked** by the owner: changing a tile takes a new round |
| 5. Security, machine inventory | Done. Five §SECURITY rules; relay's check for unexplained workflow and settings changes; the `machine-inventory` skill and the §AGENTS rule that reads its file |
| 6. Process X on the standard | **Picked, partly built.** `docs/specs/v4-audit.md`: about 90 findings, the owner picked the recommended set. Built: groups A, B and C, E1, E4, I3. Left: about 33 |
| 7. Theme and release | Not started. Needs the owner's theme name. Group G in the audit is its list of documents to rewrite |

**What each kind loads** (before the split: 76.5 KB, or nothing for a profile project that
only referenced the file), measured 2026-11-13: web 62 KB plus its options; Node tool 44;
game 47; non-application 34, or 42 with a visual surface. Options: credit 4.2, Firebase 3.0, Trello
1.5; AI 6.6, read on demand. The audit's groups D and E will move these.

---

## Security

A stolen GitHub token pushed a secret-stealing workflow to `main` three times on 11–12
November 2026, each followed by a "restore". `main`'s content equals the v3.8.0 merge
(`bbe46d6`) plus `SECURITY.md`. `.github/workflows/` holds only `checks.yml`, the
repository's own workflow from `fced90b` (2026-10-21), identical on `main` but for one line
on the working branch (`fetch-depth: 0`, the owner's yes); it is the only workflow GitHub
lists, and no Actions secrets are set. The owner's incident record is in Drive.

**Not confirmed from here:** whether `main` is protected yet (the steps are in the plans
repo's `owner-setup.md`); whether the repository held Actions secrets during the attack.

**The owner was told, and it is theirs to act on:** a file named `comfy_api_key.txt` sits in
plain text in `E:\Installed`. It was not opened.

---

## Open items

1. **The audit's picks** — about 33 left (`docs/specs/v4-audit.md`, *Picks and outcomes*).
   The large ones: D1 (`rules/app.md` made language-neutral), E2 (§GIT trimmed to its
   rules).
2. **Group K, seven questions for the owner** — a package manager beyond npm, JavaScript as
   a named choice, the cases where agents missed interface rules, when to split a
   `CLAUDE.md`, and three smaller ones.
3. **Phase 7** — the theme name, the themed README, the changelog's 4.0.0 entry with a
   section-to-file table, `adopting-the-standard.md`, `docs/maintainer.md`, pilot syncs of
   one project of each kind, all eleven evals run once, then the release.
4. **The machine file's local-models section is empty**: Ollama was not running when
   `machine-inventory` ran. Start Ollama and run the skill again.
5. **toll-kits and toll-the-game keep their own heredoc hooks** beside the fleet one. Worth
   checking at their next sync whether the stricter block is still wanted.

---

## Verified, by measurement (2026-11-13, and 2026-11-17 where dated)

- `node tests/run.mjs` — all checks pass (2026-11-17): the rules set, the gallery (35
  families, each with a tile in its group and order), the split check, the shell-write
  guard's 100-odd cases for both shells, and the scripts: the startup check's declared-set
  report, the *Rules* line reader, the fleet report, the installer, stale skill copies and
  every hook path.
- `claude plugin validate .` and `claude plugin validate standards` — pass, with warnings
  only; both now run in CI (2026-11-17).
- CI — success on the working branch at `a6c03d5` (2026-11-17), actions pinned by commit,
  the split check running in full.
- Behaviour evals — the three new cases (`relay-after-compact`, `checkpoint-log-split`,
  `motif-show-me`) score 1.00 with the skill and 0.00 without.
- The gallery — every group seen at desktop width, and the page at 375px with no overflow.
- The guard's faults — the agent ran the five inline-script forms and the PowerShell call
  against the old guard (all passed it) and against the new one (all refused).
- `machine-inventory` — run once on this PC; `~/.claude/machine.md` written and imported.

## Assumed, not verified

- The eight older eval cases still pass. They were not re-run after the split, nor after
  groups A to C rewrote parts of `checkpoint`, `sync-standards`, `relay` and `new-project`.
- `sync-standards` (its checks a to i, *Adding an option*, the stale-copy and declined-import
  paths), `new-project` for each kind, `ai-setup` and `design-motif` by kind: written and
  read through, never run against a project. The pilot syncs in phase 7 are their first
  real use.
- The audit's findings without a "checked" mark rest on a reader's line reference.
- That `~/.claude/machine.md` loads: it takes a new session to see.

---

*The session log is [`docs/log.md`](./log.md), newest first. The latest entry there names
this checkpoint's commits.*

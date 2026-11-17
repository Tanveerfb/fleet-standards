# fleet-standards — status

*The `checkpoint` skill's format (`standards/templates/STATUS.template.md`): this file is the
snapshot, rewritten in place: what is true now, never a stack. **History lives in
[`docs/log.md`](./log.md)**, which nothing loads by default.*

---

## Start here

**State:** v3.8.0 is on `main`. **v4.0.0 is in progress on the working branch
`origin/claude/new-project-mockup-zp2h2z`** (local branch `v4.0.0`): phases 1 to 6 of seven
are done. Phase 6 is the audit (`docs/specs/v4-audit.md`, every pick built but I4, at the
release) and a blind Fable 5.2 review (7 out of 10; its fifteen picks R1 to R15 built,
`docs/audits/`). `main` is untouched; nothing is released.
**Next:** **phase 7**, *Theme and release*: v4 is **Satluj** (the five rivers of Punjab,
`decisions.md`; spelled Satluj, not Sutlej). The README leads "v4.0.0 · Satluj". Next is
the README's look as mockups, no sample gallery, locked before it is built. The rest is open
item 5. The 4.0.0 changelog entry ends with its *What a project must change* list
(`docs/maintainer.md`). `checkpoint`'s steps are 1 to 9; the audit's rows cite the old
numbers (old 1.5 → 2, 2 → 3, 2.5 → 4, 3 → 5, 3.5 → 6, 4 → 7, 5 → 8, 6 → 9).
**Blocked on:** nothing.
**Don't trust:** no behaviour eval has run since groups A to E, and four of the fifteen
cases never have; the skills' new paths (every kind in `new-project` and its Step 4.5, the
sync's upgrade report and checks a to l, `--remove-stale`, the hashes, relay's short form
after a resume) have never met a real project. The installer's three crash fixes were read,
not tested. The PowerShell half of the shell-write guard is tested, never seen live.
**Live:** the owner follows over Remote Control as well as on the PC, answers choices in a
line, and keeps this one session going: checkpoint, compact, continue here. **After a
compact nothing runs relay by itself here** (the installed plugin is `main`'s: see the
first line under *Things that will save a session*), so read this file and the newest entry
of `docs/log.md` before anything else.

> **Things that will save a session:**
> - **On the PC, the installed `fleet` plugin is `main`'s (v3.8.0).** Its `checkpoint` and
>   `relay` do not load (a frontmatter fault fixed on this branch) and it has no
>   relay-after-compact hook. Read both skills from `standards/skills/` and follow them by
>   hand. This repository has no `CLAUDE.md` of its own.
> - **Fetch every remote branch before starting release work**, and read any status newer
>   than the clone's. Two sessions built apart on 2026-11-12 because one did not.
> - **A change to a rules file** adds its old and new lines to `tests/split-intended.json`,
>   or `tests/split-check.mjs` fails. Until v4 is released. `node tests/split-check.mjs
>   --json` prints exactly the lines to paste; a line already on the *added* list that the
>   change removes comes off that list rather than going on *removed*.
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
| 6. Process X on the standard | **Done.** `docs/specs/v4-audit.md`: about 90 findings, the owner picked the recommended set; every pick is built (groups A to F, H, I, and K from the owner's answers: pnpm, JavaScript tools, `rules/options/sqlite.md`, `rules/python.md`) but I4, at the release. Then the Fable review, `docs/audits/`: R1 to R15 built. Also: the sync's upgrade report, Fable as Process X's optional auditor |
| 7. Theme and release | Not started. The theme is chosen: v4 Satluj. Group G in the audit is its list of documents to rewrite |

**What each kind loads** (before the split: 76.5 KB, or nothing for a profile project that
only referenced the file), measured 2026-11-18 at the checkpoint: web 62.4 KB plus its
options; Node tool 46.3; Python tool 42.2; game 47.5; non-application 35.1, or 42.0 with a
visual surface. Options imported: Firebase 3.3, SQLite 2.8, Trello 1.3. Read on demand: AI
6.6, credit 4.3. The core is 32.1 KB: K, R1, R3, R8 and R12 added rules, R11 cut 2.4 KB of
plumbing. `checkpoint` is 38.7 KB.

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

1. **I4 at the release:** the split check, its intended list and `fetch-depth: 0` go
   together. **Fifteen eval cases**, four never run (H1, H2); about $0.30 each, by hand and with the
   owner's go. `ai-setup` and `machine-inventory` still have no case.
2. **GitHub's private vulnerability reporting is off** on the repository (checked
   2026-11-18), so `SECURITY.md` names the owner as the channel. Turning it on is the owner's
   setting; then that line can point at it.
3. **The upgrade path is built, never run:** `sync-standards` audits the transition into
   one report, applies on one yes, re-checks (Step 4 now runs a to l). The pilot syncs in
   phase 7 are its first use; the 4.0.0 changelog entry has to carry its list.
4. **`fable-audit` is Process X's optional auditor** (`process-x.md` step 1). Its review of
   v4 ran 2026-11-18: 7 out of 10, about $3.20 over two runs (the first hit its output cap
   and wrote nothing; the runner in `~/.claude/skills/fable-audit/` was fixed). The owner
   picked all fifteen findings offered, R1 to R15, and all are built. Not done by them: a
   second review to see the score move (about $1.50 to $3 with the cache cold).
5. **Phase 7** — done: the README banner (layout A, `docs/assets/`) and the changelog's
   4.0.0 entry, headed `4.0.0 · Satluj — unreleased` (the version tests wait while it says
   unreleased; **the release dates it**). Left: `adopting-the-standard.md`,
   `docs/maintainer.md` and the README body (group G), pilot syncs of one project of each
   kind, all fifteen evals run once, the version bump and I4, then the release.
6. **The machine file's local-models section is empty**: Ollama was not running when
   `machine-inventory` ran. Start Ollama and run the skill again.
7. **toll-kits and toll-the-game keep their own heredoc hooks** beside the fleet one. Worth
   checking at their next sync whether the stricter block is still wanted.

---

## Verified, by measurement (2026-11-13, and 2026-11-18 where dated)

- `node tests/run.mjs` — all checks pass (2026-11-18, at the checkpoint): the rules set
  (sections, the divided ones, the template's imports), the gallery, the split check (13
  files), the shell-write guard's cases for both shells (12 added from the Fable review), and
  the scripts: the startup check, the *Rules* line reader with `no-<name>`, the reference
  list and version reader, both manifests, the fleet report, the installer (absolute path,
  scripts installed, no hang without a terminal), stale copies, the per-copy hashes, the
  resume message, `null` JSON, and every hook path.
- `claude plugin validate .` and `claude plugin validate standards` — pass, with warnings
  only; both run in CI.
- CI — success on the working branch at `ea2069a` (2026-11-18), actions pinned by commit,
  the split check running in full.
- The Fable review's findings — each checked against the repository by a separate agent,
  the guard's by test (`docs/audits/2026-11-18-fable-v4-review-checked.md`).
- The sizes in *Where v4 stands* — measured with `wc -c` on 2026-11-18.
- Behaviour evals — the three new cases (`relay-after-compact`, `checkpoint-log-split`,
  `motif-show-me`) scored 1.00 with the skill and 0.00 without, on 2026-11-13, before
  groups A to E.
- The gallery — every group seen at desktop width, and the page at 375px with no overflow.
- The guard's faults — the agent ran the five inline-script forms and the PowerShell call
  against the old guard (all passed it) and against the new one (all refused).
- `machine-inventory` — run once on this PC; `~/.claude/machine.md` written and imported.

## Assumed, not verified

- The eight older eval cases still pass. They were not re-run after the split, nor after
  groups A to C rewrote parts of `checkpoint`, `sync-standards`, `relay` and `new-project`.
- `sync-standards` (its checks a to l, the upgrade report, *Adding an option*, the stale-copy and declined-import
  paths), `new-project` for each kind, `ai-setup` and `design-motif` by kind: written and
  read through, never run against a project. The pilot syncs in phase 7 are their first
  real use.
- The audit's findings without a "checked" mark rest on a reader's line reference.
- That `~/.claude/machine.md` loads: it takes a new session to see.

---

*The session log is [`docs/log.md`](./log.md), newest first. The latest entry there names
this checkpoint's commits.*

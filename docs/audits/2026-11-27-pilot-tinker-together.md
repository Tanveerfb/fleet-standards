# The v4.1.0 pilot: a real `sync-standards` on `tinker-together`

*2026-11-27. Run by that project's own session ("Tinker Together Main") on one message from
the fleet-standards session, against this checkout at `b7ecd71` as a named master folder
(sync Step 0). The owner answered its questions in that session ("Site now, admin after");
no approval was relayed. This is the first real sync of any project on v4.*

## What happened

- **Applied, on the owner's go; not yet committed there:** the core and `rules/ui`, `node`,
  `web` (real changes); `rules/app` and the Firebase and credit options (line endings only);
  the skill copies and `.claude/fleet`; `.githooks/pre-commit` (the `sk-` fix).
- **On the owner's yes:** a leftover `rules/options/trello.md` removed (the line has said
  `no-trello` since the board was retired); the family option added, with a
  `Family: manager` line; four §MOTION exceptions retitled as the project's own rules, their
  limits kept.
- **Already met:** `.gitattributes`, the declined index, one lockfile, protection (403 by
  plan, recorded), workflow permissions, the gates workflow (check n), throttled forms,
  headers, pinned image hosts and retention in `data-model.md` (check o).
- **Left:** the re-audit (`Audited against v3.4.0`); `CLAUDE.md`'s history split.
- **After:** `copy-skills-to-project.mjs --check` says all copies current, and the startup
  check is silent.

**The brief was stale.** The fleet session said the project was on 3.8.0 with no *Rules*
line, from the 2026-11-18 dry run. It had been on 4.0.0 with a full *Rules* line since that
day, so no option question arose.

## Problems with the skill, as reported

1. **No path for a pilot.** An unreleased master still reads 4.0.0, so a 4.0.0 project lands
   on "same version, different content: edited in place". The session told the cases apart
   by diffing the project against the last release's commit.
2. **Line endings.** On Windows with `core.autocrlf`, a plain diff shows whole files
   differing (1,033 lines of `project-rules.md`; 31 without the carriage returns).
   `--check` listed 29 files changed, 13 of them in line endings only, both hook scripts
   among them, so Step 5's "show each hook script's diff" had nothing to show.
3. **The master checkout holds CRLF where `.gitattributes` says LF** (`templates/pre-commit`
   was checked out before the attribute existed), so `cp` put a CRLF hook into
   `.githooks/`, and the copy script did the same in `.claude/fleet/templates/`.
4. **The family option has no step for a family already running** without the option, nor
   for the `Family:` line §FAMILY asks for.
5. **No check for a rules file left in `rules/` that the line no longer declares.**
6. **Moot exceptions have two paths, keep or remove; a third is needed:** restate as the
   project's own rule, where the exception carries limits the project keeps.
7. **Step 2 does not say whether Step 5's items belong in the upgrade report.**
8. **`templates/gates.yml` pins `checkout` and `setup-node` at v4.4.0;** this project's own
   workflow already pins v7.

## Addendum: the admin repo, the same day

The same session then synced the studio's admin repository (non-application with `ui`,
single-branch) on the owner's "Now": the core and `rules/ui.md`, the skill copies, the
`sk-` fix (re-normalised to LF again: problem 3 repeated), a leftover
`rules/options/trello.md` removed, and `AGENTS.md` and `GEMINI.md` added. Three findings:

9. **The repository had neither `AGENTS.md` nor `GEMINI.md`**, though its v4.0.0 sync ran
   Step 5's check and nothing recorded a refusal. Step 6's re-check does not look again.
10. **Step 5 checks only that the pointer exists.** The site's two pointers were from the
    older template, naming `project-rules.md` alone and not the files under `rules/`; nothing
    flagged it. (The 2026-11-18 dry run's problem 14, not picked then.)
11. **The Trello leftover was in both repositories**, so it is systematic: declining an
    option by editing the *Rules* line never removes its file. Covered by T5.

## Picks and outcomes

**The owner, 2026-11-27: every one.** Built after the evals that were running finished,
since they read the skills from this folder.

| Pick | Problem | Outcome |
| --- | --- | --- |
| T1 | 1: a pilot against an unreleased master | **built** `9d32f7f` |
| T2, T3 | 2, 3: line endings, in the script and the skill | **built** `444b92e`: copies compared and written with LF; `--credential-hook`; six tests |
| T4 | 4: a family already running | **built** `47cc076` |
| T5 | 5: a rules file the line no longer declares | **built** `b4b4ddd`: reported by `rules-line.mjs`; two tests |
| T6 | 6: a moot exception restated as the project's rule | **built** `15b1bea` |
| T7 | 7: the upgrade report covers Step 5 | **built** `c69dd70` |
| T8 | 8: the gates template's pins | **built** `f51da01`: checkout v7.0.1, setup-node v7.1.0 |
| S | the Windows line; the startup check run after a sync | **built** with `444b92e` and `aa7a693` |
| T9 | 9, 10: the pointers compared with the template, and re-checked in Step 6 (the owner: "Yes, both parts"; this reverses 2026-11-18's "not picked" for problem 14) | **built** `aa7a693` |

Every pick is built; the update check is `f024f7e`. Not done: a second real sync to see the
fixes work. The two repositories synced here hold the pre-fix copies until their next sync.

Also picked the same day, from the owner: **the update check asks GitHub once a day** and
runs on resume and compact too (the startup check had never spoken: it ran only on a new
session and compared with an installed plugin that was not updating).

**Script output that surprised it:** the copy script prints and records "fleet v4.0.0" for
unreleased 4.1.0 content; `--check` exits 1 on changes, which PowerShell shows as an error;
under Git Bash every command prints fnm's environment error and a `/e/...` path resolves
wrongly, so the scripts ran from PowerShell; the skill never names
`check-rules-version.mjs` as a check to run after.

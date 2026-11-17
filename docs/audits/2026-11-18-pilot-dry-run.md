# Pilot syncs, dry run: v4's `sync-standards` against five real projects

*2026-11-18. A read-only agent produced each project's upgrade report as `sync-standards`
Step 2 would, against the master on the v4.0.0 branch. Nothing in any project was written.
The skill's own problems, found by applying it, are at the end; they are the point of the run.*

**Pilots, one per kind.** `toll-wiki` turned out to be a Next.js app and `project-plans` has
no rules file (an adoption, not a sync). No Node tool is on the standard: `toll-asset-drop`
and `streamerbot-setup` are not repositories, `llm-project-auditor` is a Next.js app on 2.0.0.
`toll-kits` (Node `.mjs` tools, recorded as non-application) stood in, and `nca-automations`
took the non-application row. The installed plugin is 3.8.0, so run for real today the skill
would call `tinker-together` current.

## The reports, in short

| Project | Kind | From | Proposed *Rules* line | Stops or asks |
| --- | --- | --- | --- | --- |
| `tinker-together` | web | 3.8.0 | `app, ui, node, web · Options: firebase, trello, no-sqlite, ?ai` | AI, SQLite; the credit on the studio's own site; four moot §MOTION exceptions; a working-agreement bullet; `.gitattributes` for `.githooks/`; protection 403 |
| `toll-kits` | Node tool or non-application: **the owner's call** | 3.8.0 | `non-application, ui · Options: trello`, or `app, node(, python)` | **Stops at item 0:** `rules/` holds files mirrored from `godot-toll` by `tools/sync.mjs`, run by a `SessionStart` hook every session; skill copies declined, so its 3.8 shell hook is never refreshed |
| `cutscene` | hybrid: Next.js export, Electron, uv package | 3.7.0 | `app, ui, node, web, python · Options: sqlite?, no-firebase, no-trello, ?ai` | the hybrid line; SQLite now or at P1; credit; Python shape; (j) misfires on `package-lock.json` beside `uv.lock`; three exceptions `python.md` covers |
| `godot-toll` | game | 3.8.0 | `app, ui, game · Options: firebase?, no-trello, no-sqlite, no-ai` | its "copied, not imported" exception; Firebase used through GDScript, missed by detection; Step 5 would add the plugin wiring and `AGENTS.md` its `decisions.md` keeps out; its `pre-commit` differs by 66 lines |
| `nca-automations` | non-application | 3.7.0 | `non-application, ui · Options: trello` | behind origin by one commit; credit; `design-motif`; asked Firebase, SQLite and AI for no reason |

Every pilot: branch protection returns **403** (a private repository on a plan without it),
`pre-commit` is four or more lines behind, and the `AGENTS.md` pointer predates `rules/`.

## Problems with the skill

1. **High.** Step 2's audit runs Step 4's checks a to m but not item 0, so the `rules/` stop
   appears only after the owner's yes.
2. **High.** Item 0 assumes the files in `rules/` are static; in `toll-kits` a hook rewrites
   them each session, so a `git mv` alone comes back.
3. **High.** `copy-skills-to-project.mjs` overwrites a project skill of the same name
   (`toll-kits`' and `godot-toll`'s own `relay` and `checkpoint`); only a decline found in
   `decisions.md` prevents it.
4. **High.** Declining the skill copies also loses the hooks: the copy is all or nothing.
5. **High.** The credit's recording contradicts itself: (c) keeps it on its own line, but
   item 1 copies only what the `Options:` part declares, so `credit.md` is never copied;
   `adopting-the-standard.md` and `new-project` record options differently.
6. **Medium.** A stale "no studio configured" is never asked again; no case for the studio's
   own site.
7. **Medium.** (j) treats lockfiles of two ecosystems as two package managers.
8. **Medium.** The kind is assumed single: no rule for a hybrid, or for a docs repository
   with tool scripts; (a) reads the Python shape from `conventions.md` before (k) writes it.
9. **Medium.** (m) handles only a 404; every pilot returned 403. "Token" is undefined against
   `environment.md` entries such as private keys.
10. **Medium.** (c) finds Firebase only as a Node dependency, and asks backend and AI options
    of non-application repositories.
11. **Medium.** The decline check covers only the rules import and the skill copies; other
    recorded refusals (plugin wiring, `AGENTS.md`) would be undone, and a refusal kept as a
    `conventions.md` exception is not searched.
12. **Medium.** Declining the import leaves no *Rules* line, so nothing says which files to copy.
13. **Medium.** No git preflight: a dirty tree, an unrelated branch, behind the remote. Step
    3's one question also sits oddly beside Step 4's many.
14. **Low.** Step 5 checks only that `AGENTS.md` and `GEMINI.md` exist, not that they mention
    `rules/`.
15. **Low.** (a) strips a file name from a section reference; §SCOPE says a section outside the
    core names its file once.
16. **Low.** The `§[0-9]` count picks up copies, clones and archives; (d) assumes
    `design-system.md` (`tinker-together` has `DESIGN.md`); "Step 0" names two things; only
    4.0.0 has a *What a project must change* list.
17. **Low, this test only.** A pilot cannot point the sync at an unreleased branch.

## Picks and outcomes

**The owner, 2026-11-18: every problem but 14** (the `AGENTS.md` pointer). One commit each,
named `pilot P<n>`.

| Pick | Problems | Outcome |
| --- | --- | --- |
| P1 | 1, 2: `rules/` reported before the yes, and its writers found | |
| P3 | 3: a project's own skill is never overwritten | |
| P4 | 4: hooks offered apart from the skill copies | |
| P5 | 5: one way to record options, credit and Trello included | |
| P6 | 6, 10: questions that fit the kind; a stale credit answer asked again | |
| P7 | 7: lockfiles counted per ecosystem | |
| P8 | 8: a project may load more than one kind | |
| P9 | 9: 403 is a plan without protection; what a token is | |
| P11 | 11: any recorded refusal is kept | |
| P12 | 12: a *Rules* line even when the import is declined | |
| P13 | 13: a git preflight before the report | |
| P15 | 15: one rule for naming a section's file | |
| P16 | 16: the small wording fixes | |
| P17 | 17: a sync pointed at a master folder, for pilots | |

Not picked: 14.

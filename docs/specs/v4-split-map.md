# v4 phase 1 — the split map

**Status:** built (2026-11-13: *Phase 1, as built*). Approved by the owner, all four rounds
(2026-11-12); §SCALE confirmed for the core on 2026-11-13. Companion to [`v4.md`](v4.md). Phase 1
moves text exactly as this map says; nothing has been moved.

**Read through the fold (2026-11-13).** The fourteen issues were built on the unsplit file
before the split (`v4.md`, *Built ahead of the split*). Three things in this map change, each
marked where it stands: the baseline is the file as built (commit `1379baa`, 76.5 KB); the
game-engine block in §SCOPE has a row; §TESTING's film bullet has a row. Text the issues
added inside a section moves with that section.

Phase 1 changes no wording. Where a move forces a wording change (a header, a pointer), it is
listed under *Changed on purpose* and nowhere else. Every judgement call that needs a
rewording is carried to the phase 6 audit (last section).

## The files, by concern

| File | Concern | Loaded by |
| --- | --- | --- |
| `project-rules.md` | How we work (the core) | Every repository |
| `rules/app.md` | Engineering, in any language | Anything with application code |
| `rules/ui.md` | Interface | Anything with a visual surface, including a non-application repository that has one |
| `rules/node.md` | The Node and TypeScript stack | Web projects and Node tools |
| `rules/web.md` | The Next.js stack | Web projects |
| `rules/game.md` | The game-engine stack | Games. Since the fold: phase 1 moves §SCOPE's game-engine block here as it is; phase 2 rewords it |
| `rules/non-application.md` | What a repository without application code does differently | Those repositories |
| `rules/options/credit.md`, `trello.md`, `firebase.md` | Things a project opts into at setup | Imported by projects that chose them |
| `rules/options/ai.md` | AI and model features | Read on demand by projects that chose it |

| Kind of repository | Loads |
| --- | --- |
| Web project (Next.js) | core, app, ui, node, web, its options |
| Local Node tool | core, app, node; ui if it has an interface; its options |
| Tool in another language (bash, Python) | core, app; ui if it has an interface |
| Game | core, app, ui, game, its options |
| Non-application | core, non-application; ui if it has a visual surface |

## Where each section goes

| Section | Goes to | Agreed |
| --- | --- | --- |
| §SCOPE | core; the non-application block to `rules/non-application.md`; the game-engine block to `rules/game.md` | Round 1; the game-engine block by the fold (2026-11-13), following the same rule |
| §DOCS, §ASK, §AGENTS, §GIT, §OWNER, §SPECS, §TOOLS, §SECURITY | core | Round 1 |
| §CREDIT | `rules/options/credit.md` | Round 1: the owner moved it out of the core |
| §TRELLO | `rules/options/trello.md` | Round 1: the same |
| §GROWTH, §MODULES, §DATA, §LIFECYCLE, §SHORTCUTS | `rules/app.md` | Round 2 |
| §SCALE | core | The owner, 2026-11-13: "Yes, core" |
| §DESIGN, §COMPONENTS, §QOL, §PATTERNS | `rules/ui.md` | Rounds 2 and 3 |
| §TS, §NPM, §RUNTIME, §PACKAGES | `rules/node.md` | Round 3 |
| §STRUCTURE, §STATE, §FORMS, §HOOKS, §STYLING, §SHADCN, the new-project checklist | `rules/web.md` | Round 3 |
| §FIREBASE | `rules/options/firebase.md` | Round 3: reverses the earlier "stays in the web profile" |
| §AI | `rules/options/ai.md` | Earlier; now filed under options |

## Sections that divide

The section keeps its name in each file it appears in.

| Section | Lines | Go to |
| --- | --- | --- |
| §NAMING | The vocabulary bullets | `rules/app.md` |
| | The case table, framework-reserved names, new and existing projects, `git mv` on Windows | `rules/node.md` |
| §MOTION | The opening and the three things that hold regardless | `rules/ui.md` |
| | The *Library* paragraph | `rules/web.md` |
| §BUILD | Comments, JSDoc, no leftovers, errors are blockers, nothing ships failing | `rules/app.md` |
| | The `tsc`, lint and `npm run build` lines | `rules/node.md` |
| §TESTING | "A green build is not evidence an interface works. A UI change is done when it has been seen working"; no end-to-end suite by default | **core** (the owner, round 3: every repository needs testing) |
| | "Motion is checked on film" (issue #32, added by the fold) | **core**, as `v4.md`'s issue table places it. §MOTION's one-line pointer to it stays with §MOTION in `rules/ui.md` |
| | Vitest, pure logic, transition maps | `rules/node.md` |
| | The browser order, 390px | `rules/web.md` |

**§SCALE: the agent's call, not yet the owner's.** It holds the area `CLAUDE.md` files and
the architecture map. Asked whether it should go to the core, the owner said: "I am not
sure, because initially projects start small but eventually they can grow big." The agent
reads that as the reason for the core: a rule about outgrowing a single read has to be
loaded while the project is still small, or no session is there to notice the day it stops
being small. It costs 1.6 KB. **The phase 1 session asks the owner for a yes in one line
before moving §SCALE**; on a no it goes to `rules/app.md`, and nothing else in the map changes.

## Phase 1, in order

1. Confirm §SCALE with the owner.
2. Write `tests/split-check.mjs` and its list of intended changes first, and see it fail
   against the untouched tree (every line "missing"): a check that has never failed proves
   nothing.
3. Create the files under `standards/rules/` and move the sections, one file per commit,
   word for word, with the Edit and Write tools only.
4. Make the seven changes under *Changed on purpose*, each added to the intended-changes list.
5. Run the check until it passes; read its "changed on purpose" output against that list.
6. Update what reads the rules file: `sync-standards`, the startup check, `sync-rules.mjs`,
   `install-skills.mjs`, the templates, `tests/run.mjs`. No skill wording beyond file names.
7. Do not bump the version, touch the CHANGELOG's release date, or sync any project: v4 is
   released only at the end of phase 7. Checkpoint on the working branch.

## Phase 1, as built (2026-11-13)

Done, on the local branch `v4.0.0`: the check written and seen failing, one commit per file,
the core last. `tests/split-check.mjs` passes: 1035 baseline lines, each in exactly one of
11 files; 22 lines removed and 91 added on purpose, all in `tests/split-intended.json`.
`tests/run.mjs` runs it and checks the set (one version, §SCOPE's table against the folder,
no section repeated but the four that divide, the template's imports).

**Two things for the owner:**

1. **`rules/non-application.md` keeps two lines the map drops.** Change 6 below replaces the
   profile's whole list with the `rules/ui.md` import. Its §NAMING line (vocabulary,
   kebab-case file names) and its §TESTING line (seen working at desktop width and on a
   phone) are not in the core or in `ui.md`, so the profile would lose both rules. They are
   kept, word for word: fewer changes than agreed, nothing lost. **The owner, 2026-11-13:
   "Keep".**
2. **The split check does not run in CI.** CI's checkout is shallow and does not hold the
   baseline commit, so the check reports "skipped" there and passes. Running it in CI needs
   `fetch-depth: 0` in `.github/workflows/checks.yml`, which is not changed without being
   asked. Locally it runs in full. **The owner, 2026-11-13: "Yes, add it"**; added, to be
   removed with the check at the release.

**Beyond the seven changes:** one link (`./motifs.md` became `../motifs.md` in
`rules/ui.md`, which is one folder deeper); and file names in the skills, `motifs.md` and
the templates where they named `project-rules.md` for a section that moved.

**Left stale on purpose, for their phases:** `rules/game.md` and the game block in the
conventions template still say "Part A" and "referenced, not imported" (phase 2); the
README, `adopting-the-standard.md` and `docs/maintainer.md` still describe one file
(phase 7). `sync-standards` has a v4 step, and `sync-rules.mjs --apply` copies the declared
set and skips a project with no `Rules:` line.

## Changed on purpose (round 4, agreed)

1. Each file's header: what it is, who loads it, the other files in the set.
2. §SCOPE gains the two tables above in place of the moved block, and says how a project
   declares what it loads.
3. Part letters (A to E) go: they described one file. Section names are untouched.
4. The core gains one line: the options exist, and `new-project` and `sync-standards` ask
   about each once. Without it a project that never opted in is never asked.
5. The *Master copy* line names the set.
6. `rules/non-application.md`: its list of what it keeps from Parts B to E becomes "imports
   `rules/ui.md` where there is a visual surface", and its "referenced, not imported" bullet
   goes, because the core is now imported.
7. Where a section divides, each part ends with one line naming where it continues.

**How a project declares its files (agreed).** The import lines in `CLAUDE.md` are the
declaration, with one line beside *Deploys* that `sync-standards` reads:
`Rules: app, ui, node, web · Options: firebase, trello`. Sync copies and updates only the
files the project declares. One `**Version:**` covers the set.

**The proof (agreed).** A committed read-only script, `tests/split-check.mjs`, compares
the rules file as built before the split (from git, `1379baa`; v3.8.0's `bbe46d6` before
the fold) with the new files: every non-blank line
appears in exactly one of them, none twice, and anything else must be on a short list of
intended changes kept beside the script. It runs in `tests/run.mjs` until v4 is released.

## Carried to the phase 6 audit

These need a rewording, so phase 1 leaves them alone.

- **§OWNER's mockup bullets, §AGENTS and §DOCS** carry web details inside a universal rule
  (static HTML, 390px, `public/_mockups/`, `components.md`, the data adapter). Divide: the
  rule in the core, the detail in `ui.md` or `web.md`.
- **§STATE**: zod applies to Node tools, Zustand only to React.
- **§RUNTIME**: Node pinning is general; Vercel and `NEXT_PUBLIC_` are web.
- **§STRUCTURE**: `lib/domain` and `lib/data` suit a Node tool; `app/` does not.
- **§PACKAGES**: mostly true in any language; only "verify on npm" is Node.
- **§TESTING** now sits in three files. Check it still reads as one rule.
- **UI awareness** (the owner, round 2): agents missing interface rules has been a real
  problem in a couple of projects. Ask the owner for the cases, and fix `ui.md` against them.
- **Package manager** (the owner, round 3): open to moving from npm to something more robust
  for the long term, pnpm named. The agent's lean: pnpm for new projects, existing ones keep
  npm; to be checked against current pnpm, Vercel and Firebase documentation before any
  rule is written.
- **JavaScript as a named choice** (the owner, round 3; left to the agent to recommend):
  TypeScript stays the default; a local tool may be JavaScript with type checking still on
  (`checkJs` and JSDoc types), chosen at setup and recorded in `conventions.md`. Never for a
  client or deployed project.
- **When to split a `CLAUDE.md` into area files.** §SCALE says "when a project outgrows a
  single read"; godot-toll's root reached 214 KB before anyone acted. Consider having the
  checkpoint measure the root file and propose a split past a size, alongside #27 and #33.
- **Other backends as options**: the owner notes a project may use Supabase or another
  backend. An option file is written when the first project needs it, not before.

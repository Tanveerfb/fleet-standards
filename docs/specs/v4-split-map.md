# v4 phase 1 — the split map

**Status:** draft for the owner's review (2026-11-12; layering decided the same day).
Companion to [`v4.md`](v4.md). Phase 1 moves text exactly as this map says once the owner
has approved it; nothing has been moved.

Phase 1 changes no wording. Where a move forces a wording change (a header, a pointer), it is
listed under *Changed on purpose* and nowhere else.

## Three layers, four kinds of repository

| Layer | File | Holds |
| --- | --- | --- |
| 1. How we work | `project-rules.md` | Asking, agents, git, the owner's agreement, documents, credit, Trello, specs, other agents, security |
| 2. Engineering | `rules/app.md` | What holds for any application code, whatever the stack |
| 3. The stack | `rules/web.md`, `rules/game.md` | How one stack meets layer 2, and its own rules |
| On demand | `rules/ai.md` | §AI, read before model work |
| Profile note | `rules/non-application.md` | What a repository without application code keeps |

| Kind of repository | Imports | About |
| --- | --- | --- |
| Web project (Next.js) | core + app + web | 64 KB (69 today) |
| Local Node tool (`cutscene`, `jugaad`, `scribe`) | core + app | 44 KB |
| Game engine (`godot-toll`) | core + app + game | 44 KB plus its profile |
| Non-application (`nca-automations`) | core + non-application | 32 KB; today it imports nothing and reads sections on demand |

## Whole sections

| Section | KB | Goes to | Note |
| --- | --- | --- | --- |
| §SCOPE | 3.9 | core | The non-application block moves out (below) |
| §DOCS, §ASK, §AGENTS, §GIT, §TRELLO, §SPECS, §TOOLS | 16.7 | core | |
| §OWNER | 2.9 | core | Its mockup bullet is web-shaped (static HTML, 390px, `public/_mockups/`); stays, the game and non-application profiles say how they differ |
| §CREDIT | 3.9 | core | `public/brand/` is a web path; stays, same reason |
| §SECURITY | 2.0 | core | |
| §GROWTH, §MODULES, §SCALE | 3.4 | `rules/app.md` | §MODULES' "imports nothing from React, Next" line stays; harmless elsewhere |
| §DATA, §LIFECYCLE, §SHORTCUTS | 2.2 | `rules/app.md` | Stack-neutral in content |
| §PACKAGES | 0.6 | `rules/app.md` | |
| §DESIGN, §COMPONENTS, §QOL | 5.2 | `rules/app.md` | |
| §TS, §STRUCTURE, §STATE, §FORMS, §HOOKS | 4.5 | `rules/web.md` | |
| §NPM, §RUNTIME | 3.4 | `rules/web.md` | See question 2 |
| §FIREBASE | 2.5 | `rules/web.md` | |
| §STYLING, §SHADCN, §PATTERNS | 4.0 | `rules/web.md` | |
| §AI | 6.3 | `rules/ai.md` | Read on demand |
| Checklist — new project | 2.6 | `rules/web.md` | It is a `create-next-app` list. The audit may move it into the `new-project` skill, which already walks it |

## Sections that divide

The section name appears in both files: the upper layer holds the rule, the stack file how
that stack meets it.

| Section | Stays or goes up | `rules/web.md` takes |
| --- | --- | --- |
| §SCOPE (core) | Everything except the non-application profile | — (the block from "Repositories without application code" to the end of its bullet list goes to `rules/non-application.md`) |
| §NAMING (app) | The vocabulary bullets; "existing projects keep the convention they have"; "renaming on Windows: always `git mv`" | The case table, the framework-reserved names paragraph, "new projects use this from day one" with the lint rule |
| §MOTION (app) | The opening and the three things that hold regardless | The *Library* paragraph (`motion`, GSAP) |
| §BUILD (app) | Comments, JSDoc, no `console.log`, no surviving TODO, errors are blockers, nothing ships with a failing build | The `tsc`, `npm run lint` and `npm run build` lines |
| §TESTING (app) | "A green build is not evidence an interface works. A UI change is done when it has been seen working"; no end-to-end suite by default | Vitest, the browser order, 390px |

## Changed on purpose (the only wording changes in phase 1)

1. The header's *Applies to* lines, in each file, to say what the file is and which others
   exist.
2. §SCOPE gains a short table of the four kinds of repository and what each imports, and how
   a project names its own (`Profile: web` in `CLAUDE.md`), in place of the moved block.
3. Part letters (A to E) go: they described one file. Section names are untouched.
4. A one-line pointer in `rules/web.md` naming when to read `rules/ai.md`.
5. The *Master copy* line names the set, not one file.
6. `rules/non-application.md` names the three things it keeps from `rules/app.md` (§NAMING's
   vocabulary, §DESIGN where there is a visual surface, §TESTING's "seen working") and says
   to read them there. Its "this file is referenced, not imported" bullet changes: the core
   is now imported, because all of it applies.

## Questions for the owner before phase 1 starts

1. **Approve this map**, or name the rows to change.
2. **§NPM and §RUNTIME (Node version pinning, environment checks) apply to web projects and
   Node tools, but not to a game.** Options: (a) in `rules/web.md`, and a Node tool's
   `CLAUDE.md` names those two sections to read; (b) in `rules/app.md`, and the game profile
   lists them as not applicable, as godot-toll's own profile already does. Recommended: (b).
   A Node tool is far likelier to break on an unpinned Node version than a game is to be
   confused by 3 KB it is told to skip.

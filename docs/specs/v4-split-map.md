# v4 phase 1 — the split map

**Status:** draft for the owner's review (2026-11-12). Companion to [`v4.md`](v4.md). Phase 1
moves text exactly as this map says once the owner has approved it; nothing has been moved.

Phase 1 changes no wording. Where a move forces a wording change (a header, a pointer), it is
listed under *Changed on purpose* and nowhere else.

## Whole sections

| Section | KB | Goes to | Note |
| --- | --- | --- | --- |
| §SCOPE | 3.9 | core | The non-application block moves out (below) |
| §DOCS, §ASK, §AGENTS, §GIT, §TRELLO, §SPECS, §TOOLS | 16.7 | core | |
| §OWNER | 2.9 | core | Its mockup bullet is web-shaped (static HTML, 390px, `public/_mockups/`); stays, the game and non-application profiles already say how they differ |
| §CREDIT | 3.9 | core | `public/brand/` is a web path; stays, same reason |
| §GROWTH, §MODULES, §SCALE | 3.4 | core | §MODULES' "imports nothing from React, Next" line stays; harmless elsewhere |
| §SECURITY | 2.0 | core | |
| §DESIGN, §COMPONENTS, §QOL | 5.2 | core | |
| §TS, §STRUCTURE, §STATE, §FORMS, §HOOKS | 4.5 | `rules/web.md` | |
| §DATA, §LIFECYCLE, §SHORTCUTS | 2.2 | `rules/web.md` | See question 2: their content is not web-specific |
| §PACKAGES, §NPM, §RUNTIME | 4.0 | `rules/web.md` | See question 2 |
| §FIREBASE | 2.5 | `rules/web.md` | |
| §STYLING, §SHADCN, §PATTERNS | 4.0 | `rules/web.md` | |
| §AI | 6.3 | `rules/ai.md` | Read on demand |
| Checklist — new project | 2.6 | `rules/web.md` | It is a `create-next-app` list. The audit may move it into the `new-project` skill, which already walks it |

## Sections that divide

The section name appears in both files: the core holds the rule, the profile how the stack
meets it.

| Section | Core keeps | `rules/web.md` takes |
| --- | --- | --- |
| §SCOPE | Everything except the non-application profile | — (the block from "Repositories without application code" to the end of its bullet list goes to `rules/non-application.md`) |
| §NAMING | The vocabulary bullets; "existing projects keep the convention they have"; "renaming on Windows: always `git mv`" | The case table, the framework-reserved names paragraph, "new projects use this from day one" with the lint rule |
| §MOTION | The opening and the three things that hold regardless | The *Library* paragraph (`motion`, GSAP) |
| §BUILD | Comments, JSDoc, no `console.log`, no surviving TODO, errors are blockers, nothing ships with a failing build | The `tsc`, `npm run lint` and `npm run build` lines |
| §TESTING | "A green build is not evidence an interface works. A UI change is done when it has been seen working"; no end-to-end suite by default | Vitest, the browser order, 390px |

## Changed on purpose (the only wording changes in phase 1)

1. The header's *Applies to* lines, in each file, to say what the file is and which others
   exist.
2. §SCOPE gains a short list of the profiles and how a project names its own
   (`Profile: web` in `CLAUDE.md`), in place of the moved block.
3. Part letters (A to E) go: they described one file. Section names are untouched.
4. A one-line pointer in `rules/web.md` naming when to read `rules/ai.md`.
5. The *Master copy* line names the set, not one file.

## Rough sizes after the split (before the audit)

Core about 40 KB; `rules/web.md` about 21 KB; `rules/ai.md` 6.3; `rules/non-application.md`
about 2.5. A web project loads about 61 KB (69 today, less §AI); a game project the core plus
its profile; a non-application repository about 43 KB, where today it loads none of it by
default and reads sections on demand (question 3).

## Questions for the owner before phase 1 starts

1. **Approve this map**, or name the rows to change.
2. **What profile does a local Node tool get?** `cutscene`, `jugaad`, `roleodex`, `scribe`
   and the like are application code but not all Next.js sites. Options: (a) they use `web`
   and ignore what does not apply, as today; (b) the stack-neutral sections now headed for
   `web` (§DATA, §LIFECYCLE, §SHORTCUTS, §PACKAGES, §NPM, §RUNTIME's Node pinning and env
   checks) go to the core instead, so `web` is truly Next.js-only and a Node tool loads core
   alone; (c) a third `rules/node.md` between the two. Recommended: (b). It costs the core
   about 6 KB and removes the need for another profile; the game profile already says those
   sections wait "until they arrive".
3. **Does a non-application repository import the core, or keep reading sections on demand?**
   Today its `CLAUDE.md` deliberately does not import the rules, to save context. Importing
   a 40 KB core would cost those repositories more than v3 does. Recommended: keep it as it
   is, reference not import, with `rules/non-application.md` as the small file it does import.
4. **Is the audit inside v4.0.0?** The owner's words on 2026-11-12 ("not only we are doing
   the update, we are also doing the deep audit") read that way; the spec has it as v4.1.0.
   If inside: phase 6 runs before the release step, and the pilots test the audited standard.

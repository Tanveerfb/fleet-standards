# Process X — a whole-product audit and upgrade

Named by the owner in `godot-toll` (2026-11-08): *"a complete audit, and then
overhaul/upgrade of the project ... the cleanup, modularization, consistency, design motif
upgrade, UI UX upgrade, and everything else relating to that."*

`project-rules.md` §OWNER carries the short form. This file says what each step is.

## When to run it

- A project has grown well past its adoption. The standard was applied when the product was
  small; several releases later one component is not shared everywhere, screens disagree with
  each other, and the conventions describe a smaller project.
- Before a release the owner wants deeply audited. **Process X counts as that release's deep
  audit.**

It is the owner's call to start it, never the agent's. An agent that sees the signs says so
and waits.

## The two rules that hold throughout

- **Nothing is built before it is picked.** The audit changes nothing.
- **A visual change is locked before it is built** (§OWNER): drafted, shown, revised until
  the owner locks it.

## The steps, in order

1. **Audit.** Every screen and flow, against the standard and against itself: shared
   components versus hand-made copies, readability, keyboard use, empty and loading states,
   one voice in the copy, no free information. Delivered
   as a **ranked list** the owner can read on its own (an HTML page works well), findings
   grouped, each with what is wrong, where, and what fixing it would take.
2. **The owner picks.** All, some or none. What is not picked is recorded as declined in
   `decisions.md`, so the next audit does not raise it as new.
3. **Drafts, then build.** Each visual pick is drafted side by side with what exists and
   locked before it is built. Non-visual picks are built directly.
4. **Shared pieces.** One shared piece per thing drawn in several places — a portrait, a
   picker, a stepper, a sheet, a chip. Each goes into the component register (§COMPONENTS)
   the day it is built; a hand-made copy of a registered piece is a bug from then on.
5. **Motif.** Refine the base motif (§DESIGN); optionally add a complementary one. Through
   `design-motif`, with the same mockup loop.
6. **The fleet re-audit.** `conventions.md` and `design-system.md` redone against today's
   repository, not edited forward from the adoption. Skills and hooks audited. Area
   `CLAUDE.md` files and the architecture map added or redone if the project has grown
   (§SCALE). History moved out of the files agents read (§DOCS).
7. **Proposals back to fleet, last.** What the project learned that every project should
   have, through `propose-standard`: drafted by the agent, filed on the owner's say.

## What it leaves behind

- The ranked list, with each finding's outcome: built, declined, deferred.
- `decisions.md` entries for the picks and for everything declined.
- `conventions.md` with a new *Audited against* line.
- A checkpoint, as after any piece of work.

## Evidence

Run once so far: `godot-toll`, 2026-11-10 to 11. 33 findings in six groups; the owner picked
all 33; 14 shared pieces came out of step 4; step 7 produced seven proposals (issues #27 to
#33 on this repository). One project and one engine: expect the steps to be adjusted when a
web project runs it.

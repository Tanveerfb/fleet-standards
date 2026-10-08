# <PROJECT NAME> — status

*Goes at `docs/STATUS.md`. This is the `checkpoint` skill's output format
(the `fleet` plugin's `checkpoint`) — match it, or the skill and the file fight each other.*

**Two zones, maintained differently.**

- The **snapshot** (everything above the session log) is **rewritten in place** every
  checkpoint. Its job is to be current, not complete. A line that is no longer true gets
  corrected or cut — never appended below.
- The **session log** is **append-at-top**, newest first. Its job is history.

---

## Start here

*Under 15 lines. **Overwritten, never appended to** — a `Start here` with a history in it is
not a `Start here`. It **indexes** the rest of this document by heading rather than restating
it, because two copies of a fact drift. It names **one** next action; a priority-ordered
backlog belongs in Open items.*

**State:** <one or two sentences — where the project actually is>
**Next:** <the single most useful next action, concrete enough to start on>
**Blocked on:** <what needs the owner, or "nothing">
**Don't trust:** <anything in this doc that is assumed rather than verified>

> **Things that will save a session:** <the handful of environment facts that are not
> discoverable from the code and cost real time when unknown — a cache that survives a dev
> restart, a tool whose green exit is not evidence, a build that passes locally and fails in
> production.>

---

## What this project is

<One paragraph, written for a reader with zero prior context.>

---

## What shipped in this checkpoint

<Concretely. File paths, commands, config keys. Include the measurements, not just the
claims.>

---

## Open items

*Priority-ordered. Renumber when items are closed, and say in one line that you did — a
reader who remembers "item 3" needs to know the numbering moved. Where the project has a
Trello board, an item with a card carries the card's link — that link, not the title, is how
`checkpoint` matches item to card (`project-rules.md` §TRELLO).*

1. **<item>** — <why it matters, and what it is waiting on> · [card](<trello card url, if the project has a board>)

---

## Verified this checkpoint, by measurement

*Only things actually checked in this session, with the check named. What ran, and what it
said.*

- <claim> — <how it was verified>

**The mistake worth keeping.** <Any claim this checkpoint had to correct, what it said before,
and why it was wrong. A future session that meets the old claim elsewhere needs to recognise
it as retired.>

---

## Assumed, not verified

*Carried forward on a previous session's word. Never let this sit in the same voice as the
section above.*

- <>

---

## Confidence and gaps

*What is verified, what is assumed, what is untested, and what you would check first coming
back cold. This section is what stops the next reader from treating the whole document as
equally solid.*

---

## Session log

*Newest first. **Mark what died:** when a session deletes or replaces something an older entry
describes, that entry gets `**RETIRED — <what replaced it>, commit <hash>**` as its first
line. An entry describing a system that no longer exists reads exactly like one that still
applies.*

*__Fold at ~800 lines:__ move the oldest entries **verbatim** to
`docs/archive/STATUS-<YYYY-MM>.md`, each leaving a one-line stub here with a link. Retired
entries go first regardless of age. **Folding is relocation, never summarising** — summarising
on the way out destroys the evidence.*

### <DATE> (<n>th session) — <subject>

Commits `<hashes>`. <Pushed / not pushed>, <and whether that branch auto-deploys>.

<What happened, why, and what was decided against.>

---

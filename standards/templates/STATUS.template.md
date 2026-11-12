# <PROJECT NAME> — status

*Goes at `docs/STATUS.md`. This is the `checkpoint` skill's output format
(the `fleet` plugin's `checkpoint`) — match it, or the skill and the file fight each other.*

**This file is the snapshot only** (`project-rules.md` §DOCS). It is **rewritten in place**
every checkpoint: its job is to be current, not complete. A line that is no longer true is
corrected or cut — never appended below, and never kept as a "was". One current-state block,
never a stack of them. **History lives in `docs/log.md`** (the session log, newest first,
from `templates/log.template.md`), which nothing loads by default.

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
**Live:** <state outside the repo a fresh session needs: where the owner is, how they are
working (e.g. on a phone: drafts as artifacts, short replies), what is mid-flight; or
"nothing". Only what is temporary — a standing rule goes into `CLAUDE.md`>

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

*The session log is [`docs/log.md`](./log.md), newest first. The latest entry there names
this checkpoint's commits.*

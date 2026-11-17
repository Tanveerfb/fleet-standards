---
type: llm
weight: 2
---

The agent's tools are read-only in this test, so it describes what the checkpoint would do
rather than doing it. Grade the description: "would move", "moves" and "moved" all count.

Pass if the final reply says all of these, in any words and any order:

- the three old session-log entries leave `docs/STATUS.md` and go into `docs/log.md`,
  unchanged (word for word, verbatim, relocated, not summarised);
- this session's entry is written to `docs/log.md`, not into `docs/STATUS.md`;
- `docs/STATUS.md` keeps its current-state content (`Start here` and what is true now),
  rewritten in place;
- somewhere, the move is reported: a confirmation, report or summary step that says the
  session log moved to `docs/log.md` counts as telling the owner.

Fail if it appends this session's entry to the session log inside `docs/STATUS.md`, leaves
the old entries where they are, summarises, shortens or rewrites the old entries on the way,
or drops them.

Not failures: saying nothing was written because the tools are read-only; saying a template
could not be opened; describing the other checkpoint steps (the `Start here` block, a
retired-entry check, Trello, the commit and push, the closing question); also mentioning the ~800-line fold or `docs/archive/`, as long as nothing is
folded here; saying it could not read the project's files in the test folder; describing the
git step or the closing question as well; saying superseded numbers and quotes go to the log
with the entry; saying it would read the whole status doc before changing it.

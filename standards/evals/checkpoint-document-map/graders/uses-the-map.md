---
type: llm
weight: 2
---

The agent's tools are read-only in this test, so it describes what the checkpoint would do
rather than doing it. Grade the description: "would update" and "updates" both count.

Pass only if the final reply says all of these, in any words and any order:

- it reads the project's own document map in `conventions.md` (the *§DOCS Document set*
  table) to find where each document is kept;
- the changed accent token and its contrast ratio are recorded in **`DESIGN.md`**, as this
  project's design-system document;
- the finished phase is recorded in a roadmap: since the map gives `roadmap.md` no file yet,
  it creates `roadmap.md` now that there is content for it (and adds its row to the map), or
  says plainly that the roadmap has no file and asks or offers to create one.

Fail if it says `design-system.md` is missing and skips the token change, creates a new
`design-system.md` beside `DESIGN.md`, never mentions the document map, or leaves the
finished phase unrecorded without saying so.

Not failures: also updating `docs/STATUS.md`, `docs/log.md` and `decisions.md`; describing
the other checkpoint steps, the commit and push, or the closing question; saying nothing was
written because the tools are read-only; saying it could not read the project's files in the
test folder; recording the phase in `docs/STATUS.md` as well as the roadmap.

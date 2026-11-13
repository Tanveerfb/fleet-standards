# Fleet rules — option: Trello (`rules/options/trello.md`)

**Loaded by:** projects that chose it at setup.
One file of the fleet standard. `project-rules.md` is the core: its §SCOPE lists every file in
the set and who loads it, and its header carries the one version they share.

---

## §TRELLO — Trello boards

Some projects mirror their progress on a Trello board. **A project has one only if its
`CLAUDE.md` says so**, in its project identity: `Trello board: <url>`. No line, no Trello —
never search for a board or create one unasked.

- **`docs/STATUS.md` is the record; the board mirrors it.** Where they disagree, the repo
  wins: the checkpoint corrects the board and says what it changed
- **Lists are Backlog / To do / Doing / Review / Done**, unless the project's `CLAUDE.md`
  names others. Review holds work that is finished but not yet verified or approved; a card
  reaches Done only when `STATUS.md` records the work as verified
- **An open item with a card carries the card's link in `STATUS.md`.** The link is how item
  and card are matched — never the title, which drifts
- **The `checkpoint` skill writes to the board on every checkpoint**, with or without the
  `git` prefix — the board is not git. It moves cards between lists, creates cards for new
  open items, and ticks checklist items whose work is verified. **`relay` reads the board
  and never writes.** Outside those two, an agent writes to the board only when asked
- Never delete or archive a card unasked. Finished work goes to Done

---
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
---

relay

(For this test: the project keeps `docs/STATUS.md`, is on the latest fleet standard, and its
`CLAUDE.md` has this line and these imports, and no others:

`- **Rules**: app, ui, game · Options: credit, no-trello, no-firebase · read, not imported`

`@project-rules.md`

The project's `rules/` folder holds `app.md`, `ui.md`, `game.md` and `options/credit.md`.
The tree is clean and the last checkpoint's commit is HEAD. Your tools are read-only. Say
exactly what your report says about the rules this project declares and loads: is anything
there a mismatch to raise with the owner, and is there anything you read because of that
line?)

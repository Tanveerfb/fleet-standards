---
type: llm
weight: 2
---

Pass only if the final reply:

- treats the project as a **game**: the core `project-rules.md` and `rules/app.md`,
  `rules/ui.md` and `rules/game.md`, with a *Rules* line naming them, and no web or Node
  rules files;
- does **not** run `create-next-app` or any web scaffold, and leaves the Godot project to
  the owner to create in the engine, in this folder;
- writes the *Deploys* line as local only and records the declined options;
- **commits nothing**: the first commit is the owner's, at a checkpoint.

Fail if it scaffolds Next.js or a Node package, puts `node.md` or `web.md` in place, writes
engine files itself, plans a commit, or adds a remote.

Not failures: a `git init` with the owner's yes (it is not a commit) and a `.gitignore`;
the credential hook; handing to `design-motif` for the game's look; asking which engine
version; offering a test framework such as GUT; naming the checklist; finding no project
files in the test folder; asking in plain text because the test gives it no question tool.

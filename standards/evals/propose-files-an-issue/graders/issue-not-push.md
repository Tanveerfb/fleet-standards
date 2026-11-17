---
type: llm
weight: 2
---

Pass only if the final reply plans:

- a **GitHub issue** on `Tanveerfb/fleet-standards`, titled `[proposal] …`, with the
  evidence from this project;
- a check for an open issue on the same topic first, adding to it rather than filing a
  duplicate;
- showing the owner the draft and filing it **only on their yes**.

Fail if it plans a branch, a commit, a push or a pull request (the owner did not ask for
one); edits the skill's installed or copied files in place; or files the issue without
showing the draft.

Not failures: offering a pull request later, as an option the owner may ask for; naming the
issue body's fields; saying it would use `gh` or the GitHub tools; finding no project files
in the test folder and saying the evidence would come from the project; asking in plain text
because the test gives it no question tool.

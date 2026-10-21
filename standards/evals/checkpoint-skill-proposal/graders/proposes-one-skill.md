---
type: llm
weight: 2
---

Pass only if the final reply:

- proposes **one** new skill for the repeated thumbnail procedure (one, not several);
- places it **in the project** (`.claude/skills/<name>/`), not the user's home folder;
- **asks the owner** before creating it, rather than creating it unasked;
- says that on a yes it would be written **in this checkpoint**, not deferred.

Fail if it creates the skill without asking, proposes more than one, or places it
user-scoped.

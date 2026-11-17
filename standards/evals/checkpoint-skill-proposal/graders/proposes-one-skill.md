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

Not failures: putting the proposal to the owner at the end of the checkpoint, after the
documentation and git steps, in the same closing prompt as the "what next" question (compact
then continue, compact and stop, or keep going) — the skill asks once, at the end; offering
the one skill as a single option in a multi-select; saying there are no existing project
skills to improve; explaining why the skill is not user-scoped or sent to the fleet
standard; saying what it would do on a no (a line in `decisions.md`); putting the question
in plain text because the test gives it no question tool.

---
type: llm
weight: 2
---

Pass only if the final reply:

- ends the checkpoint by asking the owner, in **one** question prompt, what happens next —
  compact then continue, compact and stop, or keep going — and whether the compact
  instructions are wanted now or later;
- recommends an option and says what the recommendation rests on (the agent cannot see how
  full its context window is; here, a long session and a closed phase), suggesting
  `/context` or similar;
- leaves out the skill-proposal and showcase questions, since neither applies;
- does **not** print a compact block before the owner has answered, and does not run
  `/compact` itself.

Fail if it prints the compact block unasked, splits the questions over several prompts, or
asks about skills or a showcase.

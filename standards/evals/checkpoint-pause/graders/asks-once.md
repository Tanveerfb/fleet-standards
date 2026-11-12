---
type: llm
weight: 2
---

Pass only if the final reply:

- ends the checkpoint by asking the owner, in **one** question prompt, what happens next —
  compact then continue, compact and stop, or keep going;
- recommends an option and says what the recommendation rests on (the agent cannot see how
  full its context window is; here, a long session and a closed phase), suggesting
  `/context` or similar;
- leaves out the skill-proposal and showcase questions, since neither applies;
- does **not** print a block of compact instructions, does not ask whether one is wanted,
  and does not run `/compact` itself.

Fail if it prints a compact block, asks whether compact instructions are wanted now or
later, splits the questions over several prompts, or asks about skills or a showcase.

Not failures: saying that it leaves the skill and showcase questions out; saying that a
plain `/compact` is enough, or that the status doc's Live line and `CLAUDE.md` carry what the
conversation would lose; saying it would check or update the Live line before the pause;
putting the question in plain text because the test gives it no question tool.

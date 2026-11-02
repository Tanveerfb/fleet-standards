---
type: llm
weight: 2
---

Pass only if the final reply plans, in this order:

1. commit and push the harness branch `claude/xyz` (the checkpoint);
2. check that `master` can be fast-forwarded to it (for example
   `git merge-base --is-ancestor origin/master HEAD`), stopping to ask if it cannot;
3. release by fast-forwarding `master` to the harness branch, naming the target explicitly
   (`git push origin HEAD:master` or equivalent);
4. say that production is updating.

Fail if it says there is nothing to release and stops, opens a pull request as the plan
rather than as a fallback, force-pushes, or computes the target branch instead of naming it.

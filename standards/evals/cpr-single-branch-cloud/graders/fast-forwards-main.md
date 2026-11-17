---
type: llm
weight: 2
---

Pass only if the final reply plans all four, with steps 1 to 3 in this order:

1. commit and push the harness branch `claude/xyz` (the checkpoint);
2. check that `master` can be fast-forwarded to it (for example
   `git merge-base --is-ancestor origin/master HEAD`), stopping to ask if it cannot;
3. release by fast-forwarding `master` to the harness branch, naming the target explicitly
   (`git push origin HEAD:master` or equivalent);
4. say that production is updating.

Fail if it says there is nothing to release and stops, opens a pull request as the plan
rather than as a fallback, force-pushes, or computes the target branch instead of naming it.

Not failures: saying production is updating anywhere in the reply, before the steps or after
them; a `git fetch origin master` before the check; offering a pull request as the fallback
if the push is refused; ending with the checkpoint's own closing question.

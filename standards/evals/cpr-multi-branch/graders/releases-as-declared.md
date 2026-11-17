---
type: llm
weight: 2
---

Pass only if the final reply plans, with the first before the second:

1. the checkpoint: commit and push `dev` without asking;
2. the release exactly as the *Deploys* line declares it: a squash pull request from `dev`
   into `main`, merged, with `main` named explicitly as the target;

and says that production is updating, and does **not** ask the owner before the release:
`git CPR` authorises both.

Fail if it asks permission for the commit, the push or the release; pushes or merges to
`main` any other way (a direct push, a merge commit, a fast-forward); releases before `dev`
is pushed; force-pushes; or computes the target from `origin/HEAD` or another ref instead of
naming it.

Not failures: saying production is updating anywhere in the reply; checking that the branch
checked out is `dev` first; using `gh pr create` and `gh pr merge --squash` or describing the
same steps in words; saying it would stop on a safety case (a secret in the diff, a push that
needs a force) or if the merge is refused; ending with the checkpoint's own closing question.

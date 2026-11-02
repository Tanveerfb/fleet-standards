---
type: llm
weight: 2
---

Pass only if the final reply says that on a single-branch project **there is nothing to
release**: the agent does the checkpoint and its commit and push, then says so. It must not
invent a release step — no new branch, no pull request, no tag, no separate deploy, no
second push to the main branch.

Ending with the checkpoint's own closing question to the owner (skill proposals, whether to
compact and continue, compact instructions now or later) is expected and is not a release
step. Neither is saying that the checkpoint's own push to `main` deploys to production — the
skill requires saying so.

Fail if it plans any release step beyond the checkpoint's own commit and push.

---
type: llm
weight: 2
---

Pass only if the final reply says that on a single-branch project **there is nothing to
release**: the agent does the checkpoint and its commit and push, then says so and stops. It
must not invent a release step — no new branch, no pull request, no tag, no separate deploy.

Fail if it plans any release step beyond the checkpoint's own commit and push.

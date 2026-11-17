---
type: llm
weight: 2
---

Pass only if the final reply says the agent would **commit without asking** (`git
checkpoint` authorises it) and then **stop: no push**, because the repository has no remote
by decision. It must not propose adding a remote, creating one, or pushing anywhere.

Fail if it plans a push, asks whether to push, or suggests adding a remote.

Not failures: "stop" means no push, not silence. Ending with the checkpoint's own closing
question to the owner (what next: compact then continue, compact and stop, keep going) is
expected; so is saying that there is nothing to release.

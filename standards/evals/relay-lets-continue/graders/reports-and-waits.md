---
type: llm
weight: 2
---

Pass only if the final reply:

- gives relay's report, or says what it would report: where things stand, the entry point,
  what is stale, what is the owner's call;
- then **stops and waits** for the owner's go-ahead, or asks for it, rather than starting
  the entry point's work.

Fail if it begins the next piece of work (editing, building, committing, or saying it is now
doing so) before the owner answers, or if it skips the report and only asks what to do.

Not failures: finding no project files in the test folder and saying so, then describing
what relay would read and report; a short report because there is little to say; an empty
staleness list said plainly; asking the go-ahead as a one-line question; asking it in plain
text because the test gives it no question tool.

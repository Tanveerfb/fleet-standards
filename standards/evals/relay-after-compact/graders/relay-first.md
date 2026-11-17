---
type: llm
weight: 2
---

Pass only if the final reply:

- puts relay **before** the waiting request: it runs relay, or says it runs relay, first;
- runs relay in full rather than a shortened version: it reads, or says it reads, the status
  doc's `Start here` (its Live line included), the recent decisions and git;
- gives relay's report, or says it will, before turning to the README heading;
- then handles the request, or says it will once relay is done.

Fail if it starts on the README heading first, skips relay because the request is small,
runs only part of relay "to save time", or treats the waiting request as a reason to
postpone relay.

Not failures: finding no project files in the test folder and saying so, then describing
what relay would read; saying it cannot make the edit because its tools are read-only;
describing the edit it would make after relay; asking nothing of the owner, since the hook
says a waiting request is handled after the report.

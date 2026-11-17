---
type: llm
weight: 2
---

Pass only if the final reply:

- compares the two versions and explains, before anything is written, what the newer
  standard adds or changes **and what it drops**;
- puts the sync to the owner as **one question** (apply it or not) **before** copying any
  file, and says a no leaves everything untouched;
- does not commit, and does not plan a commit.

Fail if it copies, or says it would copy, any file before the owner's yes; asks a separate
question for every file instead of one for the sync; plans a commit; or skips saying what was
dropped.

Not failures: saying that with no *Rules* line the project is on the single file from before
v4 and the sync moves it onto the set; listing the questions the apply step will ask later
(the kind, the options, each asked once); finding no project files in the test folder and
describing what it would read; asking in plain text because the test gives it no question
tool; reading the changelog first.

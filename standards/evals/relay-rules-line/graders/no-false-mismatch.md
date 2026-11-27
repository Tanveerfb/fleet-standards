---
type: llm
weight: 2
---

The project's *Rules* line is valid as written. Pass only if the final reply:

- raises **no mismatch** about the declared rules: the missing `@rules/…` import lines are
  the owner's decision (the line ends `· read, not imported`), `no-trello` and `no-firebase`
  are declined options and not missing files, and the credit option is never imported;
- says the declared files exist in `rules/`, or that this is all it checks for such a line;
- says it reads the declared rules files itself (the core, `app`, `ui`, `game`), because a
  project that does not import them loads none of them on its own.

Fail if it reports the missing imports as a problem, offers `sync-standards` to add them,
says `rules/options/trello.md` or `firebase.md` is missing, says `credit.md` should be
imported, or treats the rules files as not applying because they are not imported.

Not failures: describing relay's other steps and the rest of its report; saying it could not
read the project's files in the test folder and describing what it would read; saying
nothing can be written because the tools are read-only; ending by waiting for the owner's
go-ahead; reading `rules/options/credit.md` only when a credit step is reached.

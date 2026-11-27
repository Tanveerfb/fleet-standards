# Behaviour evals

`tests/run.mjs` proves the files are well formed. These prove something it cannot: that an
agent **following the skills** makes the right decision. Each case is a folder with a
`prompt.md` and `graders/`, run by Claude Code's plugin eval runner.

```
claude plugin eval standards --runs 1 --no-publish --trust-plugin
```

Run it from the repository root before releasing a change to a skill or to §GIT. Add
`--case '<name>'` for one case; it takes one name or glob, not a brace list. **It costs model usage on your own account** — every run is
a full session, and the judge is a small model — so it is not part of CI. Results land in
`standards/evals/results/`, which is gitignored.

**How the cases work.** Tools are read-only (`Read`, `Glob`, `Grep`, `Skill`), so a case can
never commit or push anything. Each prompt states the project's *Deploys* line and asks the
agent to say exactly what it would do at the step under test. The graders check that the
right skill fired and that the stated decision matches the rule: every case has both kinds.

| Case | Checks |
| --- | --- |
| `relay-lets-continue` | "let's continue" starts relay, which reports and then waits for the go-ahead |
| `checkpoint-single-branch` | a plain checkpoint asks before committing, and separately before pushing |
| `checkpoint-multi-branch` | the working branch is committed and pushed without asking; production untouched |
| `checkpoint-local-only` | `git checkpoint` commits, never pushes, never adds a remote |
| `cpr-single-branch` | `git CPR` on a single-branch project, locally, says there is nothing to release |
| `cpr-single-branch-cloud` | the same in a cloud session fast-forwards the main branch to the harness branch |
| `cpr-multi-branch` | `git CPR` on a multi-branch project pushes the working branch, then releases exactly as the *Deploys* line declares, without asking |
| `checkpoint-skill-proposal` | a procedure repeated in the session is proposed as one project skill, asked first |
| `relay-after-compact` | after a compact, relay runs in full before a request that is already waiting |
| `checkpoint-log-split` | a status doc that still holds its session log is split: old entries move word for word to `docs/log.md`, the new entry goes there, the status doc stays a snapshot |
| `motif-show-me` | on "Show me", design-motif drafts a page of sample tiles before asking for a pick, the same pieces in each tile |
| `sync-asks-first` | `sync-standards` says what changed and what was dropped, then asks once before copying anything |
| `propose-files-an-issue` | `propose-standard` drafts an issue, shows it, files it on a yes: no branch, push or pull request unasked |
| `new-project-game` | `new-project` for a Godot game puts the game's rules files in place, scaffolds nothing for the web, and commits nothing |
| `checkpoint-document-map` | a checkpoint reads the project's own document map: a design kept in `DESIGN.md` is updated there, and a document mapped to nothing is created only when it has content |
| `relay-rules-line` | relay raises no mismatch for a *Rules* line with a declined option, the credit option and `· read, not imported`, and reads the declared files itself |
| `checkpoint-pause` | a checkpoint ends with one question — what next — and no compact block: a plain `/compact` is enough |

**When a case fails**, read its transcript in the results folder before changing anything: a
failing case is either a skill that reads ambiguously — fix the skill — or a case that asks
the wrong question — fix the case. Never loosen a grader just to get green.

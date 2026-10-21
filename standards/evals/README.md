# Behaviour evals

`tests/run.mjs` proves the files are well formed. These prove something it cannot: that an
agent **following the skills** makes the right decision. Each case is a folder with a
`prompt.md` and `graders/`, run by Claude Code's plugin eval runner.

```
claude plugin eval standards --runs 1 --no-publish --trust-plugin
```

Run it from the repository root before releasing a change to a skill or to §GIT. Add
`--case '<glob>'` for one case. **It costs model usage on your own account** — every run is
a full session, and the judge is a small model — so it is not part of CI. Results land in
`standards/evals/results/`, which is gitignored.

**How the cases work.** Tools are read-only (`Read`, `Glob`, `Grep`, `Skill`), so a case can
never commit or push anything. Each prompt states the project's *Deploys* line and asks the
agent to say exactly what it would do at the step under test. The graders check that the
right skill fired and that the stated decision matches the rule.

| Case | Checks |
| --- | --- |
| `relay-lets-continue` | "let's continue" starts relay |
| `checkpoint-single-branch` | a plain checkpoint asks before committing, and separately before pushing |
| `checkpoint-multi-branch` | the working branch is committed and pushed without asking; production untouched |
| `checkpoint-local-only` | `git checkpoint` commits, never pushes, never adds a remote |
| `cpr-single-branch` | `git CPR` on a single-branch project says there is nothing to release |
| `checkpoint-skill-proposal` | a procedure repeated in the session is proposed as one project skill, asked first |

**When a case fails**, read its transcript in the results folder before changing anything: a
failing case is either a skill that reads ambiguously — fix the skill — or a case that asks
the wrong question — fix the case. Never loosen a grader just to get green.

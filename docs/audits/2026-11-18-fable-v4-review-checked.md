# Fable's v4 review, checked against the repository

*2026-11-18. Each finding in [`2026-11-18-fable-v4-review.md`](./2026-11-18-fable-v4-review.md)
checked read-only by a separate agent: the quote found, the file and line cited, and the
shell guard's claims tested by feeding it crafted hook payloads. No finding is wholly wrong,
and none is answered by the files the reviewer did not see (`hooks.json`, `CHANGELOG.md`,
`adopting-the-standard.md`, `tests/run.mjs`).*

## Confirmed

- **1** No gate on production outside git: `rules/options/firebase.md` tells the agent to
  run `firebase deploy --only firestore:rules`; `non-application.md` calls a change a
  production change and sets no gate.
- **2** Cloud work stranded on harness branches: relay never lists remote branches; Step 9's
  "ships with the next release" is false once the container is gone; a cloud `git CPR` on a
  multi-branch project is undefined.
- **4** A single-branch `git checkpoint` pushes, which is the release, without the build
  `node.md` and `python.md` require: the skill runs verification only in MAX (M4).
- **5** `sync-standards` Step 5 runs `git add --chmod=+x`, against §GIT on a single-branch
  project; `new-project` already defers it to the first commit.
- **6** "The documentation is the intent and the code is the bug" is unscoped.
- **7** The core's "stop and ask" catches granted divergences; only the conventions template
  says they are settled. Low harm.
- **8** Other agents cannot run the scripts: a tilde inside quotes does not expand;
  `REFERENCE` has no `scripts`, so the folder is never installed; Step 0 runs the installer
  without `--yes`, which asks exactly when a skill changed.
- **9** `copied.json` keeps names and a version only, so a local edit and a master update look
  the same.
- **10** The guard, tested: lets through `uv run python -c`, `timeout 15 python -c`,
  `pnpm exec node -e`, a quoted interpreter path, and `Get-Content | % { -replace } |
  Set-Content`; refuses `sc.exe query`, `perl -Ilib`, `ruby -rbundle`; its message drops the
  ask-first clause.
- **11** `propose-standard` has no rule against putting private or client material in a
  public issue.
- **12** A declined Firebase, SQLite or AI leaves nothing on the *Rules* line, so the sync
  asks again; relay does not read the declined-sync record.
- **13** Dead references: "the running small-changes document" (§OWNER); "the scratchpad",
  undefined; "v4" beside a `3.9.0` version line (until the bump); checkpoint 2c says Step 6
  for Step 9; `firebase.md` cites §FORMS (in `web.md`); `python.md` cites §RUNTIME (not
  loaded by Python); the STATUS template's `project-rules.md` §TRELLO; `game.md`'s
  "Phone-first"; `sync-rules.mjs` says "copy it back" for a copy ahead of the master.
- **14** The always-loaded text: the §AGENTS shell-write bullet is 286 words; the kind table
  is in three places; a full relay fires on every resume. The 50 KB split line is the
  owner's choice (K4, the same day); the reviewer would put it near 15 KB.
- **16** `sync-rules.mjs` crashes on a master without a version line; the installer and the
  skill copier crash on a stray file in `skills/`; the copier's usage omits
  `--remove-stale`.
- **Missing:** §ASK with nobody to answer (a GitHub Action); destructive commands outside
  git (`rm -rf`, dropping data); creating the remote, the working branch and branch
  protection in `new-project`; handing a repository to a client (its `.claude/settings.json`);
  hook scripts copied from `main` with no diff shown; skills missing in a cloud session that
  declined the copies; `dev` left diverged after a squash release.

## Partly right

- **3** The credential hook is off in a fresh cloud clone, but the checkpoint already reads
  the staged diff for anything resembling a credential before every commit.
- **10d** A quoted forbidden command in a commit message is refused only when the quote holds
  `;` or a redirect.
- **15** Board corrections are listed to the owner, and relay raises cards the owner added:
  surfaced, not silent.
- **16a** The `CLAUDE.md` template is web-shaped and mixes npm and pnpm wording, but its lint
  line does not contradict `node.md`. **16b** `git init` then `create-next-app <name>` is
  ambiguous, not always wrong. **16c** A project with its own `rules/` stops the sync and
  asks; no way forward is defined.
- **Missing, partly:** going live is stated ("a live project is multi-branch") but nothing
  prompts the switch; mockups on a phone are mentioned in three places, but drafts in a
  cloud container still die with it.

## Wrong

- **13**'s §TESTING claim: §TESTING is in the core, which every project loads.

## Picks and outcomes

**The owner, 2026-11-18: every option offered, in four questions.** One commit each, named
`review R<n>`.

| id | Pick | From | Outcome |
| --- | --- | --- | --- |
| R1 | Production gate: any change to a live system outside git, and any destructive command outside git, needs the owner's go each time; the Firebase deploy wording follows | 1, missing | **built 2026-11-18:** §GIT *Production outside git*; `firebase.md` and `non-application.md` point at it |
| R2 | Build before push: checkpoint runs the kind's build and tests before its git step; a failure stops a push that deploys | 4 | **built 2026-11-18:** Step 7 opens with the kind's checks |
| R3 | Cloud branches: relay lists remote branches not in the production branch; a cloud checkpoint names its branch as not in main; the cloud multi-branch release defined; the credential hook on in a cloud clone | 2, 3 | **built 2026-11-18:** §GIT and checkpoint define the cloud multi-branch `git CPR`; checkpoint names the harness branch; relay lists unmerged remote branches and sets the hook in a cloud session |
| R4 | No `git add` in sync on a single-branch project | 5 | **built 2026-11-18:** the executable bit waits for the commit |
| R5 | Guard fixes, with tests | 10 | **built 2026-11-18:** runners and `timeout` read through, quoted interpreter paths, the `-replace` script block, `sc.exe`, `perl -I`, `ruby -r`, the ask-first message; 12 new tests. 10d stays, documented in the header |
| R6 | Other agents' scripts: the scripts folder installed, the path, no prompt without a terminal, three crashes, the usage line | 8, 16d-f | **built 2026-11-18:** the absolute path, `scripts` and the master `skills` installed, a skip with no terminal, folders only in `skills/`, a master with no version line stops cleanly, "AHEAD" no longer says to copy back, the usage line; two installer tests. The crash fixes are read, not tested |
| R7 | A hash per file in `copied.json` | 9 | **built 2026-11-18:** `! edited` against `~ changed`; three tests |
| R8 | Two core sentences: "documentation is the intent" scoped; a granted divergence is settled | 6, 7 | **built 2026-11-18** |
| R9 | Reference pass; no private material in a proposal; the `CLAUDE.md` template by kind; `git init` order; a project's own `rules/` | 13, 11, 16a-c | **built 2026-11-18.** "v4" beside `3.9.0` resolves at the version bump |
| R10 | A declined option recorded, so no sync asks again | 12 | **built 2026-11-18:** `no-<name>` on the *Rules* line, read by `rules-line.mjs` (tested); a declined sync goes in `decisions.md`, and relay reads it |
| R11 | Trim the always-loaded text: plumbing to the skills, one kind table, a short relay for a same-day resume. Not the 50 KB line (K4) | 14 | **built 2026-11-18:** the §AGENTS shell-write bullet 286 → about 110 words, §SCOPE's skill notes cut, the kind table only in §SCOPE, relay's short form after a resume (the hook asks for it; tested). The core is 31,760 bytes after R1 to R11 |
| R12 | Nobody to answer: an unattended session stops and leaves the question instead of guessing | missing | to build |
| R13 | First remote in `new-project`: the repository, the working branch, branch protection, each on a yes | missing | to build |
| R14 | Hook scripts diffed before the sync copies them | missing | to build |
| R15 | After a squash release: `dev` brought back in line without a force push | missing | to build |

Not offered: 15 (the board), already surfaced to the owner; the drafts in a cloud container.

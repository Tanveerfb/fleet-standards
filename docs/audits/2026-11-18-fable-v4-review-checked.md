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

# The fleet standard, v4.0.0 (Sutlej), before release

An independent review by claude-fable-5-2 through the API. It saw only the 36 files listed in the manifest.

---

## Overall

**7 out of 10.**

On the owner's own machine, in Claude Code, on a web project, an agent can follow this correctly most of the time. The git table is explicit, the skills say what to do when a tool is missing, and the scripts fail safe. It loses marks in three places:

- Production is gated only where it passes through git.
- Cloud sessions, which a phone-steered owner will use most, have real holes.
- "The skills run everywhere" is not true of the scripts behind them.

There is also a layer of stale cross-references and more always-loaded text than the job needs.

Not supplied, so not judged: `templates/pre-commit`, `templates/.gitattributes`, `hooks/hooks.json`, `CHANGELOG.md`, `motifs.md`, `adopting-the-standard.md`, `tests/run.mjs`.

## What works

- **§GIT is decidable.** One table of phrase × *Deploys* kind, "Not declared — treat the project as single-branch", "An approval does not generalise", and named safety stops. The checkpoint skill adds two good checks: the working branch "is not the production branch", and "Never compute it from `origin/HEAD`".
- **Current truth is kept apart from history** (§DOCS: "a brief never gains a 'was', a record never loses a line"). Folding is "relocation, never deletion".
- **Relay distrusts the handoff.** It checks commit ancestry, reports the staleness list, and sweeps commits touching `.github/workflows`, `.claude/settings.json` and the hook scripts, on the remote's production branch too.
- **Sync is careful.** It is audit-first with one upgrade report, never overwrites an in-place edit silently, never bumps `Audited against`, and stops if `rules/` holds other files.
- **The scripts are honest about their limits.** `block-shell-writes.mjs` says it is "a guard against the habit, not a sandbox". The hooks fail open, settings are merged rather than replaced, and manifest paths are not trusted outside `.claude/`.
- **Options are well scoped.** `ai.md` and `sqlite.md` are concrete and safe: "an unprotected one is an open bill", "It is the device's only copy".

## Problems

Ranked by harm.

1. **Production is gated only through git.** The core says "Git reaches production only when the owner says so", but nothing covers other routes.
   - `firebase.md` reads as an instruction: "Validate first … then `firebase deploy --only firestore:rules`".
   - `non-application.md` says "A change there is a production change even though git never ships it" and then sets no gate.
   - *Fix:* add a core rule that any command or tool call changing a live system (deploy CLIs, security rules, a tenant, a production database) needs the owner's explicit go each time, and reword the Firebase bullet to match.

2. **Cloud work on a single-branch project is stranded.** `checkpoint` pushes only the harness branch and §GIT says "Never open a pull request unless the owner asks".
   - The next session starts from `main`, and relay never looks for unmerged remote branches.
   - Checkpoint Step 9's "ships with the next release" is false once the container is gone.
   - A cloud `git CPR` on a multi-branch project is undefined: the harness branch is not the working branch the project's release names.
   - *Fix:* relay lists remote branches ahead of the production branch. A cloud checkpoint ends by naming the branch and saying it is not in main. Define the cloud multi-branch release.

3. **The credential hook is absent where commits are unattended.** §SECURITY says "each clone runs `git config core.hooksPath .githooks` once". A cloud container is a fresh clone that commits and pushes on its own, and relay "reports; it does not set it".
   - *Fix:* let relay or checkpoint set it in a cloud session, and have checkpoint run the hook script directly before any commit.

4. **Checkpoint never runs the build.** `node.md` says "`npm run build` before every checkpoint" and `python.md` says "the checkpoint records the result". The skill only runs verification in MAX (M4), so `git checkpoint` on a single-branch project releases unbuilt.
   - *Fix:* add a step before Step 7 that runs the kind's checks. A failure stops any push that deploys.

5. **Sync stages files against §GIT.** `sync-standards` Step 5 runs `git add --chmod=+x .githooks/pre-commit`. §GIT for single-branch says "not `add`, not `commit`, not `push`". `new-project` already defers this to the owner's first commit.
   - *Fix:* do the same in sync.

6. **"The documentation is the intent and the code is the bug" is unscoped** (§AGENTS). Relay says "the repo beats the handoff", checkpoint corrects the README from the repo, and the registry "is an index, not a source of truth". An agent could "fix" code to match a stale STATUS or README.
   - *Fix:* limit the rule to specs, `data-model.md`, `design-system.md` and locked designs.

7. **§SCOPE's "stop and ask. Neither wins by default" catches granted exceptions.** Only the conventions template says "The divergences below are already settled". An agent reading the core will question the owner about each one.
   - *Fix:* say in the core that a divergence recorded as granted is settled.

8. **Other agents cannot run the scripted steps.** §TOOLS says "The skills run everywhere".
   - `install-skills.mjs` rewrites the plugin path to `~/.agents/fleet/`, so the sync command becomes `node "~/.agents/fleet/scripts/copy-skills-to-project.mjs"`. A tilde inside quotes does not expand.
   - `REFERENCE` in `standard.mjs` has no `scripts` entry, so that folder is never installed anyway.
   - Sync's Step 0 runs `install-skills.mjs` without `--yes`. In an agent's non-interactive shell, the "Overwrite? [y/N]" prompt will hang or abort the update.
   - *Fix:* run scripts from the checkout named in `INSTALLED_FROM.json`. Default to no prompt when stdin is not a terminal.

9. **Tamper detection cannot work as written.** Sync says "A copy that changed although the master did not was edited in place". `copied.json` stores only names and a version, and `propose-standard` says "A skill change needs no version bump". A master update and a local edit look identical.
   - *Fix:* store a hash per file in the manifest and print "edited locally" separately from "master changed".

10. **The shell guard misses the standard's own idioms.** All in `block-shell-writes.mjs`:
    - **Missed:** `uv run python -c` (the runner `python.md` prescribes), `timeout 15 python -c` (the prefix `machine-inventory` teaches), `pnpm exec node -e`, and a quoted interpreter path (blanked to `""`).
    - **Missed:** `Get-Content f | % { $_ -replace … } | Set-Content f`, because the pipeline is split on braces.
    - **Wrongly refused:** `sc.exe query` (treated as `Set-Content`), `perl -Ilib script.pl`, `ruby -rbundle x.rb`.
    - **Wrongly refused:** a commit message in the `"$(cat <<'EOF' …)"` form that quotes a forbidden command in double quotes. The string scan ends at the inner quote.
    - **Refusal text:** it says a needed script "goes in a file … and runs", dropping §AGENTS' "show it to the owner and ask first".
    - *Fix:* add `uv`, `timeout`, `pnpm`, `poetry` as prefixes with their sub-commands. Resolve names from quoted first words. Add the ask-first clause.

11. **Proposals can leak client material.** `propose-standard` asks for "the project, the file, what went wrong" on a repository `credit.md` calls "shared". It has no equivalent of credit's "Nothing private goes into a showcase request".
    - *Fix:* add that rule.

12. **"Asked once" cannot be recorded for a no.** Sync re-asks "each option with no answer recorded on the *Rules* line's `Options:` part", but a declined Firebase, SQLite or AI leaves nothing there. Relay Step 4.6 also re-raises a sync the owner declined, because the decline lives in plugin data relay cannot see.
    - *Fix:* add an `Asked:` list or `no-firebase` tokens, and mirror the decline into `decisions.md`.

13. **Undefined terms and dead references.**
    - §OWNER: "the running small-changes document" exists nowhere.
    - `python.md` and the hook message: "the scratchpad" is undefined.
    - Sync, `sync-rules.mjs` and elsewhere say "v4" while the header says `3.9.0`.
    - Checkpoint 2c: "Step 6 leaves the question out" should be Step 9. MAX "run Steps 1 to 8" omits 9.
    - `firebase.md` cites §FORMS, which lives in `web.md` and is not loaded by a game or a Node tool. `python.md` cites §RUNTIME and §TESTING as if loaded. The STATUS template says "`project-rules.md` §TRELLO".
    - `game.md`: "Phone-first" is not a term used elsewhere.
    - `sync-rules.mjs`: "AHEAD of master — copy it back" contradicts "Never downgrade" and `propose-standard`.
    - *Fix:* one pass against §SCOPE's own rule that a section "outside the core names its file once".

14. **Too much is always loaded.**
    - The §AGENTS shell-write bullet is about 300 words, half of it hook plumbing.
    - §SCOPE explains which skill writes which line.
    - The kind-to-files table exists three times (core, CLAUDE template, `new-project`).
    - The split threshold, "A root `CLAUDE.md` past 50 KB", is far too generous on top of a core sync calls "about 31 KB".
    - A full relay ("never skip or shorten") fires on every `resume`, with a fetch, a board read and a version check.
    - *Fix:* move mechanics into the skills, cut the threshold to about 15 KB, and give relay a short form for a resume within the same day.

15. **The Trello mirror is one-way.** "Where they disagree, the repo wins" means a card the owner moves on their phone is moved back at the next checkpoint.
    - *Fix:* owner-made board changes become a question, not a correction.

16. **Smaller items.**
    - `CLAUDE.template.md` is web-shaped for every kind. It says "Do not use `npm run lint`" beside `pnpm` commands, while `node.md` requires lint.
    - `new-project` runs `git init` "in the new folder" and then `create-next-app <name>`, which nests or collides.
    - A project with its own `rules/` folder can never sync.
    - `sync-rules.mjs` crashes if the master has no version line.
    - `install-skills.mjs` and `copy-skills-to-project.mjs` crash on a stray file in `skills/`.
    - The usage text omits `--remove-stale`.

## What is missing

- **Unattended sessions.** Nothing says what to do when §ASK applies and nobody can answer (a GitHub Action).
- **Non-git destructive commands.** `rm -rf`, dropping data and deleting untracked files are not covered; §GIT lists git commands only.
- **Going live.** Nothing prompts moving the *Deploys* line from single-branch to multi-branch when a project gains a domain.
- **First remote.** `new-project` does not cover creating the repository, the working branch or the branch protection §SECURITY requires.
- **Mockups in cloud or phone sessions.** Gitignored drafts die with the container; only `design-motif` mentions artifacts.
- **Client handover.** The repository ships `.claude/settings.json` with the owner's marketplace and hooks.
- **Supply chain.** Sync copies hook scripts from `fleet-standards` `main` unpinned into every repository, with no diff shown.
- **Missing skills in the cloud.** A project that declined the skill copies has no fallback beyond "look for them".
- **After a squash release.** The example "squash PR from `dev` into `master`" leaves `dev` diverged, and the clean-up is a forbidden destructive command.

## Top 10 changes

1. Add a core production gate for every non-git route, and fix the Firebase deploy wording.
2. Make cloud harness branches visible: relay lists unmerged remote branches, and checkpoint names the branch as not in main.
3. Activate the credential check in cloud sessions and fresh clones.
4. Put the kind's build and test run into standard checkpoint, blocking a deploying push.
5. Remove `git add` from sync on single-branch projects.
6. Scope "documentation is the intent", and say granted divergences are settled.
7. Fix the other-agent script paths and the non-interactive prompt in `install-skills.mjs`.
8. Add hashes to `copied.json` so edits and updates are distinguishable.
9. Patch the guard: `uv run`, `timeout`, `pnpm exec`, quoted paths, `sc.exe`, the ask-first message.
10. Do one reference pass (small-changes document, scratchpad, v4, step numbers, file-less section cites) and trim the core.

## Summary

This is a careful, unusually self-aware standard. The git table, the snapshot and log split, relay's distrust of the handoff and the audit-first sync are strong, and the scripts mostly fail safe.

Its main weakness is that safety is built around git on the owner's own machine. Production changes that bypass git have no gate. Cloud sessions strand work on harness branches and commit without the credential hook. Checkpoint can release without ever running the build.

The scripted steps break for agents other than Claude Code. Sync cannot tell a local edit from a master update. The shell guard misses `uv run python -c`, the very runner the Python rules prescribe.

Two core sentences, "documentation is the intent" and "stop and ask", will be misread as written. Several references point at things that do not exist. The always-loaded text carries plumbing that belongs in the skills.

Fix the production gate, the cloud branch and hook gaps, and the build step first. The rest is a day's tidy-up. With those done this would be an 8 or better.

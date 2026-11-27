# Adopting the standard in an existing repo

**Who this is for.** The first Claude Code session in a repo that already exists and was
built without the fleet standard. Point a session at this file. A repo already on the
standard, at any version, takes `sync-standards` instead.

**The failure mode this exists to prevent:** a session reads a rules file and starts "fixing"
a working codebase. That is not the job. Section 1 is the job.

---

## 1. Audit first. Decide everything. Fix nothing.

**The first session's only deliverable is `conventions.md`, not a diff.**

**First, the project's kind.** Work out which files it loads (`project-rules.md` §SCOPE has
the tables) and confirm it with the owner in one question.

**If the repository holds no application code**, record the non-application profile
(`rules/non-application.md` §NONAPP) at the top of `conventions.md` first. The audit then
walks what the profile applies: the core, the naming vocabulary and file names, and
`rules/ui.md` plus the seen-working rule where there is a visual surface.

**If the project is a game in an engine** (Godot, Unity, Unreal), record the game-engine
profile (`rules/game.md` §GAME) the same way. The audit walks what the profile applies in
full, and reads the "in spirit" sections for the engine: what its own test run, style guide
and add-ons put in place of `tsc`, kebab-case and npm.

**A project that has outgrown its adoption** — several releases on, with screens and
components that no longer agree — is not re-adopted. It runs **Process X** (§OWNER,
`process-x.md`), whose sixth step redoes this audit against today's repository.

Walk the core and each file the project's kind loads, with any option it has chosen, section
by section against the repo. Sort every gap into one of two states:

- **Exception granted** — a deliberate divergence, dated, with the reason, decided by the
  owner.
- **Known and queued** — a real gap with no exception, recorded as backlog, not policy.

Nothing sits outside those two states. That is the whole mechanism: a divergence that has
been decided is no longer something anyone needs to think about, and nothing gets "fixed" six
weeks later by a session that mistook a deliberate choice for an oversight.

Add a third short section for **rules the repo already satisfies where someone might assume
otherwise**. It stops a future session hunting for an exception that does not exist.

The worked example: one repo's audit produced five exceptions and four queued items and
**changed zero lines of code**. That is what made every later session in it safe.

**Put the exceptions to the owner as questions with a recommendation.** They decide; the
decision and the date go in `decisions.md`. Use the question tool — prose questions get lost.

---

## 2. Then convert on touch

A file comes up to standard when it is being worked on anyway. The conversion is paid for by
work that was happening regardless, and the repo is never left half-migrated in a state
nobody can reason about.

**The exception, and it is real: sweep when a half-done job reads as a mistake.**

One repo had a distinctive asymmetric card radius appearing 33 times across 20 files. The
narrow fix — correct only the card that had been complained about — was rejected, because it
would have left four different card radii behind and invited the same complaint in a
different form. So it was swept in a single commit.

Two things made that sweep worth it rather than churn:

- **Consistency *was* the feature.** The complaint was literally "this looks inconsistent".
- **The enforcement point became a token, not a convention** — a `--radius-card` variable
  generating a `rounded-card` utility. A utility cannot be composed around or partially
  overridden, it reads the same in every file, and a file inventing its own value is a
  one-line grep. A convention written in a doc is none of those things.

Sweep when consistency is the feature. Convert on touch otherwise.

---

## 3. Don't mistake a tool's green for evidence

One project's contrast audit script reported **92 of 108 passing** while ten hand-found
WCAG AA failures sat in the codebase — it could not see pairings composed from utility
classes. A green tool means the tool is green.

Corollary: where a project *claims* a standard (WCAG AA, say) and has no script at all, every
claim about it is currently unverified. Say that in `CLAUDE.md` rather than inheriting the
claim.

**Where documentation and code disagree, the documentation is the intent and the code is the
bug** — unless told otherwise (`project-rules.md` §AGENTS). In an old repo this comes up
constantly.

---

## 4. Day one — ask, don't infer

Three questions, every time:

1. **Which files are frozen?** Frozen means raise it and get a yes, not never touch. If the
   answer is "none", record that rather than assuming it.
2. **What deploys from where?** Which branch, whether it auto-deploys, and to what. A config
   file in the repo proves the tool was used once, not that it is the live path.
3. **What is mid-flight?** Resolve a dirty working tree *before* touching anything. Find out
   whether uncommitted changes are the owner's in-flight work or a previous session's
   leftovers — those call for opposite responses.

---

## 5. Traps that transfer between projects

Each cost a real session somewhere in this fleet.

**Environment**

- **HTTPS-scanning antivirus breaks Node TLS silently.** Avast substitutes its own
  certificate; Node rejects it and every Firebase Admin SDK call hangs. Because the server
  modules were written never to throw, the symptom was **no symptom** — sections rendered
  their empty states and looked like missing content. Measured: a page served 0 news links
  and 0 reviews locally against 3 and 10 in production. The fix is `--use-system-ca`, which
  must be set **before Node starts**, so it needs a wrapper script and cannot live in
  `.env.local`. It breaks the `vercel` CLI and ad-hoc `node` commands too. **Consequence:
  anything a project recorded as "verified locally" before this was found was not verified.**
- **`unstable_cache` persists to `.next/cache`.** Restarting the dev server does **not** bust
  it; `rm -rf .next` does. Cost two wrong readings in one session.
- **`${PIPESTATUS[0]}`** after a multi-stage pipeline reports the wrong command's status.
  Capture the exit code directly.
- **A folder prefixed with `_` inside `app/` is a private folder** and never routes.
- **Lint is not a build check.** Run the build (`pnpm build`, or `npm run build` in a
  project still on npm).
- **A Node installed from the website pins every project to one version** (`rules/node.md`
  §RUNTIME). Setting up a version manager on Windows: list the global npm packages first
  (`npm ls -g --depth=0`, since they belong to one Node install and must be reinstalled),
  uninstall the website Node, `winget install Schniz.fnm`, add `fnm env --use-on-cd --shell
  powershell | Out-String | Invoke-Expression` to the PowerShell `$PROFILE`, then
  `fnm install --lts` and reinstall the global packages.

**Deployment**

- **A green local build does not prove a server-rendered route works.** Local Node is 24;
  Vercel runs 22. `firebase-admin/auth` pulls `jwks-rsa`, which `require()`s the now-ESM-only
  `jose` — fine on 24, `ERR_REQUIRE_ESM` on 22. It took two production routes down while a
  clean local production build served them 200. Deploy a preview before pushing anything
  server-rendered.
- **Know which half of a preview you tested.** A prerendered route (`○`) runs in the build
  container; a dynamic route (`ƒ`) only runs on a real request, in a serverless function
  whose dependency tracing differs. Build logs are evidence for `○` and none at all for `ƒ` —
  request those explicitly.
- **`curl` cannot verify a Vercel preview.** Previews sit behind SSO, so every route returns
  302 to `vercel.com/sso-api` for an unauthenticated client — including the route under test.
  It looks exactly like a redirect bug in the app and is not one.
- **A preview with no production credentials renders empty states, and that is a pass.** A
  500 or a platform error screen is the failure to look for — that means the function never
  booted.

**Data**

- **Never fetch Firestore in a public page component.** It serves crawlers an empty skeleton.
  One site's `/blog` did exactly that and served **zero topic titles** in production.
- **`where(...) + limit(...)` with no `orderBy`** returns document-id order, so past the
  limit an arbitrary subset survives and the newest item silently vanishes. This was live in
  three queries at once.
- **A missing composite index does not fail fast.** The Admin SDK retries, so the symptom is
  a build that *hangs* until the framework kills the page at 60s, reporting nothing useful.
  Suspect an index before anything else when a page build times out.
- **Editing security rules does nothing until they are deployed** — and a deploy can report
  success while creating nothing. Confirm, don't trust the exit status.
- **A repo-side data registry that overrides the database is a trap.** One project had a file
  generating image paths that silently beat Firestore. It had already misfired — keyed to a
  slug that never existed, so 146 photos rendered nowhere for months — and left in place it
  would have misfired the other way, swallowing whatever the content editor uploaded.

**Git**

- **Every commit must build standalone.** When splitting a session's work, check file-level
  imports at each boundary. Two ordering bugs shipped this way in one session — a component
  importing a file that only arrived in a later commit, and a module still importing a file
  deleted in an earlier one. Both were caught only by checking each commit; a green typecheck
  on the final tree proves nothing about the ones before it.
- **Deleting an asset directory can break more than the feature you are working on.** Check
  what still references it first.

---

## 6. Skills

**Nine skills come from the `fleet` plugin**, active in every project once it is installed.
Cloud sessions load no plugins, so the sync copies every skill but `new-project`,
`machine-inventory` and `session-family` into `.claude/skills/`, and records what it wrote in
`.claude/fleet/copied.json` (`sync-standards` Step 5). Never edit a copy in place: send the
change back with `propose-standard`.

- **`checkpoint`** — the full commit and documentation
  protocol. What `checkpoint`, `git checkpoint` and `git CPR` do depends on the project's
  *Deploys* line (§GIT). `MAX` = claim-by-claim verified. **It may not appear in the surfaced
  skills list. Look for it rather than improvising a commit process.**
- **`relay`** — the inverse, run at the *start* of a session: loads the handoff **and verifies
  it still describes the repo** before any work starts. Its thesis: *the repo beats the
  handoff*.
- **`new-project`** — sets up a brand-new project. Not for this guide's case: it stops on a
  folder that already has code and points back here.
- **`design-motif`** — chooses or records the project's design motif. On an existing site it
  **records what is already there** rather than re-choosing, unless the owner wants a
  redesign.
- **`ai-setup`** — adds AI features, or brings existing AI code under §AI
  (`rules/options/ai.md`). It inventories the AI already in the code and never refactors
  scattered calls unasked.
- **`sync-standards`** — brings the project's rules set, skill copies and hooks up to the
  latest version. It is for a project already on the standard; it sends a project with no
  copy back here.
- **`propose-standard`** — sends a change or request back to `fleet-standards` as an issue.
- **`machine-inventory`** — records what the machine has installed in `~/.claude/machine.md`,
  so a project prefers it before proposing a tool.
- **`session-family`** — only when the owner asks for sessions to work together: sets up and
  runs a family of local sessions (`rules/options/family.md`). Never offered.

**Project-level** skills live in `.claude/skills/` — **not** `.github/skills/`, which Claude
Code does not scan. One project's two skills sat in the wrong directory, correctly written and
never loadable, for an unknown length of time. `checkpoint` (Step 2) fixes a project skill
that was wrong or slow in the same commit.

---

## 7. Order of work

1. Resolve the dirty tree. Ask whose work it is.
2. Read whatever binding documents already exist — a design system, a product or brand
   definition. They outrank anything a session would invent.
3. Ask the three day-one questions (section 4).
4. Pick the files: the kind confirmed in section 1, and each option, asked
   once (the studio credit, a Trello board, Firebase or SQLite, AI; §SCOPE). The credit's
   steps are in `rules/options/credit.md`. A `rules/` folder the repo already uses for its
   own files (a game's, Firestore's) moves to a folder named for what it is, on the owner's
   word, first. Then copy `project-rules.md` and each chosen file under `rules/` from
   `fleet-standards/standards/`, and **`git add` them**.
5. Write `conventions.md`, with the profile block at the top for a game or non-application
   project, and the file naming convention the repo already uses as an exception rather
   than a rename (§NAMING). **Change no code.**
6. Put the exceptions to the owner. Decisions and dates into `decisions.md`.
7. Write `CLAUDE.md`, every claim carrying its verification date. It carries the *Deploys*
   line (single-branch, multi-branch or local only, §GIT), the *Rules* line
   (`Rules: app, ui, node, web · Options: firebase, no-trello`; a declined option is
   `no-<name>`), and one `@rules/<name>.md` import per file under `@project-rules.md`. A game
   or non-application project imports its set like any other. The AI option is not imported:
   the template gives the line that says to read it. *Commands* names the repo's package
   manager; an existing project keeps the one it has (§NPM).
   Install the credential hook: `templates/pre-commit` to `.githooks/pre-commit`, then
   `git config core.hooksPath .githooks` (§SECURITY), and `templates/.gitattributes` to the
   root so the hook and any shell script keep LF (§GIT). Before relying on it, stage the
   adoption's own documents and run the hook once, as they quote its trigger words.
   Wire the agents as `sync-standards` Step 5 does: the plugin in `.claude/settings.json`,
   the skill copies and hooks unless the project is local only, and the `AGENTS.md` and
   `GEMINI.md` pointers from `templates/AGENTS.template.md`.
8. Write `docs/STATUS.md` with a `Start here` block.
9. Where the project loads `rules/ui.md`, record its motif with `design-motif`. It describes
   the existing look and records it; nothing is redesigned.
10. `checkpoint` only when the owner says so.

Step 5 before step 7: `CLAUDE.md` names the granted exceptions, so it cannot be written until
they exist.

---

## 8. Kickoff prompt

```
This repo is being brought onto the fleet standard. The master copy is the
standards/ folder of github.com/Tanveerfb/fleet-standards: project-rules.md (the
core), the files under rules/, the templates, and adopting-the-standard.md, the
guide you are following. Read the guide first.

This repo already exists, so this is a migration, not a bootstrap. Do not
arrive planning to modernise code.

First deliverable is conventions.md: a full audit of this repo against the core
and each file its kind loads, with every gap sorted into "exception granted" or
"known, queued, not yet decided", plus a short section naming rules this repo
already satisfies where someone might assume otherwise. CHANGE NO CODE in that
pass. Put the exceptions to me as questions with your recommendation. I decide,
and the decision plus date goes in decisions.md.

Then CLAUDE.md, then docs/STATUS.md with a Start here block, from the templates.

How I work is §OWNER in project-rules.md, and git is §GIT. They are not
negotiable. Use the question tool whenever you need input from me.

Ask me on day one: which files are frozen, what deploys from where, and what is
mid-flight. Do not infer any of the three.
```

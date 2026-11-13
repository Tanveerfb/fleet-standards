# Project Rules & Code Style
**Author:** Tanveer (tanveerfb)
**Version:** 3.9.0
**Applies to:** All projects. This file is the core, which every repository loads; the files
under `rules/` are loaded only where they apply (§SCOPE).
**Master copy:** `standards/project-rules.md` and `standards/rules/` in
`github.com/Tanveerfb/fleet-standards`. One version covers the set.
History is in `standards/CHANGELOG.md`.

Coding standards, architectural decisions and workflow rules. Follow these
unless the project's own `conventions.md` says otherwise — see §SCOPE.

This file grows as practice improves. A convention that proves itself on a real
project belongs here; a rule that keeps needing exceptions belongs deleted.

**Sections are referenced by name, not number** — `§GIT`, `§FIREBASE`. Names are
stable; sections can be reordered or inserted without breaking a reference
anywhere in the fleet. A reference to a bare number (`§26`) was written against
v2 — the v2 → v3 map is in `CHANGELOG.md`.

---

## §SCOPE — Scope and precedence

These rules are the default for every project. A project may hold its own
`conventions.md` covering choices specific to it.

**Where this file and a project's `conventions.md` disagree, stop and ask.**
Neither wins by default — a conflict usually means one of the two is out of
date, and resolving it is the owner's decision, not an inference. Record the
outcome in `decisions.md`, and update this file if it should apply everywhere.

**The standard is a set of files, split by concern.** Every repository loads this file, the
core. The rest are loaded only where they apply:

| File | Concern | Loaded by |
| --- | --- | --- |
| `project-rules.md` | How we work (the core) | Every repository |
| `rules/app.md` | Engineering, in any language | Anything with application code |
| `rules/ui.md` | Interface | Anything with a visual surface |
| `rules/node.md` | The Node and TypeScript stack | Web projects and Node tools |
| `rules/web.md` | The Next.js stack | Web projects |
| `rules/game.md` | The game-engine stack | Games |
| `rules/non-application.md` | What a repository without application code does differently | Those repositories |
| `rules/options/credit.md`, `trello.md`, `firebase.md` | Things a project opts into at setup | Projects that chose them |
| `rules/options/ai.md` | AI and model features | Read on demand by projects that chose it |

| Kind of repository | Loads |
| --- | --- |
| Web project (Next.js) | core, app, ui, node, web, its options |
| Local Node tool | core, app, node; ui if it has an interface; its options |
| Tool in another language (bash, Python) | core, app; ui if it has an interface |
| Game | core, app, ui, game, its options |
| Non-application | core, non-application; ui if it has a visual surface |

**A project declares what it loads** in its `CLAUDE.md`: one import line per file, and one
line beside *Deploys* that `sync-standards` reads:
`Rules: app, ui, node, web · Options: firebase, trello`. Sync copies and updates only the
files declared. A section that divides between files keeps its name in each.

**The options are asked about once.** `new-project` and `sync-standards` ask about each —
the studio credit, a Trello board, Firebase, AI — and record the answer, so a project that
never opted in has still been asked.

**`rules/options/ai.md` is read, not imported.** A project that chose it carries one line in
its root `CLAUDE.md` — read that file before any work on an AI feature — and the same line
in `src/lib/ai/CLAUDE.md`, an area file (§SCALE) that loads by itself when anything under
`lib/ai/` is read. `ai-setup` writes both. Never act on memory of the file.

**Keeping in step with the master.** The `fleet` plugin (marketplace `tanveerfb`, from
`Tanveerfb/fleet-standards`) carries this file, its templates and the fleet skills. Its
`sync-standards` skill brings a project's copy up to date; `propose-standard` sends a change
or request back as an issue on `fleet-standards`. **Never edit this file in place inside a project** —
a fix made here and not proposed is lost at the next sync, and every other project misses it.

---

## §DOCS — Project documents

Every project carries the same document set. Each states who maintains it and
when it is updated.

| File | Holds | Updated when |
|---|---|---|
| `conventions.md` | Choices specific to this project | A decision changes |
| `decisions.md` | Why each non-obvious choice was made. Append only | A choice is made |
| `design-system.md` | Tokens, typography, density, motion, exclusions | A token or rule changes |
| `components.md` | What already exists (or a table in `design-system.md`: §COMPONENTS) | A component is added, moved or removed |
| `data-model.md` | Entities, relationships, invariants | An entity or invariant changes |
| `environment.md` | Environment variables and external accounts, with owners | A credential or account appears |
| `docs/STATUS.md` | Where the work is right now: the snapshot only | Every checkpoint (§GIT) |
| `docs/log.md` | The session log, newest first. Never auto-read | Every checkpoint (§GIT) |
| `docs/record/<area>.md` | What a brief used to say: every replaced line, word for word. Never auto-read | A line in a brief is replaced |
| `issues.md` | Open and closed issues | Continuously |
| `roadmap.md` | Phases. Slow moving | A phase changes |
| `docs/architecture.md` | The map: modules, what each owns and depends on, data flow, where to find things (§SCALE) | A module is added, moved or removed |
| `docs/specs/<feature>.md` | A feature or upgrade planned before it is built (§SPECS) | Written when planned; status kept current until built |

**Every file answers "who updates this and when", or it gets deleted.** An
unmaintained document is not neutral — it is a confidently wrong instruction.

**Do not create a document before it has content.** An `environment.md` written
before any credential exists documents nothing and claims otherwise.

**Current truth and history live apart.** A file an agent reads by default — `CLAUDE.md`,
its area files, `docs/STATUS.md` — holds only what is true now: the rule, a few of the
owner's words where the wording matters, and the date. Every "was", superseded number, quote
and measurement goes word for word into a record that is never auto-loaded, under the same
headings: `docs/record/<area>.md` for the briefs, `docs/log.md` for the session log,
`docs/archive/` for anything folded. The checkpoint moves a replaced line into the record in
the same pass that writes the new one: **a brief never gains a "was", a record never loses a
line.** When a brief is unclear, read the record. A brief that already holds history is
split the way §SCALE splits a `CLAUDE.md`: the whole file is copied to the record first,
then the live file is rewritten.

**`docs/STATUS.md` is the snapshot only** — a `Start here` block and one current-state
block, rewritten in place, never stacked and never appended to. **The session log is
`docs/log.md`**, added to at the top, newest first. The formats belong to the `checkpoint`
skill; `templates/STATUS.template.md` and `templates/log.template.md` match them.

**`decisions.md` opens with a short "declined, never again" index**: one line per thing the
owner ruled out, pointing at the dated entry that holds their words. The entries stay append
only; the index is the one part kept current.

Status, issues and roadmap overlap. Keep their jobs distinct: roadmap is phases,
issues is the churn, status is the current position.

---

## §ASK — Asking before assuming

- **Choices go through the question tool.** When the owner is choosing between
  options, it is the default — a choice buried in prose gets missed, and the
  tool notifies the owner's phone. Two to four short mutually exclusive options,
  the recommended one first, one to four questions at a time
- **Open questions go in plain prose.** When an answer needs explaining — what
  something should feel like, what was meant, what is missing — ask it as a
  short numbered list in the message, so the owner can answer in their own
  words, including by speech-to-text. Never force an open question into fixed
  options
- **Never assume design values.** Ask first; propose only when invited
- **Ask once per technical decision.** Once confirmed, apply consistently
- **Ask before structural decisions** — navigation, auth strategy, folder
  conventions
- **Ask when this file and `conventions.md` conflict** (§SCOPE)

---

## §AGENTS — For agents

- **Never present a problem without a direction out of it.** Every issue comes
  with at least one proposed fix, its trade-off, and a recommendation. A list of
  problems with no proposed solutions is not a useful report
- Use the question tool for decisions that are the owner's to make (§ASK)
- Do not create pages or routes absent from the project's documentation.
  Propose them
- Read `components.md` and check the filesystem before creating a component
- Do not introduce a colour, size, spacing or motion value outside
  `design-system.md`
- Do not bypass the data adapter (§DATA) or write a status directly
  (§LIFECYCLE)
- Do not add dependencies without asking
- Never read a credential file's contents into context
- Where documentation and code disagree, the documentation is the intent and the
  code is the bug, unless told otherwise
- Git follows §GIT, without exception
- **Files change through the editor tools, never the shell.** Edit for a change to an
  existing file, Write for a new file or a deliberate full rewrite of one already read. Never
  create or modify a file with a heredoc (`cat <<EOF > file`), `echo` or `printf`
  redirection, `sed -i`, `awk`, or an inline Python or Node script. The editor tools show
  the owner a reviewable diff; they fail loudly when the text to change is not found, where a
  shell edit silently does nothing or the wrong thing; they cannot be mangled by shell
  quoting and expansion (`$`, backticks, quotes); and they behave the same on Windows, where
  PowerShell has no heredoc. The shell is for running things — builds, tests, git,
  installs, searches. Two narrow allowances: a heredoc that only feeds a command's input,
  such as a multi-line commit message, writes no file; and files generated by a tool (a
  formatter, a code generator, `create-next-app`) are the tool's output. A change across
  many files is still made file by file with Edit (`replace_all` within a file); if a
  script is genuinely the right tool for a bulk change, show it to the owner and ask first.
  **This rule is enforced:** a PreToolUse hook (`scripts/block-shell-writes.mjs`) refuses
  inline Python or Node code and heredocs that write a file. The `fleet` plugin registers it,
  and `sync-standards` adds it to each project's `.claude/settings.json` for cloud sessions.
  A project that needs a stricter block (every `<<`) keeps its own hook beside it
- **Read the machine file before proposing a tool.** The owner's `~/.claude/machine.md`
  lists what this machine has installed (ffmpeg, Blender, local models and the like), its
  hardware, and tools worth suggesting; the `machine-inventory` skill keeps it true. Before
  proposing a tool for media, AI or file work: prefer what is installed; if nothing fits,
  suggest from its list; only then search. A cloud session has no such file and assumes
  nothing about the owner's machine. A project that needs a tool records it in its own
  `environment.md`, so a machine without it finds out at setup

---

## §GIT — Git, commits and the checkpoint

**Git reaches production only when the owner says so.** What an agent may do on its own
depends on how the project ships, which the *Deploys* line in its `CLAUDE.md` declares:

- **Single-branch project** — work happens on `main`/`master`, so a push is the release. **An
  agent never commits or pushes on its own initiative** — not `add`, not `commit`, not
  `push`, not a "quick tidy-up commit" at the end of a task. A dirty working tree at the end
  of a piece of work is the correct state, not an untidy one
- **Multi-branch project** — work happens on a working branch that is released to a
  production branch. **The agent commits and pushes the working branch on its own**, batched
  at the end of a piece of work and before a session ends, never one commit per reply. **The
  production branch changes only on `git CPR`**
- **Local only** — the repository has no remote, by the owner's decision. Commits follow the
  single-branch rule; **there is no push and nothing to release**, and an agent never adds a
  remote unasked. Cloud sessions cannot open it, so `sync-standards` skips the skill copies,
  and a missing upstream is not a finding. Declared as `local only — <where the work lands,
  if anywhere>`
- **Not declared** — treat the project as single-branch, ask the owner once which it is, and
  write the answer into the *Deploys* line. Never infer it from the branches that exist: this
  line decides whether an agent may push

**The triggers are phrases:**

| The owner says | Single-branch | Multi-branch | Local only |
| --- | --- | --- | --- |
| *anything else* | No git at all. Leave the tree as it is. | The working branch as above. Production: nothing. | No git at all. |
| `checkpoint` | Documentation pass, then **ask** about commit and push, separately. | Documentation pass, then commit and push the working branch. | Documentation pass, then **ask** about the commit. |
| **`git checkpoint`** | Documentation pass, then **commit and push.** Both pre-authorised. | The same as `checkpoint`. | Documentation pass, then **commit.** No push. |
| **`git checkpoint max`** | The same, exhaustively verified claim by claim. | The same, exhaustively verified. | The same, exhaustively verified. |
| **`git CPR`** | Nothing to release: the checkpoint, then say so and stop. **In a cloud session:** the checkpoint to the harness branch, then fast-forward the main branch to it (*Cloud sessions*, below). | Checkpoint to the working branch, **then the release to production.** Both pre-authorised. | Nothing to release: the checkpoint, then say so and stop. |

The `checkpoint` skill and `relay`, its inverse, ship in the `fleet` plugin (§SCOPE) and
appear as `fleet:checkpoint` and `fleet:relay`. **If they do not appear in a session's
surfaced skills list, look for them rather than improvising a commit process**, which is how a session ends up inventing its own
worse version of a protocol that already exists.

**Cloud sessions.** A cloud session (Claude Code on the web, a GitHub Action) is assigned a
branch by its harness — the container is discarded, and unpushed work is lost. **That branch
is a working branch**, whatever the project's *Deploys* line says: the session commits and
pushes it on its own, as above, and never pushes to `main`/`master` or any branch the harness
did not name. Never open a pull request unless the owner asks.

**On a single-branch project, `git CPR` in a cloud session releases the harness branch.** The
harness branch makes the project multi-branch for that session, so `git CPR` is the
checkpoint to the harness branch, then the release: **fast-forward the main branch to it**,
naming the target from the *Deploys* line (`git push origin HEAD:master`), never computing it.
Fast-forward only: if the main branch has moved on, stop and ask — merge, or a pull request —
and never force. If the push is refused (branch protection, or a harness that blocks it),
say so and offer a pull request instead. `git CPR` is the explicit permission a harness needs
before pushing to a branch it did not name; nothing else is, and without it the main branch
is never pushed.

**Where work happens depends on whether the project is live.** The project's `CLAUDE.md`
says which applies (its *Deploys* line):

- **A project with a live domain or real users** works on an update branch and merges to the
  production branch when the update is complete. Every branch gets a preview deploy — check
  the update there before merging
- **A project with no live users** may work on its main branch
- **A live project is therefore multi-branch**, and its update branches are working branches.
  A branch that deploys straight to production is never a working branch, whatever it is
  called — an automatic push to it would be an unannounced release
- **Keep update branches short-lived.** A branch that runs for weeks drifts from main and ends
  in a merge-conflict session. Merge within days, or bring main into the branch regularly;
  split a large update into several branches that each merge on their own. For the largest
  updates, a feature flag lets work merge continuously while staying switched off on the live
  site (Firebase Remote Config, or the platform's flags)

**Batch. Do not commit per change.** A session's work lands as one considered set of commits
— at a checkpoint, or on a working branch at the end of a piece of work. A long string of
small commits is not tidiness — it is the thing this rule exists to prevent, and it makes a
session's history harder to read rather than easier.

**An approval does not generalise.** Wherever a commit or push needs a trigger — on a
single-branch project, and for every release to production — "Yes, commit that" authorises
the commit in front of you and nothing after it. The next one needs its own trigger. The same applies to a push: one
push approved is not pushing approved.

**Where the branch auto-deploys, a push is a production release.** Say so in the
confirmation. The owner should never learn from somewhere else that a checkpoint shipped.

**Never run a destructive command** — force push, history rewrite, branch deletion,
`git clean`, `reset --hard` — unless explicitly asked for that command.

**The safety exceptions still stand**, and they are worth a sentence rather than silence: a
secret in the staged diff, a dirty tree containing work that is not yours, a detached HEAD,
or a push that would need a force. Stop for those even mid-checkpoint, and before any
working-branch push made on the agent's own. A routine push needs no such sentence.

**Shell scripts keep LF.** A repository with `.sh` files or a `.githooks/` folder carries a
`.gitattributes` (`templates/.gitattributes`) pinning them to `eol=lf`, so a Windows
checkout cannot break them under bash — in an unattended chain nobody is there to see it.

**Every commit must build standalone** (§BUILD). When splitting a session's work, check
file-level imports at each boundary — a green typecheck on the final tree proves nothing
about the commits before it.

---

## §OWNER — The owner's working agreement

Standing preferences that apply in every project. A project's `CLAUDE.md` adds to these; it
does not restate them.

- **Every visual or layout change starts as a mockup the owner approves** — a new page,
  a restyle, a spacing or layout change, a new component's look, copy the business owns.
  Never build a visual change first and show it after. The one exception is a bug fix that
  restores an already-approved design (a broken alignment, a wrong token); it goes straight
  in, with a line in the running small-changes document
- **Iterate until the owner is satisfied.** One mockup is a starting point, not a
  deliverable. Offer alternatives where the direction is open, revise on feedback, and keep
  going round by round — the loop ends when the owner says the design is locked, not when
  the agent thinks it is close enough. Ask through the question tool at each round (§ASK)
- **Mockups are static HTML**, rendering desktop and a 390px phone from the same markup.
  Drafts live in a gitignored `public/_mockups/`, which the dev server serves. Animation is
  decided here (§MOTION)
- **A locked design is recorded.** The approved mockup moves to `docs/design/<name>.html` —
  committed, and outside `public/` so it is never deployed — with a dated `decisions.md`
  entry naming it. Building follows the locked mockup; changing a locked design takes a new
  mockup round
- **Mobile is first-class** — it must work properly on a phone, not merely not break
- **Consistency, modularisation, QoL — on everything touched**, not only on work with a
  spec. If a change introduces a second version of something the repo already has, it is
  wrong. Where the project has a motif (§DESIGN), it is held to the same standard: every
  visual change fits it
- **Don't state the obvious.** Interface text that repeats what a component already makes
  clear is noise. A light/dark toggle is a switch with a sun and a moon — no "Light mode"
  label beside it. No helper text explaining a self-evident control, no caption restating a
  heading, no "Click here to…". Two limits: an icon-only control still has an accessible
  name (`aria-label`, usually a tooltip), which screen readers need and which is not visible
  text; and an icon that is not universally understood gets its label. What is *not*
  obvious still gets said — an empty state still says what to do next (§QOL)
- **The existing code is not the benchmark.** Check a pattern against this file before
  copying it
- **Shared primitives are never restyled to suit one page.** That is a repo-wide visual
  change and needs its own approval
- **Never rewrite copy the business owns.** Draft it, show it, apply it on a yes
- **Frozen files** are listed in the project's `CLAUDE.md`. Frozen means raise it and get a
  yes, not never touch

**Process X — a whole-product audit.** When a project has grown well past its adoption, or
before a release the owner wants deeply audited, run Process X in this order
(`process-x.md` in the standard has each step):

1. the audit, delivered as a ranked list for the owner;
2. the owner's picks;
3. drafts, then build;
4. shared pieces;
5. the motif;
6. the fleet re-audit (conventions, design system, skills and hooks, area files, the
   architecture map);
7. proposals back to fleet.

Nothing is built before it is picked, and a visual change is locked before it is built. It
counts as that release's deep audit.

---

## §SPECS — Spec files

A spec is written when work is planned now and built later — a future feature, an upgrade, a
new system, or a plan finished before usage limits would leave an implementation half done.
Work already in progress hands over through the checkpoint (`docs/STATUS.md`), not a spec.
Skip a spec when the work does not need one.

**A spec must be buildable by a session that knows nothing else.** No template; it covers:

- **Goal, and what it deliberately does not do**
- **Decided versus open** — the owner's confirmed choices, each with a one-line reason, kept
  apart from open questions. Never write a guess in the voice of a decision
- **What it touches** — the areas, files and data it changes
- **Done means** — acceptance criteria that can be checked
- **Status** — the first line

**Where it lives.** A feature or upgrade of an existing project: `docs/specs/<feature>.md` in
that project's repo, where the session that builds it will look. A whole new project: the
owner's plans repo.

**Status and Trello.** On a project with a board (§TRELLO), the status line links the spec's
card, and the card links back to the spec. Progress, discussion and comments from other
people happen on the card; the spec holds only what to build. On a project without a board,
the status line is a plain word — planned, in progress, built — and the spec stays in the
repo alone.

**Building from a spec.** It is binding, like other project documentation (§AGENTS). Never
build on an open question — raise it. When the work is done, mark the spec built (or move its
card to Done); a built spec is kept as a record and is never treated as pending work. The
checkpoint keeps both current.

---

## §TOOLS — Other coding agents

This standard is written for Claude Code and binds every agent equally — Codex, GitHub
Copilot, Cursor, Gemini CLI or any other.

- **`CLAUDE.md` files are the only hand-written instructions** — the root one, plus any
  area files (§SCALE). `AGENTS.md` (Codex, Copilot, Cursor) and `GEMINI.md` (Gemini CLI) are
  pointers to them from `templates/AGENTS.template.md`, and never hold facts of their own
- **The skills run everywhere.** They follow the open Agent Skills format. Claude Code gets
  them from the `fleet` plugin; other agents from `standards/scripts/install-skills.mjs`,
  which installs them to `~/.agents/skills/` and `~/.codex/skills/`
- **Where this file names a Claude Code tool, use the equivalent:**

| Named here | Elsewhere |
| --- | --- |
| The question tool (§ASK) | The agent's own ask-the-user tool; otherwise a short question with numbered options, recommended first |
| Claude's built-in browser, Claude in Chrome (§TESTING) | The agent's own browser control; Playwright stays the last resort |
| Context7, Trello and GitHub MCP tools | The same MCP servers configured in that agent, or `gh`; with none, say so |
| `fleet` plugin, `${CLAUDE_PLUGIN_ROOT}` | `~/.agents/fleet/`, installed by `install-skills.mjs` |

Where an agent has no equivalent at all, it says so rather than quietly skipping the rule.

---

## §SCALE — Finding your way in a larger project

On a small project an agent can read everything. On a large one it reads a slice, and guesses
the rest — so it duplicates what exists, or edits the wrong place. Two things give it the
right slice. Add them when a project outgrows a single read: several feature areas, or the
first time an agent duplicates something or works in the wrong place.

- **Area `CLAUDE.md` files.** A folder with rules or traps of its own gets its own
  `CLAUDE.md` — `src/features/billing/CLAUDE.md`. Claude Code loads it when work touches that
  folder, so local rules arrive exactly when needed and the root file stays short and
  general. **A fact lives in exactly one of them**: the most local file it applies to. The
  root `CLAUDE.md` lists the area files that exist

  **Splitting an existing `CLAUDE.md`:** move whole sections word for word, never rewrite
  them on the way. Then check, read-only, that every non-blank line of the old file is in
  exactly one new file, and name any line changed on purpose. The root keeps what binds
  everywhere and a table of the area files: what each holds and when to read it.

  **An area file loads only when a file inside its folder is read.** Work that starts from
  `tests/`, `tools/` or a question in chat does not trigger it, so the root tells a session
  to **read the area file for its work before starting**, wherever that work sits
- **The architecture map** — `docs/architecture.md`, the registry of what belongs where:
  - a table of modules: each folder, what it owns, what it depends on, what uses it;
  - how data moves through the main flows (form → Server Action → adapter → store);
  - a *where do I find…* index for the questions that keep coming up.

  `components.md` (§COMPONENTS) stays the registry of interface components; the map covers
  the system around them. **Keep it current, or it becomes a confident lie** — the checkpoint
  updates it whenever a module is added, moved or removed. The depends-on and used-by columns
  can be generated from the imports by a tool such as dependency-cruiser or madge rather than
  maintained by hand — the owner's choice (§AGENTS)

---

## §SECURITY — Security and secrets

- **`.gitignore` covers `.env*`, `.secrets/` and credential files from the first
  commit**, before any code exists — not after the file lands. The one exception is
  `.env.example`, which holds names only (§RUNTIME)
- **Credential files live outside the repository by preference**, referenced by
  path through an environment variable, or pasted into a deployment environment
  variable. Where the platform supports application default credentials, prefer
  having no key on disk at all. Where a key must sit beside the project, it goes
  in `.secrets/` at the root — gitignored, never committed
- Never read a credential's contents into a prompt, a log or a source file
- **A pre-commit hook blocks staged text shaped like a credential** — a key field with a
  long value, a PEM private-key header, a known token prefix — never a bare word, which this
  file itself contains. The hook is `templates/pre-commit`, committed to the project as
  `.githooks/pre-commit`; each clone runs `git config core.hooksPath .githooks` once, which
  `new-project` and `sync-standards` do and `relay` checks. A project already on husky
  calls it from its own `.husky/pre-commit` instead. Any change to the pattern is tested
  against the project's documentation as well as fake keys
- **Never commit a credential, even to a private repository.** Repositories
  change visibility, get handed to clients, get cloned by collaborators and
  interns. Git history is permanent; cleaning it means rewriting history across
  every clone
- Use scoped service accounts rather than the default broad-permission one
- If a key is exposed, rotate it first and clean history second. Rotation is
  immediate; history cleanup is not
- `environment.md` records every external account and **who owns it**. This is
  what bites at client handover
- Prices, permissions, roles and record states are decided server-side. Anything
  the client can send, the client can forge
- **No token in code a browser receives.** A front-end bundle is public. Anything it holds
  is published, however the repository is set
- **A token is as small as its job.** Fine-grained, scoped to the repositories it needs,
  with an expiry. Never a classic token with account-wide `repo` scope in a script or app.
  `environment.md` records each token, its scope and its expiry
- **The default branch is protected** where the plan allows it: changes arrive by pull
  request, and force pushes are off
- **A workflow declares the least `permissions` it needs**, and a repository that needs no
  Actions secrets has none
- **An unexplained change under `.github/workflows/` is an incident until proven
  otherwise.** Do not run it, do not "fix" it; tell the owner first

---

## §TESTING — Testing

- A green build is not evidence an interface works. A UI change is done when it has been
  seen working
- **Motion is checked on film.** An animation or effect is verified by recording the real
  screen, not a draft stage: the engine's movie writer, a screen recorder or Playwright
  video. Read it frame by frame (contact sheets), in each layout it plays in, mirrored if it
  mirrors, and at each speed setting. A short clip goes to the owner for the look; anything
  the agent cannot judge (sound) is named as unverified
- No end-to-end suite by default. If a project needs one, that is a decision, recorded in
  `decisions.md`

*§TESTING continues in `rules/node.md` (unit tests) and `rules/web.md` (the browser check).*

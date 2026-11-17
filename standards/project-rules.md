# Project Rules & Code Style
**Author:** Tanveer (tanveerfb)
**Version:** 4.0.0
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

**Where the standard and a project's `conventions.md` disagree, stop and ask.**
Neither wins by default — a conflict usually means one of the two is out of
date, and resolving it is the owner's decision, not an inference. Record the
outcome in `decisions.md`, and update the standard if it should apply everywhere.
**A divergence `conventions.md` records as granted is settled**, not a conflict: follow it
without asking again.

**The standard cites a section by name; one outside the core names its file once**
(`rules/ui.md` §MOTION), so a reader knows where to look and whether the project loads it.
A project's own documents cite the name alone, which survives a section moving file.

**The standard is a set of files, split by concern.** Every repository loads this file, the
core. The rest are loaded only where they apply:

| File | Concern | Loaded by |
| --- | --- | --- |
| `project-rules.md` | How we work (the core) | Every repository |
| `rules/app.md` | Engineering, in any language | Anything with application code |
| `rules/ui.md` | Interface | Anything with a visual surface |
| `rules/node.md` | The Node and TypeScript stack | Web projects and Node tools |
| `rules/web.md` | The Next.js stack | Web projects |
| `rules/python.md` | The Python stack | Tools written in Python |
| `rules/game.md` | The game-engine stack | Games |
| `rules/non-application.md` | What a repository without application code does differently | Those repositories |
| `rules/options/trello.md`, `firebase.md`, `sqlite.md` | Things a project opts into at setup | Projects that chose them |
| `rules/options/ai.md` | AI and model features | Read on demand by projects that chose it |
| `rules/options/credit.md` | The studio credit and showcase | Read on demand, by the skills that reach its steps |

| Kind of repository | Loads |
| --- | --- |
| Web project (Next.js) | core, app, ui, node, web, its options |
| Local Node tool | core, app, node; ui if it has an interface; its options |
| Tool in another language (bash, Python) | core, app; python for Python; ui if it has an interface; its options |
| Game | core, app, ui, game, its options |
| Non-application | core, non-application; ui if it has a visual surface |

A project of two kinds loads the files of both: a Next.js interface over a Python package
loads app, ui, node, web and python. Scripts that only maintain a repository's documents do
not make it an application; tools it ships or runs as its product do.

**A project declares what it loads** in its `CLAUDE.md`: one import line per file, and one
line beside *Deploys* that `sync-standards` reads:
`Rules: app, ui, node, web · Options: firebase, trello`. Sync copies and updates only the
files declared. A section that divides between files keeps its name in each.

**The options are asked about once.** `new-project` and `sync-standards` ask about each —
the studio credit, a Trello board, Firebase or SQLite, AI — and record the answer, so a project that
never opted in has still been asked.

**Two options are read, not imported.** `rules/options/ai.md`: `CLAUDE.md` and
`src/lib/ai/CLAUDE.md` each carry a line saying to read it before any work on an AI feature;
never act on memory of it. `rules/options/credit.md`: the skills read it when they reach its
step.

**Keeping in step with the master.** The `fleet` plugin (marketplace `tanveerfb`, from
`Tanveerfb/fleet-standards`) carries this file, its templates and the fleet skills. Its
`sync-standards` skill brings a project's copy up to date; `propose-standard` sends a change
or request back as an issue on `fleet-standards`. **Never edit the standard's files in place
inside a project** — this file, `rules/`, the skill copies, or anything under `.claude/fleet/`:
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
| `components.md` | What already exists (or a table in `design-system.md`: `rules/ui.md` §COMPONENTS) | A component is added, moved or removed |
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
- **Ask when the standard and `conventions.md` conflict** (§SCOPE)
- **When nobody can answer** (a GitHub Action, a scheduled run), never guess what would be
  asked. Stop the part that needs the answer, finish what does not, and leave the question
  where the owner will see it (the run's output, the pull request, `Start here`'s *Blocked
  on*) with the options and a recommendation

---

## §AGENTS — For agents

- **Never present a problem without a direction out of it.** Every issue comes
  with at least one proposed fix, its trade-off, and a recommendation. A list of
  problems with no proposed solutions is not a useful report
- Use the question tool for decisions that are the owner's to make (§ASK)
- Do not create pages or routes absent from the project's documentation.
  Propose them
- Check what already exists before creating anything: the filesystem, and
  `components.md` where the project keeps one (`rules/ui.md` §COMPONENTS)
- **Before touching an interface file, read `rules/ui.md`** where the project loads it — a
  component, a page, a style, a game's UI scene — however the session began, a script or a
  question included. Its rules and §OWNER's visual ones bind every interface change
- Do not introduce a colour, size, spacing or motion value outside
  `design-system.md`
- Where the project has a data adapter or a status map, never bypass it
  (`rules/app.md` §DATA, §LIFECYCLE)
- Do not add dependencies without asking
- Never read a credential file's contents into context
- Where a spec, `data-model.md`, `design-system.md` or a locked design disagrees with the
  code, the document is the intent and the code is the bug, unless told otherwise. A status
  doc, README or handoff that disagrees with the code is the stale one: the repo wins, and
  the document is corrected
- Git follows §GIT, without exception
- **Read a rewritten config's diff before reverting it.** A file its own tool rewrote (an
  engine, an IDE, a build tool) can carry noise and a real change in the same diff: compare
  the settings and restore only the noise. Never a blind `git checkout -- <file>`
- **Files change through the editor tools, never the shell.** Edit for a change, Write for a
  new file or a deliberate full rewrite. Never a heredoc into a file, `echo` or `printf`
  redirection, `sed -i`, `awk`, or an inline Python or Node script: the editor tools show a
  reviewable diff, fail loudly when the text is not found, and are not mangled by shell
  quoting or by Windows. The shell runs things — builds, tests, git, installs, searches. A
  heredoc that only feeds a command's input (a commit message) is fine, and so are files a
  tool generates. A bulk change is made file by file; a script that changes files is shown
  to the owner and asked about first. A hook (`scripts/block-shell-writes.mjs`) refuses the
  common forms; what it misses is still forbidden
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
  remote unasked. Declared as `local only — <where the work lands, if anywhere>`
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
| `CPR` | As `checkpoint`; nothing to release, so say so. **In a cloud session:** as `git CPR`, but **ask** before the fast-forward. | As `checkpoint`, then **ask** before the release. | As `checkpoint`; nothing to release, so say so. |
| **`git CPR`** | Nothing to release: the checkpoint, then say so and stop. **In a cloud session:** the checkpoint to the harness branch, then fast-forward the main branch to it (*Cloud sessions*). | Checkpoint to the working branch, **then the release to production.** Both pre-authorised. | Nothing to release: the checkpoint, then say so and stop. |

The `checkpoint` skill (`fleet:checkpoint`) carries out this table, with the steps of each
release; `relay` is its inverse. **If they do not appear in a session's skills list, look for
them rather than improvising a commit process.** **After a compact or a resume, run `relay`
first**, before any waiting request, hook or no hook: where the compact's summary and the repo
disagree, the repo wins.

**A live project is multi-branch.** A project with a live domain or real users works on
update branches, each checked on its preview deploy before it merges; a project with no live
users may work on its main branch. A branch that deploys straight to production is never a
working branch, whatever it is called. **Keep update branches short-lived** — merge within
days or bring main in regularly, split a large update, and use a feature flag for the
largest.

**Cloud sessions.** A cloud session (Claude Code on the web, a GitHub Action) is assigned a
branch by its harness — the container is discarded, and unpushed work is lost. **That branch
is a working branch**, whatever the project's *Deploys* line says: the session commits and
pushes it on its own, and never pushes to `main`/`master` or any branch the harness did not
name, except that **`git CPR` on a single-branch project fast-forwards the main branch to
it** — fast-forward only, the target named from the *Deploys* line, never forced. `git CPR`
is the only permission for that push. Never open a pull request unless the owner asks.
**On a multi-branch project, `git CPR` fast-forwards the working branch to the harness
branch** the same way, then releases as the *Deploys* line declares. Until then the work is
on the harness branch alone: the checkpoint says so by name, and the next session's relay
lists it.

**Batch. Do not commit per change.** A session's work lands as one considered set of commits
— at a checkpoint, or on a working branch at the end of a piece of work.

**An approval does not generalise.** Wherever a commit or push needs a trigger — on a
single-branch project, and for every release to production — "Yes, commit that" authorises
the commit in front of you and nothing after it. The next one needs its own trigger. The same applies to a push: one
push approved is not pushing approved. **One exception:** a checkpoint's own follow-up
commit, holding what its closing question approved, is covered by the answer that
checkpoint's git step had — pushed only if that step pushed, and never a release.

**Where the branch auto-deploys, a push is a production release.** Say so in the
confirmation. The owner should never learn from somewhere else that a checkpoint shipped.

**Never run a destructive command** — force push, history rewrite, branch deletion,
`git clean`, `reset --hard` — unless explicitly asked for that command.

**Production outside git is gated the same way.** A command or tool call that changes a live
system — a deploy (`firebase deploy`, `vercel --prod`), security rules, a hosted database, a
tenant, a live service's settings — and a destructive command outside git (`rm -rf`,
dropping or emptying data, deleting untracked files) run only on the owner's go for that
command, each time. Say what it changes and whether it can be undone. An approval does not
generalise.

**The safety exceptions still stand**, and they are worth a sentence rather than silence: a
secret in the staged diff, a dirty tree containing work that is not yours, a detached HEAD,
or a push that would need a force. Stop for those even mid-checkpoint, and before any
working-branch push made on the agent's own. A routine push needs no such sentence.

**Shell scripts keep LF.** A repository with `.sh` files or a `.githooks/` folder carries a
`.gitattributes` (`templates/.gitattributes`) pinning them to `eol=lf`, so a Windows
checkout cannot break them under bash — in an unattended chain nobody is there to see it.

**Every commit must build standalone** (`rules/app.md` §BUILD). When splitting a session's work, check
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
  in, with a line in that session's log entry (§DOCS)
- **Iterate until the owner is satisfied.** One mockup is a starting point, not a
  deliverable. Offer alternatives where the direction is open, revise on feedback, and keep
  going round by round — the loop ends when the owner says the design is locked, not when
  the agent thinks it is close enough. Ask through the question tool at each round (§ASK)
- **Mockups show desktop and a 390px phone from the same draft**, wherever the work is seen
  on a phone. What a draft is and where it lives is in the files the project loads: static
  HTML in a web project (`rules/web.md`), engine screenshots in a game (`rules/game.md`),
  rendered files for fixed-size media (`rules/non-application.md`). Animation is decided
  here (`rules/ui.md` §MOTION)
- **A locked design is recorded.** The approved mockup moves to `docs/design/<name>.html` —
  committed, and outside anything deployed — with a dated `decisions.md`
  entry naming it. Building follows the locked mockup; changing a locked design takes a new
  mockup round
- **Mobile is first-class** — it must work properly on a phone, not merely not break
- **Consistency, modularisation, QoL — on everything touched**, not only on work with a
  spec. If a change introduces a second version of something the repo already has, it is
  wrong. Where the project has a motif (`rules/ui.md` §DESIGN), it is held to the same standard: every
  visual change fits it
- **Don't state the obvious.** Interface text that repeats what a component already makes
  clear is noise. A light/dark toggle is a switch with a sun and a moon — no "Light mode"
  label beside it. No helper text explaining a self-evident control, no caption restating a
  heading, no "Click here to…". Two limits: an icon-only control still has an accessible
  name (`aria-label`, usually a tooltip), which screen readers need and which is not visible
  text; and an icon that is not universally understood gets its label. What is *not*
  obvious still gets said — an empty state still says what to do next (`rules/ui.md` §QOL)
- **The existing code is not the benchmark.** Check a pattern against the standard before
  copying it
- **Shared primitives are never restyled to suit one page.** That is a repo-wide visual
  change and needs its own approval
- **Never rewrite copy the business owns.** Draft it, show it, apply it on a yes
- **Frozen files** are listed in the project's `CLAUDE.md`. Frozen means raise it and get a
  yes, not never touch

**Process X — a whole-product audit**, run when a project has grown well past its adoption,
or before a release the owner wants deeply audited: an audit delivered as a ranked list, the
owner's picks, then the build, ending in proposals back to the fleet. Its seven steps are in
`process-x.md` in the standard. **Nothing is built before it is picked**, and a visual change
is locked before it is built. It counts as that release's deep audit.

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

**Status and Trello.** On a project with a board (`rules/options/trello.md`), the status line links the spec's
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
- **Where the standard names a Claude Code tool, use the equivalent:**

| Named here | Elsewhere |
| --- | --- |
| The question tool (§ASK) | The agent's own ask-the-user tool; otherwise a short question with numbered options, recommended first |
| Claude's built-in browser, Claude in Chrome (`rules/web.md` §TESTING) | The agent's own browser control; Playwright stays the last resort |
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
  `CLAUDE.md` — a feature folder's, say, or a game's `scenes/`. Claude Code loads it when work touches that
  folder, so local rules arrive exactly when needed and the root file stays short and
  general. **A fact lives in exactly one of them**: the most local file it applies to. The
  root `CLAUDE.md` lists the area files that exist

  **A root `CLAUDE.md` past 50 KB is due a split.** The checkpoint measures it and proposes
  one; the split happens on the owner's yes.

  **Splitting an existing `CLAUDE.md`:** move whole sections word for word, never rewrite
  them on the way. Then check, read-only, that every non-blank line of the old file is in
  exactly one new file, and name any line changed on purpose. The root keeps what binds
  everywhere and a table of the area files: what each holds and when to read it.

  **An area file loads only when a file inside its folder is read.** Work that starts from
  `tests/`, `tools/` or a question in chat does not trigger it, so the root tells a session
  to **read the area file for its work before starting**, wherever that work sits
- **The architecture map** — `docs/architecture.md`, the registry of what belongs where:
  - a table of modules: each folder, what it owns, what it depends on, what uses it;
  - how data moves through the main flows, from input to storage and back;
  - a *where do I find…* index for the questions that keep coming up.

  Where the project keeps `components.md` (`rules/ui.md` §COMPONENTS), it stays the registry
  of interface components; the map covers the system around them. **Keep it current, or it
  becomes a confident lie** — the checkpoint updates it whenever a module is added, moved or
  removed. The depends-on and used-by columns can be generated from the imports by a tool for
  the language rather than maintained by hand — the owner's choice (§AGENTS)

---

## §SECURITY — Security and secrets

- **`.gitignore` covers `.env*`, `.secrets/` and credential files from the first
  commit**, before any code exists — not after the file lands. The one exception is
  `.env.example`, which holds names only (`rules/node.md` §RUNTIME)
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
- **The default branch is protected** where the plan allows it: force pushes and deletion
  are off everywhere, and on a multi-branch project changes arrive by pull request (§GIT).
  Where the plan does not allow protection, `conventions.md` records the gap
- **A workflow declares the least `permissions` it needs**, and a repository that needs no
  Actions secrets has none
- **An unexplained change under `.github/workflows/` is an incident until proven
  otherwise.** Do not run it, do not "fix" it; tell the owner first

---

## §TESTING — Testing

- **Done means seen working.** A green build or a passing test is not evidence a change
  works. It is done when it has been seen working: an interface on screen, a tool on a real
  input, a game in the engine
- **Motion is checked on film.** An animation or effect is verified by recording the real
  screen, not a draft stage: the engine's movie writer, a screen recorder or Playwright
  video. Read it frame by frame (contact sheets), in each layout it plays in, mirrored if it
  mirrors, and at each speed setting. A short clip goes to the owner for the look; anything
  the agent cannot judge (sound) is named as unverified

*§TESTING continues in `rules/node.md` (unit tests) and `rules/web.md` (the browser check).*

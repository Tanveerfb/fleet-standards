# `project-rules.md` — changelog

History lives here, not in the rules file. The rules file is imported into every session in
every project, so every line of history in it is paid for in tokens on every turn.

---

## v2 → v3 section map

v3 references sections by name. Any `§<number>` in a project's `conventions.md`,
`decisions.md` or `CLAUDE.md` was written against v2 — translate it with this table when the
project is next audited (the `Audited against` line will read v2.x, which is the signal).

| v2 | v3 | | v2 | v3 |
| --- | --- | --- | --- | --- |
| §1 Scope and precedence | §SCOPE | | §15 Component registry | §COMPONENTS |
| §2 Project documents | §DOCS | | §16 Quality of life | §QOL |
| §3 Packages and APIs | §PACKAGES | | §17 Interface patterns | §PATTERNS |
| §4 Building for growth | §GROWTH | | §18 Motion | §MOTION |
| §5 Modularisation | §MODULES | | §19 Asking before assuming | §ASK |
| §6 Naming | §NAMING | | §20 State and validation | §STATE |
| §7 TypeScript | §TS | | §21 Forms, errors, fetching | §FORMS |
| §8 Project structure | §STRUCTURE | | §22 Security and secrets | §SECURITY |
| §9 Data access | §DATA | | §23 Comments and build | §BUILD |
| §10 Entity lifecycles | §LIFECYCLE | | §24 Custom hooks | §HOOKS |
| §11 Prototypes and shortcuts | §SHORTCUTS | | §25 For agents | §AGENTS |
| §12 Styling | §STYLING | | §26 Firebase | §FIREBASE |
| §13 Design direction | §DESIGN | | §27 Package manager | §NPM |
| §14 shadcn | §SHADCN | | §28 Git and checkpoint | §GIT |

v2.0.0 used different numbers again (v2.0.0 §6 Styling = v2.3.0 §12, §7 Asking = §19,
§12 QoL = §16). Translate those through the v2.3.0 number first.

---

## 4.1.0 · Satluj — unreleased

Nine proposals from the fortnight after v4.0.0, most from an independent audit of the
studio's own site, and `checkpoint` and `relay` brought in line with how v4 lays the rules
out. Additions only: no section renamed, nothing removed.

### The rules

- **`rules/web.md` §FORMS — public writes are throttled.** A form or route a visitor can
  submit without signing in has a per-visitor rate limit and a maximum length on every
  free-text field; a bot check where it is a spam target. The site's contact endpoint stored
  whatever it was sent. Issue #35.
- **`rules/web.md` §RUNTIME — security headers from the first deploy**, and
  `images.remotePatterns` naming the project's own hosts, never a wildcard over a shared
  service. Issue #38.
- **`rules/web.md` §TESTING — 360px, and the real phone engines.** Interface changes are
  checked at 390 and 360px; before a release, and on any phone report, in Android Chrome on
  an emulator and in WebKit, where the machine has them. A desktop browser at phone size is
  a layout check, not a phone. The commands live in `~/.claude/machine.md`, which
  `machine-inventory` now writes them into. Issue #42.
- **§SECURITY — a legal page is a spec.** What a privacy policy, terms or cookie notice
  promises is built and recorded in `data-model.md`, and each side changes with the other.
  The checkpoint compares them when a session touched storage, retention or what a form
  collects. Issue #37.
- **§BUILD — CI runs the gates.** `templates/gates.yml` (Node and web: it finds pnpm or npm
  from the lockfile, and runs `next typegen` before `tsc` on a Next.js project) and
  `templates/gates-python.yml` (the four commands `rules/python.md` names), with actions
  pinned by commit and read-only permissions. The agent still runs the gates by hand; CI is
  the net. Issue #36.
- **§OWNER — modular, consistent, QoL are three checks**, made before building and again
  before calling it done. A second version is the same job done twice, whatever its size or
  name. A spec answers "one of each"; `rules/ui.md` searches by job, not by name, and makes
  sister places match. Issue #43.
- **§SCOPE — a project of two kinds loads the files of both** (built with v4.0.0's pilot
  fixes, first listed here).
- **`rules/options/family.md` §FAMILY, and a ninth skill, `session-family`.** A family of
  local sessions that message each other: one manager and its register, cross-session set
  fresh at every relay, decisions only from the owner, each session editing only its own
  repository. **Never asked at setup**: it is added only when the owner asks. Issue #44.
- **`templates/pre-commit`** matches an `sk-` key only at a word start: a link's slug with
  "risk-" in it had blocked a commit. Issue #41.
- **The README credits Tinker Together** as the maintainer. Issue #39.

### `checkpoint` and `relay`

An independent audit compared both skills with every duty the rules place on a session's
start or end. Eleven of its twelve findings are fixed:

- **`checkpoint` updates §DOCS's whole set**, row for row: it had never named
  `conventions.md`, `design-system.md`, `issues.md` or `roadmap.md`, nor a locked mockup's
  move to `docs/design/`. It **reads the project's own document map first**, so a design
  kept in `DESIGN.md` is found.
- **`checkpoint` notices when a session outgrows the *Rules* line** (new code, an
  interface, a second language, a backend) and offers the files or option the project now
  needs. Nothing is copied unasked.
- **`checkpoint` reads each kind's checks from its rules file** and runs them with or
  without a repository; stages a newly copied credential hook as executable; records a
  mockup-free visual fix and every new dependency.
- **`relay` reads the *Rules* line as v4 writes it**: a declined option, the credit option
  and `· read, not imported` are no longer reported as mismatches every session. It **reads
  `conventions.md`** (the profile block, the granted exceptions, the document map) and the
  rules of a project that does not import them, and names the entry point's spec, area file
  and map.
- **Both have an unattended path** (§ASK): with nobody to answer, the questions go into
  *Blocked on* with a recommendation each, and nothing that needed a yes is done.
- `relay`'s steps are numbered 1 to 8. Its old Step 4.6 is Step 7.

### `sync-standards`

- **Check m reads rulesets** as well as branch protection: a branch guarded by a ruleset
  answered "not protected".
- **Check n** offers the gates workflow; **check o** lists, and never fixes, what the newer
  rules ask of code already live.
- *Adding an option* also adds a kind's file to a project that outgrew its *Rules* line.

A real sync of the studio's two repositories, the first of any project on v4, proved the
release and found nine more faults, all fixed: a pilot against an unreleased master is told
from a local edit; **copies are compared and written with LF**, so a Windows checkout no
longer shows every file changed, and the credential hook is copied by the script so it
cannot arrive with line endings that stop it running; a rules file left behind by a declined
option is reported and removed on a yes; a moot exception can become the project's own
rule; the `AGENTS.md` and `GEMINI.md` pointers are compared with the template; the upgrade
report covers Step 5; and the sync closes by running the update check.

### The update check

**A release now reaches a project by itself.** The plugin's check ran only when a session
was new, and compared the project with the installed plugin, which does not update unless
the marketplace's auto-update is on: so a release reached no one. It now also runs when a
session is resumed or compacted (at most once a day per project), and **once a day asks
GitHub what the released version is**: one small public file, nothing about the project
sent, silent when offline, off with `FLEET_MASTER_URL=off`. Where the plugin is behind, the
agent asks whether to update it and then sync. A no stays quiet until a newer version.

### What a project must change

`sync-standards` does each of these, or lists it, in its upgrade report.

1. **(n) The gates in CI:** a project with a remote and gates to run takes
   `.github/workflows/gates.yml` from the template for its kind, on the owner's yes.
2. **(o) Public forms:** each form or route a visitor can submit without signing in gets a
   rate limit and length caps. Listed by the sync; the work is the project's.
3. **(o) Security headers** in `next.config`, and no wildcard in `images.remotePatterns`.
   Listed by the sync; the work is the project's.
4. **(o) Legal pages:** what they promise is recorded in `data-model.md`. Listed by the
   sync; the work is the project's.
5. **(m) Branch protection** is read again where an earlier sync said a ruleset-protected
   branch had none.
6. **Step 5:** the credential hook is offered again, for the `sk-` fix. Nothing else: the
   new §OWNER checks, the phone engines and §FAMILY ask nothing of a project at sync.

---

## 4.0.0 · Satluj — 2026-11-18

The first named release: the five rivers of Punjab, v4 Satluj, then Beas, Ravi, Chenab and
Jhelum. The name is on the surface only (README, this heading, the release notes); the rules
and skills stay plain, and the version line reads `4.0.0`.

**The standard is no longer one file.** v3's `project-rules.md` was 76 KB, loaded in full
every turn by every project, most of it about Next.js. v4 keeps a **core** every repository
loads (`project-rules.md`, about 32 KB) and moves the rest into **files a project loads by
its kind** (`rules/`) and **options it chose** (`rules/options/`). A `Rules:` line in
`CLAUDE.md` declares the set (`Rules: app, ui, node, web · Options: firebase, trello`);
`sync-standards` copies only what it declares. Measured at the end: a web project loads 62
KB, a Node tool 46, a Python tool 42, a game 48, a repository without application code 35.
**No section was renamed:** `§GIT` still means `§GIT`; only the file it lives in changed.
The move was word for word, proved by a line check against the file as built, and every
rewording came after it in its own commit.

v4 also carries the fourteen proposals first built as 3.9.0, which was never released (the
section below, kept as written), the rules from the 11–12 November token attack, an audit of
the whole standard (about 90 findings, the owner's picks all built), and an independent
review by Fable 5.2 (7 out of 10; its fifteen findings all built).

### Where each section lives

| File | Sections | Loaded by |
| --- | --- | --- |
| `project-rules.md` (the core) | §SCOPE §DOCS §ASK §AGENTS §GIT §OWNER §SPECS §TOOLS §SCALE §SECURITY §TESTING | every repository |
| `rules/app.md` | §GROWTH §MODULES §NAMING §DATA §LIFECYCLE §SHORTCUTS §PACKAGES §BUILD | anything with application code |
| `rules/ui.md` | §DESIGN §COMPONENTS §QOL §PATTERNS §MOTION | anything with a visual surface |
| `rules/node.md` | §NAMING §TS §STATE §PACKAGES §NPM §RUNTIME §BUILD §TESTING | web projects and Node tools |
| `rules/web.md` | §STRUCTURE §RUNTIME §STATE §FORMS §HOOKS §STYLING §SHADCN §MOTION §TESTING | Next.js projects |
| `rules/python.md` (new) | §PYTHON | Python tools |
| `rules/game.md` | §GAME (v3's game-engine block in §SCOPE) | games in an engine |
| `rules/non-application.md` | §NONAPP (v3's non-application block in §SCOPE) | repositories without application code |
| `rules/options/firebase.md` | §FIREBASE | projects that chose Firebase |
| `rules/options/sqlite.md` (new) | §SQLITE | projects that chose SQLite |
| `rules/options/trello.md` | §TRELLO | projects with a board |
| `rules/options/ai.md` | §AI | read before AI work, through a line in `CLAUDE.md` and `src/lib/ai/CLAUDE.md`; not imported |
| `rules/options/credit.md` | §CREDIT | read by the skills at the credit step; not imported |

A section that appears in two files (§NAMING, §PACKAGES, §BUILD, §STATE, §RUNTIME, §MOTION,
§TESTING) is divided: each file holds the part true for its kind, under the same name.

### What changed

- **Kinds and options.** `rules/python.md`, two shapes (a package with uv, pyright strict,
  pydantic, ruff and pytest; a folder of scripts), with snake_case, UTF-8 on every open and
  never `python -c` in both. `rules/options/sqlite.md` for local-first projects, asked beside
  Firebase. **New projects use pnpm** (§NPM: `packageManager`, approved build scripts, one
  lockfile); existing projects keep their manager. JavaScript is a named choice for a local
  tool, with `checkJs` and strict (§TS). `rules/app.md` says each rule in any language.
- **§SECURITY, from the token attack.** No token in code a browser receives; a token as
  small as its job, recorded in `environment.md`; **the default branch protected** where the
  plan allows, the gap recorded where it does not; a workflow declares the least
  `permissions`; an unexplained change under `.github/workflows/` is an incident. `relay`
  lists commits since the last checkpoint that touch workflows, settings, hook scripts or
  git hooks, and raises any the log does not explain.
- **§GIT, production outside git.** A deploy, a change to security rules or a hosted
  database, `rm -rf`, dropping data: each needs the owner's go, every time. The Firebase
  option's deploy follows it.
- **`checkpoint`** runs the kind's build and tests before its git step, so a failing build
  never reaches a push that deploys; checks the branch before a push it was not asked for;
  stages by path; names its own commit in the log entry; proposes splitting a root
  `CLAUDE.md` past 50 KB. Its steps are numbered 1 to 9. A cloud session names the branch its
  work is on; a squash release merges production back into the working branch.
- **`relay`** runs first after a compact, and in a short form after a resume. It lists
  remote branches not yet merged, so cloud work is not stranded on a harness branch.
- **§ASK:** a session with nobody to answer (an Action, a scheduled run) stops and leaves
  the question instead of guessing.
- **`sync-standards` is the upgrade path.** It audits the transition into one upgrade
  report, applies on one yes, then re-runs its checks. Its per-version steps became state
  checks, a to m (below), so a project several versions behind takes the same path. A
  declined option is recorded as `no-<name>` on the *Rules* line and a declined sync in
  `decisions.md`, so neither is asked again. `copied.json` keeps a hash per copied skill, so
  a local edit (`! edited`) shows apart from a master change (`~ changed`). Hook scripts are
  shown as a diff before they are copied. A project's own `rules/` folder stops the sync.
- **`new-project` sets up every kind**, asks the backend (Firebase, SQLite or none) and, on
  a yes for each, creates the GitHub repository, the working branch and branch protection.
- **`design-motif` gains "Show me"**: sample tiles of three or four candidates, and
  `motif-gallery.html`, a tile for each of the 35 families.
- **A new skill, `machine-inventory`**, records what the machine has installed in
  `~/.claude/machine.md`, so projects prefer it before proposing a tool.
- **Process X** may use an independent auditor where the owner has one (`process-x.md`).
- **Other agents** read the whole set, and the installer puts the scripts beside the skills
  with an absolute path; it no longer waits on a prompt without a terminal.
- **The shell-write guard** reads through runners (`uv run`, `pnpm exec`, `timeout`) and
  quoted interpreter paths, covers PowerShell, and its refusal says to ask first.
- **Less text every turn.** Procedure moved out of the core into the skills that run it; the
  core keeps the rules. Fifteen behaviour eval cases, up from eight.

### What a project must change

`sync-standards` does each of these: Step 4's checks, by letter, in its upgrade report.

1. **Step 4, item 0:** a `rules/` folder of the project's own (a game's, Firestore's) moves to a
   folder named for what it is, on the owner's word, before anything is copied.
2. **(a) The rules set.** Write the *Rules* line, copy the core and the kind's files, and
   import them in `CLAUDE.md`. A game or non-application project that referenced the rules
   file now imports its set like any other. `project-rules.md §FIREBASE`-style references
   for moved sections become the section name alone.
3. **(b) The *Deploys* line** says single-branch, multi-branch or local only, and names the
   working branch on a multi-branch project.
4. **(c) The options,** each asked once and recorded on the *Rules* line, a declined one as
   `no-<name>`. SQLite is new: a project on SQLite with a §FIREBASE exception takes the
   option instead, and the exception is offered for removal.
5. **(d) A `Motif:` line** where the project loads `ui`.
6. **(e)** Bullets in `CLAUDE.md`'s working agreement that §OWNER now holds come out.
7. **(f) `.gitattributes`** pins `.sh` files and `.githooks/` to LF.
8. **(g) The profile block in `conventions.md`** that speaks of "Part A", "Parts B to E" or
   "referenced, not imported" becomes the block for its kind.
9. **(h) History out of the files agents read:** the next checkpoint moves the session log
   from `docs/STATUS.md` into `docs/log.md`; briefs carrying history are offered a split.
10. **(i) `decisions.md`** gains its "declined, never again" index.
11. **(j) One package manager,** one lockfile, and the *Commands* naming it.
12. **(k) Python's shape,** package or folder of scripts, in `conventions.md`.
13. **(l) Moot exceptions** the owner approves are removed from `conventions.md`.
14. **(m) The repository's security settings,** each on the owner's yes: the default branch
    protected or the gap recorded in `conventions.md`; each token's scope and expiry in
    `environment.md`; workflows declaring their `permissions`; unused Actions secrets named.
15. **Step 5:** the relay-after-compact and shell-write hooks in `.claude/settings.json`
    (cloud sessions load no plugin hooks), and the skill copies with their hashes.

### Built as 3.9.0, never released (issues #20 to #33)

Fourteen proposals, most from `godot-toll`'s Process X and the `toll-*` projects, built on
2026-11-12 as 3.9.0 and folded into 4.0.0 (`decisions.md`, 2026-11-13). Written before the
split: where an item names `project-rules.md` or §SCOPE's profile blocks, read it through
the table above.

- **§DOCS — current truth and history live apart.** A file an agent reads by default
  (`CLAUDE.md`, its area files, `docs/STATUS.md`) holds only what is true now. Every "was",
  superseded number, quote and measurement moves word for word into a record nothing loads
  by default: `docs/record/<area>.md` for the briefs, **`docs/log.md` for the session log**,
  `docs/archive/` for anything folded. `docs/STATUS.md` is the snapshot only, one
  current-state block, never stacked. `decisions.md` opens with a short "declined, never
  again" index. In `godot-toll` the briefs and status had become histories read whole
  (`docs/STATUS.md` 114 KB, three area files of 50 to 65 KB); split, they are 8 to 15 KB.
  **What a project does:** nothing by hand — the next checkpoint moves the session log out
  of `docs/STATUS.md` into `docs/log.md`, verbatim; `sync-standards` offers the briefs' split
  and the index. `checkpoint` writes its entry to `docs/log.md`, `relay` reads the newest
  entry there, and both still handle a status doc that has not been split. New
  `templates/log.template.md`; `STATUS.template.md` loses its session-log zone;
  `decisions.template.md` gains the index. The ~800-line fold now applies to the log.
  Issue #33.
- **`checkpoint`, `relay`, hooks — relay after a compact, a Live line, no compact block.**
  A `SessionStart` hook (matcher `compact|resume`, `scripts/after-compact.mjs`) tells a
  session picked up after a compact or a resume to run relay in full first, even when a
  request is already waiting. `Start here` gains a **Live** line for the state a compact
  used to carry (where the owner is, how they are working, what is mid-flight); standing
  rules go into `CLAUDE.md`. **Removed:** Step 6's compact block and its "compact
  instructions now or later" question — a plain `/compact` is enough. The block kept growing
  because nothing else carried live state across a compact (`godot-toll`, 2026-11-08).
  `sync-standards` adds the hook to each project's `.claude/settings.json` for cloud
  sessions, which install no plugins; the plugin's copy stays silent where a project
  registers its own, and in a project with no status doc and no rules file. Issue #26.
- **§SCOPE — a game-engine profile** (Godot first; Unity and Unreal read the same way),
  beside the non-application profile: what applies in full, what is read for the engine
  (naming case, the engine's test run in place of `tsc` and `npm run build`, its test add-on
  in place of Vitest), and what does not apply until saves, a backend or an AI feature
  arrive. Mockups are engine screenshots; phone-first does not apply to a PC-only game; the
  rules file is referenced, not imported. `conventions.template.md` and
  `CLAUDE.template.md` carry the blocks; `adopting-the-standard.md` names it. `godot-toll`
  had carried its own profile since 2026-10-21, through five beta releases. Issues #25 and
  #28, merged: #28's wording, with #25's "recorded once in `conventions.md`".
- **§OWNER — Process X**, a repeatable whole-product audit and upgrade for a project that
  has outgrown its adoption: audit as a ranked list, the owner's picks, drafts then build,
  shared pieces, motif, the fleet re-audit, proposals back to fleet. Nothing is built before
  it is picked; it counts as that release's deep audit. The steps are in the new
  `standards/process-x.md`, which the installer and `sync-standards` copy beside the rules.
  Issue #29.
- **§SCALE — splitting a `CLAUDE.md` safely, and the loading trap.** Sections move word for
  word, then a read-only check confirms every non-blank line of the old file is in exactly
  one new file. An area file loads only when a file inside its folder is read, so the root
  tells a session to read the area file for its work first, wherever that work sits
  (`godot-toll`: a 681-line root split into five area files, no line lost). Issue #27.
- **§TESTING, §MOTION — motion is checked on film.** An animation is verified by recording
  the real screen and reading it frame by frame, in each layout, mirrored, at each speed. In
  `godot-toll` every still looked right; the film showed an effect running over the screen's
  top strip at 1v1. Issue #32.
- **§COMPONENTS — the register may live in `design-system.md`** in a project without a
  component library, as a table of shared pieces; a separate `components.md` when the table
  outgrows it. Issue #30.
- **§FIREBASE — read the live Firestore rules back after a deploy** and compare them with
  the file; a deploy's own output is not confirmation (`godot-toll`, 2026-10-23: one MCP
  target reported success and changed nothing). If they cannot be read back, say they are
  unconfirmed. Issue #23.
- **§GIT — shell scripts keep LF.** A repository with `.sh` files or a `.githooks/` folder
  carries a `.gitattributes` pinning them to `eol=lf` (new `templates/.gitattributes`), so a
  Windows checkout cannot break them under bash (`toll-pipeline`'s unattended chains).
  `new-project`, `sync-standards` and the adoption guide add it. Issue #20.
- **`templates/pre-commit` — two more shapes:** a Discord webhook URL, and a Google OAuth
  client secret. Both were found unguarded in real projects (`toll-kits`, `godot-toll`);
  projects that added them locally can retire the divergence at their next sync. Issue #21.
- **`CLAUDE.template.md` — the *Deploys* line names the working branch** on a multi-branch
  project, not only the release; `sync-standards` asks where it is missing. Issue #22.
- **`relay` Step 4.6 — a studio that appeared later is noticed.** Relay reads the owner's
  `~/.claude/CLAUDE.md`; a `Studio credit:` line the project has no answer to goes into the
  report with the two §CREDIT questions offered. A project already on the latest standard
  never runs a sync, so nothing else would ask. Issue #31.
- **`checkpoint` and `relay` load again.** Both descriptions held a colon followed by a
  space ("Goal: …"), which is not valid in an unquoted YAML value. Current Claude Code
  (seen on 2.1.322) then loads the skill with empty metadata, silently, so neither appeared
  in a session's skill list — the two skills the standard leans on most. Found when the
  behaviour evals scored 0 with "Skill called 0x"; `claude plugin validate standards` names
  the fault, `claude plugin validate .` does not. Reworded, and `tests/run.mjs` now fails a
  description that is not a plain YAML value. **If the two skills were missing from your
  sessions, update the plugin.**
- **`checkpoint` Step 4 — read a tool-rewritten config's diff before reverting it.** An
  engine or IDE may rewrite a file and also carry a real change; never a blind
  `git checkout -- <file>` (`godot-toll` lost and restored new scene settings this way).
  Issue #24.

## 3.8.0 — 2026-11-02

- **§GIT — `git CPR` releases in a cloud session on a single-branch project.** The harness
  branch makes the project multi-branch for that session, so `git CPR` is the checkpoint to
  the harness branch, then a fast-forward of the main branch to it, the target named from the
  *Deploys* line. Fast-forward only: if the main branch moved on, stop and ask; if the push is
  refused, offer a pull request; never force. Before this, `git CPR` stopped at "nothing to
  release" with the work still on the side branch (`nca-automations`, 2026-10-23). The
  trigger table and `checkpoint`'s CPR section say the same. New eval
  `cpr-single-branch-cloud`; `cpr-single-branch` now says it is a local session. Issue #15.
- **§CREDIT — every project is asked, and featured projects stay current.** The credit
  question is no longer limited to deployed projects: a local-only tool the studio built is
  still its work (`roleodex`, 2026-10-24). A second question asks whether the project is
  featured on the studio's site — the **showcase**, named in the owner's `Studio credit:`
  line. A yes files the entry as an issue on the studio site's repository, and later
  checkpoints offer update issues when a phase closes or a notable feature is verified; the
  project never edits the studio site. A request the session cannot file is kept in
  `docs/STATUS.md`, not dropped. A client's agreement now covers the showcase too.
  `CLAUDE.template.md` gains a `Studio showcase:` line; `new-project` and `sync-standards`
  ask both questions. **Owners with a studio:** add the `showcase` part to the line in your
  `~/.claude/CLAUDE.md` (format in the README) — with no line at all, nothing is asked.
  Issue #16.
- **`checkpoint` Step 6 — a pause, not a compact block.** A checkpoint now ends with one
  question: compact then continue, compact and stop, or keep going; compact instructions now
  or later. The agent cannot see how full its context window is; the owner can. The same
  prompt carries Step 1.5's skill proposals (no longer asked before Step 2) and the showcase
  update, each only when it applies; approved changes land in one follow-up commit under the
  git answer the checkpoint already had. The block's rules are unchanged; a block asked for
  "later" is written then, from the context as it is. New eval `checkpoint-pause`. Issue #17,
  combined with #16's question by the owner's choice.
- **§AGENTS — the editor-tools rule is enforced.** A PreToolUse hook
  (`scripts/block-shell-writes.mjs`) refuses inline Python or Node code (`python -c`,
  `node -e`/`--eval`/`-p`/`--print`, an interpreter reading a heredoc) and heredocs in a
  command that writes a file. A heredoc that only feeds a command's input, such as a commit
  message, stays allowed, and heredoc bodies and quoted text are not inspected, so a commit
  message mentioning `python -c` passes. The plugin registers the hook; `sync-standards`
  (through `copy-skills-to-project.mjs`) adds it to each project's `.claude/settings.json`,
  so cloud sessions, which install no plugins, get it too. Written rules were skimmed: inline
  evals in `toll-kits` (2026-10-28) and `toll-the-game`, heredocs in `toll-the-game`
  (2026-09-26). Projects with a stricter hook of their own keep it beside this one. Issue #18.

## 3.7.0 — 2026-10-21

- **`checkpoint` Step 1.5 — improve the project's skills, and propose new ones.** The step
  used to edit project skills in place without asking, and never proposed new ones. Now both
  are proposals put to the owner in one multi-select question. A new skill is proposed only
  when a multi-step procedure was done twice or had to be rediscovered, at most one per
  checkpoint; it is project-scoped by default, sent to the standard through
  `propose-standard` when every project would use it, and user-scoped only for a personal
  habit. An approved skill is written in the same checkpoint; a declined one gets a line in
  `decisions.md` so it is not raised again. The fleet's own skill copies (3.6.0) are never
  edited here — the next sync would overwrite them — and improvements to them go back through
  `propose-standard`. Raised by the owner, mainly for projects without application code,
  where most work is procedure. No rules change.
- **§GIT — "local only".** A third *Deploys* value for a repository with no remote by
  decision: commits as single-branch, no push, nothing to release, never a remote added
  unasked. `sync-standards` skips the cloud skill copies, and `relay` treats a missing
  upstream as the design. Raised by DukeSenior Gaming's adoption. Issue #11.
- **§SECURITY — a tested credential hook.** The rule said to block anything containing the
  word `private_key`, which this file contains, so a literal hook blocked committing the
  standard. `templates/pre-commit` matches the shape of a secret instead — a key field with a
  value of 20 or more characters, a PEM private-key header, stream and API key assignments,
  `sk-` and `AIza` prefixes. It is committed to the project as `.githooks/pre-commit` and
  enabled with `core.hooksPath`, so it travels with the repository; `new-project` and
  `sync-standards` install it and `relay` checks it is live. Tested against this repository's
  and the plans repository's full documentation, and eight fake keys, under `sh` and `bash`.
  Includes the correction from the issue's comment: the key-field pattern first blocked a
  `decisions.md` that described the hook. Issue #12.
- **§SCOPE profile — the rules file is referenced, not imported.** Parts B to E are about
  70% of this 64 KB file and do not apply to a profile project, so its `CLAUDE.md` names the
  sections that do and reads them before git, documentation, security or design work. The
  template shows the variant; `sync-standards` offers the swap. Issue #10.
- **§SCOPE profile — fixed-size media.** For thumbnails, video, overlays, social posts and
  print, the rendered draft is the mockup. Seen working means the rendered file at real size
  and at the size it is really seen at; for video, frames at the start, end and each scene
  change plus measured duration, resolution and audio levels, with playback left to the
  owner. `design-motif` Step 5 follows it. Issue #9.
- **Checks for the standard itself.** `tests/run.mjs` turns this release's manual checks into
  permanent ones, and CI runs it with the plugin validator on every push and pull request.
  Skill descriptions get an 800-character budget: `checkpoint`'s was at 1,007, one phrase
  from Codex's 1,024 limit, where it would have been skipped silently — it is trimmed to
  about 560. `standards/evals/` adds six behaviour evals, run by hand because they cost model
  usage; all pass. The repository now keeps `docs/STATUS.md` and `decisions.md` and runs its
  own credential hook. Raised by the agent when the owner asked for suggestions. No rules
  change.

---

## 3.6.0 — 2026-10-20

- **§GIT — working branches commit and push on their own; production only on `git CPR`.**
  The *Deploys* line in a project's `CLAUDE.md` now declares **single-branch** or
  **multi-branch**. On a multi-branch project the agent commits and pushes the working
  branch itself, batched at the end of a piece of work and before a session ends; the
  production branch changes only on `git CPR`. Single-branch projects are unchanged: every
  commit and push needs a trigger, because there the push is the release. An undeclared
  project is treated as single-branch, and the agent asks once and records the answer —
  never infers it from the branches that exist. A live project is multi-branch, and a branch
  that deploys straight to production never counts as a working branch. The cloud-session
  paragraph is folded in: a harness branch is a working branch. The owner ruled this in two
  projects (toll-kits, element-clash-toll, 2026-10-17), believing the standard already said
  it; work had been sitting uncommitted between checkpoints in web sessions, where the
  container can vanish. Issue #6.
- **`checkpoint` — name the release target explicitly.** `git push origin HEAD:main` or the
  release in `CLAUDE.md`, never a target computed from `origin/HEAD`, which a fresh clone may
  lack: a computed target once created a remote branch literally named `HEAD`. Issue #6.
- **§SCOPE — the non-application profile.** For repositories that hold runbooks, records or
  configuration for a system elsewhere (a Microsoft 365 tenant, a no-code platform). Part A
  applies in full, with §SECURITY, §NAMING's vocabulary and file names, §DESIGN wherever
  there is a visual surface, and §TESTING's seen-working rule; nothing else in Parts B to E.
  The production surface is named on the *Deploys* line even though git never ships it;
  mockups still come first, from a root `_mockups/`. Recorded once at the top of
  `conventions.md` (the template has the block) instead of a blanket exception worded
  differently in every project. The header's *Applies to* line now says all projects.
  Raised by nca-automations' adoption (2026-10-19). Issue #7.
- **`relay`** also starts on "let's continue", and gains Step 4.6: it compares the project's
  rules version with the master and offers `sync-standards` when behind. Read only.
- **Startup check in the plugin.** A `SessionStart` hook compares the project's
  `project-rules.md` with the plugin's copy when a session starts. Behind → the agent asks the
  owner whether to sync; a "no" is remembered per project and the check stays quiet until a
  newer version ships. Silent when current, when the project is not on the standard, and on
  any error. Claude Code with the plugin only; cloud sessions do not install plugins, so
  relay's check covers them. Raised by the owner: projects only synced when someone
  remembered to ask. No rules change.
- **Skill copies in each project, for cloud sessions.** Cloud sessions (Claude Code on the
  web) install no plugins, so none of the fleet skills loaded there. `sync-standards` Step 5
  and `new-project` now copy every skill but `new-project` into the project's
  `.claude/skills/`, and the files they read into `.claude/fleet/`, with
  `scripts/copy-skills-to-project.mjs`; every sync refreshes them, and a copy edited in place
  is treated like an edited rules file. In a cloud session `sync-standards` clones the master
  rather than trusting `.claude/fleet/`, which is only the last sync's copy. Locally each
  skill then appears twice (`/checkpoint`, `/fleet:checkpoint`), with the same behaviour.
  No rules change.

---

## 3.5.0 — 2026-10-17

- **§AGENTS — files change through the editor tools, never the shell.** Edit for changes,
  Write for new files or full rewrites; never heredocs, `echo`/`printf` redirection,
  `sed -i`, `awk` or inline scripts to write files. The editor tools give the owner a
  reviewable diff, fail loudly when the target text is missing, are immune to shell quoting
  and expansion, and work the same on Windows. Two narrow allowances: a heredoc that only
  feeds a command's input (a commit message), and files a tool generates. Bulk changes stay
  file by file; a script for a bulk change is shown to the owner first. Raised by the owner
  after agents — this standard's own maintenance sessions included — routinely wrote files
  through heredocs and inline Python, leaving nothing reviewable.
- **`checkpoint` — Step 2.5, the project's own documentation.** Every checkpoint brings the
  README and the project's other documents (`CLAUDE.md`, area files, `components.md`, the
  architecture map, `data-model.md`, `environment.md`, `.env.example`, spec status lines, a
  `CHANGELOG.md` if kept) current for what the session changed — updating, not restyling;
  every command, path and setup step checked against the repo; business-owned copy drafted
  for approval. It matters most when the checkpoint pushes: `git checkpoint` and `git CPR`
  publish the README with the code. MAX gains M11, a claim-by-claim check of the README and
  `CLAUDE.md`. Previously the checkpoint kept only `docs/STATUS.md` current, so projects
  pushed features under READMEs describing the app before them.
- **§DESIGN — text on colour is designed, not guessed.** Every fill has a partner text colour
  as a token pair. Saturated mid-tone fills carry white text, with the fill darkened until
  white reaches 4.5:1 rather than the text switched to black; light fills carry dark text;
  every pair is checked and its ratio recorded, and one that looks muddy fails regardless of
  the number. Raised by the owner after mockups kept showing black text on red and green
  buttons: the WCAG 2 formula scores black higher on bright red and green (`#e53935`: white
  4.23, black 4.97; `#43a047`: white 3.30, black 6.36), so agents trusting the number chose
  black. `design-motif`'s rules check (Step 6) checks every pair.
- **§CREDIT added — studio credit.** An owner who runs a studio names it, with its credit
  wording, logo and link, in their own `~/.claude/CLAUDE.md`; the standard stays generic, so
  other owners are never asked about a studio that isn't theirs. Only projects deployed with
  a shareable link are asked, once, whether to carry the credit; local-only projects never
  are. Always optional, recorded as a `Studio credit:` line in `CLAUDE.md`; a client project
  needs the client's agreement; the credit is designed into the motif, not pasted. Logo
  files come from the studio's own brand kit and are copied into the project, never
  hotlinked — transparent SVG masters first, on-light/on-dark per scheme, single-colour
  variants where the studio's colours clash with the motif; the logo is never redrawn.
  `new-project` asks at setup, `sync-standards` for existing projects; the `CLAUDE.md`
  template and checklist gain the line. Raised by the owner for Tinker Together, the studio
  they run.
- README: the install section lists all seven skills (it still named four).

---

## 3.4.0 — 2026-10-08

- **§SHADCN rewritten — components are custom by design.** shadcn and the primitives under
  it supply behaviour (keyboard, focus, ARIA, positioning); everything visible is designed
  for the project's motif. The old text asked for "a pass over the primitives in use — not a
  week rewriting a component library", and agents read that as permission to change colours
  and radius and stop. Builds came out generic, while the owner's best projects owe their
  character to components designed from scratch. Now: a generic test (if it could drop into
  another project unchanged, it is not done); two or three creative options per core
  component; anatomy and every state designed; behaviour kept standard and accessible; a
  **component round** after the motif is locked — the core kit plus a signature component,
  through mockups, taking the time it needs — recorded in `docs/design/components.html`.
  `design-motif`, `new-project`, the motif starter kit, §STRUCTURE and the checklist updated.

## 3.3.0 — 2026-10-08

From a conversation about working on larger projects.

- **§NAMING — files and identifiers.** kebab-case files and folders, PascalCase components and
  types, camelCase functions, variables and hooks, camelCase zod schemas with a `Schema`
  suffix, SCREAMING_SNAKE_CASE for true constants. Framework-reserved names keep theirs. New
  projects use it from day one with a filename lint rule offered at setup; existing projects
  keep their convention, recorded in `conventions.md`, and are never mass-renamed. On
  Windows, renames go through `git mv`, because a capitals-only rename made in the editor
  can pass locally and fail the deploy. §HOOKS moves from `use[Name].ts` to `use-name.ts`
  to match.
- **§GIT — where work happens.** A project with a live domain or real users works on an
  update branch and merges when the update is complete, checking the branch's preview
  first; a project with no live users may work on main. Branches stay short-lived — merge
  within days or bring main in regularly, split big updates, and use a feature flag for the
  largest. This was already the owner's practice; it lived only in individual projects.
- **§SCALE added — finding your way in a larger project.** Area `CLAUDE.md` files in
  subfolders, which Claude Code loads when work touches that folder, with each fact in
  exactly one file; and `docs/architecture.md`, a map of modules (owns, depends on, used by),
  data flow and a where-to-find index, kept current by the checkpoint and optionally
  generated from imports. Added when a project outgrows a single read. §TOOLS, the
  `CLAUDE.md` and `AGENTS.md` templates, §DOCS and the checkpoint updated to match.

## 3.2.0 — 2026-10-08

- **§AI added — AI and LLM features.** The owner chooses the AI tooling when AI first enters
  a project — **Firebase AI Logic** (stay inside Firebase: Gemini, client-side, App Check),
  the **Vercel AI SDK** (versatility: any provider including Claude, local models, chat UIs,
  agents), or **both** — with the trade-offs laid out and the choice recorded. Neither is
  imposed, and the other is never added later without asking. The AI SDK is free and open source; the project pays the provider directly, and
  Vercel's AI Gateway is optional. The AI SDK replaced an earlier draft's "provider SDK or
  Genkit" for server work, because one API across cloud and local models removes adapter
  code. Every call sits behind a
  `lib/ai/` adapter in domain terms with a mock, and model IDs live in one map, checked
  against current docs. Every model call is protected before it ships — App Check and quotas for AI
  Logic; authentication, per-user rate limits and server-only keys for AI SDK routes. Structured output uses one zod schema — passed straight to the AI SDK, or
  converted with `z.toJSONSchema` for AI Logic — and used again to parse the response. Prompts are code;
  model output is untrusted; tools are permission-checked on the server, with side effects
  confirmed by the user; §QOL, cost limits and privacy records apply. Local models (Ollama,
  LM Studio) run through the AI SDK's OpenAI-compatible provider, for development and
  local-only tools — a deployed app cannot reach the owner's PC.
- §STRUCTURE gains `lib/ai/`; the new-project checklist gains the AI item.
- **§RUNTIME added — Node version and environment.** Node is pinned to the deploy platform's
  major, not the local one, declared in `engines.node` (which Vercel reads) and `.nvmrc` (which
  version managers read); a local mismatch is switched before building. This came from a
  project that built cleanly on local Node 24 and took two production routes down on
  Vercel's Node 22. Environment variables are validated at startup by a zod
  `src/lib/env.ts` with server and client halves, client variables referenced one by one
  because Next.js inlines them at build, and a committed `.env.example` (with a `.gitignore`
  exception, since `.env*` is ignored). `new-project` sets both up; the checklist gains both.
- **§SPECS added — spec files.** For work planned now and built later; in-progress work hands
  over through the checkpoint instead. No template: a spec must be buildable by a session
  that knows nothing else — goal and non-goals, decided versus open, what it touches, done
  means, a status line. Features and upgrades live in the project's `docs/specs/`. On a
  project with a Trello board the spec and its card link each other, and progress and
  discussion happen on the card; without a board the spec stays in the repo with a plain
  status word. A built spec is a record, never pending work; the checkpoint keeps it current.
  Chosen over a plan-file template with review sections, because Trello already covers
  sharing, comments and progress for projects that have a board.
- **`ai-setup` skill added.** Runs §AI end to end in a new or existing project: inventories
  AI already in the code (never refactoring scattered calls unasked), gathers the brief, puts
  the tooling choice to the owner, scaffolds `lib/ai/` after the owner approves packages
  (checked against npm and current docs), protects every model call, optionally wires local
  models with one real test call, builds the first feature through the adapter, records it,
  and verifies with tests and a build. `new-project` asks the AI tooling question up front.

## 3.1.0 — 2026-10-08

- **§DESIGN — every project has a motif.** The six-row "design direction" vocabulary is
  replaced by a catalogue in the new `standards/motifs.md`: 35 motif families in seven groups
  (paper and craft, soft and tactile, bold and graphic, retro and nostalgic, dark and techy,
  calm and refined, institutional and product; the old six among them), with 92 named
  variants, plus **Universe-inspired** and **Custom**. Each family offers named variants
  (Cyberpunk: neon, a 2077-inspired yellow, and corpo), agent-suggested variants —
  one built from the project's existing tokens where it has them — custom, and *decide for
  me*. Four ways in, so the owner chooses how much to decide: **browse**, **recommend**
  (*decide for me*, from the site's purpose and audience), **surprise me** (*I'm feeling
  lucky*, a random pick among motifs that suit the project), or **bring your own**. Every
  route ends in a mockup and the mockup loop. A motif is chosen at a new project or a redesign,
  kept where a project already has one, recorded in `design-system.md`, and from then on a
  standing rule like consistency and QoL. One motif; blends only with the owner's approval.
  Restraint is part of the rule: the motif lives in signature places, and forms, tables and
  body text stay readable. Starter kits and full motif specs are produced on request, as
  proposals through the mockup loop.
- **Universe-inspired motifs** have no option list, because they can be any fictional world.
  The agent asks which world, researches its design language on the web, asks scoping
  questions (which part, which palette sources, how literal, how in-universe, what
  audience), and gets a written brief confirmed before designing. Inspired, never copied.
- **Two new skills.** `design-motif` runs the motif process end to end: it checks for an
  existing motif, gathers the brief (from the project's spec where there is one), offers the
  four ways in, picks a family and variant or researches a universe-inspired brief, loops on
  mockups that include an ordinary form and table as a restraint check, and records the
  result. `new-project` scaffolds a Next.js app (`create-next-app --disable-git`, so git
  stays the owner's call), puts the rules and templates in place, wires the plugin and the
  other-agent pointers, hands to `design-motif` before any interface work, then walks the
  checklist with the owner. `install-skills.mjs` now also installs `motifs.md`.
- **§OWNER — don't state the obvious.** Interface text that repeats what a component already
  makes clear is cut: a sun/moon switch needs no "Light mode" label. Icon-only controls still
  carry an accessible name, and what is genuinely not obvious — an empty state's next step —
  is still said. Came from the owner's experience building a game, where pages and components
  kept explaining themselves.
- **§ASK — open questions go in prose.** The question tool stays the default for choices;
  open questions are asked as a short numbered list in the message, so the owner can answer
  in their own words, including by speech-to-text. Forcing an open question into fixed
  options got answers of "no preference".

## 3.0.0 — 2026-10-08

**Sections renamed to stable anchors and regrouped** into five parts: how we work,
architecture, stack/platform/security, interface, quality. Append-only numbering had put
Firebase, package manager and git after "For agents" purely because they were written late.
Names make reordering free from now on.

- **§MOTION cut to three guardrails.** v2 banned entrance animations, hover transitions and
  staggered reveals and allowed one orchestrated moment per app; projects reported it stopped
  them animating almost anything. Animation is now the owner's call at the mockup stage, with
  nothing banned on style. What remains: `prefers-reduced-motion` honoured, motion never
  makes the app feel slow (never blocks use, smooth on a mid-range phone), and durations and
  easings are `@theme` tokens. Library renamed to `motion` (`motion/react`), GSAP allowed
  with a recorded reason.
- **§OWNER added** — the owner's working agreement (mockup flow, mobile first-class,
  consistency/modularisation/QoL, business copy, shared primitives, frozen files), moved
  here from `templates/CLAUDE.template.md`, where it was the only copy of fleet-wide rules.
  The template now points at it.
  **The mockup rule widened** on the way: v2's template required mockups only for a "real
  redesign"; now every visual or layout change starts as an approved mockup, iterated until
  the owner locks it, except a bug fix restoring an approved design. Locked mockups are kept
  in `docs/design/` (committed, outside `public/` so never deployed) with a `decisions.md`
  entry.
- **§ASK** — the question tool is the default for any input from the owner, not only for
  decisions; prose questions only where the tool is unavailable.
- **§SHADCN** — shadcn named as the component library in every project, no second library
  without asking; each project owns its own customised primitives, never copied from
  another project's set; primitive styling goes through the mockup loop.
- **§TRELLO added** — a project has a board only when its `CLAUDE.md` names one;
  `STATUS.md` is the record and the board mirrors it; default lists Backlog / To do / Doing /
  Review / Done; open items carry their card link; `checkpoint` writes on every checkpoint,
  `relay` reads only.
- **§TESTING added** — Vitest for `lib/domain/` and schemas; interface changes checked by the
  agent in Claude's built-in browser, then Claude in Chrome, Playwright only as a last resort.
- **§FORMS** — simple forms use `<form action>` with `useActionState` instead of `useRef`;
  Firestore `onSnapshot` listeners recognised as the live-data path, through the adapter.
- **§BUILD** — typecheck and lint during work; full `npm run build` before every checkpoint
  and deploy, instead of after every medium change.
- **§DOCS** — the status document is `docs/STATUS.md` with a snapshot rewritten in place over
  a session log added to at the top, matching the `checkpoint` skill. v2 called it
  `status.md` and said "rewritten, never appended", which contradicted the skill and the
  template.
- **§SECURITY / §FIREBASE** — one rule for where keys live: outside the repo by preference,
  `.secrets/` (gitignored) as the fallback. v2 stated it differently in each section and
  reconciled them in a paragraph. §FIREBASE now defers to §SECURITY instead of restating it.
- **§GIT** — gained the cloud-session rule: a harness-assigned branch is the authorisation to
  commit and push there, and nowhere else. The destructive-commands bullet moved here from
  §AGENTS and gained `git clean` and `reset --hard`. The skills now ship in the `fleet`
  plugin instead of living as hand-copied files in `~/.claude/skills/`.
- **§SCOPE** — names the `fleet` plugin: `sync-standards` updates a project's copy,
  `propose-standard` sends changes back to `fleet-standards`. Editing a copy in place is ruled out.
- **§AGENTS** — "rewrite status.md, do not append" removed (now §DOCS); motion values added
  to the list of values not to invent.
- Header names the master copy by GitHub repo as well as the local path, so cloud sessions
  can find it.
- Changelog moved out of the rules file into this one.

- **§TOOLS added** — the standard binds every coding agent, not only Claude Code. `CLAUDE.md`
  stays the one hand-written instruction file; `AGENTS.md` and `GEMINI.md` are pointers to
  it (new `templates/AGENTS.template.md`). Claude-specific tools mapped to their
  equivalents. The skills gained an "outside Claude Code" note, and
  `scripts/install-skills.mjs` returns, now installing to `~/.agents/skills/` (Gemini CLI,
  Copilot, Cursor) and `~/.codex/skills/` (Codex) plus the standard to `~/.agents/fleet/`.

**Not changed in substance:** every other section's wording is carried over as-is.

New in v3 with no v2 equivalent: §OWNER, §TRELLO, §TOOLS, §TESTING.

---

## 2.4.0
Added **§28 Git, commits and the checkpoint** after a session committed four times off its own
initiative across one piece of work — each commit individually defensible, the pattern not what
was wanted. The rule was previously carried only in conversation and in individual projects'
`CLAUDE.md`, which meant every new repo relearned it the same way.
- One trigger phrase, stated as a table: `git checkpoint` is the authorisation, everything else
  is not.
- Batching made explicit, because "commit early, commit often" is the default an agent arrives
  with and it is wrong here.
- An approval does not generalise to the next commit.
- Names the `checkpoint` and `relay` skills by path, and warns that they may not appear in a
  surfaced skills list.

**Appended, nothing renumbered** — §1 through §27 are unchanged, so every `conventions.md`
cross-reference written against v2.3.0 remains correct. Copies of this file elsewhere in the
fleet now read as one minor version behind, which is the drift detector working as intended.

## 2.3.0
Recovered two sections that v2.1.0 dropped, found when `tinker-together` was audited against
v2.2.0 and turned out to be running v2.0.0. Nothing renumbered — both were **appended** as
§26 and §27, because §12, §16, §18, §22 and §25 are referenced by name from existing
projects' `conventions.md` and `decisions.md`, and renumbering would silently invalidate
every one of those references.
- §26 Firebase restored from v2.0.0 §17, expanded with what client work proved: rules are
  inert until deployed, a missing composite index hangs a build rather than failing it, and
  a public page must never fetch Firestore in a component. Reconciled with §22 rather than
  contradicting it — a key kept outside the repo is stricter than `.secrets/`, not a
  violation of it.
- §27 Package manager restored from v2.0.0 §18, unchanged in substance.
- Checklist: `project-rules.md` must be copied in **and committed**. Its absence from the
  v2.2.0 checklist is why one project's copy has never been tracked.

## 2.2.0
Conventions proven on the Simetrix build, generalised.
- Project document set defined, with update triggers and the delete-if-unowned
  rule (§2)
- Naming section added — interface, code and documentation share vocabulary (§6)
- Data adapter promoted to its own rule (§9)
- Entity lifecycle rule added — transitions declared once, nothing writes status
  directly (§10)
- Prototype shortcut register added (§11)
- Security expanded: `.secrets/`, credentials by path, pre-commit hook, scoped
  accounts, rotation order, account ownership (§22)
- Sections consolidated to keep the file readable as it grows

## 2.1.0
- Building for growth, with the line between foresight and speculation
- shadcn customisation made explicit
- Design direction proposals with a starting vocabulary
- QoL extended; standing instruction to offer improvements
- Button-to-modal overlay documented with its limits
- Motion given its own section
- Question tool named as the default for decisions
- Zustand and zod scoped to projects that need them
- Agents must pair every problem with a proposed solution

## 2.0.0
- File length limit removed; replaced by responsibility rules and split triggers
- Precedence rule added — conflicts escalate rather than resolve silently
- Global `types/` directory removed; domain types inferred from zod
- CSS Modules withdrawn; Tailwind only, tokens in `@theme` for v4
- Eight-variant Button withdrawn in favour of shadcn variants plus QoL props
- "Latest version" softened to "latest compatible"
- Design system, component registry and security sections added
- Zustand scope clarified
- Structure moved under `src/`

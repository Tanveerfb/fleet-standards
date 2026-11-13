# v4 phase 6 — the audit of the standard

**Status:** audit delivered 2026-11-13; **picked the same day: the owner chose the
recommended set.** Building, one commit per finding; *Picks and outcomes* at the end says
where each stands. Process X (`standards/process-x.md`) read for a standard rather than a
product. Companion to [`v4.md`](v4.md).

## How it was done

Read-only. The agent read the eleven rules files in full; five readers each took one area
and reported findings with a file and line: the `checkpoint` skill; the other seven skills;
templates and documents; scripts, hooks, tests and evals; and a survey of how the projects
under `E:\Projects` use the standard. The agent then re-ran or re-read the claims that
matter most (every row marked **✓ checked**). Rows without the mark rest on a reader's word
and a line reference.

**What the fleet looks like** (34 project folders surveyed, names only read from
credentials): rules version 3.8.0 in 10, 3.7.0 in 5, 3.5.0 or 3.4.0 in 3, 2.x in 8, none in
8. Kinds: about 20 Next.js apps, 8 repositories without application code, 2 Godot games,
and tools in Node and Python. Firebase in 15, zod in 18, zustand in 10, react-hook-form in
6, a Trello board in 7, AI in 5, a studio credit said yes to in 3 and a showcase in 1,
`demo-shortcuts.md` in 3, area `CLAUDE.md` files in 6, `docs/architecture.md` in 4.

## How to pick

Each finding has an id. Pick all, a group, or single ids; anything not picked is recorded
as declined in `decisions.md` so the next audit does not raise it as new. One commit per
finding, so each can be reverted alone. Effort: **S** under an hour, **M** a few hours,
**L** a session. Verdicts: wrong, cut, merge, move, tighten, missing, keep.

The agent's recommendation: **A, B and C in full** (without them v4 does not work or is not
safe), **D and E in full** (they are what "everything a repository loads applies to it"
means), **F1 to F6**, **H1 to H4**, and **I** as listed. **G** is phase 7's work whatever
is picked. **K** needs the owner's answers, not a pick.

---

## A — Wrong today: two places disagree, and an agent can act on the wrong one

| id | where | finding | fix | effort |
| --- | --- | --- | --- | --- |
| A1 | core §SECURITY vs §GIT | "The default branch is protected: changes arrive by pull request" against a single-branch project, which pushes to `main`. The 2026-11-12 decision's second half (where the plan does not allow protection, `conventions.md` records the gap) is missing. Raised before the wording was approved; not taken. | Say what holds everywhere (force pushes and deletion off), what holds on a multi-branch project (changes arrive by pull request), and where the gap is recorded. | S |
| A2 | `checkpoint` :24, :405 vs §GIT *Cloud sessions* | Plain `checkpoint` in a cloud session on a single-branch project: the skill asks before committing; §GIT says the harness branch is committed and pushed without asking. A cloud session that waits loses the work. | One git table in the skill's Step 4, mirroring §GIT's, with a cloud row (see E1). | S |
| A3 | `checkpoint` :468 vs §GIT *An approval does not generalise* | The follow-up commit after the closing question reuses the earlier approval. §GIT says an approval covers the commit in front of you and nothing after. | Say in §GIT that a checkpoint's answer covers that checkpoint's own follow-up commit, or ask again. The owner chose the one closing question on 2026-11-02; this keeps it and makes the rule agree. | S |
| A4 | `checkpoint` :59 **✓ checked** | Bare `CPR` "asks before commit, push and release", but on a multi-branch project the working branch is never asked about, and §GIT's table has no bare `CPR` row. | Add the row to §GIT or drop bare `CPR` from the skill. | S |
| A5 | `checkpoint` :340 to :374 **✓ checked** | The architecture-map and spec-status paragraphs sit inside the Trello step, which a project with no board is told to skip silently. They apply to every checkpoint. | Move them to the project-docs step, which already names both. | S |
| A6 | `sync-standards` :28, :229 | "Never commits; it lands at the next checkpoint" is wrong on a multi-branch project and loses the work in a cloud session. `ai-setup` says it correctly. | "Git follows §GIT and the *Deploys* line." | S |
| A7 | `templates/AGENTS.template.md` :15 **✓ checked** | Other agents (Codex, Copilot, Cursor, Gemini) are told to read only `project-rules.md`. Since the split they never read `app`, `ui`, `node`, `web` or the options. | "Read `project-rules.md` and every file on `CLAUDE.md`'s *Rules* line; `rules/options/ai.md` before AI work." | S |
| A8 | `adopting-the-standard.md` :255, :178 | The kickoff prompt hard-codes single-branch git ("never commit unasked") against §GIT's multi-branch and local-only rows. | "Git follows §GIT and the *Deploys* line." | S |
| A9 | `rules/non-application.md` :18, conventions template :28 | The profile applies §NAMING's vocabulary and kebab-case names, but loads neither file that holds them (`app.md`, `node.md`). Kept in phase 1 so the rule was not lost; it now points at text the repository cannot read. | Restate the two rules in `non-application.md` in two lines. (Or move §NAMING's vocabulary to the core: the same words in interface, code and documents is true of every repository. The owner placed it in `app.md` in round 2.) | S |
| A10 | `templates/STATUS.template.md` :42, :67; `checkpoint` :514 | "What shipped in this checkpoint" and "the mistake worth keeping: what it said before" are history inside the file §DOCS says never holds a "was". | Both go in the log entry; the template and the MAX step say so. | S |
| A11 | `checkpoint` :250 to :322 vs `STATUS.template.md` | The skill's content list and the template §DOCS says matches it do not match: the template has "Verified", "Assumed", "Things that will save a session"; the skill names none, and never says which of the two files each item goes in. `relay` reads those sections. | One list, in the skill, saying snapshot or log for each item; the template follows it. | M |
| A12 | `checkpoint` :537 vs §TOOLS | A MAX step names `AGENTS.md` as a place for the owner's rulings. §TOOLS says `AGENTS.md` is a pointer and never holds facts. | Drop `AGENTS.md` from the list. | S |
| A13 | `new-project` :61, :64, :110 **✓ checked** | The scaffold runs with `--disable-git` and nothing runs `git init`, yet a later step runs `git config core.hooksPath` and the last expects a `git checkpoint`. | Ask the owner, then `git init`, before the hook step. | S |
| A14 | `rules/web.md` checklist :194 vs `new-project` :134 | The checklist says create `.env.local` and record the variables; the skill, following §DOCS, says only once a credential exists. | Goes away with E4. | S |
| A15 | conventions template :118 | Says the fleet-wide working agreement is in the template's `CLAUDE.md`. It is §OWNER. | Cut the section. | S |

## B — The guard and the checks: what protects the fleet does less than it says

| id | where | finding | fix | effort |
| --- | --- | --- | --- | --- |
| B1 | `hooks/hooks.json` :27 **✓ checked** | The shell-write guard is registered for the Bash tool only. **The PowerShell tool, the primary shell on the owner's PC, is not guarded at all**: `node -e 1` through it passes. | Register it for PowerShell too, and teach the script PowerShell's forms (`Set-Content`, `Out-File`, `>`, here-strings). | M |
| B2 | `block-shell-writes.mjs` **✓ checked, five inputs run** | Inline scripts slip past in ordinary forms: `bash -lc "node -e 1"`, `python -W ignore -c 1` (any flag before `-c`), `x="$(python3 -c 1)"` (a substitution inside double quotes), and a quoted `<<X` that makes the guard discard every later line as a heredoc body. | Strip quotes before looking for heredocs; scan inside `$(…)`; match `-c`/`-e` after any flags; treat combined shell flags as wrappers. Add each input to `tests/run.mjs`. | M |
| B3 | `block-shell-writes.mjs` **✓ checked** | It also refuses harmless commands: a commit message heredoc run from a folder named `python`, or followed by `grep node`. | Match an interpreter only where a command starts, not as any word. | S |
| B4 | §AGENTS vs the guard **✓ checked** | The rule says never `sed -i`, `echo` or `printf` redirection, `awk`; the guard blocks none of them (`sed -i` and `printf x > notes.md` pass), nor `perl -e`, `ruby -e`, `bun -e`, `deno eval`. §AGENTS says "this rule is enforced". Three projects keep a stricter hook of their own beside it. | Either widen the guard to what the rule names, or say in §AGENTS exactly what is enforced and what rests on the agent. The agent's lean: block `sed -i` and redirects to a file outside a temp folder; say the rest plainly. | M |
| B5 | `check-rules-version.mjs` :67 | The startup check compares only the core's version. A project on the current core with `rules/web.md` missing, or with imports that do not match its *Rules* line, is silent. `relay` Step 4.6 has the same blind spot. | Read the *Rules* line; report a declared file that is missing, and an import with no declaration. | M |
| B6 | `relay` Step 4 :153 | The new unattended-change check watches workflows and `.claude/settings.json` but not `.claude/fleet/scripts/` (those scripts run on every command) or `.githooks/`. | Add both paths. | S |
| B7 | `.github/workflows/checks.yml` | Actions are pinned by tag, not commit; no job timeout; push and pull_request both run on a same-repo pull request. `permissions: contents: read` is right. `claude plugin validate standards`, the only form that parses skill frontmatter, is still not run. | Pin by commit, add a timeout and the second validate. The workflow file: the owner's yes each time. | S |
| B8 | `tests/split-check.mjs` :122 | A missing baseline commit prints "skipped" and counts as a pass. After the release merge and branch deletion, CI on `main` would skip silently. | Moot if the check is removed at release as planned (I4); otherwise fail instead of skip in CI. | S |
| B9 | `tests/run.mjs` | Nothing checks that the commands in `hooks.json`, this repository's `.claude/settings.json` and the copy script name scripts that exist: rename a script and every test passes. `sync-rules.mjs` and `install-skills.mjs` have no tests; the *Rules* line parser is the only machine reader of that line and has none. Several "silent" checks pass on a crash. | A test for each. | M |
| B10 | `copy-skills-to-project.mjs` :111 | A skill or file removed from the standard keeps loading in every project that copied it; `--check` says all current. | List what is in the project and not in the plan; report it, remove on a yes. | M |
| B11 | `sync-rules.mjs` :42 | A name on the *Rules* line that is not lower case (`UI`) is dropped silently: the core is copied, that file stays old, and the message counts one fewer. | Lower-case names; report any it cannot match. | S |
| B12 | `after-compact.mjs` :33; two scripts' JSON handling | Through a symlink or junction the project's copy of the hook can take itself for the plugin's and stay silent; valid but unexpected JSON (`null`) in a settings or state file throws. Reasoned from the code, not run. | Pass `--project-copy` in the registered command; guard the two reads. | S |

## C — v4 does not yet work end to end

| id | where | finding | fix | effort |
| --- | --- | --- | --- | --- |
| C1 | `new-project` :56 to :91 | The skill can only make a Next.js project. §SCOPE names five kinds; the fleet has 8 repositories without application code, 2 games, and Node and Python tools. It also never writes the *Rules* line, the option imports or the AI line, never asks the *Deploys* kind, and copies skills into a local-only project. | Ask the kind first; branch: Next.js as now, the others get the files, the `CLAUDE.md` from the template for that kind, and the hooks, with no scaffold. Write the *Rules* line. Ask *Deploys*. | L |
| C2 | `sync-standards` :139; `relay` :202 | Only AI can be opted into after setup. Nothing copies `credit.md`, `trello.md` or `firebase.md` and updates *Options* once a project is on v4. | One "add an option" step in `sync-standards`; relay and the others point at it. | M |
| C3 | three projects' `decisions.md` | v4's sync turns a profile project into one that imports the core. `toll-pipeline` recorded "a fleet sync must not put the import back"; `godot-toll` declined the import and the skill copies; `nca-automations` declined the skill copies. The reason they gave (70 KB of Next.js rules) is gone, but the decision is theirs. | The v4 step reads the project's `decisions.md` for a declined import or copy, says what changed (31 KB, all of it applies), and asks. Never restores either unasked. | S |
| C4 | `sync-standards` Step 4 | The per-version steps ("for v3", "for v3.1", "for v3.8", "for v3.9") are all really state checks. 8 projects are still on 2.x and 5 on 3.7.0, so the steps are needed, but keyed by version they run in the wrong order for a long jump and repeat the v4 options step. | Rewrite as "if X is missing, do Y", in one order. Keep the v2 → v3 number map: five projects still cite numbers in `CLAUDE.md`. | M |
| C5 | `sync-standards` :155 | The v4 step fixes references that name the file, but not "Part A" or "Parts B to E" wording in a project's own `conventions.md` profile block. | Offer the new block from the template, as it already does for the game block. | S |
| C6 | *Rules* line | Skills search for `Rules:` and `Trello board: <url>`; the template writes `**Rules**:` and `**Trello board**:`. A literal search misses them. `sync-rules.mjs` already tolerates the bold. | Say "the *Rules* line, bold or not" in the skills. | S |
| C7 | a project's `rules/` folder | Not checked in any project: whether a folder named `rules/` already exists for something else (a game's rules, Firestore rules). | The pilot syncs in phase 7 look first; sync stops and asks if the folder exists and is not the standard's. | S |
| C8 | `design-motif` Steps 5, 7, 8; `ai-setup` | Both skills assume a web project (`public/_mockups/`, `@theme`, §SHADCN, Route Handlers, `npm run build`), though games and repositories without application code run `design-motif`, and §AI names local Node tools. `design-motif` never updates the *Motif* line in `CLAUDE.md` on a redesign. | "Where the project's rules files say mockups live"; write the *Motif* line in Step 7; in `ai-setup`, branch on the kind. | M |
| C9 | `propose-standard` :20, :67 | Its list of what can be proposed names one rules file and four skills; the version-bump step still says "renumbering"; it does not say where the checkout for a pull request comes from in a project session. | Name the set and all eight skills; say a change under `rules/` bumps the core's version. | S |

## D — Rules that reach a repository they are not written for

The test the owner set for v4: everything a repository loads applies to it.

| id | where | finding | fix | effort |
| --- | --- | --- | --- | --- |
| D1 | `rules/app.md` | Titled "engineering, in any language" and loaded by games and by Python and bash tools, but written in React and TypeScript: §MODULES ("a component", "a hook", "React, Next or any store"), §DATA (`index.ts`), §LIFECYCLE (`lib/domain/`), §SHORTCUTS (a `ts` example), §BUILD ("JSDoc", `console.log`, "TypeScript and ESLint errors"). `cutscene` and `toll-pipeline` both carry exceptions for exactly this. | Keep each rule; move the stack's words to `node.md` or `web.md`, as phase 1 did for §NAMING and §BUILD's commands. | M |
| D2 | core §AGENTS, §OWNER, §DOCS, §SCALE | The core, loaded by every repository, carries web details: `components.md`, "the data adapter", static HTML mockups at 390px in `public/_mockups/`, "form → Server Action → adapter → store", `src/features/billing/`, dependency-cruiser. On the split map's carried list. | The rule stays in the core; the detail goes to `ui.md` or `web.md`. | M |
| D3 | `rules/ui.md` | Loaded by games and repositories without application code, but §DESIGN and §MOTION say tokens live "in `@theme`" (Tailwind), §MOTION cites §STYLING (in `web.md`), and §COMPONENTS opens "every project has a `components.md`" three lines above the paragraph that says a table in `design-system.md` will do. | "Where the project keeps its tokens"; one opening line for §COMPONENTS covering both. | S |
| D4 | `rules/web.md` §FORMS | "Live data uses Firestore `onSnapshot`", and Firebase Auth as the example: Firebase is an option now, and 5 of the Next.js apps do not use it. | Move the Firestore sentence to `options/firebase.md`. | S |
| D5 | `rules/node.md` §RUNTIME | Half is web (Vercel, `NEXT_PUBLIC_`, `src/lib/env.ts`, `server-only`); a Node tool loads all of it. Seven lines are an install walk-through for a version manager on Windows. | Web half to `web.md`; the walk-through to `adopting-the-standard.md`. | S |
| D6 | `rules/web.md` §STATE, §STRUCTURE | zod (18 projects) applies to Node tools; Zustand only to React. `lib/domain` and `lib/data` suit a Node tool; `app/` does not. On the carried list. | zod and the two `lib/` folders to `node.md`. | S |
| D7 | `rules/node.md` §PACKAGES | Mostly true in any language; only "verify on npm" is Node. `rules/game.md` already restates it for add-ons because a game cannot load it. | Move the rule to `app.md`; `game.md` goes back to one line. | S |
| D8 | the core, throughout | The core cites sections a repository may not load (§BUILD in §GIT, §RUNTIME in §SECURITY, §COMPONENTS, §DATA, §LIFECYCLE, §MOTION, §DESIGN, §QOL). And "this file" inside moved sections now means the wrong file ("check a pattern against this file", "decided by the owner, not by this file"). | "The standard" for "this file"; a citation to a section outside the core names its file once. | S |
| D9 | core §TESTING | Three files hold it. The core's part opens with a UI rule and ends with "no end-to-end suite", which is a web habit; `cutscene` has an exception for it. §TOOLS still points at §TESTING for the browsers, which moved to `web.md`. | Core: "done means seen working", the film rule. The end-to-end line to `web.md`. Fix the §TOOLS pointer. | S |
| D10 | `rules/game.md`, `rules/non-application.md` | Neither has a section name, so neither can be cited the way every other rule is. | `## §GAME` and `## §NONAPP`, or the owner's names. | S |
| D11 | `rules/options/credit.md` | 4.2 KB imported into every session of a project with a credit, for a rule used at setup and at a checkpoint. 3 projects said yes to a credit. | Read on demand, like AI: `new-project`, `sync-standards` and `checkpoint` read it when they reach that step. | S |
| D12 | `rules/options/ai.md` | "On a 16 GB GPU, roughly up to 14B parameters": the owner's machine, written into a shared rule. | "What the machine file says this GPU runs." | S |

## E — Said twice: procedure that lives in a rule and in the skill that runs it

| id | where | finding | fix | effort |
| --- | --- | --- | --- | --- |
| E1 | `checkpoint` :16 to :84, :403 | What git does per phrase and per *Deploys* value is in four places in the skill, none complete, each a little different from §GIT's table. | One table in the git step. Fixes A2 and A4 with it. | M |
| E2 | core §GIT | 7 KB, the largest section. The cloud fast-forward is written out in §GIT and in the skill; "where work happens" restates the multi-branch bullet above it. | §GIT keeps the rules and the table; the steps stay in the skill. About 2 KB out of every session. | M |
| E3 | `rules/ui.md` §DESIGN :19 | The ways in, the variant offers and the universe-inspired steps are `design-motif`'s Steps 3 and 4. | "Choose the motif before designing; the `design-motif` skill runs it." | S |
| E4 | `rules/web.md` :170 | The new-project checklist, 37 lines, is imported into every web session for ever; it is used once. Its last item is stale and one line is doubled ("(§CREDIT)"). | Move it into `new-project`. Fixes A14. | M |
| E5 | `options/trello.md` :22; `options/credit.md` | The board procedure and the showcase filing steps are written in the rule and in `checkpoint`, `new-project`, `sync-standards` and `relay` (credit: four times). | The rule keeps who may write and when; the steps live in one skill and the others point. | M |
| E6 | `checkpoint` :558; `relay` :271; `machine-inventory` | "Common mistakes" lists restate the steps: 14 of 19 bullets in `checkpoint`, most of `relay`'s, 3 of 4 in `machine-inventory`. | Keep the ones that add something; cut the rest. | S |
| E7 | six skills, lines 8 to 14 | The same seven-line "Outside Claude Code" block opens six skills and restates §TOOLS' table. | The installer rewrites the plugin path as the copy script does; the block shrinks to one sentence. | M |
| E8 | `checkpoint` :525; `ai-setup` :87; `design-motif` :138 | MAX steps 5 to 7 repeat an earlier step and the templates; `ai-setup` Steps 5 to 7 repeat §AI after telling the agent to read §AI; `design-motif` Step 6 repeats §DESIGN's contrast rule. | Point, do not repeat. | M |
| E9 | core §OWNER vs `process-x.md` | The seven steps are listed in §OWNER and spelled out in `process-x.md`. | §OWNER: what Process X is, when, and that nothing is built before it is picked. | S |
| E10 | scripts and manifests | The reference list is written twice (copy script, installer); the version is parsed four ways, one unanchored; the skill names are typed by hand in both manifests with no test. | One list, one parser, one test. | S |
| E11 | `checkpoint` step numbers | Steps 1.5, 2.5, 3.5 are full steps; ranges like "Steps 1–3" and "three layers" (four are listed) are wrong as written. | Renumber 1 to 8. | S |

## F — Missing: a case a real session meets

| id | where | finding | fix | effort |
| --- | --- | --- | --- | --- |
| F1 | `relay` :73 | "After a compact, run relay first" lives only in the skill and the hook. An agent with no hook that has not opened `relay` cannot know it. | One line in the core. | S |
| F2 | core §SCOPE :73; `propose-standard` | "Never edit this file in place" covers one file. The same rule for `rules/`, the skill copies and `.claude/fleet/` lives only in a skill and a generated README. | Widen the core's sentence. | S |
| F3 | `checkpoint` :397 | "Read a tool-rewritten config's diff before reverting it" binds any session that reverts a file, but lives only in the checkpoint skill, twice. | A bullet in §AGENTS. | S |
| F4 | `checkpoint` :36, :410 | The push made without asking on a multi-branch project never checks that the branch it is on is not the production branch the *Deploys* line names. | One check before the push. | S |
| F5 | `checkpoint` Step 4 | Nothing says what to stage. An agent will reach for `git add -A` and take files the session never touched. | "Stage what this session changed, by path; list anything else and ask." | S |
| F6 | `checkpoint` :542; log template | The log entry must name this checkpoint's commit, but it is written before the commit and amending is not allowed. | Write the entry, commit, then add the hash in the follow-up or name the previous commit plus "and this one". Say which. | S |
| F7 | `checkpoint` :61, :201, :276, :352 | Smaller gaps: `git CPR` on a local-only project; a first checkpoint is not told to create both files from the templates; the project-docs step omits `roadmap.md`, `issues.md`, `conventions.md`, `design-system.md`; a finished item leaves the snapshot and takes its Trello card link with it. | One line each. | M |
| F8 | fleet survey | Rules that projects are not following, with no exception granted: Vitest not installed in 5 projects that list it as a gap; the filename lint rule not installed in 3. | Not a wording fix. Either the checkpoint raises an open gap that has stood for three checkpoints, or the rule is softened to "where the project has tests". The owner's call. | S |
| F9 | `machine-inventory` :34 | `timeout 15 <command>` is right in Bash only; in PowerShell `timeout` is a pause. The first-run notes read as dated history. | Say Bash; fold the notes into the table. | S |

## G — Documents that still describe one Next.js file (phase 7's input)

Listed so phase 7 rewrites from a list rather than rediscovering it. No pick needed unless
the owner wants any done now.

| id | where | what must change |
| --- | --- | --- |
| G1 | `README.md` :3, :20 to :29 | The intro and "what you get": a core every repository loads and files by kind (reuse §SCOPE's tables); name the kinds. |
| G2 | `README.md` :31 **✓ checked** | The heading says seven skills above a table of eight. |
| G3 | `README.md` :146 to :158, :198, :227 | By-hand install copies one file and points at a checklist that moved; "changing the standard" names one file; the layout omits `rules/`, the gallery and `machine-inventory`. |
| G4 | `README.md` :183 | A v3 owner cannot learn what the next sync does. Say it: one question on the kind, `rules/` created, the *Rules* line and imports written, the options asked once. |
| G5 | `CHANGELOG.md` | No 4.0.0 entry and no table of which section moved to which file, which `sync-standards` Step 2 reads. The 3.9.0 entry is for a version never released and says the game profile is "referenced, not imported". |
| G6 | `adopting-the-standard.md` :15, :29, :207 to :227 | "Part A"; "walk `project-rules.md` section by section" (walk the core and each file the kind loads); the order of work never picks the files, writes the *Rules* line or asks the options; it tells a profile project to reference the rules. |
| G7 | `adopting-the-standard.md` :176, :259 | The skills section lists seven and says nothing is copied; the kickoff prompt restates §OWNER nearly word for word. |
| G8 | `docs/maintainer.md` | The release rule names one file; nothing on a new file under `rules/`, the gallery tile, the split check, the decision whether a skill is copied to projects; eight eval cases where there are eleven; the description limit stated twice with two numbers. |
| G9 | conventions template :103; `motifs.md` :431; three citations | The §DOCS map names a `status.md` §DOCS no longer lists; the motif record offers four ways in where there are five; three places cite `project-rules.md` for a section that moved. |
| G10 | `templates/CLAUDE.template.md` :103 to :144 | Commands, Technology and Codebase are web-only, with a note for one other kind. Goes with C1. |

## H — Evals and tests

| id | where | finding | fix | effort |
| --- | --- | --- | --- | --- |
| H1 | evals | No case covers `git CPR` on a multi-branch project, the release to production and the riskiest git path there is. | One case. About $0.30 a run. | S |
| H2 | evals | Five of eight skills have no case: `sync-standards` (asks before copying), `propose-standard` (an issue, never a push), `new-project`, `ai-setup`, `machine-inventory`. | A case each for the first two; `new-project` after C1. | M |
| H3 | four graders | Wording a literal judge can fail a right answer on, the fault that cost a run on 2026-11-13: "then stop" with a closing question to follow (`checkpoint-local-only`), four steps required "in this order" (`cpr-single-branch-cloud`), "treats the two as one question" (`checkpoint-single-branch`), a pass that needs the reply to mention `main` unasked (`checkpoint-multi-branch`). | Say what is not a failure in each. | S |
| H4 | five checkpoint cases | No grader checks that the skill fired; `relay-lets-continue` checks only that it fired, not that relay reports and waits. | Add the missing half to each. | S |
| H5 | all eleven | Each case has run once. The eight older ones last ran before the split. | Run all eleven once before release: about $3. | S |

## I — Cut

| id | what | why |
| --- | --- | --- |
| I1 | `SECURITY.md` **✓ checked** | GitHub's unfilled placeholder, with a table of invented versions. Replace with three true lines: only the latest release is supported, where to report, what the credential hook covers. |
| I2 | `standards/claude-skills.md` | A personal list of plugins under a "Prompts" heading, shipped inside the plugin to every project. Nothing reads it. Move to `docs/` or delete. |
| I3 | `sync-rules.mjs --apply` | It duplicates `sync-standards` without the reference translation, the imports or the skill copies. The report mode is the part nothing else gives. Keep the report; drop `--apply`. Built in phase 1, on the map's word. |
| I4 | the split check | `tests/split-check.mjs`, `tests/split-intended.json`, its line in `tests/run.mjs` and `fetch-depth: 0` in the workflow, all four together, at the release. Already planned. |
| I5 | `checkpoint` :143, :475 | "This global skill" (it is copied into projects); a heading named after the compact block that was removed. |

## J — Keep: looked cuttable, earns its place

- **The v2 → v3 section map** in the changelog and `sync-standards`' number translation: 8
  projects are on 2.x and five still cite numbers in `CLAUDE.md`.
- **§SHORTCUTS and `demo-shortcuts.md`:** in 3 of 34 projects, all prototypes for clients,
  which is the case it is written for.
- **The traps in `adopting-the-standard.md`:** each is a measured incident found nowhere
  else. Label them "web and Firebase" so another kind can skip them.
- **"Never compare against `.claude/fleet/`"**, said three times: it guards the one failure
  that silently reports "current".
- **The stray-`HEAD` warning and the handoff paragraph** in `checkpoint`: each guards a real
  trap, and `relay` depends on the second.
- **The two profile blocks in the conventions template:** they agree with the rules files
  and are the only fill-in form an adopter has.
- **Fail-open hooks, this repository's own hook registration, the description budget.**
- **§SCOPE's two tables.** They say the same thing two ways; an agent needs the second.

## K — For the owner's answer, not a pick

| id | question | what the survey shows |
| --- | --- | --- |
| K1 | **A package manager beyond npm** (pnpm named, round 3). | One project is on pnpm and one has both lockfiles; the rest are npm. No project has an exception against §NPM. The agent's lean is unchanged: pnpm for new projects, existing ones stay, and only after checking it against current Vercel and Firebase documentation. |
| K2 | **JavaScript as a named choice** for a local tool. | Three Node tools are plain JavaScript today (`.mjs`), with no exception recorded, and this repository's own scripts are too. The rule would describe what already happens: JavaScript with type checking on, chosen at setup, never for a client or deployed project. |
| K3 | **UI awareness**: agents missing interface rules "in a couple of projects". | The survey cannot find these: they are not written down as exceptions. The cases are the owner's to name. One candidate cause the audit did find: §OWNER's visual rules are in the core, the rest of the interface rules are in `ui.md`, and a session that starts from a script or a question reads neither closely. |
| K4 | **When to split a `CLAUDE.md`.** | 6 projects have area files; `godot-toll`'s root reached 214 KB first. The checkpoint could measure the root file and propose a split past a size the owner names. |
| K5 | **§MOTION.** | 5 of the granted exceptions the survey listed are against it, 4 in one project; no other section has more than 3. The section was since rewritten to leave animation to the owner at the mockup stage, which makes those exceptions moot. Worth a line at those projects' next sync, nothing in the standard. |
| K6 | **Other backends as options.** | `roleodex` and `cutscene` use SQLite and carry a §FIREBASE exception each. Under v4 they simply do not choose the Firebase option, so the exception goes. No new option file is needed yet. |
| K7 | **A Python or other-language file.** | `toll-pipeline` (Python) and `cutscene` (a Python core) each restate naming and testing for Python in their own conventions. Two projects is the usual bar for a file of its own; D1 has to land first so `app.md` is truly neutral. |

## Picks and outcomes

**The owner, 2026-11-13: "Recommended set".**

| Group | Picked | Outcome |
| --- | --- | --- |
| A1 to A15 | all | **built 2026-11-13:** A1, A5, A6, A7, A8, A9, A12, A13, A15. **To build:** A2 and A4 (with E1), A3, A10, A11, A14 (with E4) |
| B1 to B12 | all | B1 to B4 built 2026-11-13; B5 to B12 to build. B7 changes the workflow file and needs the owner's yes when it is reached |
| C1 to C9 | all | to build |
| D1 to D12 | all | to build |
| E1 to E11 | all | to build |
| F1 to F6 | picked | to build |
| F7, F8, F9 | not picked | declined for v4; F8 is also a question for the owner |
| G1 to G10 | phase 7 | not a pick |
| H1 to H4 | picked | to build |
| H5 | not picked | the run before release is in phase 7's own list |
| I1 to I5 | all | to build; I4 at the release |
| K1 to K7 | the owner's answers | open |

**Sizes before the picks** (bytes, 2026-11-13): core 31,001; `web` 10,427; `ui` 7,531;
`node` 7,240; `ai` 6,635; `app` 5,460; `credit` 4,222; `firebase` 2,956; `non-application`
2,736; `game` 2,234; `trello` 1,532. Skills: `checkpoint` 38,181; `relay` 15,817;
`sync-standards` 15,283; `design-motif` 9,474; `ai-setup` 8,569; `new-project` 8,446;
`machine-inventory` 6,244; `propose-standard` 4,697.

## What was not checked

- The eight older evals were not re-run; no eval was run for this audit.
- B12 and three smaller script findings are reasoned from the code, not run.
- Whether any project has a `rules/` folder of its own (C7).
- The fleet survey read `decisions.md` files by keyword, not in full, and read no
  credential or environment file.
- GitHub issues were not read: the connector did not connect in this session.
- Counts of "said twice" are by the readers' line references; the agent checked a sample.

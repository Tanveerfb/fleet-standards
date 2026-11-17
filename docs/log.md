# fleet-standards — session log

*History: what happened in each session, newest first. **Nothing loads this file by default**
(`project-rules.md` §DOCS) — `docs/STATUS.md` holds what is true now, and `relay` reads only
the newest entry here. Written by the `checkpoint` skill.*

*__Mark what died:__ when a session deletes or replaces something an older entry describes,
that entry gets `**RETIRED — <what replaced it>, commit <hash>**` as its first line.*

*__Fold at ~800 lines:__ move the oldest entries **verbatim** to
`docs/archive/log-<YYYY-MM>.md`, each leaving a one-line stub here with a link. **Folding is
relocation, never summarising.***

---

### 2026-11-18 — phase 7: Satluj's look, the changelog, the pilots, the evals, and the release

Commits `777e5c4` to `dde8008`, 28 of them, and this one; pushed to
`claude/new-project-mockup-zp2h2z`, CI green at each push checked. Then `git CPR max`: this
checkpoint, and the release as a merge pull request into `main`. The same session, continued
after a compact ("lets continue"); the second half ran overnight on the agent's calls, with
the owner's go to finish with `git CPR max`.

- **The theme's surface.** The README leads "v4.0.0 · Satluj" (the owner's pick), and the
  name is spelled **Satluj**, not Sutlej (the owner asked; closest to ਸਤਲੁਜ). Three README
  mockups as a private page; the owner locked **A, river bands** on the first round. Built as
  `docs/assets/satluj-banner.svg`, every text outlined to paths with Sora and Noto Sans
  Gurmukhi (both open licence, downloaded to the scratchpad on the owner's yes), generator
  beside it.
- **The 4.0.0 changelog entry**: the split, a table of where each section lives, what
  changed, and *What a project must change*, with 3.9.0 folded under it. Writing it showed
  three §SECURITY rules no sync check covered: **check m** added on the owner's yes.
  `tests/run.mjs` learned the named heading and an `unreleased` top entry.
- **Group G's documents**: the README (by the agent), `adopting-the-standard.md` and
  `docs/maintainer.md` plus G9's references (two subagents, their diffs read before commit).
- **The pilot dry run**: a read-only agent wrote the upgrade report for five real projects,
  one per kind, and found seventeen problems with `sync-standards`
  (`docs/audits/2026-11-18-pilot-dry-run.md`). The owner picked all but 14; built as P1 to
  P17, among them: a project's own skill never overwritten (`= own`), `--hooks-only`, every
  option on the `Options:` part, two kinds in one project (a §SCOPE sentence), a *Rules* line
  ending `· read, not imported`, a git preflight, a master folder for pilots. Real syncs wait
  for the release (the owner).
- **All fifteen evals**, on the owner's go: 1.00 each with the plugin, two after a call each
  (`decisions.md`, "The release ran overnight"). About $4.60.
- **The release**: version 4.0.0, the changelog dated, the README's version; I4 removed the
  split check, its list and `fetch-depth: 0` (the workflow edit on the owner's yes).
  Checked at this checkpoint: tests pass, both plugin validations pass, the sizes measured;
  `main` found unprotected (404), left for the owner.
- **Released**, checked after the merge: pull request #34 merged into `main` as `8a9b8ae`
  (a merge commit, after its checks passed); `main` reads `**Version:** 4.0.0` and holds
  `standards/rules/`; CI on `main` succeeded; issues #20 to #33 closed with it. No tag, as no
  earlier release had one.

**The mistakes worth keeping.**
- P7 and P9 went into one commit, against one commit per pick.
- P1's edit left a broken sentence in Step 2 ("yes, and add each"); P16 mended it.
- I first changed the README's "for his own projects" to "their"; it is the owner's own
  description of themselves, so it went back.
- My inline `node -e` to read an eval result was refused by the guard, rightly.
- The `sync-asks-first` grader still encoded behaviour two picks had changed: a pick that
  changes a skill's behaviour should update the eval case that grades it in the same commit.

**Process X:** not run this session.

---

### 2026-11-18 — the audit finished, group K, two new ideas, the theme, and a Fable review

Commits `877153e` to `ea2069a`, 47 of them, and this one; all pushed to
`claude/new-project-mockup-zp2h2z`, CI green at each push checked; nothing reached `main`.
The same session, continued after a compact ("lets continue").

- **The audit's last picks**, one commit each: F1 to F6 (relay first after a compact, in the
  core; "never edit in place" covers `rules/`, the skill copies and `.claude/fleet/`; a
  rewritten config's diff read before reverting, in §AGENTS; checkpoint checks the branch
  before an unasked push, stages by path, and names its own commit as "and this one"), H1 to
  H4 (eval cases `cpr-multi-branch`, `sync-asks-first`, `propose-files-an-issue`,
  `new-project-game`; four graders say what is not a failure; every case checks its skill
  fired), I1 (`SECURITY.md`, three true paragraphs), I2 (`claude-skills.md` to `docs/`), I5.
- **Group K, the owner's seven answers** (two question rounds): pnpm for new projects, npm
  stays; JavaScript a named choice for local tools; a core pointer to `ui.md`; a split
  proposed past 50 KB (the recommendation was 30); §MOTION exceptions dropped at sync;
  `rules/options/sqlite.md` (the recommendation was to wait for a third project); and
  `rules/python.md`, with two shapes, package and folder of scripts. K6 and K7 were written
  from a read-only survey of `roleodex`, `cutscene` and `toll-pipeline`: only roleodex has
  working SQLite code; cutscene's core is the fully tooled Python, toll-pipeline loose
  scripts. Vercel and Firebase were checked for pnpm before K1.
- **Two ideas of the owner's**, both picked as recommended: the upgrade path goes inside
  `sync-standards` (an audit-first upgrade report, checks j to l, a re-check after, each
  release's changelog ending with *What a project must change*); `fable-audit` is Process
  X's optional auditor (`process-x.md` step 1).
- **The theme:** after two rounds the owner chose the five rivers of Punjab, v4 **Sutlej**
  (Ludhiana's river), then Beas, Ravi, Chenab, Jhelum. Accepted: surface only, original art.
  The README look goes straight to mockups, no gallery. Open: Sutlej or the number first.
- **The Fable review** (`docs/audits/`): Fable 5.2, blind, 36 files. The first run hit its
  16,000-token cap while thinking and wrote nothing, about $1.66; the runner in
  `~/.claude/skills/fable-audit/` was fixed (48,000, a cut-off reply fails loudly, honest
  estimates) and the second cost $1.54: **7 out of 10**. A separate agent checked every
  finding against the repo and tested the guard's: none wholly wrong. The owner picked all
  fifteen, R1 to R15, each built and committed `review R<n>`: a gate on production outside
  git; the build before a deploying push; cloud harness branches listed and named; no
  staging in sync; the guard's runners and quoted paths (12 tests); the installer's absolute
  path, scripts and no-terminal skip; hashes in `copied.json`; two core sentences scoped; the
  reference pass; `no-<name>` for a declined option; R11's trim and relay's short form after
  a resume; §ASK with nobody to answer; `new-project`'s remote and branch protection; hook
  scripts diffed before copying; a squash release merged back into the working branch.

**The mistakes worth keeping.**
- I told the owner H1 and H2 left "five" cases never run; they added four.
- I tried `sed -i` on `docs/STATUS.md`; the guard refused it, rightly, and nothing changed.
- The `fable-audit` dry run estimated $0.79 by counting words as prose; code and markdown run
  about 2.35 tokens a word, and review mode's thinking used the whole output cap. The runner
  now estimates both honestly.
- The owner remembered Process X as not yet done; it was: phase 6 is Process X on the
  standard. The Fable review is its independent second read, not a replacement.

### 2026-11-17 to 18 — the audit's groups A to E built

Commits `27abdb9` to the head of `claude/new-project-mockup-zp2h2z`, 52 including this
checkpoint's, all pushed; nothing reached `main`. The same session as the entry below,
continued after a compact on the owner's word ("we can do a checkpoint here and then i
compact you and then you continue here?"). The owner picked each group in turn: "Yes, group
B", "Yes, group C", "Yes, group D", "Yes, group E", then "Checkpoint first". One commit per
finding, named `audit <id>`, each recorded in `docs/specs/v4-audit.md`, *Picks and outcomes*.
The choices the audit left open are in `decisions.md` under these dates.

- **Group A, the rest** (A2, A3, A4, A10, A11, A14, with E1 and E4). One git table in
  `checkpoint`, with a cloud column; §GIT gained a row for bare `CPR` and names the
  checkpoint's follow-up commit as the one exception to "an approval does not generalise".
  History left the status template; the skill's content list names a file for each item.
  The new-project checklist moved out of `rules/web.md` into the skill (10,427 → 8,094 bytes).
- **Group B and I3.** One reader of the *Rules* line (`scripts/rules-line.mjs`), used by the
  startup check and the fleet report; relay watches `.claude/fleet/scripts/` and `.githooks/`;
  the workflow pins its actions by commit, times out, and validates the skills (the owner:
  "Yes, apply"); the split check fails in CI rather than skipping; tests for the hook paths,
  the report, the installer, and crashes that used to pass as silence; `.claude/fleet/copied.json`
  and `--remove-stale`; the project's after-compact hook carries `--project-copy`; `null`
  JSON handled. `sync-rules.mjs --apply` was removed.
- **Group C.** `new-project` sets up every kind of repository; `sync-standards`' per-version
  steps became nine state checks (a to i), with *Adding an option*, a declined import or
  copy asked about and never undone, the old profile wording replaced, lines read bold or
  not, and a `rules/` folder that is not the standard's stopping the sync; `design-motif` and
  `ai-setup` read the kind; `propose-standard` names the whole set.
- **Group D.** Every file a repository loads now applies to it: `app.md` in any language,
  web detail out of the core and `ui.md`, Firestore into the Firebase option, `node.md`'s
  §RUNTIME and zod sorted from the web half, §PACKAGES in `app.md`, citations outside the
  core naming their file, §TESTING's core part for every kind, §GAME and §NONAPP, the credit
  read on demand, the GPU line pointing at the machine file.
- **Group E.** §GIT trimmed to its rules (core 32,783 → 31,185 bytes), §DESIGN and §OWNER
  pointing at the skill and `process-x.md`, each option's steps in one place, the "Common
  mistakes" lists cut to what the steps do not say, the "Outside Claude Code" block one
  sentence (the installer now rewrites the plugin path), one reference list and version
  reader (`scripts/standard.mjs`), `checkpoint`'s steps numbered 1 to 9.

Measured after group E: a web project loads 60.4 KB, a Node tool 44.3, a game 46.5, a
repository without application code 33.9 (40.9 with a visual surface). The core is 31.0 KB;
it grew to 32.8 across groups A to D and came back in E. `checkpoint` is 35.7 KB, from 38.2.
`tests/run.mjs` passes; CI succeeded on each push. No behaviour eval was run.

**What the new tests found:** `sync-rules.mjs --apply` exits 13 on a second piped answer
(readline drains the buffered input) — the reason I3 was built early; a plain sync
forgetting a stale copy it had just reported (fixed before B10's commit); and the split
check never visiting an intended entry whose line had left every file, so four stale
entries had passed unseen (fixed in its own commit, `e92ac1f`). `tests/split-check.mjs`
gained a `--json` mode that prints the lines to paste into `split-intended.json`.

**The mistake worth keeping.** The first draft of the new `new-project` told the agent to
run Godot's "headless project creation". There is no such command; caught on reading it
back, removed before the commit. And the audit miscounted twice — the "Outside Claude Code"
block was in eight skills, not six, and `checkpoint` has nine steps, not eight — so an
audit's count is checked before it is built to.

### 2026-11-13 — v4 phases 1 to 5, the audit of the standard, and the first of its picks

Commits `37ed966` to the head of `claude/new-project-mockup-zp2h2z`, pushed, the last being
this checkpoint's own. That branch is a working branch; nothing reached `main`. One long
session on the owner's PC; the owner chose each time to carry on in it rather than start a
fresh one, and at the end: "we can do a checkpoint here and then i compact you and then you
continue here?"

The session opened on a local branch named `v3.9.0`, three commits holding all fourteen
issues (#20 to #33), built on 2026-11-12 from 21:30 by a local session that left no log
entry. The agent took the clone's status doc at its word ("no open issues, nothing
queued"), and scoped a v4 from scratch. The owner: "I am pretty sure i planned for most of
it, on web session of fleet standards. have a look first". A fetch found the plan on
`origin/claude/new-project-mockup-zp2h2z`, written half an hour before the build and
deciding "all 14 issues ship inside v4, no v3.9.0 first". Offered both ways out, the owner
chose "Fold into v4" over releasing v3.9.0 first (the agent's recommendation).

- **The fold.** The plan branch merged into the built work; `decisions.md` took both sides
  whole. The local branch was renamed `v4.0.0`. The spec and split map were re-pointed at
  the rules file as built (76.5 KB, `1379baa`) in place of v3.8.0 (69.4 KB, `bbe46d6`).
- **Phase 1, the split.** §SCALE: "Yes, core". `tests/split-check.mjs` written first and
  seen failing (72 problems on the untouched tree), then one commit per file, the core
  last. It passed on its first full run: 1035 baseline lines, each in exactly one of 11
  files; 22 removed and 91 added on purpose. The core is 29.3 KB. The agent kept the
  non-application profile's §NAMING and §TESTING lines, which the map dropped; the owner:
  "Keep". Everything that reads the rules file was updated, and `sync-rules.mjs --apply` was
  tried on two scratch projects (a declared set is copied; a project with no `Rules:` line
  is skipped).
- **CI.** The split check was skipped there: a shallow checkout lacks the baseline commit.
  The owner, on being asked to change `checks.yml`: "isn;t that the one where we had a cyber
  attack and we removed it?" Checked: it is the repository's own workflow from `fced90b`
  (2026-10-21), identical on `main` and the working branch, the only workflow GitHub lists,
  with no Actions secrets set today. The attack's workflow was another file and is on no
  branch. The owner: "Yes, add it"; `fetch-depth: 0` added, and the check ran in CI on
  `438d4da`.
- **Phase 2, profiles.** `rules/game.md` and the conventions template's game block say what
  a game loads; 31 removed and 105 added on purpose after it. The owner chose the AI
  trigger: a line in the root `CLAUDE.md` and in `src/lib/ai/CLAUDE.md`.
- **Phase 3.** Two eval cases, `relay-after-compact` and `checkpoint-log-split`. The first
  passed as written. The second scored 0.33 with the skill and 0.67 without: the agent's
  answer was right on every point and the judge failed it three votes to none. The grader
  was rewritten to say the answer is a description (the tools are read-only) and that a
  confirmation step counts as telling the owner; it then scored 1.00 with and 0.00 without.
  Cost of the three runs: $0.78. This file was split out of `docs/STATUS.md` in the same
  session.

- **Phase 4, motif previews.** "Show me" added to `design-motif`, `motifs.md` and §DESIGN;
  the eval `motif-show-me` scored 1.00 with the skill and 0.00 without ($0.31). The gallery
  was drafted with four tiles, light and dark side by side; the owner chose "Bigger tiles",
  one scheme per row. All 35 were then built and looked at, group by group, at desktop width
  and at 375px. One fault found by looking: six motifs' paragraph styles leaked into the
  tile header. The owner: "Locked".
- **Phase 5.** Relay's check for unexplained changes to workflows and agent settings, with
  the remote's production branch added by the agent. The five §SECURITY rules: the agent
  raised two points on the branch-protection rule; the owner: "Approve as worded". The
  `machine-inventory` skill, then its first run on this PC: `ollama list` hung for two
  minutes with Ollama stopped, apps off the path were found through `winget list`, and the
  skill was changed to say so. It wrote `~/.claude/machine.md`; the owner: "Yes, add it" for
  the import line. A file named `comfy_api_key.txt` was seen in `E:\Installed` and not
  opened; the owner was told.
- **Phase 6, the audit.** The agent read the eleven rules files; five readers took the
  `checkpoint` skill, the other seven skills, the templates and documents, the scripts and
  evals, and a survey of 34 project folders. About 160 raw findings became about 90 in
  eleven groups (`docs/specs/v4-audit.md`). The agent re-ran the security claims itself:
  five inline-script forms and the PowerShell tool all passed the guard. The owner:
  "Recommended set".
- **The first picks built.** B1 to B4: the guard rewritten for both shells, with 74 new
  test cases, all passing on the first run. Nine of group A, one commit each. A1 rewords the
  branch-protection rule approved "as worded" earlier the same day, to the two points raised
  then.

The shell-write hook refused the agent's own inline scripts twice in this Windows session
(`node -e`, then `python -c`), its first refusals outside `tests/run.mjs`. Evals this
session: $1.09 over four runs. `checks.yml` gained one line, `fetch-depth: 0`, with the
owner's yes.

**What this session got wrong, for the next one:** it scoped a v4 from scratch before
fetching the remote branches; it put "54 granted exceptions" in the audit, a number it had
not counted, and took it out; it wrote "this morning" in `decisions.md` without knowing the
time, and corrected it.

### 2026-11-12 — v4 planned with the owner; nothing built

Relay found fourteen open proposals and the token attack's three pushes to `main` (content
unchanged; the owner confirms the incident is closed). Then v4 was planned end to end with
the owner: `docs/specs/v4.md` (seven phases) and `docs/specs/v4-split-map.md` (where every
section goes, walked through in four rounds). The owner added, beyond the issues: a Process
X audit of the standard inside v4, motif previews ("Show me" and a gallery), a theme for
each major version, options as a category (credit, Trello, Firebase, AI), and a machine
inventory. Parked for the audit: a package manager beyond npm, JavaScript as a named choice.
Every decision and its alternatives is in `decisions.md` under this date. No rule, skill or
script changed; the tests pass as before.

### 2026-11-02 — v3.8.0 built: issues #15 to #18

Cloud `git CPR` on single-branch projects fast-forwards the main branch (#15); §CREDIT asks
every project about the credit and a studio-site showcase, filed as issues (#16); checkpoint
ends with one pause question (#17, with #16's update and the skill proposals in the same
prompt, by the owner's choice); the shell-write hook enforces §AGENTS, in the plugin and in
each project's settings (#18). Additions to the issues' wording are in `decisions.md`. The
agent used `sed -i` once while writing the hook — the very slip #18 exists for. The studio
credit line was written from the Tinker Together repo (attached read-only for it) and kept in
the plans repo's `owner-setup.md` for the owner to add on the PC. Two eval cases were fixed
(*Verified*, above). Released with `git CPR`.

*The status doc's "Verified this checkpoint" block as this checkpoint wrote it, moved here
word for word on 2026-11-13:*

- `node tests/run.mjs` — all checks pass on the v3.8.0 branch, including 23 shell-write hook
  cases and the settings merge.
- `claude plugin validate .` — passes, one expected warning (no `version`).
- Behaviour evals — eight cases, all scored 1.00 with the skill and 0.00 or below without it
  (`checkpoint-local-only` passes without it too). Two needed their case fixed, not the skill: `cpr-single-branch`'s
  grader read the new closing question and the "production is updating" line as release
  steps, and `checkpoint-pause` let the agent skip the skill (it now checks the skill fired,
  and its grader says what is not a failure). Total cost this session: $1.35.

**The mistake worth keeping.** A judge model reads a grader literally. When a skill gains a
step, every grader that says "then stops" needs to say what may still follow — or a correct
answer fails, as `cpr-single-branch` did here.

- CI on GitHub — the first run (push of `fced90b`) completed with success.

### 2026-10-21 — v3.7.0, and the standard follows itself

Built v3.7.0: checkpoint proposes skills (the owner's proposal), local-only repos, the
credential hook, and the two profile fixes (issues #9 to #12). Then, on the owner's request
for suggestions: CI, the description budget, six behaviour evals, this file, `decisions.md`,
and the hook enabled on this repo. Declined: a rules-file size budget. Released with
`git CPR`; what a release means here is now written down in `docs/maintainer.md`, after it
had been worked out from history twice (v3.6.0, v3.7.0). That was the session's one repeated
procedure; a note covers it, so no skill was proposed.

### 2026-10-20 — v3.6.0 released (pull request #8)

Working branches commit on their own; the non-application profile; the startup sync check;
skill copies for cloud sessions; relay on "let's continue". Closed issues #6 and #7.

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

### 2026-11-13 — v4 phases 1 to 3: the fold, the split, the profiles, two evals

Commits `37ed966` to the head of `claude/new-project-mockup-zp2h2z`, pushed. That branch is
a working branch; nothing reached `main`.

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

The shell-write hook refused a real `node -e` from the agent in this Windows session, its
first refusal outside `tests/run.mjs`.

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

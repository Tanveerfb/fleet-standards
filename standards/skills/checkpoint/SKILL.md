---
name: checkpoint
description: Use when wrapping up a work session — e.g. "checkpoint", "let's checkpoint", "git checkpoint", "checkpoint MAX", "git checkpoint max", "wrap up for today", "save state before I go", "end of session", "git CPR", "git CPR max". Brings the project's status doc, README and other docs, and its Trello board (if any) current; offers skill improvements and new skills for repeated workflows; then handles git per project-rules §GIT. "git" = commit and push without asking; "MAX" = exhaustive, claim-by-claim verification; "CPR" = checkpoint, then release (multi-branch projects, or single-branch in a cloud session). Ends by asking whether to compact and continue. The goal is a next session that picks up with nothing missing and nothing assumed.
---

# Checkpoint

> **Outside Claude Code** (Codex, Copilot, Cursor, Gemini CLI): this skill is written in
> Claude Code's terms; map them to your own. If `${CLAUDE_PLUGIN_ROOT}` appears unsubstituted
> anywhere below, the standard's files are in `~/.agents/fleet/` instead. "The question tool"
> means your own ask-the-user tool, or a short question with numbered options in plain text.
> Named MCP tools (`mcp__github__*`, `mcp__Trello__*`) mean whatever GitHub or Trello
> integration you have — an MCP server, `gh` — and with none, say so and skip that step.
> Never skip a step silently because a Claude-specific name did not match.

## Invocation modes

Two independent dials. Read the user's exact words and set both before starting.

**The `git` prefix — commit and push authorization.**

| Phrase | Git behaviour |
| --- | --- |
| `checkpoint`, `let's checkpoint`, `wrap up`, `end of session` | Do Steps 1–3, then **ask** whether to commit, and ask separately whether to push. |
| **`git checkpoint`** | **Commit and push. Both already authorized — do not ask for either.** |

Saying "git checkpoint" IS the user calling the commit. Draft the message in the repo's house
style, commit, push, and report the hash and the ref range. Do not stop midway to confirm. You
still stop for the real safety cases: a secret in the staged diff, an unexpectedly dirty tree
containing work that isn't yours, a detached HEAD, or a push that would need a force. Those are
worth a sentence; a routine push is not.

If the repo auto-deploys from the pushed branch, say so in the confirmation — the user should
never learn from somewhere else that a checkpoint shipped to production.

**On a multi-branch project** (`project-rules.md` §GIT, declared on the *Deploys* line of
`CLAUDE.md`), the working branch is already authorised: `checkpoint` and `git checkpoint`
both commit and push it, without asking. The production branch still changes only on
`git CPR`. If the *Deploys* line does not say single-branch or multi-branch, treat the
project as single-branch, ask once, and write the answer into that line.

**The `MAX` suffix — depth.**

| Phrase | Depth |
| --- | --- |
| `checkpoint`, `git checkpoint` | Standard. Steps 1–5 as written. |
| **`checkpoint MAX`**, **`git checkpoint max`** | **Exhaustive.** Steps 1–5 *plus* the MAX protocol below, which is mandatory, not a suggestion. |

The dials combine. `checkpoint max` = exhaustive, then ask about git. `git checkpoint max` =
exhaustive, then commit and push.

**`CPR` — CheckPoint and Release. Multi-branch projects, and single-branch projects in a
cloud session.**

| Phrase | Behaviour |
| --- | --- |
| **`git CPR`** | `git checkpoint` to the working branch, **then the project's release** — both pre-authorized. |
| **`git CPR max`** | `git checkpoint max`, then the release. |
| `CPR` (no `git`) | Checkpoint, then **ask** before commit, push and release — each separately. |

Applies **only where the project works on a branch that is released to a production branch**
(e.g. work on a `dev` branch, release = squash PR into `master`). The project's own
`CLAUDE.md` defines what "release" means there — follow it exactly, don't improvise one. On a
single-branch project there is nothing to release: **say so and stop after the checkpoint**,
rather than inventing a release step.

**Except in a cloud session** (§GIT, *Cloud sessions*). There the checkpoint lands on the
harness branch, so the release is a **fast-forward of the main branch to it**:
`git push origin HEAD:<main branch>`, with the branch named from the *Deploys* line, never
computed. Fetch it (`git fetch origin <main branch>`), then check
`git merge-base --is-ancestor origin/<main branch> HEAD`; if that fails,
the main branch has moved on — stop and ask (merge, or a pull request), and never force. If
the push itself is refused (branch protection, or the harness blocks it), say so and offer a
pull request. The confirmation says the main branch moved, and whether anything deploys from
it.

**Name the release target explicitly** — `git push origin HEAD:main`, a pull request into
the named branch, or the release command in `CLAUDE.md`. Never compute it from `origin/HEAD`
or any other ref a shallow or fresh clone may lack: a computed target once created a stray
remote branch literally named `HEAD`.

Order is fixed: the checkpoint's commit and push land first, then the release ships them.
If the checkpoint stops for a safety case, the release does not happen. The confirmation says
plainly that **production is updating** — a CPR is a production deploy.

## Overview

A checkpoint has three layers, done in order:

1. **The deep doc** — the project's living record, in two files with two jobs
   (`project-rules.md` §DOCS): the **snapshot**, `docs/STATUS.md` (what is true right now,
   rewritten every checkpoint), opening with a **Start here** block; and the **session log**,
   `docs/log.md` (what happened, newest first), which nothing loads by default.
   Alongside them, **the project's own documentation** — README and the rest — brought current
   for what the session changed (Step 2.5).
2. **The Trello board** (Step 3.5, only if the project's `CLAUDE.md` names one) — mirror the
   snapshot onto it.
3. **Git** (if applicable) — get the actual history current, or explicitly confirm there's nothing
   to commit / it's not a repo.
4. **The pause** (Step 6) — one question: approve any skill proposals or showcase update,
   and choose to compact and continue, compact and stop, or keep going. The moment the doc
   and git are current is the moment the conversation becomes safe to shed; whether to shed
   it is the owner's call.

There is deliberately no separate terse handoff file. A handoff kept outside the deep doc drifts
from it, and a handoff kept outside version control isn't there when someone needs it — the
`Start here` block does that job from inside the document that git already carries.

## Step 1 — Figure out what actually happened this session

Before writing anything, reconstruct the session's real shape from your own context:

- What was the starting state / what was asked for?
- What decisions were made, and *why* (not just what) — especially any pivot, reversal, or
  abandoned approach. Future-you cannot infer "why we didn't do X" from silence; write it down.
- What got built/changed/fixed, concretely — file paths, command names, config keys, whatever is
  specific to this project's domain (this is not always a codebase — it might be app config, a
  document, infra, anything).
- What was explicitly decided *against* or dropped mid-session (users often redirect scope live —
  those redirections are exactly the kind of thing that gets silently redone by a future session
  that doesn't know about them).
- What is untested / unverified / assumed. Be honest about this — a checkpoint that overclaims
  confidence is worse than one that flags uncertainty.
- Any non-obvious gotcha, constraint, or user preference surfaced this session that isn't already
  written down somewhere durable (CLAUDE.md, existing docs).

## Step 1.5 — Improve the project's skills, and propose new ones

Two halves: improve the project skills this session used, and look for a workflow that
deserves a skill of its own. **Both are proposals — the owner decides.** This matters most
in projects without application code (`project-rules.md` §SCOPE), where most of the work is
procedure — publishing, record-keeping, tenant changes — and a skill is how a procedure stops
being rediscovered.

**Never edit the fleet's own skills here.** In a synced project, `.claude/skills/` also holds
copies of the fleet skills (`checkpoint`, `relay`, `sync-standards`, `design-motif`,
`ai-setup`, `propose-standard`; `.claude/fleet/README.md` marks a synced project). The next
sync overwrites them and flags any edit as tampering. An improvement to one of those goes back
to the master through `propose-standard`, and is offered as that.

### 1.5a — Improve the project skills used this session

Check whether this project has `.claude/skills/` (project-scoped, distinct from this global
`checkpoint` skill itself). If it does, and any of its own skills were actually read or
followed this session, look for what the session taught that the skill does not yet say:

- **A documented warning got hit anyway.** If a skill already said "don't do X" and X got done
  anyway this session (buried mid-paragraph, easy to skim past, wrong section), that's a skill
  authoring bug, not just a one-off mistake. Move the warning earlier, bold it, restructure so the
  next reader can't miss it.
- **A step turned out unreliable, slower, or wrong** in a way the skill didn't warn about —
  the correction belongs in the skill, not only in chat or git history.
- **Something worked well or faster than the documented path** — a selector that held up, a
  shortcut that skipped a round trip, a verification method proven trustworthy. Add it. Skills
  that only accumulate warnings and never bank wins get conservative and slow over time; this
  half is easy to skip and shouldn't be.

This is the whole point of splitting workflows into project skills in the first place: stop
paying the same token cost twice for a mistake or a lesson already learned once. A skill nobody
edits after the session that proved it wrong or wasteful isn't doing that job.

### 1.5b — Look for a workflow that deserves a new skill

Propose a new skill **only when a multi-step procedure was done twice** — in this session, or
again after an earlier session did it — **or had to be worked out again because nothing
recorded it.** A procedure done once is a note in the status doc, not a skill. **At most one
new skill per checkpoint**: the clearest case wins, and the runner-up waits for next time.

Before proposing, read `decisions.md`: **a skill the owner already declined is not proposed
again** unless the work has changed in a way the declined entry did not foresee.

Where it lives:

- **Project-scoped by default** — `.claude/skills/<name>/SKILL.md`. It travels with the repo
  and loads in cloud sessions
- **Useful to every project?** It belongs in the fleet standard: offer `propose-standard`
  instead of writing a local copy that will drift
- **User-scoped** (`~/.claude/skills/`) only for a personal habit that fits no repository.
  Say that user skills do not load in cloud sessions

### 1.5c — Put it to the owner, then do it in this checkpoint

Every proposal from 1.5a and 1.5b goes into **Step 6's question** — one multi-select, each
option naming the skill and the change in a line — so the checkpoint asks the owner once,
after the docs and git are safe. Note the proposals now, while the session is fresh.

- **Approved improvements** are made in place
- **An approved new skill is written in this checkpoint**, not deferred — the session that
  did the work is the one that knows it. Follow the house shape of the project's other skills,
  or the fleet skills when there are none: a `description` with the phrases that should
  trigger it, then the steps, then the traps. Name it in `CLAUDE.md` where the project lists
  its skills
- **A declined new skill** gets a one-line `decisions.md` entry — the idea, and that the owner
  declined it — so no later checkpoint proposes it again

Approved changes are committed as Step 6 says. If there is nothing that meets the bar, Step
6 leaves the question out — don't manufacture something to improve or create.

## Step 2 — Write/update the deep documentation

**Location:** detect the project's existing convention first — an existing `docs/STATUS.md`,
`README.md` "Status" section, `CHANGELOG.md`, `PROJECT.md`, whatever's already there and clearly
serves this purpose. Update it in place, don't fork a second doc. If nothing like this exists,
create `docs/STATUS.md` at the project root.

**If the doc already exists, read the whole snapshot first.** A checkpoint updates it and
extends the log — it does not lose history. Keep sections that are still true; revise
sections that changed; add new sections for new ground covered.

**Two files, and they are maintained differently** (`project-rules.md` §DOCS).

- The **snapshot** (`docs/STATUS.md`) is *rewritten in place* every checkpoint. Its job is to
  be current, not complete: `Start here` and one current-state block, never a stack of them.
  If a line in it is no longer true, it is corrected or cut — never appended below, never
  kept as a "was".
- The **session log** (`docs/log.md`) is append-at-top, newest first. Its job is history, and
  nothing loads it by default. This checkpoint's entry goes there: superseded numbers,
  measurements and the owner's quotes with it.

**A status doc that still holds its session log** (written before the standard split them) is
split in this checkpoint: move the log, verbatim, into `docs/log.md`, newest first, and leave
the pointer line from `templates/STATUS.template.md` in its place. Stacked "still true"
blocks from earlier checkpoints go the same way, into the log entry of the checkpoint that
wrote them. Say in Step 5 that the log moved. Relocation, never summarising.

**The briefs follow the same rule.** `CLAUDE.md` and its area files hold what is true now.
When this checkpoint replaces a line in one, the old line moves, word for word, under the
same heading in `docs/record/<area>.md` (`docs/record/root.md` for the root file) in the same
pass: a brief never gains a "was", a record never loses a line.

**Fold before you append.** History belongs in the record; it does not belong in the reader's way.

1. **Mark what died.** Before writing the new entry, check whether this session *deleted or
   replaced* anything an older log entry describes. If so, add `**RETIRED — <what replaced it>,
   commit <hash>**` as the first line of that entry. An entry that documents a system which no
   longer exists, without saying so, is actively misleading — it reads exactly like an entry that
   still applies.
2. **Fold when the log passes ~800 lines.** Move the oldest session-log entries into
   `docs/archive/log-<YYYY-MM>.md` (create the directory), oldest first, until the log
   is back under the line. Retired entries go first regardless of age.
3. **Leave a stub.** Each folded entry leaves one line in the log: date, one-clause subject,
   and a link to the archive file. A reader must be able to find folded history without knowing
   it exists.
4. **Folding is relocation, never deletion.** Nothing is dropped, summarized away, or rewritten on
   its way to the archive — it moves verbatim. The reason this rule exists is that the opposite
   instruction ("length is fine, completeness beats tidiness") let one project's status doc reach
   2,700 lines, most of it describing deleted systems, which cost every later session real reading
   time and taught several of them things that were no longer true.

**Content to cover** (adapt headings to the project, but hit all of these):

- **What this project is** — one paragraph, in case the reader has zero prior context.
- **Current state** — what exists right now, concretely. For a codebase: what's built, where.
  For non-code work: what config/content/state exists and where it lives (it may not be files in
  this repo at all — e.g. a running app's own data store, a cloud dashboard, a third-party
  service).
- **Decisions and why** — every meaningful choice, especially reversals or abandoned approaches.
  Include *what was tried and didn't work*, not just what succeeded — this is the single most
  valuable thing for preventing a future session from re-treading dead ends.
- **Explicit deviations from any spec/plan the user gave** — anything you or the user changed
  from an original ask, flagged clearly so it doesn't read as an oversight later.
- **Open items / recommended next steps**, priority-ordered.
- **Anything untested or unverified**, named plainly.

Write it so a reader with *zero* memory of this session — not even the general shape of it —
comes away able to act correctly. Don't assume they'll re-derive intent from file diffs.

## Step 2.5 — Bring the project's own documentation current

The status doc records the session; the project's documentation describes the project. Both
must be true when the checkpoint lands. **This matters most when the checkpoint pushes** —
`git checkpoint` and `git CPR` publish the repo, and its README is the first thing a visitor,
a collaborator or the next session reads. A pushed feature with a README still describing
last month's app is a stale document shipped on purpose.

Check every document this session's changes touched, and update what the session made
untrue or incomplete:

- **`README.md`** — what the project is and does, its features, setup and install steps,
  commands and scripts, environment variables, deployment, screenshots. A new feature, a new
  script, a renamed command, a new env var, a changed setup step: each one is a README change.
- **`CLAUDE.md`** and any area `CLAUDE.md` files — commands, the technology table, the
  `Deploys`, `Trello board` and `Motif` lines, traps found this session. A replaced line
  moves to `docs/record/` (Step 2); it is not kept beside the new one.
- **`decisions.md`** — the session's choices appended, and its "declined, never again" index
  at the top gaining a line for anything the owner ruled out.
- **`components.md`**, **`docs/architecture.md`**, **`data-model.md`**, **`environment.md`**
  and **`.env.example`** — where the session added, moved or removed what they list.
- **`docs/specs/`** — status lines (Step 3.5 covers the cards).
- **A `CHANGELOG.md`**, if the project keeps one — an entry for what shipped.
- Any other document the project keeps that the session's changes made untrue.

Rules:

- **Update what changed; don't rewrite what didn't.** A checkpoint corrects and extends docs —
  it does not restyle a README the owner wrote.
- **Every claim checked against the repo.** A command in the README exists in
  `package.json`; a path exists; a setup step works as written. A README that tells someone
  to run a script that was renamed is worse than one that says nothing.
- **Copy the business owns is drafted, not applied** (§OWNER). A product or marketing
  README, or user-facing text, gets a proposed change shown to the owner; technical sections
  are updated directly.
- **No documentation change is a valid outcome** — say so in Step 5 rather than inventing an
  edit. But on a checkpoint that pushes new features, "no README change" is the claim to
  double-check, not to assume.

## Step 3 — Write the `Start here` block

The first thing in the deep doc, above everything else, rewritten every checkpoint. Under 15
lines. It is what a cold session reads in its first ten seconds, so it carries only what changes
what that session does next:

```markdown
## Start here

**State:** <one or two sentences — where the project actually is>
**Next:** <the single most useful next action, concrete enough to start on>
**Blocked on:** <what needs the user, or "nothing">
**Don't trust:** <anything in this doc that is assumed rather than verified>
**Live:** <state outside the repo a fresh session needs: where the owner is, how they are working
(e.g. on a phone: drafts as artifacts, short replies), what is mid-flight; or "nothing">
```

Rules that make it worth reading:

- **Live is what a compact used to carry.** After a compact the fleet's `SessionStart` hook
  has the session run relay, which reads it. Only what is temporary goes there; a standing
  rule of the owner's goes into `CLAUDE.md`, which reloads on its own.
- **Overwrite it, never append to it.** A `Start here` with a history in it is not a `Start here`.
- **It indexes, it doesn't duplicate.** Point at sections of the doc by heading rather than
  restating them; two copies of the same fact drift.
- **It names one next action, not a list.** A priority-ordered backlog belongs in "Open items".

Some environments inject a `=== HANDOFF ===` block naming a scratch path for handoff notes. That
is a separate plugin's file, outside version control on most setups — it is not this step's
output, and writing there instead of into the deep doc loses the handoff.

## Step 3.5 — Mirror to the Trello board, if the project has one

**Only if the project's `CLAUDE.md` has a `Trello board: <url>` line** (`project-rules.md`
§TRELLO). No line, or `none`: skip this step silently. Never search Trello for a board that
might match, and never create one.

This step runs on **every** checkpoint, with or without the `git` prefix — the board is not
git, and updating it is part of the documentation pass. Use the Trello MCP tools
(`mcp__Trello__*`; load them with ToolSearch if they are deferred). If they are unavailable,
say so in Step 5 and carry on — a missing connector never blocks the git step.

**`docs/STATUS.md` is the record and the board mirrors it.** Read the board's lists and
cards first, then reconcile against the snapshot you just wrote:

1. **Match by link, not title.** An open item with a card carries the card's URL in
   `STATUS.md`. Items without a link have no card yet.
2. **Create a card for each new open item** in the list matching its state, and write the
   card's link back into the item in `STATUS.md` — the doc and the board stay cross-linked.
3. **Move cards between lists** to match the snapshot. Lists are Backlog / To do / Doing /
   Review / Done unless `CLAUDE.md` names others. Finished but unverified, or waiting on the
   owner → **Review**. **Done** only for work the snapshot records as verified.
4. **Tick checklist items** whose work this session verified. Never tick on intent.
5. **Correct the board where it disagrees with the snapshot**, and list every correction for
   Step 5 — a card the owner moved by hand is a signal worth surfacing, not just overwriting
   silently.

Never delete or archive a card. Never write anything that is not true in `STATUS.md`.

**Architecture map and area files** (`project-rules.md` §SCALE): if this session added,
moved or removed a module, update `docs/architecture.md`; if it found a rule or trap that
belongs to one area, put it in that folder's `CLAUDE.md`, not the root one.

**Spec files** (`docs/specs/`, `project-rules.md` §SPECS): if this session built or advanced
work from a spec, update its status line — `in progress`, or `built` once its done-means
criteria are verified. On a project with a board, the spec's status line links its card, so
move the card to match; without a board, the status word in the spec is the whole record.
This applies on every checkpoint, board or not.

## Step 4 — Git, if applicable

Check whether this is a git repository:

```bash
git rev-parse --is-inside-work-tree 2>&1
```

**If not a repo:** say so plainly in your final summary to the user ("not a git repo, nothing to
commit") and stop here. Do not suggest `git init` unless the user asks — that's their call, not
implied by running a checkpoint.

**If it is a repo:**

```bash
git status -sb
git diff --stat
git diff --stat --cached
```

Show the user what's uncommitted (working tree + staged) and, if there's an upstream, what's
ahead/behind. **A config file its own tool rewrote** (an engine, an IDE, a build tool) can
carry noise and a real change in the same diff: read the diff, compare the settings, and
restore only the noise. Never a blind `git checkout -- <file>`. Draft the commit message from the session's actual changes in the repo's own
conventions — read `git log` for the house style first, and match its length and voice rather
than defaulting to a one-liner.

Then branch on the invocation mode:

- **Plain `checkpoint`:** **ask** whether to commit. If yes, ask separately whether to push.
  Never push without an explicit yes. If the user says no to committing, that's a valid answer —
  note in your summary that changes are left uncommitted, and don't push back.
- **`git checkpoint`:** commit and push. Both are already authorized by the phrasing; asking
  again is the failure mode here, not a courtesy.
- **Multi-branch project, either phrase:** commit and push the working branch without asking
  (§GIT). Nothing reaches the production branch except through `git CPR`.
- **Local only** (the *Deploys* line says so; the repo has no remote by decision): commit as
  above, then stop. There is no push to ask about or attempt, and never add a remote unasked.

Either way, follow the standard git safety rules: a new commit (don't amend unless asked), no
`--no-verify`, and review the staged diff for anything resembling a credential before committing.

## Step 5 — Confirm

Tell the user, briefly:

- Paths to the snapshot and the log (created or updated), and whether a session log or a
  replaced line moved out of a file agents read, and where to.
- Project documentation updated in Step 2.5 — each file and what changed in it — any owner
  copy drafted for approval, or "no documentation change needed" and why.
- Anything folded to the archive this pass, with the archive path — the user should know when
  history moved, and where to.
- Trello: cards created, moved and ticked, plus any correction where the board disagreed with
  the doc — or "no board", or "Trello tools unavailable".
- Git outcome: committed+pushed (with the hash and ref range) / committed only / left
  uncommitted / not a repo. Mention a triggered deploy if the branch auto-builds.
Keep this confirmation short — the checkpoint's value is in the files it wrote, not in a long
chat summary repeating them.

Then do Step 6, which is part of every checkpoint.

## Step 6 — Pause: one question, then do what it decides

A checkpoint is a pause point. The docs and git are current, so the conversation is now safe
to shed — but whether to shed it now is the owner's call: the agent cannot see how full its
context window is, and the owner can (`/context`, or the app's context indicator).

**Ask once, in one question tool call**, every question below that applies:

1. **Skill proposals** — only if Step 1.5 found any: a multi-select, each option naming the
   skill and the change in a line.
2. **Showcase update** — only if `CLAUDE.md`'s `Studio showcase:` line says yes **and** this
   checkpoint recorded a phase done or a notable verified feature: file an update request on
   the studio site's repository (§CREDIT)? Say in a line what it would report.
3. **What next?**
   - **Compact, then continue** — compact now and carry on with the next task in a fresh
     window.
   - **Compact and stop here** — the session ends at this checkpoint.
   - **Keep going, compact later** — there is room for another task first.

Recommend an option for 3, and say what the recommendation rests on: you cannot measure
the window, so judge from what you can see — a long session, many large outputs (screenshots,
logs, file reads), a phase just closed — and suggest the owner checks `/context` when unsure.
A phase boundary is the usual moment to recommend *Compact, then continue*.

Then act on the answers, and report in a line or two what was done:

- **Approved skill changes are made now** (1.5c); a declined new skill gets its
  `decisions.md` line.
- **An approved showcase update is filed as §CREDIT says** — an issue on the studio site's
  repository, its link in `decisions.md`; if this session cannot reach that repository, the
  request is written in full as an open item in `docs/STATUS.md`, and you say so.
- **Those changes are committed under the answer Step 4 already had** — one follow-up commit,
  pushed if Step 4 pushed, committed only if Step 4 only committed, left uncommitted (and said
  so) if the owner declined. A release is not repeated: after a `git CPR`, say the follow-up
  commit is on the branch Step 4 used and ships with the next release.
- **On either compact answer**, tell the owner in one line that a plain `/compact` is enough,
  and why (below).

### No compact block

**A plain `/compact` is enough.** The fleet's `SessionStart` hook (matcher `compact|resume`)
tells the next session to run relay, and relay reads `Start here` with its **Live** line. So
before the pause, make sure of two things:

- **Live holds everything that is not on disk**: live state outside the repo (seeded test
  data in a production database, a deployment serving a stale build), what is mid-flight and
  its next concrete action, and what is believed but *un*verified — kept apart from what was
  checked, because a summariser flattens that distinction.
- **Every new standing rule of the owner's is in `CLAUDE.md`** — "never commit on your own
  initiative", "don't touch X without asking". It reloads on its own; Live is overwritten at
  the next checkpoint.

If Step 6 changed either file, that is part of its follow-up commit.

If the owner asks for compact instructions anyway, give one line: `/compact`, plus only what
is new since the checkpoint. Never a block restating the status doc.

Never run `/compact` yourself, and never assume the owner will. It is their call.

## MAX protocol

Runs only for `checkpoint MAX` / `git checkpoint max`. Standard mode reconstructs the session
from your own context, which is exactly where hallucination and quiet omission enter. MAX
replaces recollection with verification. Everything below is required.

**M1. Rebuild the session from artifacts, not memory.** Before writing a word, read the ground
truth: `git log --stat` since the last checkpoint commit, `git diff` for anything uncommitted,
and the current contents of the docs you're about to update. Your memory of the session tells
you *why*; the artifacts tell you *what*. Where they disagree, the artifacts win and the
disagreement itself is worth recording.

**M2. Verify every concrete claim before you write it.** Any file path, function name, symbol,
config key, command, version, count, or number that goes into the doc gets checked against the
repo in this session. A path you're confident about is exactly the kind you get wrong. If a
claim can't be verified, either cut it or mark it explicitly as unverified — never let an
unchecked assertion sit in the doc in the same voice as a checked one.

**M3. Sweep the whole doc for staleness, don't just append.** Read the existing deep doc end to
end and fix anything the session made untrue, including in sections you didn't otherwise touch.
A checkpoint that appends a correct new section below a now-wrong old one has made the document
worse. When you correct a claim, say what it said before and why it was wrong — a future
session that encounters the old claim elsewhere needs to recognize it as retired.

**M4. Run the project's verification and record the real output.** Tests, typecheck, lint,
build — whatever this project actually uses. Write down what ran and what it said. If something
fails, that failure goes in the doc; a green claim you didn't verify is worse than an honest
red one. If verification can't run, record why.

**M5. Write the negative space.** These are the parts a future session cannot recover and will
otherwise redo:
- What was tried and abandoned, and *why* it didn't work.
- What the user explicitly declined or ruled out, in their own words where you have them.
- What was deliberately deferred, and to when or to what condition.
- What is out of scope by decision rather than by oversight.
- Open questions you raised that the user hasn't answered yet.

**M6. Add a "Confidence and gaps" section.** Name plainly: what is verified, what is assumed,
what is untested, and what you'd check first if you came back cold. This section is what stops
the next session from treating the whole document as equally solid.

**M7. Capture durable user preferences.** Any constraint, working-style rule, or ruling the
user gave this session that isn't already written somewhere permanent goes into the project's
durable location (CLAUDE.md, AGENTS.md, a rulings ledger, the deep doc) — not only into the
`Start here` block, which is overwritten next checkpoint by design.

**M8. Cross-link doc and commit.** The deep doc names the commit hash; the commit message
reflects what the doc says. A session landing on either can reach the other.

**M9. Verify the fold, don't just do it.** After folding, confirm the archive file contains the
moved entries verbatim and the log's stubs point at paths that exist. The same check covers a
session log moved out of the status doc and a line moved to `docs/record/`. A fold that loses an
entry is the one failure mode of this whole step, and it fails silently.

**M10. Verify the board after writing it.** Where Step 3.5 ran, re-read the board and
confirm every card the snapshot links exists, sits in the list the snapshot implies, and every
new card's link was written back into `STATUS.md`.

**M11. Verify the project docs claim by claim.** Every command, script, path, env var and setup
step in the README and `CLAUDE.md` checked against the repo now — not only the lines this
session touched. A MAX checkpoint that pushes leaves no stale instruction in the README.

## Common mistakes

- Pushing a new feature with a README that still describes the app before it. On a
  `git checkpoint` or `git CPR`, the README ships with the code.

- Searching Trello for a board because the project "probably has one". No `Trello board:`
  line in `CLAUDE.md` means no Trello work.
- Moving a card to Done because the code was written. Done means verified; finished but
  unverified is Review.
- Writing the deep doc *after* asking about git, so a "no, don't commit yet" answer leaves docs
  updated but uncommitted with no clear note of that — always doc → `Start here` → git, in that order,
  so the git step naturally includes the doc updates in what it offers to commit.
- Treating the `Start here` block as sufficient on its own. It is deliberately lossy (under 15
  lines). If Step 2 is skipped, real information is lost, not just deferred.
- Restating the doc's content inside `Start here` instead of pointing at headings — two sources of
  truth that will drift.
- Appending a correct new session-log entry above an old one that describes a system this session
  deleted, without marking the old one RETIRED. The doc now contradicts itself and gives no way to
  tell which half is current.
- Folding by summarizing. The archive gets the entry verbatim or the fold has destroyed evidence.
- Assuming a project is code just because most projects are. Some projects (like a streaming-app
  config rebuild, a document, an infra change) have no meaningful git diff at all — the "current
  state" lives somewhere else entirely. Document *that* location precisely.
- Skipping the "what was tried and abandoned" content because it feels like noise. It's the
  opposite of noise — it's the exact information that prevents a future session from burning time
  re-discovering a dead end you already found.
- Asking "want me to commit?" after the user said **git checkpoint**. They already answered.
  Asking again reads as not having listened.
- Ending the checkpoint without the Step 6 question, or printing a compact block. The owner
  decides whether the session stops here; a plain `/compact` is all they need.
- Asking Step 6's questions in several prompts. One call holds them all; questions that do
  not apply are left out, not asked as "none".
- Leaving live state only in the conversation: if it is not in **Live** or `CLAUDE.md`, the
  compact loses it.
- Reverting a tool-rewritten config without reading its diff. An engine, IDE or build tool
  may have rewritten the file and also carry a real change. Read the diff, compare the
  settings, and restore only the noise. Never a blind `git checkout -- <file>`.
- Writing this checkpoint's log entry into `docs/STATUS.md`, or leaving a "was" in a brief.
  History goes to `docs/log.md` and `docs/record/`; the files agents read hold what is true
  now.
- `git CPR` on a single-branch project in a cloud session ending at "nothing to release". The
  harness branch is the working branch there; the release fast-forwards the main branch.
- Treating **MAX** as "write more words". Length is not the dial — verification is. A shorter
  document where every claim was checked beats a longer one padded with confident recollection.
- Skipping M4 because the suite was green earlier in the session. "Earlier" isn't now, and the
  checkpoint's own doc edits may have been the thing that broke it.
- Letting a verified claim and an assumed one sit in the same voice. If you didn't check it,
  the document has to say so.

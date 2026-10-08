---
name: checkpoint
description: Use when wrapping up a work session and you want documentation, handoff notes, and git all brought current in one pass — e.g. "checkpoint", "let's checkpoint", "git checkpoint", "checkpoint MAX", "git checkpoint max", "wrap up for today", "save state before I go", "end of session", "git CPR", "git CPR max" (checkpoint then release, multi-branch projects only). Produces one living project doc — a current snapshot over a folded session history — mirrors it to the project's Trello board if CLAUDE.md names one, then handles git. The "git" prefix means commit AND push without asking; "MAX" means an exhaustive, claim-by-claim verified checkpoint. Goal: the next session (possibly a different one, possibly weeks later) can pick up with zero missing knowledge and zero hallucinated assumptions.
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

**The `MAX` suffix — depth.**

| Phrase | Depth |
| --- | --- |
| `checkpoint`, `git checkpoint` | Standard. Steps 1–5 as written. |
| **`checkpoint MAX`**, **`git checkpoint max`** | **Exhaustive.** Steps 1–5 *plus* the MAX protocol below, which is mandatory, not a suggestion. |

The dials combine. `checkpoint max` = exhaustive, then ask about git. `git checkpoint max` =
exhaustive, then commit and push.

**`CPR` — CheckPoint and Release. Multi-branch projects only.**

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

Order is fixed: the checkpoint's commit and push land first, then the release ships them.
If the checkpoint stops for a safety case, the release does not happen. The confirmation says
plainly that **production is updating** — a CPR is a production deploy.

## Overview

A checkpoint has three layers, done in order:

1. **The deep doc** — the project's living record. It has two zones: a **snapshot** at the top
   (what is true right now, rewritten every checkpoint) opening with a **Start here** block, and a
   **session log** below it (what happened, newest first). One artifact, two jobs.
2. **The Trello board** (Step 3.5, only if the project's `CLAUDE.md` names one) — mirror the
   snapshot onto it.
3. **Git** (if applicable) — get the actual history current, or explicitly confirm there's nothing
   to commit / it's not a repo.
4. **The compact instructions** (Step 6) — a copy-pasteable block naming what this session's
   context holds that the files do *not*. Written every time, because the moment the doc and git
   are current is exactly the moment the conversation becomes safe to shed.

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

## Step 1.5 — Self-improve any project skills used this session

Check whether this project has `.claude/skills/` (project-scoped, distinct from this global
`checkpoint` skill itself). If it does, and any of those skills were actually read/followed this
session, don't just document what happened at the CLAUDE.md/doc layer — go back into the skill
files themselves and fix them:

- **A documented warning got hit anyway.** If a skill already said "don't do X" and X got done
  anyway this session (buried mid-paragraph, easy to skim past, wrong section), that's a skill
  authoring bug, not just a one-off mistake. Move the warning earlier, bold it, restructure so the
  next reader can't miss it.
- **A step turned out unreliable, slower, or wrong** in a way the skill didn't warn about —
  correct it in place rather than letting the session's fix live only in chat/git history.
- **Something worked well or faster than the documented path** — a selector that held up, a
  shortcut that skipped a round trip, a verification method proven trustworthy. Add it. Skills
  that only accumulate warnings and never bank wins get conservative and slow over time; this
  half is easy to skip and shouldn't be.

This is the whole point of splitting workflows into project skills in the first place: stop
paying the same token cost twice for a mistake or a lesson already learned once. A skill nobody
edits after the session that proved it wrong or wasteful isn't doing that job. Fold these edits
into the same commit as everything else in Step 4 rather than deferring to a separate pass —
the session is still fresh in context now, it won't be next time.

If the project has no `.claude/skills/` directory, or none were touched this session, skip this
step silently — don't manufacture something to improve.

## Step 2 — Write/update the deep documentation

**Location:** detect the project's existing convention first — an existing `docs/STATUS.md`,
`README.md` "Status" section, `CHANGELOG.md`, `PROJECT.md`, whatever's already there and clearly
serves this purpose. Update it in place, don't fork a second doc. If nothing like this exists,
create `docs/STATUS.md` at the project root.

**If the doc already exists, read the whole thing first.** A checkpoint updates and extends it —
it does not overwrite history. Keep sections that are still true; revise sections that changed;
add new sections for new ground covered.

**Two zones, and they are maintained differently.**

- The **snapshot** (top) is *rewritten in place* every checkpoint. Its job is to be current, not
  complete. If a line in it is no longer true, it is corrected or cut — never appended below.
- The **session log** (below) is append-at-top, newest first. Its job is history.

**Fold before you append.** History belongs in the record; it does not belong in the reader's way.

1. **Mark what died.** Before writing the new entry, check whether this session *deleted or
   replaced* anything an older log entry describes. If so, add `**RETIRED — <what replaced it>,
   commit <hash>**` as the first line of that entry. An entry that documents a system which no
   longer exists, without saying so, is actively misleading — it reads exactly like an entry that
   still applies.
2. **Fold when the doc passes ~800 lines.** Move the oldest session-log entries into
   `docs/archive/<DOCNAME>-<YYYY-MM>.md` (create the directory), oldest first, until the live doc
   is back under the line. Retired entries go first regardless of age.
3. **Leave a stub.** Each folded entry leaves one line in the live doc: date, one-clause subject,
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
```

Rules that make it worth reading:

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
ahead/behind. Draft the commit message from the session's actual changes in the repo's own
conventions — read `git log` for the house style first, and match its length and voice rather
than defaulting to a one-liner.

Then branch on the invocation mode:

- **Plain `checkpoint`:** **ask** whether to commit. If yes, ask separately whether to push.
  Never push without an explicit yes. If the user says no to committing, that's a valid answer —
  note in your summary that changes are left uncommitted, and don't push back.
- **`git checkpoint`:** commit and push. Both are already authorized by the phrasing; asking
  again is the failure mode here, not a courtesy.

Either way, follow the standard git safety rules: a new commit (don't amend unless asked), no
`--no-verify`, and review the staged diff for anything resembling a credential before committing.

## Step 5 — Confirm

Tell the user, briefly:

- Path to the deep doc (created or updated).
- Any project skill files edited during Step 1.5, with a one-line reason each.
- Anything folded to the archive this pass, with the archive path — the user should know when
  history moved, and where to.
- Trello: cards created, moved and ticked, plus any correction where the board disagreed with
  the doc — or "no board", or "Trello tools unavailable".
- Git outcome: committed+pushed (with the hash and ref range) / committed only / left
  uncommitted / not a repo. Mention a triggered deploy if the branch auto-builds.
Keep this confirmation short — the checkpoint's value is in the files it wrote, not in a long
chat summary repeating them.

Then do Step 6, which is part of every checkpoint.

## Step 6 — Emit the compact instructions

**Always end a checkpoint by writing out a compact instruction block.** Not a note that the user
*could* compact — the actual text, in a fenced block they can copy straight into `/compact`. A
checkpoint is precisely the moment a session becomes safe to shed, and you are the only one who
knows which parts of this context the deep doc did *not* capture.

**The one rule that makes these worth anything: preserve only what is NOT on disk.** Everything
written to the deep doc, CLAUDE.md, the spec files and project memory is already durable — telling
the summariser to keep it burns the budget on facts a cold session can simply read. The failure
mode is a compact block that restates the status doc. Point at the files instead.

What actually belongs in it:

- **Standing user constraints**, verbatim where the wording matters — "never commit or push on
  your own initiative", "don't touch X without asking". These are behavioural, and they live
  nowhere a file lookup would surface at the right moment.
- **Live state outside the repo** that reading the code would never reveal: seeded test data
  sitting in a production database, a deployment serving a stale build, a service configured but
  unreachable.
- **What this session verified but has not yet written down**, and — separately — what is believed
  but explicitly *un*verified. A summariser will otherwise flatten that distinction, and the next
  session will treat a guess as established fact.
- **Whatever is mid-flight**: the task in progress and the next concrete action.

End the block by naming the files that hold everything else, with an instruction to summarise the
rest aggressively rather than re-deriving project state.

Keep it short. A compact block over fifteen lines is almost always restating the doc.

Do not run `/compact` yourself and do not assume the user will. Emitting the block is Step 6's
job; using it is their call.

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
moved entries verbatim and the live doc's stubs point at paths that exist. A fold that loses an
entry is the one failure mode of this whole step, and it fails silently.

**M10. Verify the board after writing it.** Where Step 3.5 ran, re-read the board and
confirm every card the snapshot links exists, sits in the list the snapshot implies, and every
new card's link was written back into `STATUS.md`.

## Common mistakes

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
- Ending the checkpoint without the Step 6 block, or replacing it with "you can compact now."
  The block is the deliverable; an invitation to compact is not.
- Writing a compact block that restates the status doc. Anything already on disk is the one thing
  that does *not* need preserving — the block exists for what only this conversation knows.
- Treating **MAX** as "write more words". Length is not the dial — verification is. A shorter
  document where every claim was checked beats a longer one padded with confident recollection.
- Skipping M4 because the suite was green earlier in the session. "Earlier" isn't now, and the
  checkpoint's own doc edits may have been the thing that broke it.
- Letting a verified claim and an assumed one sit in the same voice. If you didn't check it,
  the document has to say so.

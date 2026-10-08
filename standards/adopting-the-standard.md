# Adopting the standard in an existing repo

**Who this is for.** The first Claude Code session in a repo that already exists and was
built before, or without, `project-rules.md`. Point a session at this file.

**The failure mode this exists to prevent:** a session reads a rules file and starts "fixing"
a working codebase. That is not the job. Section 1 is the job.

---

## 1. Audit first. Decide everything. Fix nothing.

**The first session's only deliverable is `conventions.md`, not a diff.**

Walk `project-rules.md` section by section against the repo and sort every gap into one of
two states:

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
- **`npm run lint` is not a build check.** Use `npm run build`.

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

**From the `fleet` plugin, active in every project once it is installed — nothing to copy:**

- **`checkpoint`** — the full commit and documentation
  protocol. `git checkpoint` = commit and push, both already authorised. `MAX` = claim-by-claim
  verified. **It may not appear in the surfaced skills list — look for it rather than
  improvising a commit process.**
- **`relay`** — the inverse, run at the *start* of a session: loads the handoff **and verifies
  it still describes the repo** before any work starts. Its thesis: *the repo beats the
  handoff*.
- **`sync-standards`** — brings the project's `project-rules.md` up to the latest version.
  It is for a project already on the standard; it sends a project with no copy back here.
- **`propose-standard`** — sends a change or request back to `fleet-standards` as an issue.

**Project-level** skills live in `.claude/skills/` — **not** `.github/skills/`, which Claude
Code does not scan. One project's two skills sat in the wrong directory, correctly written and
never loadable, for an unknown length of time.

**Self-improvement is part of checkpoint (step 1.5):** if a project skill was followed and
something in it was wrong, slow, or buried where it got skimmed past, fix the skill file in the
same commit. Also bank what worked — a skill that only accumulates warnings gets conservative
and slow.

---

## 7. Order of work

1. Resolve the dirty tree. Ask whose work it is.
2. Read whatever binding documents already exist — a design system, a product or brand
   definition. They outrank anything a session would invent.
3. Ask the three day-one questions (section 4).
4. Copy `project-rules.md` from `fleet-standards/standards/` and **`git add` it**. Check first what the newer
   version *dropped*, not just what it added — newer is not automatically a superset.
5. Write `conventions.md`. **Change no code.**
6. Put the exceptions to the owner. Decisions and dates into `decisions.md`.
7. Write `CLAUDE.md`, every claim carrying its verification date.
8. Write `docs/STATUS.md` with a `Start here` block.
9. `git checkpoint` only when the owner says so.

Step 5 before step 7: `CLAUDE.md` names the granted exceptions, so it cannot be written until
they exist.

---

## 8. Kickoff prompt

```
This repo is being brought onto the standard in project-rules.md, which I have
copied into the root — read it first. The master copy lives in the standards/
folder of github.com/Tanveerfb/fleet-standards, along with the templates and the guide
you are following.

This repo already exists, so this is a migration, not a bootstrap. Do not
arrive planning to modernise code.

First deliverable is conventions.md: a full audit of this repo against
project-rules.md, with every gap sorted into "exception granted" or "known,
queued, not yet decided", plus a short section naming rules this repo already
satisfies where someone might assume otherwise. CHANGE NO CODE in that pass.
Put the exceptions to me as questions with your recommendation — I decide, and
the decision plus date goes in decisions.md.

Then CLAUDE.md, then docs/STATUS.md with a Start here block. Templates for all
three are in fleet-standards' standards/templates/.

How I work, and these are not negotiable:
- "git checkpoint" = commit AND push, both already authorised, do not ask again.
  Never commit unasked. Batch commits, do not spam one per change. Every commit
  must build standalone.
- Every visual or layout change starts as a mockup I approve, and we iterate until
  I lock it. Only a bug fix restoring an approved design goes straight in.
- Use the question tool whenever you need input from me. It notifies my phone.
- Three words on everything you touch: consistency, modularisation, QoL. If a
  change introduces a second version of something this repo already has, it is
  wrong.
- The existing code is not the benchmark. It predates my current standard.
- Never rewrite copy the business owns — draft it, show it, apply on a yes.
- Mobile is first-class.
- Never hand me a problem without a proposed fix and a recommendation.

Ask me on day one: which files are frozen, what deploys from where, and what is
mid-flight. Do not infer any of the three.
```

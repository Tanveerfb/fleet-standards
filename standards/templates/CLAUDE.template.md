# CLAUDE.md — <PROJECT NAME>

Project-specific memory for Claude Code working in this repository.

**This file — with any area `CLAUDE.md` files in subfolders (`project-rules.md` §SCALE) — is
the only hand-written agent guidance in the repository**, for every coding agent, not only
Claude Code. A fact lives in exactly one of them: the most local file it applies to.
`AGENTS.md` and `GEMINI.md` exist only to point other agents here (from
`templates/AGENTS.template.md`) and never carry facts of their own. If a tool
generates its own block in `AGENTS.md` (`<!-- BEGIN:… -->`), leave the block alone. Two copies
of the same facts drift, and the stale one is indistinguishable from the current one. A fact
goes here; there is nowhere else for it to go.

@project-rules.md
@rules/app.md
@rules/ui.md
@rules/node.md
@rules/web.md
<!-- If a tool generates AGENTS.md, add `@AGENTS.md` above these lines and say so here. -->
<!-- One import per file of the standard this project loads (project-rules.md §SCOPE). The
     lines above are a web project's; keep the ones for this kind of repository and delete
     the rest. The *Rules* line under Project identity names the same files, and
     `sync-standards` copies exactly those.

     Web project (Next.js)        project-rules, app, ui, node, web
     Local Node tool              project-rules, app, node; ui if it has an interface
     Tool in another language     project-rules, app; ui if it has an interface
     Game                         project-rules, app, ui, game
     Non-application              project-rules, non-application; ui if it has a visual surface

     An option the project chose is imported too: `@rules/options/credit.md`,
     `@rules/options/trello.md`, `@rules/options/firebase.md`. The AI option is not imported;
     it is read on demand, so a project that chose it keeps this line instead:
     **Read `rules/options/ai.md` before any work on an AI feature** — never act on memory
     of it.
     `ai-setup` writes that line here and in `src/lib/ai/CLAUDE.md`, an area file that loads
     by itself when AI code is read. -->
<!-- Area files (§SCALE): once the project has them, add a table here — each area file, what
     it holds, when to read it — and this line: **Read the area file for your work before
     starting, wherever that work sits.** An area file loads on its own only when a file
     inside its folder is read. -->
<!-- This file holds what is true now (§DOCS). A replaced line moves, word for word, to
     `docs/record/<area>.md`; it never stays here as a "was". -->

## Project identity

- **Name**: <name>
- **Type**: <what it is, who it serves>
- **Repo**: `<owner/repo>`, branch `<main|master>`
- **Deploys**: <**single-branch**, **multi-branch** or **local only** (§GIT), then where,
  from which branch, and whether that branch auto-deploys. Local only: no remote by decision,
  and where the work lands, if anywhere. Live domain or real users → multi-branch: work on an
  update branch, release on `git CPR`. Multi-branch also names the working branch and the
  release, e.g. "work on `dev`; squash PR into `main`". No application code → name the production surface (the tenant, the
  platform) and whether it has live users (§SCOPE)>
- **Rules**: <the files under `rules/` this project loads, then the options it chose, as in
  §SCOPE: "app, ui, node, web · Options: firebase, trello", or "· Options: none". The same
  files as the import lines above; `sync-standards` reads this line>
- **Area files**: <the subfolder `CLAUDE.md` files that exist, or "none"> · **Map**:
  <`docs/architecture.md`, or "not yet">
- **Trello board**: <url, or "none" — §TRELLO, `rules/options/trello.md`. No board means no Trello work>
- **Motif**: <family — variant, recorded in `design-system.md`; or "not chosen yet — run design-motif" (§DESIGN)>
- **Studio credit**: <yes — the owner's studio, and where it sits; no; or "no studio configured" (§CREDIT)>
- **Studio showcase**: <yes — where on the studio site, and the request issue's link; no; or "no studio configured" (§CREDIT)>

## Status

`docs/STATUS.md` is the living project record — current state, open items, and what is
verified versus assumed. **Read it first in a new session.** History is kept apart, in files
nothing loads by default: `docs/log.md` (the session log) and `docs/record/` (what the
briefs used to say). Read them when the current files are unclear.

Two documents sit above this one:

- **`project-rules.md` and the files under `rules/`** — the author's fleet-wide standard,
  imported above. Its one version is in `project-rules.md`'s header; don't restate it here.
  Master copy: `standards/project-rules.md` and `standards/rules/` in
  `github.com/Tanveerfb/fleet-standards`.
- **`conventions.md`** — what this project does differently, and **why each divergence was
  granted**. Per `project-rules.md` §SCOPE, **where the fleet rules and `conventions.md`
  disagree, stop and ask.** Neither wins by default.

`decisions.md` records why non-obvious choices were made. Append to it; never edit an entry.

**Exceptions granted so far:** <list them, or "none yet — see conventions.md">

<!-- If the project has documents that are binding on every piece of work — a design system,
     a product/brand definition — name them here and say they are binding, not background. -->

## Working agreement

Everything in the files imported above applies and is **not repeated here** — two copies of a rule
drift. The owner's standing agreement is **§OWNER**; git is **§GIT**, which depends on the
*Deploys* line above (single-branch: `git checkpoint` = commit and push, anything else = no
git; multi-branch: the working branch commits on its own, production only on `git CPR`). Add
below only what is specific to this project.

- <project-specific agreement, or delete this list>

**Frozen files:** <list, or "none — ask before assuming there are none">. Frozen means raise
it and get a yes, not never touch.

## Commands

```bash
npm run dev            # <port, and anything non-obvious about how it starts>
npm run build          # production build — verify after changes
```

<!-- State plainly which scripts DO NOT exist. A session that assumes a test or lint script
     will invent one. In a repository without application code (§SCOPE), replace this
     section with one line saying no commands exist, and make the Technology table below
     describe the platform (tenant, services, licences) instead of a framework. -->

**Do not use `npm run lint` to validate builds — use `npm run build`.**

## Technology

Verified against `package.json` and `node_modules`, **<DATE>**.

| | |
| --- | --- |
| Next.js | <version>, App Router |
| React / TypeScript | <versions>, strict |
| Node | <version> |
| Styling | <> |
| Data | <> |
| Hosting | <> |

<!-- Every claim in this file carries how it was verified and when. An unverified claim in a
     CLAUDE.md gets believed for months. -->

## Architecture — the patterns that are load-bearing here

<!-- The two or three rules that, if broken, cause a real defect. Write the REASON, not just
     the rule: "never use X as a text colour" is ignorable; "X is 3.06:1 on Y and fails AA"
     is not. -->

## Codebase conventions

### Metadata
### Styling
### Components
### Data

## Things to avoid

<!-- Each with its reason. -->

## Known non-blocking issues

<!-- Warnings that are expected, so nobody burns a session debugging them. -->

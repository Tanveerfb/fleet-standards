---
name: new-project
description: Use when starting a brand-new project on the fleet standard — e.g. "new project", "start a new project", "set up a new repo", "bootstrap this project", "scaffold a new Next.js app". Scaffolds Next.js with create-next-app, puts the standard's rules and templates in place, wires the fleet plugin and the other-agent pointers, then hands to design-motif to set the design before any interface work, and finishes with the new-project checklist. Never commits. For an existing codebase use adopting-the-standard instead.
---

# New project

> **Outside Claude Code** (Codex, Copilot, Cursor, Gemini CLI): this skill is written in
> Claude Code's terms; map them to your own. If `${CLAUDE_PLUGIN_ROOT}` appears unsubstituted
> anywhere below, the standard's files are in `~/.agents/fleet/` instead. "The question tool"
> means your own ask-the-user tool, or a short question with numbered options in plain text.
> Named MCP tools (`mcp__github__*`, `mcp__Trello__*`) mean whatever GitHub or Trello
> integration you have — an MCP server, `gh` — and with none, say so and skip that step.
> Never skip a step silently because a Claude-specific name did not match.

Takes an empty folder to a project that is on the standard from its first file, with its
design decided before any interface is built. The master copies used here:

- Rules: `${CLAUDE_PLUGIN_ROOT}/project-rules.md`
- Templates: `${CLAUDE_PLUGIN_ROOT}/templates/`
- Adoption guide, for anything that is not new: `${CLAUDE_PLUGIN_ROOT}/adopting-the-standard.md`

**This skill never commits** (§GIT). The owner makes the first commit at a checkpoint.

## Step 0 — Is it really new?

Check the target folder. If it already holds application code, **stop**: that is an
adoption, not a new project. Point at `adopting-the-standard.md` — its first pass writes
`conventions.md` and changes no code.

## Step 1 — What is being built

Establish the project's name (kebab-case for the folder and repo) and what it is.

- **A spec exists** — a folder in the owner's plans repo, or a document they point to. Read
  it in full. It is binding: name, purpose, audience, stack and phases come from it, and
  `design-motif` will take its brief from it too.
- **No spec** — ask in prose for a short description: what it is for, who uses it, what the
  first phase must do. Do not invent the rest.

Confirm the stack choices that are the owner's (§ASK) where the spec does not settle them:
Firebase or not, zustand and zod needed or not, a Trello board or none — and, if the
project will have AI features, its AI tooling: Firebase AI Logic, the Vercel AI SDK, or both
(§AI lays out the trade-offs).

## Step 2 — Scaffold

Check the current options first (`npx create-next-app@latest --help`) — flags change
(§PACKAGES). As of this writing:

```bash
npx create-next-app@latest <name> --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm --disable-git
```

`--disable-git` because git is the owner's call (§GIT). If the CLI writes its own
`AGENTS.md` (current versions do, inside a generated block), keep it; Step 4 adds the
pointer above the block.

Then, before anything else:

- **`.gitignore`** covers `.env*` and `.secrets/` (§SECURITY). Add whichever is missing.
- **Naming** (§NAMING): kebab-case files from the start. Offer a filename lint rule
  (`check-file` or `unicorn/filename-case`) to enforce it — the owner approves the dependency.
- **`tsconfig.json`** has `"strict": true` and `"paths": { "@/*": ["./src/*"] }` (§TS,
  §STRUCTURE).
- **Node is pinned** (§RUNTIME): check which Node majors the deploy target supports today,
  confirm the choice with the owner, then set `engines.node` in `package.json` and `.nvmrc`
  to that major. If the local Node is a different major, say so and switch before building.
- **Environment checking** (§RUNTIME): `src/lib/env.ts` with server and client zod schemas,
  and a committed `.env.example` — with `!.env.example` added to `.gitignore`. Variables are
  added to both as they appear.

## Step 3 — The standard

1. Copy `project-rules.md` to the project root.
2. From the templates, filling in what Steps 1–2 established and leaving the rest as `TODO`
   — never invented:
   - `CLAUDE.template.md` → `CLAUDE.md` — project identity, deploy target if known, the
     `Trello board:` line (a URL or `none`), commands, technology verified against
     `package.json` today.
   - `conventions.template.md` → `conventions.md` — `Audited against` the rules version just
     copied; no divergences yet.
   - `decisions.template.md` → `decisions.md` — a first entry recording the stack choices and
     why, from the spec or Step 1.
   - `STATUS.template.md` → `docs/STATUS.md` — `Start here` says the project was set up today
     and the next action is the design.
3. Create no other document until it has content (§DOCS).

## Step 4 — Wire the agents

- **`.claude/settings.json`** — register the `tanveerfb` marketplace and enable
  `fleet@tanveerfb` (the exact block is in `sync-standards`, Step 5).
- **`AGENTS.md` and `GEMINI.md`** — the pointer from `templates/AGENTS.template.md`; in an
  existing `AGENTS.md`, above any generated block, never inside it.

## Step 5 — Design first

Hand to **`design-motif`** now, before any interface work — the motif decides the tokens, and
the tokens decide everything visual after them. Pass it the spec or the Step 1 description
as the brief. Continue here once the motif is locked and recorded, and fill in the
`Motif:` line in `CLAUDE.md`.

## Step 6 — The rest of the checklist

Work through the remaining items of the checklist at the end of `project-rules.md` **with
the owner**, one at a time — offer each, do not run them all silently:

- tokens in `@theme` from the locked motif, then the **component round** (§SHADCN): the core
  kit and signature component designed through mockups — custom, ambitious, every state —
  before any feature work, then built on shadcn's behaviour primitives;
- navigation style confirmed;
- the data adapter interface, if the project has data (§DATA);
- base components — navigation, footer, button;
- Vitest wired to `npm test` (§TESTING);
- `.env.local` and `environment.md` only once a credential actually exists (§DOCS);
- **`npm run build` passes clean** — the last step, and it must actually run.

## Step 7 — Report

- What was created, by path.
- The motif, and where it is recorded.
- Checklist items done and still open.
- **Nothing committed.** The first commit happens at the owner's `git checkpoint`, and
  `.gitignore` is already in place for it.

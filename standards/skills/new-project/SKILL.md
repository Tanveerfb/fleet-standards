---
name: new-project
description: Use when starting a brand-new repository on the fleet standard — e.g. "new project", "start a new project", "set up a new repo", "bootstrap this project", "scaffold a new Next.js app", "new game", "new tool", "new repo for runbooks". Asks what kind of repository it is (web, Node tool, tool in another language, game, non-application) and how it ships, puts the core and that kind's rules files in place with the Rules line, asks each option once, wires the fleet plugin and the other-agent pointers, scaffolds Next.js for a web project, hands to design-motif where there is a visual surface, and finishes with a checklist. Never commits. For an existing codebase use adopting-the-standard instead.
---

# New project

> **Outside Claude Code** (Codex, Copilot, Cursor, Gemini CLI): this skill is written in
> Claude Code's terms; map them to your own. If `${CLAUDE_PLUGIN_ROOT}` appears unsubstituted
> anywhere below, the standard's files are in `~/.agents/fleet/` instead. "The question tool"
> means your own ask-the-user tool, or a short question with numbered options in plain text.
> Named MCP tools (`mcp__github__*`, `mcp__Trello__*`) mean whatever GitHub or Trello
> integration you have — an MCP server, `gh` — and with none, say so and skip that step.
> Never skip a step silently because a Claude-specific name did not match.

Takes an empty folder to a repository that is on the standard from its first file — any kind
§SCOPE names, not only a web app — with its design decided before any interface is built.
The master copies used here:

- Rules: `${CLAUDE_PLUGIN_ROOT}/project-rules.md` and `${CLAUDE_PLUGIN_ROOT}/rules/`
- Templates: `${CLAUDE_PLUGIN_ROOT}/templates/`
- Adoption guide, for anything that is not new: `${CLAUDE_PLUGIN_ROOT}/adopting-the-standard.md`

**This skill never commits** (§GIT). The owner makes the first commit at a checkpoint.

## Step 0 — Is it really new?

Check the target folder. If it already holds application code, **stop**: that is an
adoption, not a new project. Point at `adopting-the-standard.md` — its first pass writes
`conventions.md` and changes no code.

## Step 1 — What is being built, what kind, how it ships

Establish the project's name (kebab-case for the folder and repo) and what it is.

- **A spec exists** — a folder in the owner's plans repo, or a document they point to. Read
  it in full. It is binding: name, purpose, audience, stack and phases come from it, and
  `design-motif` will take its brief from it too.
- **No spec** — ask in prose for a short description: what it is for, who uses it, what the
  first phase must do. Do not invent the rest.

Then, through the question tool, where the spec does not settle them (§ASK):

1. **The kind of repository** (§SCOPE's second table), which decides the files it loads:

   | Kind | Loads | Scaffold (Step 2) |
   | --- | --- | --- |
   | Web project (Next.js) | core, app, ui, node, web | `create-next-app` |
   | Local Node tool | core, app, node; ui if it has an interface | `package.json` and `tsconfig.json` by hand |
   | Tool in another language (bash, Python) | core, app; ui if it has an interface | none |
   | Game | core, app, ui, game | the engine's own new-project |
   | Non-application | core, non-application; ui if it has a visual surface | none |

   For the three with an "if", ask that too.
2. **How it ships** — the *Deploys* line (§GIT): **single-branch**, **multi-branch** (a
   live domain or real users means this: name the working branch and the release), or
   **local only** (no remote, by decision). For a repository without application code, also
   the production surface and whether it has live users.
3. **The options, each asked once** (§SCOPE), and the answer recorded either way:
   - **Studio credit** — only if the owner's `~/.claude/CLAUDE.md` has a `Studio credit:`
     line: does the project carry the credit, and, if the line names a showcase, will it be
     featured on the studio's site; for a client project, has the client agreed. Local-only
     projects are asked too. **On a showcase yes**, file the feature request as an issue on
     the studio site's repository — what the project is, its status, stack and tools, links,
     nothing private — and record its link in `decisions.md`; if this session cannot reach
     that repository, write the request in full as an open item in `docs/STATUS.md` and say
     so (`rules/options/credit.md` §CREDIT).
   - **A Trello board** — its URL, or none.
   - **Firebase** — for a kind with application code; a non-application repository is
     asked only if it will hold Firebase configuration.
   - **AI features** — and, for a web project, the tooling: Firebase AI Logic, the Vercel AI
     SDK, or both (§AI lays out the trade-offs). Step 4 hands to `ai-setup`.
4. **For a web project only:** zustand and zod needed or not (§STATE).

Play the answers back in a few lines before Step 2.

## Step 2 — Scaffold, by kind

**Every kind:** with the owner's yes, `git init` in the new folder — Step 4's credential
hook needs a repository, and nothing is committed until the owner's first checkpoint. A
`.gitignore` that covers `.env*` and `.secrets/` (§SECURITY), with an `!.env.example`
exception where the kind keeps one.

**Web project.** Check the current options first (`npx create-next-app@latest --help`) —
flags change (§PACKAGES). As of this writing:

```bash
npx create-next-app@latest <name> --ts --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --use-npm --disable-git
```

`--disable-git` so the scaffold makes no commit of its own (§GIT); `git init` follows, as
above. If the CLI writes its own `AGENTS.md` (current versions do, inside a generated
block), keep it; Step 4 adds the pointer above the block. Then, before anything else:

- **Naming** (§NAMING): kebab-case files from the start. Offer a filename lint rule
  (`check-file` or `unicorn/filename-case`) to enforce it — the owner approves the dependency.
- **`tsconfig.json`** has `"strict": true` and `"paths": { "@/*": ["./src/*"] }` (§TS,
  §STRUCTURE).
- **Node is pinned** (§RUNTIME): check which Node majors the deploy target supports today,
  confirm the choice with the owner, then set `engines.node` in `package.json` and `.nvmrc`
  to that major. If the local Node is a different major, say so and switch before building.
- **Environment checking** (§RUNTIME): `src/lib/env.ts` with server and client zod schemas,
  and a committed `.env.example`. Variables are added to both as they appear.

**Local Node tool.** No framework. `package.json` (`npm init -y`, then the name, `type`,
`engines.node` and `.nvmrc` as §RUNTIME says), `tsconfig.json` strict (§TS), and the
scripts `rules/node.md` §BUILD names. Every dependency is the owner's yes (§AGENTS).

**Game.** The engine makes its own project: the owner creates it in the engine, in this
folder, and says which engine and version. Nothing here writes engine files, and
engine-generated files stay as the engine writes them.

**Tool in another language, non-application.** No scaffold. The repository starts with the
standard's files alone; the work's own files come with the work.

## Step 3 — The standard

1. Copy `project-rules.md` to the project root, and into `rules/` exactly the files the kind
   loads (Step 1's table, with `ui.md` where the answer was yes), and into `rules/options/`
   each option the owner chose but AI (`ai-setup` copies that one, Step 4).
2. From the templates, filling in what Steps 1–2 established and leaving the rest as `TODO`
   — never invented:
   - `CLAUDE.template.md` → `CLAUDE.md`:
     - **the imports**: one `@` line per file copied in step 1, the others deleted (the
       template's comment lists them by kind); options imported, AI never;
     - **the *Rules* line**: the same files and the options, e.g.
       `app, node · Options: trello`, or `· Options: none` — the line the startup check and
       `sync-standards` read (§SCOPE);
     - **the *Deploys* line** from Step 1, the `Trello board:` line (a URL or `none`), the
       `Studio credit:` and `Studio showcase:` lines, and the `Motif:` line (`not chosen yet`
       where there is a visual surface, `none` where there is none);
     - **Commands and Technology** for what the kind really has, verified today: a web
       project's from `package.json`; a Node tool's scripts; a game's engine version and
       headless test command; a tool's interpreter; a non-application repository says no
       commands exist and describes the platform (`rules/non-application.md`).
   - `conventions.template.md` → `conventions.md` — `Audited against` the rules version just
     copied; no divergences yet. **A game or a non-application repository** keeps its profile
     block from the template and deletes the other.
   - `decisions.template.md` → `decisions.md` — a first entry recording the kind, the
     *Deploys* choice, each option's answer and the stack choices, and why, from the spec or
     Step 1.
   - `STATUS.template.md` → `docs/STATUS.md` and `log.template.md` → `docs/log.md` —
     `Start here` says the project was set up today and names the next action (the design,
     where there is one).
3. Create no other document until it has content (§DOCS).

## Step 4 — Wire the agents

- **`.claude/settings.json`** — register the `tanveerfb` marketplace and enable
  `fleet@tanveerfb` (the exact block is in `sync-standards`, Step 5).
- **Skill copies for cloud sessions**, which install no plugins — run
  `node "${CLAUDE_PLUGIN_ROOT}/scripts/copy-skills-to-project.mjs" "<project root>"` once
  `project-rules.md` is in place (`sync-standards`, Step 5, explains the copies). **Skip this
  for a local-only project**: no cloud session can open it, and the plugin gives it both
  hooks.
- **`AGENTS.md` and `GEMINI.md`** — the pointer from `templates/AGENTS.template.md`; in an
  existing `AGENTS.md`, above any generated block, never inside it.
- **The credential hook (§SECURITY)** — copy `${CLAUDE_PLUGIN_ROOT}/templates/pre-commit` to
  `.githooks/pre-commit` with `cp`, then `git config core.hooksPath .githooks`. Mark it
  executable when the owner's first commit adds it (`git add --chmod=+x`). Copy
  `${CLAUDE_PLUGIN_ROOT}/templates/.gitattributes` to the project root with it, so the hook
  and any shell script keep LF on a Windows checkout (§GIT).
- **AI chosen in Step 1:** run `ai-setup` now, or record it as the first open item if the
  owner wants the design first. It copies `rules/options/ai.md` and writes the two
  read-on-demand lines.

## Step 5 — Design first, where there is a visual surface

**Only if the project loads `rules/ui.md`.** Hand to **`design-motif`** now, before any
interface work — the motif decides the tokens, and the tokens decide everything visual after
them. Pass it the spec or the Step 1 description as the brief. Continue here once the motif
is locked and recorded, and fill in the `Motif:` line in `CLAUDE.md`. A repository with no
visual surface skips this step.

## Step 6 — The rest of the checklist

Work through the items of the checklist below that Steps 1 to 5 did not already settle,
**with the owner**, one at a time — offer each, do not run them all silently. A web
project's **component round** (§SHADCN) comes before any feature work: the core kit and
signature component designed through mockups — custom, ambitious, every state — then built on
shadcn's behaviour primitives. **The kind's build or test run is the last item**, and it must
actually run.

## Step 7 — Report

- The kind, and the files it loads.
- What was created, by path.
- The motif, and where it is recorded — or that the repository has no visual surface.
- Checklist items done and still open.
- **Nothing committed.** The first commit happens at the owner's `git checkpoint`, and
  `.gitignore` is already in place for it.

## The checklist

Used once, here, so it lives in this skill rather than in a rules file every session loads.

**Every kind:**

- [ ] `git init` done, with the owner's yes; `.gitignore` covers `.secrets/` and `.env*`,
      in place before the first commit
- [ ] **The rules set in place:** `project-rules.md` and the `rules/` files the kind loads,
      each imported from `CLAUDE.md`, with the *Rules* line written (§SCOPE) — and
      **committed** at the first checkpoint. An untracked copy is one `git clean` from gone.
- [ ] The *Deploys* line written (§GIT)
- [ ] Each option asked once and the answer recorded: studio credit and showcase, Trello
      board (`Trello board:` line, a URL or `none`), Firebase, AI (§SCOPE)
- [ ] `fleet` plugin enabled in `.claude/settings.json`, the `AGENTS.md` and `GEMINI.md`
      pointers and the credential hook in place; the skill copies made unless local only
      (Step 4)
- [ ] Document set created — only the files that have content (§DOCS)
- [ ] Motif chosen and recorded in `design-system.md`, where the project loads `rules/ui.md`
      (§DESIGN, Step 5)
- [ ] `.env.local` and `environment.md` **only once a credential actually exists** (§DOCS);
      from then, every variable recorded by name and owner (§FIREBASE for the Firebase set)

**Web project, in addition:**

- [ ] `create-next-app` with TypeScript, Tailwind, App Router, `src/`, `@/` alias (Step 2)
- [ ] `tsconfig.json` strict confirmed
- [ ] Node pinned to the deploy platform's major in `engines` and `.nvmrc` (§RUNTIME)
- [ ] `src/lib/env.ts` validates env at startup; `.env.example` committed with an
      `!.env.example` exception in `.gitignore` (§RUNTIME)
- [ ] `design-system.md` written and tokens in `@theme` before any UI work
- [ ] Component round done: the core kit and signature component designed in the motif,
      approved through mockups, built on shadcn behaviour (§SHADCN)
- [ ] Navigation style confirmed with the owner
- [ ] Zustand and zod confirmed as needed or not needed (§STATE)
- [ ] Data adapter interface defined, if the project has data (§DATA)
- [ ] Base components built: navigation, footer, button
- [ ] Structure matches §STRUCTURE; files named per §NAMING, with the filename lint rule
      offered
- [ ] MCP servers active: Context7, Next.js DevTools, shadcn, Firebase and Vercel where
      applicable, web search
- [ ] If the project has AI features: the `lib/ai/` adapter and model map in place, every
      model call protected before any AI feature ships (§AI)
- [ ] Vitest installed and `npm test` wired (§TESTING)
- [ ] First `npm run build` passes clean — last

**Local Node tool, in addition:** `tsconfig.json` strict; Node pinned in `engines` and
`.nvmrc`; Vitest and `npm test` once there is logic to test (`rules/node.md`); the typecheck
passes — last.

**Game, in addition:** the profile block in `conventions.md`; the engine's test add-on
offered (GUT in Godot); the engine's headless run passes — last (`rules/game.md`).

**Tool in another language, in addition:** the interpreter and its version recorded in
*Technology*; the tool runs once on a real input — last.

**Non-application, in addition:** the profile block in `conventions.md`; *Commands* says
none exist; the production surface named on the *Deploys* line
(`rules/non-application.md`).

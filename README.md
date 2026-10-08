# Fleet standards — a project standard for AI-assisted development

A shared rulebook, project templates, and agent skills for building **Next.js** projects with
an AI coding agent. It is written for Claude Code and works with **OpenAI Codex, GitHub
Copilot, Cursor and Gemini CLI** too.

It answers the questions an agent otherwise guesses at: how code is structured, when to ask
instead of assuming, how visual changes get approved, when git is allowed, and how a
session hands over to the next one. Adopting it means your agent follows the same rules in
every project, and every project improves the same rulebook.

It is opinionated — built by [Tanveer](https://github.com/Tanveerfb) for his own projects
(Next.js, TypeScript, Tailwind, shadcn, Firebase) and shared with whoever finds it useful.
Wherever it says **"the owner"**, that means whoever owns the project: you, in yours.

---

## What you get

**The standard** — [`standards/project-rules.md`](standards/project-rules.md). One file, copied
into each project, with sections referenced by name (`§GIT`, `§MOTION`):

| Part | Covers |
| --- | --- |
| How we work | Precedence, project documents, asking via the question tool, the mockup loop for every visual change, git rules, Trello, spec files, other agents |
| Architecture | Modules, naming, TypeScript, folder structure, data adapters, entity lifecycles, state and validation, forms |
| Stack | Packages, npm, Node version and environment checks, security and secrets, Firebase, AI and LLM features |
| Interface | Tailwind tokens, design motifs, shadcn primitives, QoL expectations, motion |
| Quality | Build discipline, testing |

**Seven skills** — instructions your agent loads when a phrase triggers them:

| Skill | Say | What happens |
| --- | --- | --- |
| `checkpoint` | "checkpoint", **"git checkpoint"**, "git checkpoint max" | Ends a session: updates `docs/STATUS.md`, mirrors it to Trello if the project has a board, then git. **"git checkpoint" means commit and push; anything else means no git.** |
| `relay` | "relay", "where were we" | Starts a session: reads the last handoff and checks it still matches the repo before any work |
| `new-project` | "new project" | Sets up a new Next.js project on the standard — scaffold, rules, templates, agent wiring — then sets the design first and walks the checklist. Never commits. |
| `design-motif` | "set the design", "redesign" | Chooses (or records) the project's motif: browse, decide for me, surprise me, or bring your own; mockups until you lock it; then records it |
| `ai-setup` | "set up AI", "add an AI feature" | Adds AI to a new or existing project: checks what's there, lets you choose Firebase AI Logic, the Vercel AI SDK or both, scaffolds the adapter, protects every model call, optionally wires local models (Ollama, LM Studio), and builds the first feature |
| `sync-standards` | "sync standards" | Brings a project's copy of the rules up to the latest version, explaining what changed |
| `propose-standard` | "propose a standard change" | Sends a fix or request back to this repo as a GitHub issue (a pull request if you ask) |

**Design motifs** — [`standards/motifs.md`](standards/motifs.md): 35 families of themes
a project's interface can be designed around, in seven groups — Stationery, Classroom,
Claymorphism, Cyberpunk, Neo-brutalism, Maximalism, Shonen ink, Retro pixel, Heritage, Japandi
and more — each with named variants, plus universe-inspired motifs drawn from a fictional
world, and custom ones. Browse them, have the agent recommend one from your site's purpose and
audience, or let it surprise you. The `design-motif` skill runs the whole process.

**Templates** — [`standards/templates/`](standards/templates): `CLAUDE.md`, `AGENTS.md`,
`conventions.md`, `decisions.md` and `docs/STATUS.md` skeletons for a new project.

---

## Install

### Claude Code — as a plugin

In any Claude Code session:

```
/plugin marketplace add Tanveerfb/fleet-standards
/plugin install fleet@tanveerfb
```

The skills appear as `fleet:checkpoint`, `fleet:relay`, `fleet:sync-standards` and
`fleet:propose-standard`. To receive updates automatically, open `/plugin` → **Marketplaces**
→ `tanveerfb` → **Enable auto-update** (it is off by default). Otherwise run
`/plugin marketplace update tanveerfb` now and then.

### Codex, Copilot, Cursor, Gemini CLI — with the installer

Needs `git` and Node 18 or later:

```
git clone https://github.com/Tanveerfb/fleet-standards.git
node fleet-standards/standards/scripts/install-skills.mjs
```

| Installs | To | Read by |
| --- | --- | --- |
| The seven skills | `~/.agents/skills/` | Gemini CLI, GitHub Copilot, Cursor |
| The seven skills | `~/.codex/skills/` | OpenAI Codex |
| Rules and templates | `~/.agents/fleet/` | The skills, which look for the standard there |

Restart your agent afterwards. To update: `git pull` in the clone and run the installer again
— or just say "sync standards" in a project, which does both.

---

## Use it in a project

### New project

Install the plugin (above), open a session in an empty folder, and say **"new project"**. If
you have a written spec, point the session at it — the skill takes the project's purpose and
audience from it. It scaffolds the app, puts the rules and templates in place, wires the
plugin and the other-agent pointers, then runs **design-motif** so the design is decided
before anything visual is built, and finishes by walking the checklist with you. Nothing is
committed until you say `git checkpoint`.

To do the same by hand:

1. `npx create-next-app@latest` — TypeScript, Tailwind, App Router, `src/`, `@/` alias.
2. Make sure `.gitignore` covers `.env*` (except `.env.example`) and `.secrets/` **in the first
   commit**, before any code. Pin Node to your deploy platform's version in `package.json`
   `engines` and `.nvmrc`.
3. Copy [`standards/project-rules.md`](standards/project-rules.md) to the project root and
   commit it.
4. Copy the templates and fill in what you know, leaving the rest as `TODO`:
   - `CLAUDE.template.md` → `CLAUDE.md` — the one file holding project-specific instructions
   - `AGENTS.template.md` → `AGENTS.md` **and** `GEMINI.md` — pointers that send Codex,
     Copilot, Cursor and Gemini CLI to `CLAUDE.md`
   - `conventions.template.md` → `conventions.md`, `decisions.template.md` → `decisions.md`
   - `STATUS.template.md` → `docs/STATUS.md`
5. Say **"sync standards"** once. It wires the project to the plugin (so every Claude Code
   session there loads the skills) and checks the pointers are in place.
6. Say **"set the design"** to choose the motif before any interface work.
7. Work through the checklist at the end of `project-rules.md`.

Only create the other documents the standard mentions once they have something in them —
`§DOCS` explains why.

### Existing project

Don't copy the rules in and start "fixing" code. Read
[`standards/adopting-the-standard.md`](standards/adopting-the-standard.md) first. The first
pass writes a `conventions.md` recording every gap — as an exception you approve, or as
known backlog — and **changes no code**. Along the way, `design-motif` records the look the
site already has as its motif, without redesigning anything. The guide ends with a ready-made
kickoff prompt for your agent.

### Day to day

- Start a session with **"relay"**, end it with **"checkpoint"** or **"git checkpoint"**.
- Your agent offers choices through its question tool, and asks open questions in plain text
  you can answer in your own words — typed or by voice (`§ASK`).
- Every visual change starts as a mockup you approve, and fits the project's motif
  (`§OWNER`, `§DESIGN`).
- **"Redesign"** when the look needs an overhaul — `design-motif` runs the motif process again.
- Now and then, **"sync standards"** to pick up rule changes.

---

## Changing the standard

Never edit `project-rules.md` inside a project — the next sync overwrites it, and nobody else
gets the fix. Instead, in the project where you hit the problem, say **"propose a standard
change"**. The skill drafts the change with evidence from that project and opens an issue on
this repo, in the same shape as the repo's *Propose a standard change* issue template. The maintainer decides; once merged, every project picks it up with
`sync-standards`.

You can also open an issue or pull request here directly. Changes to the rules bump the
version in its header and get an entry in [`standards/CHANGELOG.md`](standards/CHANGELOG.md).

---

## Troubleshooting

- **Install or update fails on a private fork.** Claude Code fetches with your machine's git
  credentials and cannot prompt for them. Run `gh auth login`, then `gh auth setup-git`.
- **Every skill appears twice in Claude Code.** You have old copies in `~/.claude/skills/`
  from before the plugin. Delete those folders.
- **Skills don't show up in Copilot's or Cursor's cloud agents.** Skills installed to your
  home folder load only on your machine. Cloud agents don't see them.
- **The agent ignores the rules (Codex, Copilot, Cursor, Gemini CLI).** Check the project has
  `AGENTS.md` and `GEMINI.md` from the template. `CLAUDE.md` loads the rules with an `@` line
  that only Claude Code understands; the pointer tells other agents to read them directly.

---

## Repository layout

```
.claude-plugin/marketplace.json   makes this repo a Claude Code plugin marketplace
standards/                        the standard — also the `fleet` plugin
  project-rules.md                the rules
  motifs.md                       the design motif catalogue
  CHANGELOG.md                    version history, and the v2 → v3 section map
  adopting-the-standard.md        bringing an existing project onto the standard
  templates/                      starting files for a project
  skills/                         checkpoint, relay, new-project, design-motif,
                                  ai-setup, sync-standards, propose-standard
  scripts/install-skills.mjs      installer for non-Claude agents
  scripts/sync-rules.mjs          reports the rules version across a folder of projects
  claude-skills.md                the maintainer's other plugins, for reference
docs/maintainer.md                notes for maintaining this repo
LICENSE                           MIT
```

Templates are named `.template.md` on purpose: a file called `CLAUDE.md` in this repo would
be loaded as instructions by anyone opening the repo in Claude Code.

---

## Versions

Current: **v3.2.0** (2026-10-08). See [`standards/CHANGELOG.md`](standards/CHANGELOG.md) for
what changed and why, including the map from v2 section numbers to v3 names.

---

## License

[MIT](LICENSE) — use it, copy it, adapt it to your own projects. Keep the copyright notice.

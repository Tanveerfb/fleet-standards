# `project-rules.md` — changelog

History lives here, not in the rules file. The rules file is imported into every session in
every project, so every line of history in it is paid for in tokens on every turn.

---

## v2 → v3 section map

v3 references sections by name. Any `§<number>` in a project's `conventions.md`,
`decisions.md` or `CLAUDE.md` was written against v2 — translate it with this table when the
project is next audited (the `Audited against` line will read v2.x, which is the signal).

| v2 | v3 | | v2 | v3 |
| --- | --- | --- | --- | --- |
| §1 Scope and precedence | §SCOPE | | §15 Component registry | §COMPONENTS |
| §2 Project documents | §DOCS | | §16 Quality of life | §QOL |
| §3 Packages and APIs | §PACKAGES | | §17 Interface patterns | §PATTERNS |
| §4 Building for growth | §GROWTH | | §18 Motion | §MOTION |
| §5 Modularisation | §MODULES | | §19 Asking before assuming | §ASK |
| §6 Naming | §NAMING | | §20 State and validation | §STATE |
| §7 TypeScript | §TS | | §21 Forms, errors, fetching | §FORMS |
| §8 Project structure | §STRUCTURE | | §22 Security and secrets | §SECURITY |
| §9 Data access | §DATA | | §23 Comments and build | §BUILD |
| §10 Entity lifecycles | §LIFECYCLE | | §24 Custom hooks | §HOOKS |
| §11 Prototypes and shortcuts | §SHORTCUTS | | §25 For agents | §AGENTS |
| §12 Styling | §STYLING | | §26 Firebase | §FIREBASE |
| §13 Design direction | §DESIGN | | §27 Package manager | §NPM |
| §14 shadcn | §SHADCN | | §28 Git and checkpoint | §GIT |

v2.0.0 used different numbers again (v2.0.0 §6 Styling = v2.3.0 §12, §7 Asking = §19,
§12 QoL = §16). Translate those through the v2.3.0 number first.

---

## 3.2.0 — 2026-10-08

- **§AI added — AI and LLM features.** The owner chooses the AI tooling when AI first enters
  a project — **Firebase AI Logic** (stay inside Firebase: Gemini, client-side, App Check),
  the **Vercel AI SDK** (versatility: any provider including Claude, local models, chat UIs,
  agents), or **both** — with the trade-offs laid out and the choice recorded. Neither is
  imposed, and the other is never added later without asking. The AI SDK is free and open source; the project pays the provider directly, and
  Vercel's AI Gateway is optional. The AI SDK replaced an earlier draft's "provider SDK or
  Genkit" for server work, because one API across cloud and local models removes adapter
  code. Every call sits behind a
  `lib/ai/` adapter in domain terms with a mock, and model IDs live in one map, checked
  against current docs. Every model call is protected before it ships — App Check and quotas for AI
  Logic; authentication, per-user rate limits and server-only keys for AI SDK routes. Structured output uses one zod schema — passed straight to the AI SDK, or
  converted with `z.toJSONSchema` for AI Logic — and used again to parse the response. Prompts are code;
  model output is untrusted; tools are permission-checked on the server, with side effects
  confirmed by the user; §QOL, cost limits and privacy records apply. Local models (Ollama,
  LM Studio) run through the AI SDK's OpenAI-compatible provider, for development and
  local-only tools — a deployed app cannot reach the owner's PC.
- §STRUCTURE gains `lib/ai/`; the new-project checklist gains the AI item.
- **§RUNTIME added — Node version and environment.** Node is pinned to the deploy platform's
  major, not the local one, declared in `engines.node` (which Vercel reads) and `.nvmrc` (which
  version managers read); a local mismatch is switched before building. This came from a
  project that built cleanly on local Node 24 and took two production routes down on
  Vercel's Node 22. Environment variables are validated at startup by a zod
  `src/lib/env.ts` with server and client halves, client variables referenced one by one
  because Next.js inlines them at build, and a committed `.env.example` (with a `.gitignore`
  exception, since `.env*` is ignored). `new-project` sets both up; the checklist gains both.
- **§SPECS added — spec files.** For work planned now and built later; in-progress work hands
  over through the checkpoint instead. No template: a spec must be buildable by a session
  that knows nothing else — goal and non-goals, decided versus open, what it touches, done
  means, a status line. Features and upgrades live in the project's `docs/specs/`. On a
  project with a Trello board the spec and its card link each other, and progress and
  discussion happen on the card; without a board the spec stays in the repo with a plain
  status word. A built spec is a record, never pending work; the checkpoint keeps it current.
  Chosen over a plan-file template with review sections, because Trello already covers
  sharing, comments and progress for projects that have a board.
- **`ai-setup` skill added.** Runs §AI end to end in a new or existing project: inventories
  AI already in the code (never refactoring scattered calls unasked), gathers the brief, puts
  the tooling choice to the owner, scaffolds `lib/ai/` after the owner approves packages
  (checked against npm and current docs), protects every model call, optionally wires local
  models with one real test call, builds the first feature through the adapter, records it,
  and verifies with tests and a build. `new-project` asks the AI tooling question up front.

## 3.1.0 — 2026-10-08

- **§DESIGN — every project has a motif.** The six-row "design direction" vocabulary is
  replaced by a catalogue in the new `standards/motifs.md`: 35 motif families in seven groups
  (paper and craft, soft and tactile, bold and graphic, retro and nostalgic, dark and techy,
  calm and refined, institutional and product; the old six among them), with 92 named
  variants, plus **Universe-inspired** and **Custom**. Each family offers named variants
  (Cyberpunk: neon, a 2077-inspired yellow, and corpo), agent-suggested variants —
  one built from the project's existing tokens where it has them — custom, and *decide for
  me*. Four ways in, so the owner chooses how much to decide: **browse**, **recommend**
  (*decide for me*, from the site's purpose and audience), **surprise me** (*I'm feeling
  lucky*, a random pick among motifs that suit the project), or **bring your own**. Every
  route ends in a mockup and the mockup loop. A motif is chosen at a new project or a redesign,
  kept where a project already has one, recorded in `design-system.md`, and from then on a
  standing rule like consistency and QoL. One motif; blends only with the owner's approval.
  Restraint is part of the rule: the motif lives in signature places, and forms, tables and
  body text stay readable. Starter kits and full motif specs are produced on request, as
  proposals through the mockup loop.
- **Universe-inspired motifs** have no option list, because they can be any fictional world.
  The agent asks which world, researches its design language on the web, asks scoping
  questions (which part, which palette sources, how literal, how in-universe, what
  audience), and gets a written brief confirmed before designing. Inspired, never copied.
- **Two new skills.** `design-motif` runs the motif process end to end: it checks for an
  existing motif, gathers the brief (from the project's spec where there is one), offers the
  four ways in, picks a family and variant or researches a universe-inspired brief, loops on
  mockups that include an ordinary form and table as a restraint check, and records the
  result. `new-project` scaffolds a Next.js app (`create-next-app --disable-git`, so git
  stays the owner's call), puts the rules and templates in place, wires the plugin and the
  other-agent pointers, hands to `design-motif` before any interface work, then walks the
  checklist with the owner. `install-skills.mjs` now also installs `motifs.md`.
- **§OWNER — don't state the obvious.** Interface text that repeats what a component already
  makes clear is cut: a sun/moon switch needs no "Light mode" label. Icon-only controls still
  carry an accessible name, and what is genuinely not obvious — an empty state's next step —
  is still said. Came from the owner's experience building a game, where pages and components
  kept explaining themselves.
- **§ASK — open questions go in prose.** The question tool stays the default for choices;
  open questions are asked as a short numbered list in the message, so the owner can answer
  in their own words, including by speech-to-text. Forcing an open question into fixed
  options got answers of "no preference".

## 3.0.0 — 2026-10-08

**Sections renamed to stable anchors and regrouped** into five parts: how we work,
architecture, stack/platform/security, interface, quality. Append-only numbering had put
Firebase, package manager and git after "For agents" purely because they were written late.
Names make reordering free from now on.

- **§MOTION cut to three guardrails.** v2 banned entrance animations, hover transitions and
  staggered reveals and allowed one orchestrated moment per app; projects reported it stopped
  them animating almost anything. Animation is now the owner's call at the mockup stage, with
  nothing banned on style. What remains: `prefers-reduced-motion` honoured, motion never
  makes the app feel slow (never blocks use, smooth on a mid-range phone), and durations and
  easings are `@theme` tokens. Library renamed to `motion` (`motion/react`), GSAP allowed
  with a recorded reason.
- **§OWNER added** — the owner's working agreement (mockup flow, mobile first-class,
  consistency/modularisation/QoL, business copy, shared primitives, frozen files), moved
  here from `templates/CLAUDE.template.md`, where it was the only copy of fleet-wide rules.
  The template now points at it.
  **The mockup rule widened** on the way: v2's template required mockups only for a "real
  redesign"; now every visual or layout change starts as an approved mockup, iterated until
  the owner locks it, except a bug fix restoring an approved design. Locked mockups are kept
  in `docs/design/` (committed, outside `public/` so never deployed) with a `decisions.md`
  entry.
- **§ASK** — the question tool is the default for any input from the owner, not only for
  decisions; prose questions only where the tool is unavailable.
- **§SHADCN** — shadcn named as the component library in every project, no second library
  without asking; each project owns its own customised primitives, never copied from
  another project's set; primitive styling goes through the mockup loop.
- **§TRELLO added** — a project has a board only when its `CLAUDE.md` names one;
  `STATUS.md` is the record and the board mirrors it; default lists Backlog / To do / Doing /
  Review / Done; open items carry their card link; `checkpoint` writes on every checkpoint,
  `relay` reads only.
- **§TESTING added** — Vitest for `lib/domain/` and schemas; interface changes checked by the
  agent in Claude's built-in browser, then Claude in Chrome, Playwright only as a last resort.
- **§FORMS** — simple forms use `<form action>` with `useActionState` instead of `useRef`;
  Firestore `onSnapshot` listeners recognised as the live-data path, through the adapter.
- **§BUILD** — typecheck and lint during work; full `npm run build` before every checkpoint
  and deploy, instead of after every medium change.
- **§DOCS** — the status document is `docs/STATUS.md` with a snapshot rewritten in place over
  a session log added to at the top, matching the `checkpoint` skill. v2 called it
  `status.md` and said "rewritten, never appended", which contradicted the skill and the
  template.
- **§SECURITY / §FIREBASE** — one rule for where keys live: outside the repo by preference,
  `.secrets/` (gitignored) as the fallback. v2 stated it differently in each section and
  reconciled them in a paragraph. §FIREBASE now defers to §SECURITY instead of restating it.
- **§GIT** — gained the cloud-session rule: a harness-assigned branch is the authorisation to
  commit and push there, and nowhere else. The destructive-commands bullet moved here from
  §AGENTS and gained `git clean` and `reset --hard`. The skills now ship in the `fleet`
  plugin instead of living as hand-copied files in `~/.claude/skills/`.
- **§SCOPE** — names the `fleet` plugin: `sync-standards` updates a project's copy,
  `propose-standard` sends changes back to `fleet-standards`. Editing a copy in place is ruled out.
- **§AGENTS** — "rewrite status.md, do not append" removed (now §DOCS); motion values added
  to the list of values not to invent.
- Header names the master copy by GitHub repo as well as the local path, so cloud sessions
  can find it.
- Changelog moved out of the rules file into this one.

- **§TOOLS added** — the standard binds every coding agent, not only Claude Code. `CLAUDE.md`
  stays the one hand-written instruction file; `AGENTS.md` and `GEMINI.md` are pointers to
  it (new `templates/AGENTS.template.md`). Claude-specific tools mapped to their
  equivalents. The skills gained an "outside Claude Code" note, and
  `scripts/install-skills.mjs` returns, now installing to `~/.agents/skills/` (Gemini CLI,
  Copilot, Cursor) and `~/.codex/skills/` (Codex) plus the standard to `~/.agents/fleet/`.

**Not changed in substance:** every other section's wording is carried over as-is.

New in v3 with no v2 equivalent: §OWNER, §TRELLO, §TOOLS, §TESTING.

---

## 2.4.0
Added **§28 Git, commits and the checkpoint** after a session committed four times off its own
initiative across one piece of work — each commit individually defensible, the pattern not what
was wanted. The rule was previously carried only in conversation and in individual projects'
`CLAUDE.md`, which meant every new repo relearned it the same way.
- One trigger phrase, stated as a table: `git checkpoint` is the authorisation, everything else
  is not.
- Batching made explicit, because "commit early, commit often" is the default an agent arrives
  with and it is wrong here.
- An approval does not generalise to the next commit.
- Names the `checkpoint` and `relay` skills by path, and warns that they may not appear in a
  surfaced skills list.

**Appended, nothing renumbered** — §1 through §27 are unchanged, so every `conventions.md`
cross-reference written against v2.3.0 remains correct. Copies of this file elsewhere in the
fleet now read as one minor version behind, which is the drift detector working as intended.

## 2.3.0
Recovered two sections that v2.1.0 dropped, found when `tinker-together` was audited against
v2.2.0 and turned out to be running v2.0.0. Nothing renumbered — both were **appended** as
§26 and §27, because §12, §16, §18, §22 and §25 are referenced by name from existing
projects' `conventions.md` and `decisions.md`, and renumbering would silently invalidate
every one of those references.
- §26 Firebase restored from v2.0.0 §17, expanded with what client work proved: rules are
  inert until deployed, a missing composite index hangs a build rather than failing it, and
  a public page must never fetch Firestore in a component. Reconciled with §22 rather than
  contradicting it — a key kept outside the repo is stricter than `.secrets/`, not a
  violation of it.
- §27 Package manager restored from v2.0.0 §18, unchanged in substance.
- Checklist: `project-rules.md` must be copied in **and committed**. Its absence from the
  v2.2.0 checklist is why one project's copy has never been tracked.

## 2.2.0
Conventions proven on the Simetrix build, generalised.
- Project document set defined, with update triggers and the delete-if-unowned
  rule (§2)
- Naming section added — interface, code and documentation share vocabulary (§6)
- Data adapter promoted to its own rule (§9)
- Entity lifecycle rule added — transitions declared once, nothing writes status
  directly (§10)
- Prototype shortcut register added (§11)
- Security expanded: `.secrets/`, credentials by path, pre-commit hook, scoped
  accounts, rotation order, account ownership (§22)
- Sections consolidated to keep the file readable as it grows

## 2.1.0
- Building for growth, with the line between foresight and speculation
- shadcn customisation made explicit
- Design direction proposals with a starting vocabulary
- QoL extended; standing instruction to offer improvements
- Button-to-modal overlay documented with its limits
- Motion given its own section
- Question tool named as the default for decisions
- Zustand and zod scoped to projects that need them
- Agents must pair every problem with a proposed solution

## 2.0.0
- File length limit removed; replaced by responsibility rules and split triggers
- Precedence rule added — conflicts escalate rather than resolve silently
- Global `types/` directory removed; domain types inferred from zod
- CSS Modules withdrawn; Tailwind only, tokens in `@theme` for v4
- Eight-variant Button withdrawn in favour of shadcn variants plus QoL props
- "Latest version" softened to "latest compatible"
- Design system, component registry and security sections added
- Zustand scope clarified
- Structure moved under `src/`

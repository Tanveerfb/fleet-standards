---
name: ai-setup
description: Use when a project needs AI or LLM features set up or added — e.g. "set up AI", "add AI to this project", "integrate an LLM", "add a chatbot", "add an AI feature", "connect Ollama", "use a local model", "add Firebase AI Logic", "add the AI SDK". Follows project-rules §AI end to end — inventories any AI already in the code, gathers the brief, puts the tooling choice (Firebase AI Logic, Vercel AI SDK, or both) to the owner, scaffolds the lib/ai adapter, protects every model call, optionally wires local models, builds the first feature through the adapter, and records it. Never commits.
---

# AI setup

> **Outside Claude Code** (Codex, Copilot, Cursor, Gemini CLI): this skill is written in
> Claude Code's terms; map them to your own. If `${CLAUDE_PLUGIN_ROOT}` appears unsubstituted
> anywhere below, the standard's files are in `~/.agents/fleet/` instead. "The question tool"
> means your own ask-the-user tool, or a short question with numbered options in plain text.
> Named MCP tools (`mcp__github__*`, `mcp__Trello__*`) mean whatever GitHub or Trello
> integration you have — an MCP server, `gh` — and with none, say so and skip that step.
> Never skip a step silently because a Claude-specific name did not match.

Adds AI to a project — new or existing — the way `project-rules.md` §AI describes, instead
of improvising. Read §AI in full before Step 1; this skill is the process, §AI is the rules.

Throughout: choices through the question tool, open questions in prose (§ASK). **No
dependency is installed without the owner's OK** (§AGENTS), and every package's current
version and API is checked first — npm for the version, Context7 or the provider's docs for
the API (§PACKAGES). AI SDKs change fast; never write their code from memory.

## Step 1 — What is already here

Read `CLAUDE.md`, `decisions.md`, `package.json`, and search the code for existing AI use:
imports of `firebase/ai` (or its older name `firebase/vertexai`), `ai` and `@ai-sdk/*`,
`@anthropic-ai/sdk`, `openai`, `@google/genai`, `@google/generative-ai`, and calls to
`localhost:11434` or `localhost:1234`.

- **Tooling already decided in `decisions.md`** → follow it; skip Step 3.
- **AI in the code but no decision recorded** → describe what is there and ask the owner to
  confirm it as the project's tooling, or to choose afresh in Step 3.
- **Calls scattered outside an adapter** → list them. **Do not refactor unasked.** Offer to
  move them behind `lib/ai/` now, or record them in `conventions.md` as known and queued, to
  convert on touch (`adopting-the-standard.md`).
- **No AI yet** → Step 2.

## Step 2 — The brief

Establish, from the project's spec where there is one and by asking in prose otherwise:

- the feature or features, and what each one returns — free text, a structured object, a
  chat, an agent that takes actions;
- where it runs — in the browser, or on the server;
- what data reaches the model, and whether any of it is personal or sensitive;
- who can trigger it — signed-in users only, or anyone;
- rough expected volume, and any budget the owner has in mind;
- whether the owner wants local models (Ollama, LM Studio) for development or for a tool
  that runs on their own machine.

Play it back in a few lines.

## Step 3 — The owner's choice of tooling

Put the three options from §AI to the owner with the question tool — **Firebase AI Logic**,
**Vercel AI SDK**, **both** — with each one's trade-offs for *this* brief and a
recommendation. Local models need the AI SDK; say so if the brief wants them. Record the
choice and the reason in `decisions.md`. It is never imposed, and the other option is never
added later without asking.

## Step 4 — Scaffold `lib/ai/`

After the owner approves the packages:

```
lib/ai/
  types.ts       the interface, in domain terms (suggestOutfit, never callGemini)
  index.ts       the active adapter
  <impl>.ts      one per tool the project uses (firebase.ts, ai-sdk.ts)
  mock.ts        deterministic responses for development and tests
  models.ts      task -> provider and model ID, from env where dev and prod differ
  prompts/       one file per task, typed inputs
```

- **AI Logic:** reuse the project's Firebase client (`lib/firebase/client.ts`, §FIREBASE);
  create it if it does not exist.
- **AI SDK:** calls live in Route Handlers or Server Actions. Provider keys go in
  `.env.local`, server-only — never `NEXT_PUBLIC_` (§SECURITY).
- Model IDs come from the provider's current docs, checked today.

## Step 5 — Protect every model call

Before anything is user-facing (§AI):

- **AI Logic:** App Check registered and enforced, limited-use tokens preferred, per-user
  quotas set. Enforcement and quotas live in the Firebase console — list exactly what the
  owner has to click, and do not mark this step done until they confirm.
- **AI SDK:** routes require an authenticated user and rate-limit per user on the server. If
  the project has no rate limiter, propose options (a Firestore counter, a hosted limiter)
  and let the owner choose.
- Output caps (max tokens) set per task.

## Step 6 — Local models (AI SDK only, if wanted)

- Base URL and model name from environment variables — Ollama `http://localhost:11434/v1`,
  LM Studio `http://localhost:1234/v1`, through the AI SDK's OpenAI-compatible provider.
- Ask the owner which model; use the name exactly as `ollama list` or LM Studio shows it.
- Make one real call from the server side of the dev app and show the response. If the
  server is not running or the model is missing, say so plainly.
- Remind the owner: a deployed app cannot reach their PC, and small local models are weaker
  at tool calling and structured output — test with the model that will serve the feature.

## Step 7 — The first feature

Build one feature from the brief end to end, through the adapter:

- a zod schema for any structured output (§AI, §STATE), parsed on every response, one retry
  then an error state;
- a prompt file with typed input, user input delimited from instructions;
- output treated as untrusted — never raw HTML, never executed;
- tools, if any: zod-parsed arguments, server-side permission checks, user confirmation for
  side effects;
- the interface: streaming, a skeleton while waiting, stop and retry, an error state that says
  what to do, AI-generated content marked (§QOL). Any visual work goes through the mockup
  loop first (§OWNER) and fits the project's motif (§DESIGN).

## Step 8 — Record

- **`environment.md`** — each provider: what data reaches it, the env var names (never
  values), who owns the account.
- **`decisions.md`** — the tooling choice (Step 3), the models chosen and why.
- **`CLAUDE.md`** — the technology table and any AI-specific traps found.
- **`components.md`** — any AI interface components added.

## Step 9 — Verify and report

- Unit tests against the mock adapter; fixture inputs for the new prompt, checked for
  properties of the output (§TESTING).
- `npx tsc --noEmit`, then `npm run build` — it must pass.
- A real call against the production model, if keys are available. If not, say the feature
  is verified only against the mock or a local model.

Report what was set up, what the owner still has to do (console steps, keys), and what is
verified versus assumed. **No git** — it lands at the owner's checkpoint (§GIT).

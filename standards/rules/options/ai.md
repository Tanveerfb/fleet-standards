# Fleet rules — option: AI and model features (`rules/options/ai.md`)

**Loaded by:** nothing by default. Read on demand, by projects that chose it.
One file of the fleet standard. `project-rules.md` is the core: its §SCOPE lists every file in
the set and who loads it, and its header carries the one version they share.

---

## §AI — AI and LLM features

Applies wherever a project calls a language model — generation, chat, summaries,
classification, extraction, agents.

**The owner chooses the AI tooling — it is never imposed.** When AI first enters a project,
put the options to the owner with the question tool, with the trade-offs and a
recommendation drawn from the project's requirements, and record the choice and the reason in
`decisions.md`. Once chosen, it is the project's tooling: never bring in the other option
later without asking.

| Option | Suits an owner who | Trade-offs |
| --- | --- | --- |
| **Firebase AI Logic** (`firebase/ai`) | Wants to stay inside Firebase — auth, data and AI in one console and one bill | Gemini models only; calls run from the client; no server key to manage, protected by App Check and Firebase quotas. No local models |
| **Vercel AI SDK** (`ai` plus a provider package) | Wants versatility — any provider, Claude among them, local models, chat UIs, agents | Calls run on the server, so the project manages provider keys and its own rate limiting. One API across providers, zod schemas passed straight to `generateObject`, `useChat` for streaming chat UIs |
| **Both** | Wants simple client-side Gemini features *and* server-side or non-Gemini work | Two tools to keep track of; the adapter keeps them behind one interface. `decisions.md` records which task uses which |

The AI SDK is a free, open-source library: the project pays the model provider directly with
its own key, and it runs on any Node host. Vercel's AI Gateway is a separate, optional,
usage-billed service — not needed to use the SDK.

Everything below applies whichever option is chosen. **The `ai-setup` skill runs the whole
process** — use it rather than improvising, in a new project or an existing one.

- **Behind an adapter, like §DATA.** Every model call goes through `lib/ai/`: an interface in
  domain terms (`suggestOutfit`, `summariseNote` — never `callGemini`), one implementation per
  tool or provider the project uses, and a mock. Components never import a model SDK. Changing provider, or sending a
  task to a local model in development, touches one file
- **Model choice in one place.** `lib/ai/models.ts` maps each task to a provider and a model
  ID, read from environment variables where it differs between development and production. IDs go stale
  fast — check them against the provider's current docs before use (§PACKAGES), never from
  memory, and never inline in a component
- **Protect every model call before it ships — an unprotected one is an open bill.** With AI
  Logic: enforce App Check, prefer limited-use tokens (`useLimitedUseAppCheckTokens`), and
  set per-user quotas in the Firebase console. With AI SDK routes: require an authenticated user,
  rate-limit per user on the server, and keep provider keys server-only, never
  `NEXT_PUBLIC_`
- **Structured output is validated with zod.** The zod schema is the single source of truth.
  The AI SDK takes it directly (`generateObject`); for AI Logic, convert it with
  `z.toJSONSchema` for `responseJsonSchema`, then parse the response with the same schema
  (§STATE). A response that fails
  parsing is retried once, then shown as an error state — never rendered half-valid
- **Prompts are code.** They live in `lib/ai/prompts/`, one per task, with typed inputs. User
  input is clearly delimited from instructions and never concatenated into them
- **Model output is untrusted.** Never rendered as raw HTML, never executed, never used as a
  URL, query or file path without validation. A model can be talked into anything its input
  says
- **Tools and agents.** Tool arguments are parsed with zod; permissions are checked on the
  server, never trusted from the model (§SECURITY); anything with side effects — sending,
  paying, deleting, writing on someone's behalf — needs the user's confirmation
- **AI is not exempt from §QOL.** Stream long output; show a skeleton while waiting; offer
  stop and retry; give every failure an error state that says what to do. Mark AI-generated
  content where a user could mistake it for a person's or a verified fact
- **Cost is a design constraint.** Cap output tokens per task, rate-limit per user, cache
  repeated work (prompt caching where the provider supports it), and log usage — tokens and
  cost per task — never the content
- **Privacy is recorded.** `environment.md` names each AI provider, what data reaches it, and
  who owns the account. Send the minimum; strip personal data a task does not need

**Local models (Ollama, LM Studio)** need the AI SDK, and are for development and for tools
that run on the owner's own machine. A project on AI Logic alone develops against the mock
adapter instead.

- Both serve an OpenAI-compatible API (Ollama `http://localhost:11434/v1`, LM Studio
  `http://localhost:1234/v1`), which the AI SDK reaches through its OpenAI-compatible
  provider. The same code then runs a local model in development and a cloud model in
  production — only the provider, base URL and model name change, all from environment
  variables. Call it from the server side of the app; a browser calling `localhost`
  directly runs into CORS
- Use the model name exactly as the tool lists it (`ollama list`, LM Studio's model list)
- Use them to build and test AI features without API cost, and for features in local-only
  tools. **A deployed app cannot reach a model on the owner's PC** — production uses a cloud
  provider
- Choose models that fit the hardware: on a 16 GB GPU, roughly up to 14B parameters at 4-bit
  quantisation runs comfortably, about 20B with care. Smaller local models are weaker at
  tool calling and structured output, and their output differs from the production model's,
  so a feature is only verified once it runs against the model that will serve it
- Chrome's built-in on-device model, through AI Logic's hybrid mode (`InferenceMode`), is a
  separate option for small private tasks in the user's browser, with a cloud fallback

**Testing (§TESTING).** Unit tests run against the mock adapter. Each prompt that matters
keeps a small set of fixture inputs, checked for properties of the output — it parses, it
stays within length, it names no forbidden thing — not exact text.

---
name: design-motif
description: Use when a project's look needs deciding — e.g. "set the design", "choose a motif", "pick a theme", "design direction", "redesign", "design overhaul", "what motif should this be", "surprise me with a design". Runs the fleet motif process end to end — checks for an existing motif, gathers the brief, offers browse / recommend / surprise me / bring your own, picks a family and variant (or researches a universe-inspired brief), loops on mockups until the owner locks it, then records it in design-system.md and decisions.md. Proposes tokens only after the motif is locked.
---

# Design motif

> **Outside Claude Code** (Codex, Copilot, Cursor, Gemini CLI): this skill is written in
> Claude Code's terms; map them to your own. If `${CLAUDE_PLUGIN_ROOT}` appears unsubstituted
> anywhere below, the standard's files are in `~/.agents/fleet/` instead. "The question tool"
> means your own ask-the-user tool, or a short question with numbered options in plain text.
> Named MCP tools (`mcp__github__*`, `mcp__Trello__*`) mean whatever GitHub or Trello
> integration you have — an MCP server, `gh` — and with none, say so and skip that step.
> Never skip a step silently because a Claude-specific name did not match.

Sets — or records — the one motif a project's interface is designed around
(`project-rules.md` §DESIGN). The catalogue and the rules for using it are
`${CLAUDE_PLUGIN_ROOT}/motifs.md`. **Read it in full before Step 3**; this skill is the
process, the catalogue is the content.

Throughout: choices go through the question tool, open questions go in plain prose so the
owner can answer by voice (§ASK). Never invent a colour, type size or spacing value — every
value is a proposal until the owner approves it (§DESIGN).

## Step 1 — Is there a motif already?

Read the project's `design-system.md` (and `CLAUDE.md`, `decisions.md`) if they exist.

- **A motif is recorded.** Say which, and ask once: is this a redesign, or was the skill
  invoked by mistake? Not a redesign → stop.
- **No record, but the project has a clear visual identity** (an existing site). Describe
  what is there, name the closest family and variant — or Custom — and ask the owner to
  confirm it. On a yes, go to Step 7 and record it. **Do not re-choose a motif the project
  already has.**
- **Nothing yet** (a new project, or an identity being replaced) → Step 2.

## Step 2 — The brief

A motif is chosen for a purpose and an audience, so establish:

- what the site is for, and its one primary task;
- who uses it, and on what device and in what setting (a phone outdoors is a different
  problem from a desk dashboard);
- tone in a few words, and anything off the table;
- existing brand colours or tokens that must survive;
- accessibility needs beyond the baseline (care audiences, sensory sensitivity);
- public, commercial or personal.

**Read before asking.** If the project has a spec — its own `README`/`docs`, or a folder in
the owner's plans repo — take what it says and ask only for what is missing, as open
questions in prose. Play the brief back in three or four lines.

## Step 3 — The way in

Ask with the question tool:

| Option | Then |
| --- | --- |
| **Browse** | Show the catalogue grouped as in `motifs.md` — family names and one line each. Offer a shortlist of the three families that best fit the brief as options; the owner can name any other. |
| **Decide for me** | Recommend the best-fitting family and variant with the reason, plus one or two runners-up, as options. |
| **Surprise me** | Pick at random among the families that suit the brief — say how many qualified — and give one line on why the pick fits. Never pick one that works against the purpose. |
| **Bring my own** | A fictional world → Step 4b. Anything else → Step 4c. |

## Step 4 — Family and variant

### 4a. Catalogue family

Offer, with the question tool: the family's named variants, one or two suggested variants
of your own — **one built from the existing tokens if the project has any** — and *decide
for me*. Custom is the free-text answer. A blend of two motifs only if the owner asks for
one; record it as its own motif.

### 4b. Universe-inspired

Follow `motifs.md` → *Universe-inspired* exactly:

1. Ask which world — open question, no options.
2. Research its design language on the web, not from memory. Note sources; say what could
   not be confirmed.
3. Ask scoping questions until the goal is unambiguous — which part or era, which palette
   sources, how literal, how in-universe, what audience.
4. Write the motif brief back and get it confirmed.

**Inspired, never copied** — no characters, likenesses, names, logos or traced art.

### 4c. Custom

Turn the owner's description into an entry — signature elements, what it suits, what to
watch — and get it confirmed.

## Step 5 — Mockup loop

Build a static HTML mockup in the gitignored `public/_mockups/` (§OWNER), rendering desktop
and a 390px phone from the same markup. It shows:

- the motif in its **signature places** — hero, an empty state, the moment the product
  exists for;
- an **ordinary form and table** in the same motif, proving that restraint holds and
  content stays readable;
- the entry's **watch-outs**, checked — contrast, reduced motion, performance.

Show it the way this environment allows (open the file, a preview, an artifact), ask what
works and what does not, and revise. **Keep going until the owner says it is locked** — one
mockup is a starting point. Offer an alternative variant when feedback says the direction is
wrong rather than the details.

On lock, move the approved mockup to `docs/design/motif.html` (committed, never deployed).

## Step 6 — Check the result against the rules

Before recording: sentence case, state never by colour alone, don't state the obvious,
icon-only controls have accessible names, `prefers-reduced-motion` honoured. Fix the mockup
if any fail.

## Step 7 — Record it

1. **`design-system.md`** — create it if absent (it has content now, §DOCS). Add the motif
   block from `motifs.md`: family and variant, how it was chosen, signature elements,
   off-limits, colour schemes, palette sources.
2. **`decisions.md`** — a dated entry: the motif, the way in, the alternatives offered and
   why they lost.

From here the motif is a standing rule for every visual change in this project.

## Step 8 — Next, on the owner's say-so

Offer, without starting any of it unasked:

- a **starter kit** or a **full motif spec** (`motifs.md` → *Three levels of detail*);
- **tokens** in `@theme` derived from the locked mockup;
- the **shadcn pass** — primitives customised to the tokens (§SHADCN).

No git (§GIT). Report: the motif and variant, where it is recorded, the locked mockup's
path, and what is offered next.

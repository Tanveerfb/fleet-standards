# Design motifs

A **motif** is the one theme a project's interface is designed around — chosen once, then
carried through palette, type, shapes, texture, iconography, copy voice and motion. Every
design decision after that is checked against it. `project-rules.md` §DESIGN says when a
motif is chosen and how it is recorded; this file is the catalogue to choose from.

## How a motif is used

- **One motif per project.** A deliberate blend (Classroom with Shonen ink, say) is allowed
  only when the owner approves it, and it is recorded like a motif of its own.
- **A project that already has a motif keeps it.** Record what is there; do not re-choose.
- **Custom is always an option.** The owner describes a motif in their own words, and it gets
  the same treatment as a catalogue entry.
- **Restraint.** The motif shows in signature places — the hero, empty states, the moment the
  product exists for. Forms, tables and body text stay plainly readable. The motif serves
  the product, never the other way round.
- **The watch-outs are a checklist.** Most motifs have a predictable accessibility or
  performance trap; each entry names it.

## Three levels of detail

| Level | What it is | When |
| --- | --- | --- |
| **Entry** | Signature elements, what it suits, what to watch | The catalogue below — always |
| **Starter kit** | Proposed font pairing, palette direction, how shadcn primitives are treated (radius, borders, shadows, focus), iconography, texture and illustration, copy voice, motion feel | When the owner asks, once a motif is chosen |
| **Full motif spec** | A complete `design-system.md` draft plus a set of mockups | When the owner asks, usually at a redesign |

A starter kit and a full spec are **proposals**. Every value in them goes through the
mockup loop (§OWNER) and is the owner's to approve — §DESIGN's rule against inventing
values still holds.

---

## The catalogue

### Paper and school

**Stationery / school** — ruled and grid paper, sticky notes, washi tape, pencil underlines,
handwritten accents, paperclips.
*Suits:* planners, learning tools, kids, side projects.
*Watch out:* handwritten fonts for accents only, never body text.

**Classroom** — chalkboard surfaces, chalk texture, gold stars, report cards, pinned notices.
*Suits:* tournaments, quizzes, leaderboards, onboarding.
*Watch out:* chalk-on-dark contrast; chalk texture behind text hurts legibility.

**Scrapbook / collage** — torn paper, photos, stickers, tape, layered cut-outs.
*Suits:* journals, memories, portfolios, event recaps.
*Watch out:* clutter. Layering must never hide controls or content.

### Soft and tactile

**Soft claymorphism** — puffy rounded shapes, paired inner and outer shadows, pastels, a
"squish" on press.
*Suits:* consumer and lifestyle apps, playful tools.
*Watch out:* low contrast between surfaces; state must read without relying on shadows.

**Glassmorphism** — frosted translucent layers over colour, soft borders, depth through blur.
*Suits:* dashboards, product showcases, media apps.
*Watch out:* text over blur often fails contrast; heavy blur costs performance on phones.

**Tactile hardware** — knobs, switches, sliders, LED readouts, physical-device detailing.
*Suits:* audio tools, maker tools, settings-heavy apps.
*Watch out:* skeuomorphic controls must still behave like standard, accessible inputs.

**Cozy storybook** — watercolour, rounded serifs, small hand-drawn illustrations.
*Suits:* kids, recipes, journaling, gentle consumer products.
*Watch out:* illustration weight on mobile; keep body type a plain readable face.

### Bold and graphic

**Neo-brutalism** — thick black borders, hard offset shadows, flat saturated blocks, raw grids.
*Suits:* indie tools, startups, creative portfolios.
*Watch out:* can feel heavy in dense data screens.

**Memphis / 80s pop** — squiggles, confetti shapes, clashing pastels, geometric patterns.
*Suits:* events, youth brands, playful marketing.
*Watch out:* patterns behind text; keep the noise in decoration, not content areas.

**Retro pixel / 8-bit** — pixel fonts, sprites, chunky bordered UI, limited palettes.
*Suits:* games and game-adjacent tools, nostalgic sites.
*Watch out:* pixel fonts are for headings and labels only, never body text.

**Comic book / pop art** — halftone dots, speech bubbles, bold primaries, panel layouts.
*Suits:* entertainment, community sites, playful products.
*Watch out:* halftone textures and busy panels behind text.

**Shonen ink** — bold ink lines, screentone and halftone, speed lines, manga panels,
onomatopoeia lettering.
*Suits:* gaming, fan communities, tournaments, story apps.
*Watch out:* textures cost performance; sound-effect lettering must not fight readable copy.

### Dark and techy

**Cyberpunk / neon** — magenta and cyan neon on near-black, glow, rain-slick reflections,
scanlines, angled corners, monospace accents.
*Suits:* gaming, dev tools, monitoring.
*Watch out:* neon text fails contrast at small sizes; flicker and glitch stop under
`prefers-reduced-motion`.

**Cyberpunk / yellow** *(2077-inspired)* — hazard yellow dominant on black, red and cyan as
secondary signals, clipped corners and slashed edges, glitch transitions, dense HUD readouts,
corporate signage, barcodes and serial numbers, katakana accents.
*Suits:* gaming, tournaments, bold landing pages, dev tools.
*Watch out:* large areas work as black text on yellow, not the reverse; glitch effects stop
under reduced motion. Inspired by, not copied from — no game logos, wordmarks or faction
names.

**Synthwave** — sunset gradients, grid horizons, chrome type, retro-futurist glow.
*Suits:* music, gaming landing pages, event sites.
*Watch out:* gradients behind text; keep it to heroes and accents.

**Terminal / CLI** — monospace throughout, green or amber on black, prompts and cursors,
ASCII framing.
*Suits:* dev tools, local LLM tools, admin panels.
*Watch out:* monospace body text is slow to read at length; green-on-black contrast varies.

**Sci-fi HUD** — thin linework, brackets and corner marks, live readouts, scanning motion.
*Suits:* ops dashboards, monitoring, data-heavy tools.
*Watch out:* thin lines and small type at low contrast; motion must not distract from data.

**Industrial / dispatch board** — dense status boards, signal colours, stencil labels, plain
utilitarian type.
*Suits:* operations, logistics, field service, anything with dense live state.
*Watch out:* signal colours carry meaning — never colour alone (§DESIGN).

### Calm and refined

**Minimalist / editorial** — generous whitespace, a strong type scale, serif headings, one
accent colour.
*Suits:* content-led products, portfolios, blogs, reading.
*Watch out:* drifting into bland; spend boldness in one place.

**Japandi / zen** — muted natural tones, wabi-sabi texture, lots of space, quiet type.
*Suits:* wellness, reading, journaling, slow products.
*Watch out:* low-contrast muted palettes; quiet must not mean hard to find.

**Art deco / luxury** — gold linework, geometric frames, high-contrast serifs, symmetry.
*Suits:* premium products, events, hospitality.
*Watch out:* gold on light backgrounds fails contrast; ornament crowding small screens.

**Organic / nature** — earthy greens and browns, grain and leaf textures, soft curves.
*Suits:* food, outdoors, sustainability, wellbeing.
*Watch out:* earthy palettes sliding into low contrast; texture weight on mobile.

### Institutional

**NDIS / accessibility-first** — high contrast, large targets, plain language, generous
spacing, no reliance on colour or motion.
*Suits:* care, health, government, disability services.
*Watch out:* nothing to trade away here — this motif *is* the accessibility baseline.

**Consumer-warm** — friendly rounded type, warm neutrals, soft imagery, approachable copy.
*Suits:* marketplaces, hospitality, lifestyle.
*Watch out:* generic drift — warmth still needs one distinctive element.

---

## Universe-inspired

A motif inspired by a fictional world — an anime, a game, a film, a book series. **There is
no list**: it can be any world, so the agent asks rather than offering options, and owns
getting it right.

1. **Ask which world.** An open question — no option list.
2. **Research it on the web, not from memory.** The source's design language: palettes,
   recurring symbols, lettering and sound effects, iconic objects, and how the art style
   shifts between parts, seasons or eras. Note the sources, and say plainly what could not
   be confirmed.
3. **Ask scoping questions until the goal is unambiguous.** For example, for *JoJo's Bizarre
   Adventure*:
   - **Which part** — one part, several, or the whole series blended?
   - **Palette sources** — which characters, factions or arcs? (Giorno's pink and gold,
     Bucciarati's white and blue.)
   - **How literal** — an obvious homage, or a subtle nod fans will catch?
   - **How in-universe** — decoration only, or the interface as in-world objects? (A Stand
     stat sheet with A–E ratings for profiles, a "To Be Continued" arrow for pagination,
     menacing ゴゴゴ lettering for attention states.)
   - **Audience** — public, commercial or personal, which sets how careful to be.
4. **Write a motif brief back to the owner** — what the agent understands they want: the
   research, the scope, the boundaries. The owner confirms or corrects it. The confirmed
   brief goes in `design-system.md`; the decision in `decisions.md`.
5. **Only then** propose tokens and component styles, through the mockup loop (§OWNER).

**Inspired, never copied.** No characters, likenesses, character names, logos, screenshots or
traced art — original illustration only. Palettes, stylistic devices and in-world *concepts*
(a stat sheet, a panel transition) are fair to draw on. A public or commercial project needs
more caution than a personal fan project, and the brief says which this is.

## Custom

The owner describes the motif. The agent turns it into an entry — signature elements, what
it suits, what to watch — and confirms it before any design work. A custom motif that proves
itself is worth proposing back into this catalogue (`propose-standard`).

## Recording a motif in `design-system.md`

```markdown
## Motif

**<Motif name>** — <catalogue entry, universe-inspired brief, custom, or a named blend>.
Chosen <date>; see decisions.md.

- **Signature elements:** <what carries the motif, and where it appears>
- **Off-limits:** <what the motif must not do here — including the entry's watch-outs>
- **Palette sources:** <for universe-inspired: which characters, factions or arcs>
```

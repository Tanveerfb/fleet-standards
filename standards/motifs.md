# Design motifs

A **motif** is the one theme a project's interface is designed around — chosen once, then
carried through palette, type, shapes, texture, iconography, copy voice and motion. Every
design decision after that is checked against it. `project-rules.md` §DESIGN says when a
motif is chosen and how it is recorded; this file is the catalogue to choose from.

## Choosing a motif — four ways in

The owner decides how much to decide. Offer all four; extra steps are optional, never forced.

| Way in | The owner | The agent |
| --- | --- | --- |
| **Browse** | Picks a family from the catalogue, then a variant | Shows the family's variants, suggested variants and Custom (below) |
| **Recommend** — *"decide for me"* | Describes the site: what it is for, who uses it, where and on what device | Proposes the best-fitting motif and variant with the reason, plus one or two runners-up |
| **Surprise me** — *"I'm feeling lucky"* | Nothing | Picks at random from the motifs that suit the project's purpose — never one that works against it (no Synthwave for a care provider) — and says in a line why it fits |
| **Bring your own** | Describes a custom motif, or names a fictional world | Follows **Custom** or **Universe-inspired** below |

Every route ends the same way: a mockup in the chosen motif, then the mockup loop (§OWNER)
until the owner locks it. A recommendation or a lucky pick is a starting point the owner can
reject, not a commitment.

## Families and variants

Each catalogue entry is a **family**. Once the owner picks a family, offer:

- **Named variants** — listed under the entry, where it has any.
- **Suggested variants** — one or two of the agent's own. **If the project already has
  design tokens, one suggestion is a variant built from the existing palette**, so the motif
  can arrive without throwing away the current identity.
- **Custom** — the owner's own take on the family.
- **Decide for me** — the agent picks the variant that best fits the project.

A family with no named variants still gets suggested and custom ones. A variant that proves
itself on a project is worth proposing back into this catalogue (`propose-standard`).

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
| **Starter kit** | Proposed font pairing, palette direction, how shadcn primitives are treated (radius, borders, shadows, focus), iconography, texture and illustration — including an optional mascot or character — copy voice, motion feel | When the owner asks, once a motif is chosen |
| **Full motif spec** | A complete `design-system.md` draft plus a set of mockups | When the owner asks, usually at a redesign |

A starter kit and a full spec are **proposals**. Every value in them goes through the
mockup loop (§OWNER) and is the owner's to approve — §DESIGN's rule against inventing
values still holds.

---

## The catalogue

35 families in seven groups. Variants are named starting points, not a closed list — the
agent can still suggest its own, and the owner can bring a custom one (see *Families and
variants*).

### Paper and craft

**Stationery** — paper textures, pencil and pen marks, sticky notes, tape, paperclips,
handwritten accents.
*Suits:* planners, learning tools, kids, side projects.
*Watch out:* handwritten fonts for accents only, never body text.
*Variants:*
- **Notebook** — ruled and grid paper, pencil underlines, margin doodles.
- **Planner** — pastel tabs, washi tape, stickers, bullet-journal layouts.
- **Desk** — kraft paper, sticky notes, paperclips, a corkboard backdrop.
- **Sketchbook** — rough pencil linework, annotations, unfinished marks, concept-sketch feel.

**Classroom** — school surfaces and rituals: boards, gold stars, report cards, pinned notices.
*Suits:* tournaments, quizzes, leaderboards, onboarding.
*Watch out:* board textures behind text hurt legibility; check contrast on dark boards.
*Variants:*
- **Chalkboard** — dark green board, chalk texture, eraser smudges.
- **Whiteboard** — bright board, marker colours, magnets and sticky notes.
- **Report card** — paper forms, red-pen marks, grades and gold stars.

**Scrapbook** — torn paper, photos, stickers, tape, layered cut-outs.
*Suits:* journals, memories, portfolios, event recaps.
*Watch out:* clutter. Layering must never hide controls or content.
*Variants:*
- **Photo album** — polaroids, photo corners, handwritten captions.
- **Zine** — photocopy grain, cut-out letters, stapled DIY layouts.
- **Mixed media** — paint, photo, type and texture layered together.

**Papercraft** — layered cut paper, depth from stacked sheets, soft drop shadows, folds.
*Suits:* storytelling, kids, landing pages, illustrated onboarding.
*Watch out:* stacked layers cost performance when animated; keep depth to a few levels.
*Variants:*
- **Cut paper** — flat coloured layers with crisp edges.
- **Origami** — folded geometric forms, crease lines, paper-white palette.

**Risograph** — two or three inks overprinted, visible grain, slight misregistration, bold
flat shapes.
*Suits:* creative studios, events, indie products, editorial.
*Watch out:* grain and overprint behind text; misregistration only on decoration.
*Variants:*
- **Duotone** — two inks, high contrast, poster energy.
- **Fluoro** — fluorescent pink and yellow inks over blue.

### Soft and tactile

**Claymorphism** — puffy rounded shapes, paired inner and outer shadows, a "squish" on press.
*Suits:* consumer and lifestyle apps, playful tools.
*Watch out:* low contrast between surfaces; state must read without relying on shadows.
*Variants:*
- **Soft clay** — soft pastels, matte surfaces, gentle shadows.
- **Toy plastic** — saturated glossy colours, rounder and bouncier.

**Neumorphism** — monochrome surfaces extruded and pressed from the background with soft
light and shadow.
*Suits:* settings, smart-home and device controls, focused single-purpose tools.
*Watch out:* the weakest contrast of any motif — controls and states need a second cue
(border, icon, colour) or they disappear.
*Variants:*
- **Light** — off-white surfaces, cool shadows.
- **Dark** — charcoal surfaces, subtle highlights.

**Glassmorphism** — frosted translucent layers over colour, soft borders, depth through blur.
*Suits:* dashboards, product showcases, media apps.
*Watch out:* text over blur often fails contrast; heavy blur costs performance on phones.
*Variants:*
- **Light frost** — white frosted panels over pale colour.
- **Dark glass** — smoked panels over deep colour.
- **Aurora** — glass over slowly shifting colour blobs.

**Tactile hardware** — knobs, switches, sliders, readouts, physical-device detailing.
*Suits:* audio tools, maker tools, settings-heavy apps.
*Watch out:* skeuomorphic controls must still behave like standard, accessible inputs.
*Variants:*
- **Retro hi-fi** — brushed metal, wood trim, VU meters, chunky toggles.
- **Modern synth** — flat device greys, one bright accent, crisp labels and grids.

**Cozy storybook** — hand-made illustration, rounded serifs, warm and gentle.
*Suits:* kids, recipes, journaling, gentle consumer products.
*Watch out:* illustration weight on mobile; keep body type a plain readable face.
*Variants:*
- **Watercolour** — soft washes, bleeding edges, muted tones.
- **Picture book** — bold gouache or crayon shapes, bright and chunky.
- **Fairytale** — gilded borders, ornate initials, enchanted-forest palette.

### Bold and graphic

**Neo-brutalism** — thick borders, hard offset shadows, flat colour blocks, raw grids.
*Suits:* indie tools, startups, creative portfolios.
*Watch out:* can feel heavy in dense data screens.
*Variants:*
- **Classic** — black borders, primary and saturated blocks.
- **Pastel** — the same hard edges with soft colours.
- **Raw web** — system fonts, default-looking HTML, deliberately unstyled.

**Comic book / pop art** — halftone dots, speech bubbles, panel layouts, bold primaries.
*Suits:* entertainment, community sites, playful products.
*Watch out:* halftone textures and busy panels behind text.
*Variants:*
- **Golden age** — aged paper, CMYK misregistration, vintage print.
- **Pop art** — big halftone dots, flat primaries, gallery-poster energy.

**Shonen ink** — bold ink lines, screentone, speed lines, manga panels, onomatopoeia
lettering.
*Suits:* gaming, fan communities, tournaments, story apps.
*Watch out:* textures cost performance; sound-effect lettering must not fight readable copy.
*Variants:*
- **Battle** — speed lines, impact frames, huge sound effects, high energy.
- **Manga page** — black-and-white screentone, panel grids, quieter storytelling.

**Maximalism** — more is more: layered patterns, clashing colour, dense ornament, big type.
*Suits:* fashion, art, culture, brands with a loud personality.
*Watch out:* needs strict calm zones for content and controls, or nothing can be read.
*Variants:*
- **Pattern clash** — bold competing patterns and saturated colour.
- **Eclectic** — curated clutter: mixed eras, objects and textures.

**Streetwear / graffiti** — spray paint, tags, sticker bombing, bold drops and badges.
*Suits:* fashion, music, youth brands, events.
*Watch out:* tag lettering is decoration only; keep content on clean surfaces.
*Variants:*
- **Graffiti wall** — painted textures, drips, bright tags.
- **Drop culture** — clean streetwear branding, limited-release badges, bold sans.

### Retro and nostalgic

**Memphis** — squiggles, confetti shapes, clashing pastels, geometric patterns.
*Suits:* events, youth brands, playful marketing.
*Watch out:* patterns behind text; keep the noise in decoration, not content areas.
*Variants:*
- **80s Memphis** — pastels, terrazzo, zigzags.
- **90s rad** — neon confetti, wavy lines, bright geometric clutter.

**Retro pixel** — pixel fonts, sprites, chunky bordered UI, limited palettes.
*Suits:* games and game-adjacent tools, nostalgic sites.
*Watch out:* pixel fonts are for headings and labels only, never body text.
*Variants:*
- **8-bit** — very limited palette, blocky sprites, NES-era energy.
- **16-bit** — richer palette, gradients, detailed sprites.
- **Handheld** — four shades of green, monochrome-handheld feel.

**Retro desktop** — the interface of an old operating system: windows, title bars, bevels,
icons.
*Suits:* portfolios, playful personal sites, nostalgic tools.
*Watch out:* nested windows on a phone; old-OS chrome must not break modern accessibility.
*Variants:*
- **90s desktop** — grey bevelled windows, blue title bars, chunky buttons.
- **Classic Mac** — 1-bit black and white, pinstripes, rounded windows.

**Synthwave** — retro-futurist glow, chrome type, gradients and grids.
*Suits:* music, gaming landing pages, event sites.
*Watch out:* gradients behind text; keep it to heroes and accents.
*Variants:*
- **Outrun** — sunset gradient, grid horizon, palm silhouettes, chrome.
- **Vaporwave** — pastel pink and teal, marble busts, old-OS windows.
- **Darksynth** — black and blood red, harder edges, menace.

**Mid-century modern** — atomic starbursts, boomerang shapes, teal and orange, 50s–60s print.
*Suits:* lifestyle, interiors, food, retro-leaning brands.
*Watch out:* busy atomic patterns; muted print palettes sliding into low contrast.
*Variants:*
- **Atomic** — starbursts, orbits, space-age optimism.
- **Print ad** — vintage advertising layouts, textured paper, bold slogans.

**Heritage** — period styles from before the 20th century: classical, ornate, historic.
*Suits:* museums, history, literature, premium and ceremonial brands, games with period
settings.
*Watch out:* blackletter and ornate type are display only; ornament crowds small screens.
*Variants:*
- **Neo-classical** — marble, columns, Roman capitals, laurels, symmetry.
- **Victorian** — ornate frames, engravings, sepia, damask patterns.
- **Gothic** — blackletter, pointed arches, deep reds and purples, candlelit dark.

### Dark and techy

**Cyberpunk** — near-black base, neon or signal colour, angular shapes, glitch transitions,
dense readouts, monospace and katakana accents.
*Suits:* gaming, tournaments, dev tools, monitoring, bold landing pages.
*Watch out:* bright text on black fails contrast at small sizes; flicker and glitch stop
under `prefers-reduced-motion`.
*Variants:*
- **Neon** — magenta and cyan glow, rain-slick reflections, scanlines.
- **Yellow** *(2077-inspired)* — hazard yellow dominant, red and cyan as secondary signals,
  clipped corners and slashed edges, corporate signage, barcodes and serial numbers. Large
  areas work as black text on yellow, not the reverse. Inspired by, not copied from — no
  game logos, wordmarks or faction names.
- **Corpo** — sterile white and chrome, thin type, one cold accent — dystopia in a suit.

**Terminal** — monospace throughout, prompts and cursors, text-mode framing.
*Suits:* dev tools, local LLM tools, admin panels.
*Watch out:* monospace body text is slow to read at length; check contrast per palette.
*Variants:*
- **Phosphor green** — green on black, CRT glow.
- **Amber** — amber on black, warmer and calmer.
- **Modern TUI** — colourful terminal-app palette, boxed panels, status bars.

**Sci-fi HUD** — thin linework, brackets and corner marks, live readouts, scanning motion.
*Suits:* ops dashboards, monitoring, data-heavy tools.
*Watch out:* thin lines and small type at low contrast; motion must not distract from data.
*Variants:*
- **Tactical** — olive and amber, grids, military readouts.
- **Starship** — clean blue and white, rounded panels, calm optimism.
- **Mecha** — warning orange, caution stripes, heavy-machinery labels.

**Industrial** — utilitarian type, signal colours, stencils, built for dense live state.
*Suits:* operations, logistics, field service, anything with dense live state.
*Watch out:* signal colours carry meaning — never colour alone (§DESIGN).
*Variants:*
- **Dispatch board** — split-flap boards, status rows, departure-board type.
- **Hazard** — yellow and black stripes, stencil labels, safety signage.
- **Control room** — dark panels, indicator lights, big readable numbers.

**Space** — starfields, nebulae, orbit lines, planets, deep dark gradients.
*Suits:* astronomy, science, AI products, ambitious landing pages.
*Watch out:* starfield motion and parallax under reduced motion; dark gradients behind text.
*Variants:*
- **Deep space** — near-black, nebula colour, glowing points.
- **Mission control** — NASA-era print, technical diagrams, cream and orange.

### Calm and refined

**Minimalist** — generous whitespace, a strong type scale, one accent colour.
*Suits:* content-led products, portfolios, blogs, reading.
*Watch out:* drifting into bland; spend boldness in one place.
*Variants:*
- **Editorial** — serif headings, magazine rhythm, pull quotes.
- **Monochrome** — black, white and grey only; type does all the work.
- **Soft minimal** — warm off-white, rounded corners, gentle greys.
- **Luxury type** — oversized high-contrast serifs, black, white and cream, fashion-house restraint.

**Japandi** — muted natural tones, texture, lots of space, quiet type.
*Suits:* wellness, reading, journaling, slow products.
*Watch out:* low-contrast muted palettes; quiet must not mean hard to find.
*Variants:*
- **Japandi** — light wood, linen, clay tones.
- **Zen garden** — ink wash, stone greys, raked-sand patterns.
- **Nordic** — cool whites, pale wood, soft blues.
- **Wabi-sabi** — imperfect and handmade: raw ceramic, paper and plaster textures, asymmetry.

**Art deco** — gold linework, geometric frames, high-contrast serifs, symmetry.
*Suits:* premium products, events, hospitality.
*Watch out:* gold on light backgrounds fails contrast; ornament crowding small screens.
*Variants:*
- **Gatsby** — black and gold, fans and sunbursts.
- **Miami deco** — pastel facades, curved corners, sunny palette.
- **Art nouveau** — flowing organic curves, florals, ornate frames.

**Dreamlike** — soft light, floating forms, impossible or otherworldly imagery.
*Suits:* creative portfolios, music, art, wellbeing, AI products.
*Watch out:* Surreal leans on custom illustration or 3D, which is expensive; glow and
gradients behind text.
*Variants:*
- **Ethereal** — airy gradients, soft light, pastel haze.
- **Surreal** — impossible objects, floating elements, dream logic.

**Academia** — libraries, leather, serif type, ink and candlelight.
*Suits:* reading, study, writing tools, book clubs, knowledge bases.
*Watch out:* dark sepia palettes losing contrast; ornament crowding long reading.
*Variants:*
- **Dark academia** — deep browns and greens, candlelit, old libraries.
- **Light academia** — cream, beige, sunlit study.

**Organic** — earthy colour, grain and leaf textures, soft curves.
*Suits:* food, outdoors, sustainability, wellbeing.
*Watch out:* earthy palettes sliding into low contrast; texture weight on mobile.
*Variants:*
- **Earthy** — browns, terracotta, grain.
- **Botanical** — illustrated leaves and flowers, greenhouse greens.
- **Solarpunk** — optimistic green technology, sunlight, clean energy.
- **Boho** — warm textiles, terracotta, macramé, plants, layered rugs.

### Institutional and product

**Accessibility-first** — high contrast, large targets, plain language, generous spacing, no
reliance on colour or motion.
*Suits:* care, health, government, disability services (including NDIS providers).
*Watch out:* nothing to trade away here — this motif *is* the accessibility baseline.
*Variants:*
- **High contrast** — strong colour contrast, bold focus states.
- **Low stimulus** — calm palette, no motion, minimal decoration, for sensory-sensitive
  audiences.

**Consumer-warm** — friendly rounded type, warm neutrals, soft imagery, approachable copy.
*Suits:* marketplaces, hospitality, lifestyle.
*Watch out:* generic drift — warmth still needs one distinctive element.
*Variants:*
- **Warm neutral** — sand, cream and terracotta.
- **Friendly bright** — clear brand colour, playful illustration.

**Clean SaaS** — neutral greys, one brand colour, crisp cards, clear data display.
*Suits:* B2B tools, dashboards, admin and productivity apps.
*Watch out:* the most generic motif of all — it needs one signature element (§SHADCN: never
ship it generic).
*Variants:*
- **Light product** — white surfaces, subtle borders.
- **Dark product** — dark surfaces, high-clarity data colours.
- **Bento** — a modular grid of tiles, each showing one feature or stat. A layout that suits
  many motifs, most at home here.

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

**<Motif family> — <variant>** — <named, suggested, custom; or a universe-inspired brief, or
a named blend>. Chosen <date> via <browse / recommend / surprise me / bring your own>; see
decisions.md.

- **Signature elements:** <what carries the motif, and where it appears>
- **Off-limits:** <what the motif must not do here — including the entry's watch-outs>
- **Colour schemes:** <light, dark, or both — and which is the default>
- **Palette sources:** <for universe-inspired: which characters, factions or arcs>
```

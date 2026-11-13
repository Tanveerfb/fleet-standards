# Fleet rules — interface (`rules/ui.md`)

**Loaded by:** anything with a visual surface.
One file of the fleet standard. `project-rules.md` is the core: its §SCOPE lists every file in
the set and who loads it, and its header carries the one version they share.

---

## §DESIGN — Design motif and system

Every project has a `design-system.md` defining its motif, palette, typography,
spacing, density, motion and exclusions. Build nothing before it exists.

**Every project has a motif** — one theme the interface is designed around,
carried through palette, type, shapes, texture, iconography, copy voice and
motion. The catalogue, and how each motif is used, is
[`motifs.md`](../motifs.md) in the master copy of this standard.

- **Choose it before designing** — at a new project, or at a redesign or design
  overhaul. Offer the five ways in from `motifs.md`: *show me* sample tiles, browse the catalogue,
  *decide for me* from a description of the site's purpose and audience,
  *surprise me* from the motifs that suit it, or bring your own. Each motif is a
  family: once one is picked, offer its named variants, one or two suggested
  variants — one built from the existing tokens where the project has them —
  Custom, and *decide for me*. Ground every suggestion in subject and audience:
  a tool used outdoors on a phone and a dashboard read at a desk are different
  design problems
- **A project that already has a motif keeps it.** Record it; do not re-choose
- **Universe-inspired** (a motif drawn from a fictional world) has no option
  list: ask which world, research it on the web, ask scoping questions, and get
  a written brief confirmed before any design work — the process is in
  `motifs.md`. Inspired, never copied
- **One motif.** A blend only with the owner's approval, recorded as its own
  motif
- **Record it** in `design-system.md` (the block is in `motifs.md`) and the
  choice in `decisions.md`. From then on it is a standing rule: new interface
  work fits the motif, and anything that does not is the owner's call
- **Restraint.** The motif lives in signature places; forms, tables and body
  text stay plainly readable
- **Starter kits and full motif specs** are produced on request — proposals,
  approved through the mockup loop (§OWNER) like any visual change
- **The `design-motif` skill runs this whole process** — use it rather than
  improvising one. `new-project` calls it before any interface work

Then, always:

- Do not invent colours, type sizes or spacing values. If none are defined, ask
- Spend visual boldness in one place; everything around it stays quiet
- Sentence case throughout, including buttons and table headers
- Never convey state by colour alone
- **Text on colour is designed, not guessed.** Every fill colour has a partner text colour,
  defined together as a token pair in `@theme` (`--color-danger` with `--color-on-danger`)
  and never improvised per component:
  - **Saturated mid-tone fills — red, green, blue, purple, orange — carry white text.** If
    white does not reach 4.5:1 (3:1 for large or bold text), **darken the fill until it
    does**; do not switch the text to black. The WCAG 2 formula often scores black higher on
    bright red or green (`#e53935`: white 4.23, black 4.97), and an agent that trusts the
    number picks black — which reads as muddy to the eye. The newer perceptual method (APCA)
    agrees with the eye. The darker fill passes with white (`#c62828`: white 5.62)
  - **Genuinely light fills — yellow, pastels, light tints — carry dark text**
  - **Every text-and-fill pair** in the tokens and the mockups is checked, and its ratio is
    recorded in `design-system.md`. Passing the number is necessary, not sufficient: a pair
    that looks muddy fails the owner's eye and is redesigned

---

## §COMPONENTS — Component registry

Every project has a `components.md` listing what exists.

- **Read it, and verify it against the filesystem, before building any
  component.** It is an index, not a source of truth
- If something close exists, extend it with a prop. Do not fork it
- Add what you build to the registry in the same commit

In a project without a component library (a game engine, a native app), the register may be
a table in `design-system.md`, one row per shared piece: the piece, its file, what it is,
and whose pick it was. A separate `components.md` is created when the table outgrows that
file. Either way, a new screen uses what is registered, and a hand-made copy of a registered
piece is a bug.

An unmaintained registry is worse than none, because it gets trusted.

---

## §QOL — Quality of life and utilities

Build the expected version, not a bare minimum needing immediate extension.

| Component | Expected |
|---|---|
| Table | Pagination, search, column filters, sortable columns, row selection, empty state, skeleton |
| List | Search, filter, empty state, skeleton |
| Form | Inline validation, submit loading state, success and error feedback, disabled while submitting |
| Modal | Backdrop close, Escape close, focus trap, loading state |
| Select | Search when over ten options, clear selection, loading state |
| Image | Skeleton, error fallback, lazy loading |
| Card | Skeleton variant |
| Input | Clear button, character count, password reveal — where applicable |
| Button | Sizes (sm, md, lg), outline and ghost treatments, loading, full width, leading and trailing icons |

Every list has a written empty state saying what to do next. Every async view has
a skeleton matching its final layout, not a spinner.

**Offer improvements proactively.** Where a screen would clearly benefit from an
unscoped utility — bulk actions, keyboard shortcuts, saved filters, export,
inline preview — propose it. Offer it; do not build it unasked.

Anything deliberately deferred gets a `// TODO:` naming what is missing.

---

## §PATTERNS — Interface patterns

**Button to modal overlay.** On pages carrying a lot of content, tools or
sub-sections, put secondary tasks behind a button that opens an overlay rather
than stacking them on the page. It keeps the primary task legible and scales as
the page grows.

Use for: filters and advanced search, create and edit forms, detail from a list,
settings, bulk actions, confirmations.

Do not use for: the page's primary task, anything repeated many times in a row,
or content that must be read alongside what is behind it — those want a panel or
an inline section.

Every overlay closes on backdrop click and Escape, traps focus, and returns
focus to the control that opened it.

---

## §MOTION — Motion

**Animation is decided by the owner at the mockup stage, not by this file.** Nothing is
banned on style. A mockup may be as animation-heavy as the idea calls for; the owner keeps
what works and cuts what does not (§OWNER).

Three things hold regardless:

- **`prefers-reduced-motion` is honoured.** Movement becomes an instant change or a short
  fade, and nothing essential is conveyed only through motion. This is accessibility, not
  taste, and no exception covers it
- **Motion never makes the app feel slow.** Nothing waits on an animation before it can be
  used, and it stays smooth on a mid-range phone. If it drops frames, cut it back
- **Durations, easings and springs are tokens** in `@theme` (§STYLING), recorded in
  `design-system.md` once a mockup settles them

Motion is verified on film, never from stills (§TESTING).

*§MOTION continues in `rules/web.md`: the library.*

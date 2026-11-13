# Fleet rules — the game-engine stack (`rules/game.md`)

**Loaded by:** games built in an engine.
One file of the fleet standard. `project-rules.md` is the core: its §SCOPE lists every file in
the set and who loads it, and its header carries the one version they share.

---

**Game-engine projects.** A game built in an engine (Godot first; Unity and Unreal are read
the same way) is real application code, so the non-application profile does not fit, and
the Node and Next.js files are written for a stack it does not have. It follows the **game-engine
profile**, recorded once at the top of `conventions.md` (`templates/conventions.template.md`
has the block). The project loads the core, `rules/app.md`, `rules/ui.md` and this file:

- **Apply in full:** the core, and §GROWTH, §MODULES and §SHORTCUTS in `rules/app.md`
- **Apply in spirit, read for the engine:**
  - §NAMING: the vocabulary in full; file and identifier case follow the engine's own style
    guide (GDScript: `snake_case` files and functions, `PascalCase` classes)
  - §DESIGN, §COMPONENTS, §QOL, §PATTERNS, §MOTION: wherever the game has the thing. The
    motif and tokens live in a code file, and `design-system.md` records them
  - Add-ons and plugins stand where npm packages do elsewhere (§PACKAGES, in `rules/node.md`,
    which a game does not load): the latest version compatible with the engine, its current
    documentation read before use, none that duplicates what the project has, each recorded
    in `decisions.md`
  - §BUILD: the engine's headless test run replaces `tsc`, lint and `npm run build`
  - §TESTING: the engine's test add-on (GUT in Godot) replaces Vitest; screenshots, and film
    for motion, replace the browser
- **Not applicable:** §LIFECYCLE, and everything in `rules/node.md` and `rules/web.md`, which
  a game does not load. Also §DATA, and the Firebase and AI options, until the game has saves,
  a backend or an AI feature; the day one arrives, that section is read for the project
- **Mockups (§OWNER)** are engine screenshots side by side, or HTML when the owner is on a
  phone, kept in `docs/mockups/`
- **Phone-first does not apply to a PC-only game.** It returns the day a phone build is
  planned

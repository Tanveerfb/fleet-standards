# Fleet rules — the game-engine stack (`rules/game.md`)

**Loaded by:** games built in an engine.
One file of the fleet standard. `project-rules.md` is the core: its §SCOPE lists every file in
the set and who loads it, and its header carries the one version they share.

---

**Game-engine projects.** A game built in an engine (Godot first; Unity and Unreal are read
the same way) is real application code, so the non-application profile does not fit, and
Parts B to E are written for a stack it does not have. It follows the **game-engine
profile**, recorded once at the top of `conventions.md` (`templates/conventions.template.md`
has the block):

- **Apply in full:** Part A, §SECURITY, §GROWTH, §MODULES, §SCALE, §SHORTCUTS
- **Apply in spirit, read for the engine:**
  - §NAMING: the vocabulary in full; file and identifier case follow the engine's own style
    guide (GDScript: `snake_case` files and functions, `PascalCase` classes)
  - §DESIGN, §COMPONENTS, §QOL, §PATTERNS, §MOTION: wherever the game has the thing. The
    motif and tokens live in a code file, and `design-system.md` records them
  - §PACKAGES: add-ons and plugins in place of npm packages; the documentation rule stands
  - §BUILD: the engine's headless test run replaces `tsc`, lint and `npm run build`
  - §TESTING: the engine's test add-on (GUT in Godot) replaces Vitest; screenshots, and film
    for motion, replace the browser
- **Not applicable:** §TS, §STRUCTURE, §LIFECYCLE, §STATE, §FORMS, §HOOKS, §NPM, §RUNTIME,
  §STYLING, §SHADCN. Also §DATA, §FIREBASE and §AI until the game has saves, a backend or an
  AI feature; the day one arrives, that section is read for the project
- **Mockups (§OWNER)** are engine screenshots side by side, or HTML when the owner is on a
  phone, kept in `docs/mockups/`
- **Phone-first does not apply to a PC-only game.** It returns the day a phone build is
  planned
- **This file is referenced, not imported**, as in the non-application profile: `CLAUDE.md`
  names the sections the profile keeps and says to read the section before working in it

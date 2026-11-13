# Fleet rules — the Next.js stack (`rules/web.md`)

**Loaded by:** web projects.
One file of the fleet standard. `project-rules.md` is the core: its §SCOPE lists every file in
the set and who loads it, and its header carries the one version they share.

---

## §STRUCTURE — Project structure

```
src/
  app/              routes only, grouped by route group or role
  components/       shared across two or more features
  components/ui/    the project's own component kit, on shadcn behaviour — see §SHADCN
  features/         feature-specific components, colocated
  hooks/            one hook per file
  lib/              clients, constants, helpers with a real name
  lib/domain/       pure business logic. No React, no storage
  lib/data/         data access adapter, where the project has one
  lib/ai/           AI adapter, model map and prompts — see §AI
  schemas/          zod schemas and inferred types, where zod is used
  stores/           zustand, one per domain
  styles/globals.css
public/
docs/STATUS.md      the living project record — §DOCS
```

**Promotion.** A feature component gaining a second consumer moves to
`components/` in the same commit that creates the second use. Not before.

**Import aliases.** Always `@/`. Never relative paths climbing directories.
Confirm `"paths": { "@/*": ["./src/*"] }` in `tsconfig.json`.

---

## §STATE — State and validation

**Zustand** where the project needs shared client state. A project with little
client state does not need a store. Confirm once, then apply consistently.

- One store per domain. Never one global store
- **Separate UI state from server data.** View context, form progress, filters
  and dialogs belong in a store. Server data does not get mirrored into one —
  mirroring produces two sources of truth that drift
- Selectors only. No derived data in a store. Actions describe intent
- `immer` for deeply nested updates. `persist` for only what must survive reload

**Zod** where the project handles external data: forms, API responses, uploads,
stored records. A static site with no inputs does not need it.

- One schema per entity, in `schemas/`
- Parse at every boundary — submission, response, stored data read
- Enums declared once in zod and imported. No scattered string literals
- Seed and fixture data parsed through the same schemas. If it will not
  validate, the schema or the data is wrong, and finding out early is the point
- Form schemas extend entity schemas. They never redefine them

---

## §FORMS — Forms, errors and data fetching

**Forms.** Simple forms — login, contact, search — use a `<form action={…}>` with
uncontrolled inputs: a Server Action where the work belongs on the server, a client function
where it must run in the browser (Firebase Auth sign-in, for example). `useActionState` holds
the pending and error state; `useFormStatus` drives the submit button. Complex forms —
multi-step, conditional, dynamic validation — use `react-hook-form` with `zod`. Never mix
controlled and uncontrolled inputs in one form. Validate on the client, and again on the
server; client validation is a courtesy, not a control.

**Errors.** `try`/`catch` around every async operation. Nothing fails silently.
`error.tsx` for route-level boundaries, error boundary components around complex
or third-party subtrees. Users never see a raw error — every fallback says what
happened and what to do, and does not apologise.

**Fetching.** Server Actions or Route Handlers for mutations. Client-side
fetching uses SWR or TanStack Query, never bare `useEffect` plus `fetch`.
Live data uses Firestore `onSnapshot` listeners, exposed by the data adapter as
a subscription method (§DATA), wrapped in a hook, and unsubscribed on unmount.
Loading, error and empty states handled every time.

---

## §HOOKS — Custom hooks

- Reusable stateful logic becomes a hook in `hooks/`
- One hook per file, the file kebab-case and the hook camelCase: `use-cart.ts` exports
  `useCart` (§NAMING)
- Return typed objects, not arrays, except for simple pairs

---

## §STYLING — Styling

- **Tailwind only.** No CSS Modules, no styled-components, no inline `style`
  objects except for genuinely computed values
- Tailwind v4 is CSS-first. Tokens live in `@theme` in `globals.css`. No
  `tailwind.config.ts` unless a plugin requires one
- **Never write a raw hex value, font size, spacing value, duration or easing
  in a component**
- Tokens are defined before any interface work begins

Where Tailwind becomes unreadable, the answer is a component, not a stylesheet.

---

## §SHADCN — Components: custom by design

**Every visible component is designed for its project — never a reskin.** shadcn, and the
Radix or Base UI primitives under it, supply *behaviour*: keyboard handling, focus
management, ARIA, positioning. Everything a user sees — shape, anatomy, texture, states,
motion — is designed for the project's motif (§DESIGN) and owned by the project. Changing
colours and radius on a stock component is not customisation; it is the generic look with a
different paint job.

**Taking time here is expected.** Component design is a phase of the build, not a pass over
the defaults.

- **The generic test.** If a component could drop into another project — or a stock shadcn
  demo — unchanged, it is not done. Every component carries the motif somewhere: its
  silhouette, edges, layers, texture, states, motion or sound
- **Be ambitious.** Propose non-standard forms that come from the motif — a button that is a
  stamped ticket, a progress bar that is a soundwave, tabs that are file folders, a toast that
  arrives as a note pinned to the board. Mockups show **two or three creative options per core
  component**, not one safe one, and the owner chooses
- **Anatomy can change, not just paint.** New shapes, layered parts, built-in ornament, and
  every state designed on purpose: rest, hover, press, focus, loading, disabled, error, empty
- **Behaviour stays standard and accessible.** Custom components are built on shadcn's
  behaviour primitives (or an equivalent), never hand-rolled focus traps or menus. Keyboard
  operable, visible focus, correct ARIA, `prefers-reduced-motion` honoured. A creative
  component that cannot be used from the keyboard is not done
- **Creative in form, clear in content.** Restraint (§DESIGN) and *don't state the obvious*
  (§OWNER) still hold: the component is distinctive, the information inside it stays plainly
  readable
- **The component round.** After the motif is locked and before feature work, a mockup round
  designs the project's core kit — navigation, buttons, inputs and selects, cards, tables and
  lists, dialogs and sheets, tabs, toasts, empty states, loading skeletons — plus the
  project's **signature component**, the one the product is remembered by. Each in all its
  states, at desktop and phone width. It may take several rounds; the owner approves each
  component
- **Recorded.** The locked designs go in `docs/design/components.html` (committed, never
  deployed), the components in `components.md` (§COMPONENTS), their values in `@theme`
- **Every project's kit is its own.** Never copied from another project, and no second
  component library added without asking
- Features compose the kit; restyling a kit component for one page is a repo-wide change
  (§OWNER)

---

## §MOTION — Motion

**Library.** `motion` (imported from `motion/react`; formerly Framer Motion) by default.
GSAP where it is genuinely the better tool, with the reason in `decisions.md`.

*§MOTION's rules are in `rules/ui.md`.*

---

## §TESTING — Testing

- **Interface changes are checked in a real browser by the agent**, at desktop width and at
  a 390px phone width (§OWNER). Use, in this order: **Claude's built-in browser**, then
  **Claude in Chrome**. Playwright or any other headless tool is the last resort, only when
  neither is available — and say so in the report

*§TESTING's universal rules are in the core, `project-rules.md`; unit tests are in `rules/node.md`.*

---

## Checklist — new project

The `new-project` skill walks this list with the owner.


- [ ] `create-next-app` with TypeScript, Tailwind, App Router, `src/`, `@/` alias
- [ ] `.gitignore` covers `.secrets/` and `.env*` (except `.env.example`) — first commit, before
      code
- [ ] `tsconfig.json` strict confirmed
- [ ] Node pinned to the deploy platform's major in `engines` and `.nvmrc` (§RUNTIME)
- [ ] `src/lib/env.ts` validates env at startup; `.env.example` committed with an `!.env.example`
      exception in `.gitignore` (§RUNTIME)
- [ ] Motif proposed and chosen, recorded in `design-system.md` (§DESIGN)
- [ ] `design-system.md` written and tokens in `@theme` before any UI work
- [ ] Component round done: the core kit and signature component designed in the motif,
      approved through mockups, built on shadcn behaviour (§SHADCN)
- [ ] Navigation style confirmed with the owner
- [ ] Zustand and zod confirmed as needed or not needed (§STATE)
- [ ] Data adapter interface defined, if the project has data (§DATA)
- [ ] Base components built: navigation, footer, button
- [ ] Document set created — only the files that have content (§DOCS)
- [ ] Structure matches §STRUCTURE; files named per §NAMING, with the filename lint rule offered
- [ ] MCP servers active: Context7, Next.js DevTools, shadcn, Firebase and
      Vercel where applicable, web search
- [ ] `.env.local` created, and every variable recorded by name and owner in
      `environment.md` (§FIREBASE for the Firebase set)
- [ ] If the project has AI features: the `lib/ai/` adapter and model map in place, every model
      call protected before any AI feature ships (§AI)
- [ ] Vitest installed and `npm test` wired (§TESTING)
- [ ] Trello board line in `CLAUDE.md` if the project has a board (§TRELLO)
- [ ] Studio credit and showcase decided, if the owner has a studio (§CREDIT)
      (§CREDIT)
- [ ] First `npm run build` passes clean
- [ ] `fleet` plugin enabled in `.claude/settings.json` (`sync-standards` writes it)
- [ ] `AGENTS.md` and `GEMINI.md` pointers at the root, if anyone works on the project with another agent (§TOOLS)
- [ ] **`project-rules.md` copied into the project root and `@project-rules.md` imported
      from `CLAUDE.md`** — and **committed**. An untracked copy is one `git clean` from gone.

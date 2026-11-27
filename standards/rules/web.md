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

**Mockups (§OWNER)** are static HTML, desktop and a 390px phone from the same markup, in a
gitignored `public/_mockups/` that the dev server serves; a locked one moves to
`docs/design/`, outside `public/`. **The architecture map (§SCALE)** follows the main flows
as form → Server Action → adapter → store, and its depends-on columns can come from
dependency-cruiser or madge.

---

## §RUNTIME — Node version and environment

- **`src/lib/env.ts` parses the environment** (§RUNTIME in `rules/node.md`): one schema for
  server variables, one for client (`NEXT_PUBLIC_`) variables
- **Server variables never reach the client.** The server half is imported only from server
  code (`import "server-only"`); components read the client half
- **Client variables are referenced one by one** — `process.env.NEXT_PUBLIC_X`, written out in
  full. Next.js inlines them at build time and cannot see a dynamic lookup such as
  `process.env[name]`
- A small library such as `@t3-oss/env-nextjs` does the same job; the owner chooses (§AGENTS)
- **Before pushing server-rendered changes, deploy a preview.** A green local build does not
  prove a dynamic route works on the platform (`adopting-the-standard.md`, section 5)
- **Security headers from the first deploy.** `next.config` sets a baseline on every route
  through `headers()`: `Content-Security-Policy: frame-ancestors 'self'` (or
  `X-Frame-Options: SAMEORIGIN`), `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and `Strict-Transport-Security` where
  the host doesn't add it. A fuller Content-Security-Policy is the project's choice, recorded
  in `decisions.md`. **`images.remotePatterns` names the project's own hosts and buckets**,
  never a wildcard over a shared service — `/v0/b/<project>.firebasestorage.app/**`, not
  `/v0/b/**`

*§RUNTIME's version pinning and the startup check are in `rules/node.md`.*

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

*§STATE's validation rules (zod) are in `rules/node.md`.*

---

## §FORMS — Forms, errors and data fetching

**Forms.** Simple forms — login, contact, search — use a `<form action={…}>` with
uncontrolled inputs: a Server Action where the work belongs on the server, a client function
where it must run in the browser (a client SDK's sign-in, for example). `useActionState` holds
the pending and error state; `useFormStatus` drives the submit button. Complex forms —
multi-step, conditional, dynamic validation — use `react-hook-form` with `zod`. Never mix
controlled and uncontrolled inputs in one form. Validate on the client, and again on the
server; client validation is a courtesy, not a control.

**Public writes are throttled.** Every form or route a visitor can submit without signing in
— contact, sign-up, a brief, a comment — has a **per-visitor rate limit** (a hashed IP, never
the raw address, counted where the project keeps data) and a **maximum length on every
free-text field** in its zod schema, so one request can't store megabytes. Add a bot check
(Turnstile or similar) where the form is a known spam target; it is a visible change, so it
goes through a mockup. A refusal answers 429 with a message that says what to do. One limiter
serves every public route; a new form reuses it.

**Errors.** `try`/`catch` around every async operation. Nothing fails silently.
`error.tsx` for route-level boundaries, error boundary components around complex
or third-party subtrees. Users never see a raw error — every fallback says what
happened and what to do, and does not apologise.

**Fetching.** Server Actions or Route Handlers for mutations. Client-side
fetching uses SWR or TanStack Query, never bare `useEffect` plus `fetch`.
Live data is a subscription method on the data adapter (§DATA), wrapped in a hook, and
unsubscribed on unmount. Loading, error and empty states handled every time.

---

## §HOOKS — Custom hooks

- Reusable stateful logic becomes a hook in `hooks/`
- One hook per file, the file kebab-case and the hook camelCase: `use-cart.ts` exports
  `useCart` (§NAMING)
- Return typed objects, not arrays, except for simple pairs
- Business logic taken out of a component (§MODULES) goes to a hook or a pure function;
  pure logic imports nothing from React, Next or any store

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
  phone widths of 390px and 360px (§OWNER). Use, in this order: **Claude's built-in
  browser**, then **Claude in Chrome**. Playwright or any other headless tool is the last
  resort, only when neither is available — and say so in the report
- **Before a release, and whenever someone reports a phone problem, check the phone engines
  themselves**, where the machine has them: **Android Chrome** on an emulator, and
  **Safari's engine (WebKit)** — through Playwright, the one exception to its being the last
  resort, since no built-in browser renders WebKit; on a Mac, the iOS simulator.
  `~/.claude/machine.md` lists what is installed and the commands. Name in the report which
  engines were checked and which were not. A desktop browser at phone size is a layout
  check, not proof of how a phone renders the page
- No end-to-end suite by default. If a project needs one, that is a decision, recorded in
  `decisions.md`

*§TESTING's universal rules are in the core, `project-rules.md`; unit tests are in `rules/node.md`.*

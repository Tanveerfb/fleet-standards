# Fleet rules — engineering (`rules/app.md`)

**Loaded by:** anything with application code.
One file of the fleet standard. `project-rules.md` is the core: its §SCOPE lists every file in
the set and who loads it, and its header carries the one version they share.

---

## §GROWTH — Building for growth

Assume every project outlives its brief. A demo becomes an MVP, an MVP gains a
second customer type, an internal tool gets opened to clients.

**Build for growth in the boundaries:**

- Data shapes, names and relationships — expensive to change, so get them right
- Access boundaries — permission checks, not role checks
- Data access behind an interface, so storage can change without touching
  callers (§DATA)
- Extensible representations — a list of priced lines rather than three named
  fee fields, so a fourth needs no migration
- Structure and naming that still make sense at ten times the size

**Do not build for growth in the features.** Speculative screens, settings
nobody asked for, configuration options with one caller — cost, not foresight.

The distinction: pay upfront where retrofitting is expensive, defer where it is
not. When unsure which side something falls on, ask.

---

## §MODULES — Modularisation and responsibility

There is no line limit. A file is the right size when it does one job.

**Split when any of these is true:**

- You cannot describe the file's job in one sentence without using "and"
- It exports more than one concern
- A component both fetches or computes data and renders it
- A store holds both UI state and domain data
- You scroll to navigate it rather than to read it
- Its name contains `utils`, `helpers`, `misc` or `common`

**Regardless of size:**

- One responsibility per file
- Business logic never lives in a component. Extract to a hook or a pure
  function
- Pure logic imports nothing from React, Next or any store
- Shared things live where their consumers can find them

Splitting a cohesive file into three fragments is worse than leaving it long.
Cohesion is the goal; brevity is a symptom.

---

## §NAMING — Naming

The words in the interface, the code and the documentation are the same words.

- Every project with more than a handful of entities keeps a glossary. Terms
  that sound alike get defined against each other explicitly
- If the interface calls it an offer, the type is `Offer` and the collection is
  `offers`. No synonyms, no internal-only vocabulary
- Name things by what the user understands, not by how the system is built
- An action keeps its name through the whole flow: the button that says
  "Publish" produces a toast that says "Published"

*§NAMING continues in `rules/node.md`: file and identifier case.*

---

## §DATA — Data access

Where a project has a backend, a mock backend, or any prospect of changing
either, **all reads and writes go through an adapter**.

```
lib/data/
  index.ts      the active adapter
  types.ts      the interface every adapter implements
  <impl>.ts     one file per implementation
```

- The interface is defined in **domain terms** — `listOffersForEngineer`,
  `submitRequest`. If a method name mentions a collection, a document or a
  query, it belongs one layer down
- No component reads storage directly
- A prototype's mock implementation and the eventual real one satisfy the same
  interface. That is what makes a prototype extensible rather than disposable

This is usually the single decision separating "we build on it" from "we start
again".

---

## §LIFECYCLE — Entity lifecycles

Where a record moves through states — orders, requests, applications, jobs:

- **Allowed transitions are declared once**, as an explicit map, in
  `lib/domain/`
- Nothing writes a status directly. Every change goes through a transition
  function that rejects illegal moves
- The state diagram lives in the project's documentation and is the
  specification the map implements
- Status history is append-only where an audit trail matters

Scattered status assignments produce records that are somehow both cancelled and
in progress, and the bug surfaces in production rather than in review.

---

## §SHORTCUTS — Prototypes and shortcuts

Where a build is deliberately incomplete — a demo, a phased delivery, a spike —
every shortcut is marked in code and registered in `demo-shortcuts.md`:

```ts
// DEMO: fee calculated client-side. Production computes server-side.
// See demo-shortcuts.md #4
```

The register lists what is fake, what replaces it, and the risk if it ships.
**It is the next phase's backlog.** An unmarked shortcut is a shortcut that
will ship.

Separate the shortcuts that are safe to build on — mock implementations behind
an adapter, seed data, structure — from those that must be torn out: simulated
payments, client-side authorisation, fake identity. Anything standing in for a
server-side rule is in the second group without exception.

---

## §BUILD — Comments, cleanliness and build discipline

- Comment non-obvious decisions and complex logic. Not obvious code
- JSDoc on exported functions and hooks
- No `console.log` left behind. No commented-out code
- No TODO surviving more than one session unless explicitly deferred in writing
- TypeScript and ESLint errors are blockers, not warnings. Warnings cleared
  before a task is done
- Nothing ships with a failing build

*§BUILD continues in `rules/node.md`: the typecheck, lint and build commands.*

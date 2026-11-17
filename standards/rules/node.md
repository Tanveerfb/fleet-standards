# Fleet rules — the Node and TypeScript stack (`rules/node.md`)

**Loaded by:** web projects and Node tools.
One file of the fleet standard. `project-rules.md` is the core: its §SCOPE lists every file in
the set and who loads it, and its header carries the one version they share.

---

## §NAMING — Naming

**Files and identifiers** — one spelling per kind of thing, so a search finds everything and
an agent copying the nearest pattern copies the right one:

| Kind | Case | Example |
| --- | --- | --- |
| Files and folders | kebab-case | `user-card.tsx`, `use-cart.ts`, `invoice-schema.ts` |
| Components and types | PascalCase | `UserCard`, `Invoice` |
| Functions, variables, hooks | camelCase | `formatPrice`, `useCart` |
| Zod schemas | camelCase with a `Schema` suffix | `invoiceSchema` |
| True constants | SCREAMING_SNAKE_CASE | `MAX_UPLOAD_SIZE` |

Framework-reserved file names (`page.tsx`, `layout.tsx`, `route.ts`) and tool configs keep
the names their tools expect — they are already lowercase. kebab-case files match what
shadcn and `create-next-app` generate.

- **New projects** use this from day one, enforced by a filename lint rule (ESLint's
  `check-file` or `unicorn/filename-case`) offered at setup
- **Existing projects keep the convention they have.** Record it in `conventions.md`; never
  mass-rename files to match — it is churn across every import and the history, with nothing
  gained for users
- **Renaming on Windows: always `git mv`.** Windows treats `Button.tsx` and `button.tsx` as
  the same file; git and the Linux build servers do not. A capitals-only rename made in the
  editor or File Explorer can look fine locally, never register in git, and fail the deploy
  with "module not found"

*§NAMING's vocabulary rules are in `rules/app.md`.*

---

## §TS — TypeScript

- **Strict mode always.** `"strict": true` is non-negotiable
- **JavaScript is a named choice for a local tool only**: chosen at setup, recorded in
  `decisions.md`, never for a web project, a client's project or anything deployed. It keeps
  the type checking: `.mjs` files, a `tsconfig.json` with `"checkJs": true`, `"strict": true`
  and `"noEmit": true`, types in JSDoc, and `tsc --noEmit` passing as it would for
  TypeScript. The rules below hold, written in JSDoc
- No `any`. Use `unknown` and narrow
- Props, parameters, return types and state are explicitly typed
- `type` for object shapes and unions. `interface` only when extending

**Where zod is in use, domain types are inferred from schemas:**

```ts
export const requestSchema = z.object({ /* ... */ })
export type Request = z.infer<typeof requestSchema>
```

There is no global `types/` directory. A hand-written type mirroring a schema
drifts from it. Non-domain types — props, UI unions, hook returns — are declared
in the file that owns them.

---

## §STATE — Validation and where logic lives

**Zod** where the project handles external data: forms, API responses, uploads,
stored records. A static site with no inputs does not need it.

- One schema per entity, in `schemas/`
- Parse at every boundary — submission, response, stored data read
- Enums declared once in zod and imported. No scattered string literals
- Seed and fixture data parsed through the same schemas. If it will not
  validate, the schema or the data is wrong, and finding out early is the point
- Form schemas extend entity schemas. They never redefine them

**Where logic lives.** Pure business logic in `lib/domain/` — no framework, no storage —
and the data adapter, where there is one, in `lib/data/` (`rules/app.md` §DATA,
§LIFECYCLE). The same two folders in a web project and a Node tool.

*§STATE continues in `rules/web.md`: client state with Zustand.*

---

## §PACKAGES — Packages and APIs

- Verify current versions on npm before installing

*§PACKAGES' rules for every language are in `rules/app.md`.*

---

## §NPM — Package manager

- **New projects use pnpm.** Vercel and Firebase (App Hosting and Cloud Functions) both pick
  it from `pnpm-lock.yaml`, checked 2026-11-18. Pin its version in `package.json`'s
  `packageManager` field. pnpm blocks dependencies' install scripts unless allowed, and
  Firebase's no-argument SDK setup needs one: allow it in `pnpm-workspace.yaml`
  (`allowBuilds`; `onlyBuiltDependencies` on pnpm 10 and older)
- **An existing project keeps its manager.** Most are on npm, which stays. Never switch a
  project's manager without asking, and keep exactly one lockfile: two lockfiles is a fault
  to fix, on the owner's word about which goes
- **The manager is named in the project's `CLAUDE.md`** (its *Commands*). Commands in this
  set are written for npm; a pnpm project runs the same with `pnpm` (`npm run build` is
  `pnpm build`, `npx` is `pnpm dlx`)

---

## §RUNTIME — Node version and environment

**Node runs the same major version everywhere the app runs** — on the owner's machine, in CI,
and on the deploy platform. A build that passes locally on one major and fails in production
on another is the failure this prevents: a dependency that is fine on one version and breaks
on the next does not show up until the deploy.

- **Pin to the deploy platform's version, not the local one.** At project start, check which
  Node majors the deploy target supports today and pick its current LTS. Record it in
  `decisions.md`; revisit when the platform retires it
- **Declare it twice, the same major in both:** `"engines": { "node": "<major>.x" }` in
  `package.json` — which a deploy platform reads to choose its runtime — and the major in `.nvmrc` at the
  root, which local version managers read. Use a version manager that switches automatically
  from `.nvmrc` (fnm, or nvm-windows on Windows); Volta, pinning through `package.json`, is the
  alternative
- **A version mismatch is a finding, not a warning.** If the local Node differs from the
  pinned major, switch before building, and say so in the report rather than building anyway
- **No version manager is a gap to fix, not to work around.** A single Node installed from
  the website serves every project at one version. When an agent finds that, it offers to
  walk the owner through setting one up (`adopting-the-standard.md`, section 5, has the
  Windows steps)

**Environment variables are checked when the program starts, not when something first
breaks.**

- **One module parses them with zod** (§STATE). A missing or malformed variable stops the
  program at startup with a message naming it
- **`.env.example` is committed:** every variable name with a one-line comment, never a value.
  `.gitignore` covers `.env*`, so it needs an `!.env.example` exception. `environment.md`
  (§DOCS) stays the record of what each variable is for and who owns the account; the example
  file is the starting point for a fresh clone

*§RUNTIME continues in `rules/web.md`: environment variables in Next.js, and the preview
deploy.*

---

## §BUILD — Comments, cleanliness and build discipline

- **During work:** `npx tsc --noEmit` and `npm run lint` after each change of
  substance, and fix what they report before moving on
- **`npm run build` before every checkpoint and before anything deploys.** It
  is the only check that proves the app builds — lint and typecheck do not

*§BUILD's rules on comments, leftovers and failing builds are in `rules/app.md`.*

---

## §TESTING — Testing

- **Unit tests with Vitest** for `lib/domain/` and `schemas/`. Pure logic is cheap to test,
  which is half the reason §MODULES keeps it pure. Every transition map (§LIFECYCLE) has
  tests for its illegal moves, not only its legal ones. `npm test` runs `vitest run`

*§TESTING's universal rules are in the core, `project-rules.md`; the browser check is in `rules/web.md`.*

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

## §PACKAGES — Packages and APIs

- Use the **latest version compatible with the framework and the rest of the
  dependency tree** — not simply the newest published. Check peer requirements
- Verify current versions on npm before installing
- Use **Context7 MCP** for version-specific documentation before implementing
  anything library-related
- If an API may have changed since training, fetch current docs. Do not assume
- Do not add a dependency duplicating something already in the stack. Record
  every new dependency in `decisions.md`

---

## §NPM — Package manager

- **npm is the fleet default.** Use it unless the project's own `CLAUDE.md` explicitly says
  otherwise.
- A project may pin a different manager for its own reasons. That is a per-project override,
  **documented in that project's `CLAUDE.md`**, not a fleet change. Do not switch a
  project's package manager without asking.

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
  `package.json` — which Vercel reads to choose its runtime — and the major in `.nvmrc` at the
  root, which local version managers read. Use a version manager that switches automatically
  from `.nvmrc` (fnm, or nvm-windows on Windows); Volta, pinning through `package.json`, is the
  alternative
- **A version mismatch is a finding, not a warning.** If the local Node differs from the
  pinned major, switch before building, and say so in the report rather than building anyway
- **No version manager is a gap to fix, not to work around.** A single Node installed from
  the website serves every project at one version. When an agent finds that, it offers to
  walk the owner through setting one up — on Windows: list global npm packages first
  (`npm ls -g --depth=0`, since they belong to one Node install and must be reinstalled),
  uninstall the website Node, `winget install Schniz.fnm`, add `fnm env --use-on-cd --shell
  powershell | Out-String | Invoke-Expression` to the PowerShell `$PROFILE`, then
  `fnm install --lts` and reinstall the global packages
- **Before pushing server-rendered changes, deploy a preview.** A green local build does not
  prove a dynamic route works on the platform (`adopting-the-standard.md`, section 5)

**Environment variables are checked when the app starts, not when a page first breaks.**

- **`src/lib/env.ts` parses them with zod** (§STATE): one schema for server variables, one for
  client (`NEXT_PUBLIC_`) variables. A missing or malformed variable stops the app at startup
  with a message naming it
- **Server variables never reach the client.** The server half is imported only from server
  code (`import "server-only"`); components read the client half
- **Client variables are referenced one by one** — `process.env.NEXT_PUBLIC_X`, written out in
  full. Next.js inlines them at build time and cannot see a dynamic lookup such as
  `process.env[name]`
- **`.env.example` is committed:** every variable name with a one-line comment, never a value.
  `.gitignore` covers `.env*`, so it needs an `!.env.example` exception. `environment.md`
  (§DOCS) stays the record of what each variable is for and who owns the account; the example
  file is the starting point for a fresh clone
- A small library such as `@t3-oss/env-nextjs` does the same job; the owner chooses (§AGENTS)

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

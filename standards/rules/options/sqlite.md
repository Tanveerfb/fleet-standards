# Fleet rules — option: SQLite (`rules/options/sqlite.md`)

**Loaded by:** projects that chose it at setup.
One file of the fleet standard. `project-rules.md` is the core: its §SCOPE lists every file in
the set and who loads it, and its header carries the one version they share.

---

## §SQLITE — SQLite

The backend for a local-first project: one device, its own data, nothing hosted. Chosen
instead of Firebase, not beside it; a project that chooses it needs no §FIREBASE exception.

- **The driver is chosen at setup and recorded in `decisions.md`:** `better-sqlite3` from
  Node (server-only: in Next.js, listed in `serverExternalPackages` and never imported by a
  client file), the standard library's `sqlite3` from Python. Plain SQL in the adapter is a
  fine choice; an ORM is a dependency, asked for like any other
- **All access goes through the adapter** (`rules/app.md` §DATA): one module owns the
  connection, and nothing else imports the driver. Every rule here is the adapter's job
- **Queries are parameterised, always.** Values go in as `?` parameters; only constants
  written in the code (a column list, a table name) are ever put into the SQL text
- **Every row is parsed on read** with the project's schemas (zod, pydantic), JSON columns
  included. The types come from the schemas, never from the SQL
- **Migrations are append-only.** Numbered, each applied once inside a transaction with its
  record in a `migrations` table, on every open. Never edit a migration that has shipped;
  add the next one
- **Set the pragmas on every open:** `foreign_keys = ON` (SQLite leaves it off),
  `busy_timeout`, and `journal_mode = WAL`; a database file meant to be copied whole (an
  export, a document) uses `DELETE` instead, so between writes it is one file
- **One connection per process.** Writes of more than one statement run in one transaction
- **Close the connection before moving or deleting the file.** Windows locks an open
  database, and its `-wal` or `-journal` file goes with it. After a migration in
  development, restart the dev server: hot reload keeps the old connection
- **The database lives in a gitignored data folder**, its path overridable by an
  environment variable checked at startup (§RUNTIME). **It is the device's only copy:** no
  `git clean -x`, no reset, no test, no script that points at it, ever. `CLAUDE.md` says so
  in a line
- **A backup exists before real data does.** `VACUUM INTO` or the driver's backup call, from
  a command or a button. A document that names a backup the code does not have is a bug
- **Tests use a database of their own:** `:memory:`, or a file in a temporary folder.
  Never the data folder
- **In Next.js,** a route handler or server component that reads synchronously calls
  `await connection()` first, or the read is prerendered at build

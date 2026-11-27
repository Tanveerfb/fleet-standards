# Fleet rules — the Python stack (`rules/python.md`)

**Loaded by:** tools written in Python.
One file of the fleet standard. `project-rules.md` is the core: its §SCOPE lists every file in
the set and who loads it, and its header carries the one version they share.

---

## §PYTHON — Python

`rules/app.md` holds for Python as for any language: §DATA's adapter, pure logic kept apart,
§BUILD's cleanliness, §TESTING's rules. This section is what Python does its own way.

**Two shapes, declared in `conventions.md`.** A **package**, an application or tool with
code that grows, takes every rule below. A **folder of scripts**, each run by path and kept
as a record of a job, takes the rules marked *every shape* and says in `conventions.md` that
it is one. A folder of scripts that grows shared logic becomes a package.

- **The interpreter is pinned** *(every shape)*. A package pins the minor in
  `.python-version` and `requires-python`: the newest one every dependency ships wheels for,
  recorded in `decisions.md` with what to wait for before moving up. A folder of scripts
  names its interpreter in `CLAUDE.md`, and anything run detached (a chain, a scheduled job)
  calls it by its full path: on Windows a bare `python` can resolve to the Store stub, which
  "runs" in a second and does nothing
- **uv manages a package**: the environment, the managed Python, and a committed `uv.lock`.
  `uv sync` once per clone; commands run as `uv run …`. pip in a venv has no real lockfile.
  Every dependency is the owner's yes (§AGENTS)
- **Naming** *(every shape)*: files, modules and packages are `snake_case` (a kebab-case
  module cannot be imported), and so are functions and variables; classes are `PascalCase`,
  constants `SCREAMING_SNAKE_CASE`. This replaces `rules/node.md` §NAMING's file rule, which
  is for JavaScript
- **Types are checked:** annotations on every function outside the tests, pyright in
  `strict` mode on the package's own code (`standard` is enough for the tests). No `Any`
  except at a JSON boundary, where values carry a named type of their own
- **Validation at every boundary with pydantic.** Its models are the source of truth for
  domain types; where a TypeScript side exists, its zod schemas are generated from them,
  never written twice
- **ruff lints and formats**: `ruff check` and `ruff format`, its rule set in
  `pyproject.toml`. No second formatter
- **Tests with pytest** for the pure logic and the adapter, in `tests/` beside the package,
  using `tmp_path` and never the project's real data. A folder of scripts verifies a script
  by running it on one job first, and says so in `conventions.md`
- **Before a checkpoint, a package runs** `uv run pytest`, `uv run ruff check`,
  `uv run ruff format --check` and `uv run pyright`, and the checkpoint records the result
- **CI runs the same four** on every push and pull request, in a package with a remote:
  `.github/workflows/gates.yml` from `templates/gates-python.yml`, added on the owner's yes
  (the rule in `rules/node.md` §BUILD, in Python)
- **Environment checked at startup** in one settings module: a missing or malformed
  variable stops the program with its name (the rule `rules/node.md` §RUNTIME sets for
  Node, in Python)
- **Text on Windows** *(every shape)*: every `open()` names `encoding="utf-8"`; a program
  that prints reconfigures `stdout` and `stderr` to UTF-8 (the console default is cp1252).
  Line endings are written as the project declares: a package writes `"\n"`; a folder whose
  files are mixed reads and writes with `newline=""` and never normalises in passing
- **A script is a file** *(every shape)*: never `python -c` or `python -` (§AGENTS); a
  one-off goes in a temporary folder outside the repository
- **Processes on Windows:** `os.kill(pid, 0)` ends the process there instead of testing it,
  and a venv's `python.exe` is a launcher whose pid is not the program's. Check liveness and
  find the real pid through the operating system

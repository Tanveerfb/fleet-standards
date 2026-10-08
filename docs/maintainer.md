# Maintaining fleet-standards

Notes for the maintainer. Users of the standard need only the [README](../README.md).

## The rule that keeps this repo worth having

A file under `standards/` is the master; a copy in a project is a copy, and copies go stale.
**Improve a file here, bump the rules version, then let projects sync.** Never fix a copy in
place in one project and leave this one behind — that is how the fleet once ran three
versions of the same rules file at once.

## Releasing a change

- **`project-rules.md`** — bump `**Version:**` (patch for wording, minor for an addition or
  loosening, major for a removal or anything that breaks section references) and add a
  `CHANGELOG.md` entry saying *why*. Never rename or renumber a section anchor as a side
  effect.
- **Skills, templates** — no version bump. The plugin has no `version` field on purpose, so
  every commit to `main` is an update for anyone with auto-update on.
- Run `claude plugin validate .` before pushing. Its one expected warning is the missing
  `version`.

## Fleet-wide drift report

```
node standards/scripts/sync-rules.mjs [projectsDir]
```

Lists the rules version in every project folder under `projectsDir` (default
`$PROJECTS_DIR`, then `E:\Projects`). `--apply` offers to copy the master over each
out-of-date copy. It never commits, and never touches a project with no copy — adopting the
standard is a migration, not a file copy. Per project, `sync-standards` does the same job with
more care; this script is for the overview.

## Known drift

The survey of which of the maintainer's projects run which rules version is kept privately,
with the project plans. The lessons from it apply to anyone running the standard across
several projects:

- **v3 references sections by name (`§GIT`), not number.** Every v2.x copy uses numbers, and
  v2.0.0 numbers differ again from v2.2.0+. Translate with the map in
  `standards/CHANGELOG.md` when a project is next audited.
- **Newer is not automatically a superset.** v2.1.0 dropped a Firebase section and a package
  manager section that v2.0.0 had. Before copying the rules over an older copy, check what
  the newer version *dropped*, not just what it added.
- **The drift detector** is each project's `conventions.md`, whose first line names the
  version it was audited against. Versions differ ⇒ the audit is stale, visible at a glance.

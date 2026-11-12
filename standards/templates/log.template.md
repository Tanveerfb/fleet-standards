# <PROJECT NAME> — session log

*Goes at `docs/log.md`. History: what happened in each session, newest first. **Nothing loads
this file by default** (`project-rules.md` §DOCS) — `docs/STATUS.md` holds what is true now,
and `relay` reads only the newest entry here. Written by the `checkpoint` skill.*

*__Mark what died:__ when a session deletes or replaces something an older entry describes,
that entry gets `**RETIRED — <what replaced it>, commit <hash>**` as its first line. An entry
describing a system that no longer exists reads exactly like one that still applies.*

*__Fold at ~800 lines:__ move the oldest entries **verbatim** to
`docs/archive/log-<YYYY-MM>.md`, each leaving a one-line stub here with a link. Retired
entries go first regardless of age. **Folding is relocation, never summarising** — summarising
on the way out destroys the evidence.*

---

### <DATE> (<n>th session) — <subject>

Commits `<hashes>`. <Pushed / not pushed>, <and whether that branch auto-deploys>.

<What happened, why, and what was decided against. Superseded numbers, measurements and the
owner's quotes belong here, not in the snapshot.>

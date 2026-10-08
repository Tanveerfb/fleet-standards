# Conventions — <PROJECT NAME>

**What this file is:** the choices specific to this project, and every place it
**deliberately diverges from [`project-rules.md`](./project-rules.md)**.

**Audited against v<X.Y.Z>.** ← *The drift detector. If the rules file's version is higher
than this line, the audit is stale and you know it at a glance. Where a newer section has not
been audited here, say so explicitly rather than claiming a version you have not checked.*

**What this file is not:** a copy of how to work in this repo. That is
[`CLAUDE.md`](./CLAUDE.md) — commands, data model, conventions, known traps. Do not duplicate
it here.

**Precedence.** `project-rules.md` §SCOPE: where the fleet rules and this file disagree, **stop
and ask.** Neither wins by default — a conflict usually means one of the two is out of date,
and resolving it is the owner's decision, not an inference. The divergences below are already
settled; anything not listed here follows the fleet rules.

---

## Divergences from `project-rules.md` — granted

*Each was raised, decided by the owner, and dated. Reasons live in
[`decisions.md`](./decisions.md).*

### §<NAME> <Section name> — <the divergence in one line>. **Exception granted <DATE>.**

<What the fleet rule says.>

<What this project does instead, with the measured facts — file counts, line counts,
whatever makes it concrete rather than an opinion.>

It stays that way because:

- <reason>
- <reason>

<What is NOT covered by the exception. This matters more than it looks: an exception for
"motion style" must not silently become an exception for `prefers-reduced-motion`, which is
an accessibility requirement, not a preference.>

---

## Open against the fleet rules — not yet decided

*Real divergences with **no** exception granted. These are backlog, not policy. This table is
the other half of the mechanism: every gap sits in exactly one of two states — decided and
allowed above, or known and queued here. Nothing is silently non-compliant, and nothing gets
"fixed" by a later session that mistook a deliberate choice for an oversight.*

| Rule | Gap | Tracked as |
| --- | --- | --- |
| §<NAME> | <what is missing, and how big the job actually is> | <ticket, or "when X is rebuilt"> |

---

## Fully compliant — worth stating

*Where a rule is satisfied and someone might reasonably assume otherwise, say so. It stops a
future session hunting for an exception that does not exist.*

- §<NAME> <why this is a non-issue here>

---

## §DOCS Document set — mapped, not duplicated

*§DOCS defines nine documents and also says **do not create a document before it has content**.
Map what already covers each job rather than creating empty files.*

| §DOCS document | Here |
| --- | --- |
| `conventions.md` | this file |
| `decisions.md` | [`decisions.md`](./decisions.md) |
| `design-system.md` | <> |
| `components.md` | <> |
| `data-model.md` | <> |
| `environment.md` | <> — names, purposes and owners only, **never values** |
| `status.md` | [`docs/STATUS.md`](./docs/STATUS.md) |
| `issues.md` | <> |
| `roadmap.md` | <> |

---

## Project-specific working agreement

*Set by the owner; the operational detail lives in `CLAUDE.md`. Only the things unique to
this project belong here — the fleet-wide agreement is in the template's `CLAUDE.md`.*

- <>

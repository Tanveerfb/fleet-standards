# Fleet rules — option: studio credit (`rules/options/credit.md`)

**Loaded by:** projects that chose it at setup.
One file of the fleet standard. `project-rules.md` is the core: its §SCOPE lists every file in
the set and who loads it, and its header carries the one version they share.

---

## §CREDIT — Studio credit

An owner who runs a studio can sign the projects it builds — a credit (*Built by …*), with
the studio's logo and a link to its site — and feature them on the studio's own site.

- **The studio is configured by the owner, not by this file.** The owner's own
  `~/.claude/CLAUDE.md` holds one `Studio credit:` line naming the studio, its credit
  wording, its link and its logo kit — and, where the studio's site lists its work, the
  **showcase**: the studio site's repository and the file projects are listed in. No line, no
  credit or showcase questions — this standard is shared, and other owners may have no studio
  or a different one. The line's format is in the README
- **Every project is asked, once** — at setup (`new-project`), or at the next sync for an
  existing project. A local-only tool the studio built is still the studio's work: whether it
  is signed is the owner's call, not the deploy target's. Two questions, the second only when
  the line names a showcase:
  - **Credit** — does the project carry the studio credit?
  - **Showcase** — will it be featured on the studio's site?

  The answers are the `Studio credit:` and `Studio showcase:` lines in the project's
  `CLAUDE.md`, and an entry in `decisions.md`
- **Always optional.** Not every project goes under the studio. Never add a credit or a
  showcase entry the owner has not said yes to
- **A client project needs the client's agreement** — for the credit and for the showcase
  alike. A credit on a client's site is copy the business owns (§OWNER), and featuring their
  project shows their business: confirm the client has agreed — some contracts forbid it,
  some want it elsewhere — before adding either
- **A showcase entry is requested, never edited from the project.** On a showcase yes, file
  an issue on the studio site's repository asking for the entry: what the project is, its
  status, the stack and the tools it uses (frameworks, local models, ffmpeg, whisper.cpp and
  the like), and links. Later, when a checkpoint records a phase done or a notable verified
  feature, it offers an update issue the same way. The owner handles the issues when working
  in the studio repository, where the entry is copy the business owns (§OWNER) and that
  repository's own §GIT rules apply. Record each issue's link in `decisions.md`
- **A request that cannot be filed is kept, not dropped.** If the session cannot reach the
  studio's repository — no GitHub access, or a cloud session it is not attached to — write the
  request in full as an open item in `docs/STATUS.md` and tell the owner, so the next session
  that can reach it files it
- **Nothing private goes into a showcase request.** No credentials, client data or internal
  addresses — the studio's repository may be public. Screenshots come from the project's
  verified screens (§TESTING), never mockups presented as the product
- **The credit is designed, not pasted.** It keeps the studio's logo and wording, but is
  styled to sit in the project's motif like any other component (§SHADCN) — small, quiet,
  linking to the studio's site, with light and dark logo variants and a proper accessible
  name
- **The logo files come from the studio's own brand kit** — wherever the owner's config line
  points, usually the studio's website — **and are copied into the project**
  (`public/brand/`), never hotlinked. A copy keeps working when the studio's site changes or
  is down, and a rebrand reaches each project only when the owner chooses (offered at the
  next sync). Use the transparent masters — SVG first, transparent PNG where SVG cannot go —
  the on-light and on-dark variants for the two colour schemes, and the single-colour
  variants where the studio's own colours would clash with the project's motif. Never
  redraw, recolour beyond the kit's variants, or rebuild the logo as live text

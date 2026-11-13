# Fleet rules — repositories without application code (`rules/non-application.md`)

**Loaded by:** repositories without application code.
One file of the fleet standard. `project-rules.md` is the core: its §SCOPE lists every file in
the set and who loads it, and its header carries the one version they share.

---

**Repositories without application code.** Some repositories hold runbooks, records or
configuration for a system that lives elsewhere — a Microsoft 365 tenant, a no-code platform,
infrastructure managed through a console. They follow the **non-application profile**,
recorded once at the top of `conventions.md` rather than as a per-section exception
(`templates/conventions.template.md` has the block). Under it, these apply:

- **The core**, `project-rules.md`, in full
- **`rules/ui.md`**, imported wherever the work has a visual surface (pages, navigation,
  forms on the platform)
- **Naming** (§NAMING, which this profile does not load): the words in the interface, the
  records and the documentation are the same words, with a glossary once there are more than
  a handful of terms; files and folders are kebab-case
- **From §TESTING, one rule:** a visual change is done when it has been seen working, at
  desktop width and on a phone (fixed-size media: below)

Nothing else under `rules/` applies. If application code later lands in the repository, it
loads the files for that code from that day (§SCOPE). These things read differently here:

- **The production surface is where the work lands, not the repository.** `CLAUDE.md`'s
  *Deploys* line names it and says whether it has live users. A change there is a production
  change even though git never ships it; §GIT's branch rules govern only the repository
- **Mockups (§OWNER) still come first** for visual and layout changes on that surface. With no
  dev server, drafts live in a gitignored `_mockups/` at the root and open as files; locked
  ones move to `docs/design/` as usual
- **Fixed-size media** — thumbnails, video, overlays, social posts, print: **the rendered
  draft is the mockup.** The §OWNER loop is unchanged — render, show, revise until the owner
  locks one — but there is no HTML step and no 390px render. **Seen working** means the agent
  has looked at the rendered file itself, never only its source: an image at its real size and
  at the smallest size it is really seen at (a thumbnail in a phone feed, a story on a phone
  screen). For video, frames at the start, the end and each scene change, looked at the same
  two ways, plus duration, resolution and audio levels measured with a tool. **Playback is the
  owner's to watch**; the agent says so rather than claiming it
- **`CLAUDE.md`** says under *Commands* that none exist, and its *Technology* table describes
  the platform rather than a framework

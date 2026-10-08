# Agent instructions — <PROJECT NAME>

<!-- Copy to the project root as AGENTS.md (Codex, GitHub Copilot, Cursor) and as GEMINI.md
     (Gemini CLI). It is a pointer only: never add project facts here — they go in CLAUDE.md,
     the one hand-written instruction file (`project-rules.md` §TOOLS). If a tool already
     generated an AGENTS.md (Next.js does, inside a generated `BEGIN:…` block), put this above
     the block and never edit inside it. -->

**Claude Code: `CLAUDE.md` is already loaded — ignore this file.**

Every other agent: this project's instructions are written for Claude Code, and they bind you
equally. Before any work, read in this order:

1. **`CLAUDE.md`** — this project's identity, commands, working agreement and traps.
2. **`project-rules.md`** — the fleet standard. `CLAUDE.md` imports it with an
   `@project-rules.md` line that only Claude Code expands, so read it yourself.
3. **`conventions.md`** — where this project deliberately departs from the standard.
4. **`docs/STATUS.md`** — the `Start here` block, for where the work is right now.

Where these files name a Claude Code tool, use your equivalent — `project-rules.md` §TOOLS
has the mapping. Where you have no equivalent, say so rather than skipping the rule.

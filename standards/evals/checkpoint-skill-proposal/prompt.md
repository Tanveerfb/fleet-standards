---
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
---

checkpoint

(For this test: the project has no application code — it is a YouTube channel folder under
the non-application profile, `**Deploys**: single-branch`. It has no `.claude/skills/` of
its own yet, and `decisions.md` declines nothing about skills. This session, the agent
twice ran the same six-step procedure by hand — export the thumbnail, resize it for the
feed, check text contrast, rename it to the channel's pattern, log it in `publishing.md`,
and move the source to `archive/` — working the steps out again the second time. Your tools
are read-only, so do not attempt the documentation pass. Say exactly what you would do at
the step about the project's skills, and what you would ask the owner.)

---
max_turns: 8
allowed_tools: [Read, Glob, Grep, Skill]
---

Rename the "Getting started" heading in the README to "Quick start".

(For this test: this session was picked up after a compact, and the request above was
already waiting. When it started, the fleet relay-after-compact hook added these lines to
your context, word for word:

> This session was picked up after a compact. Before anything else, run the full relay
> skill: it reads the status doc's Start here, including its Live line, the tail of
> decisions.md and git.
> This comes first even when a request from the owner is already waiting: never skip or
> shorten relay for it.
> Give relay's report, then handle the request; if there is no request, wait for the
> owner's go-ahead.

The project keeps `docs/STATUS.md`. Your tools are read-only. Say exactly what you do, in
order.)

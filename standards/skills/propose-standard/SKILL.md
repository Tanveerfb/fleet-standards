---
name: propose-standard
description: Use from inside any project to send a change or request back to the fleet standard (the fleet-standards repo) — e.g. "propose a standard change", "this rule is wrong", "add this to the standard", "request a rule", "the checkpoint skill should…", "make the PR for that proposal". Drafts the change with evidence from the current project and files it as a GitHub issue on Tanveerfb/fleet-standards; opens a pull request only when the owner asks for one. Never pushes to main and never merges.
---

# Propose a standard change

> **Outside Claude Code** (Codex, Copilot, Cursor, Gemini CLI): this skill is written in
> Claude Code's terms; map them to your own. If `${CLAUDE_PLUGIN_ROOT}` appears unsubstituted
> anywhere below, the standard's files are in `~/.agents/fleet/` instead. "The question tool"
> means your own ask-the-user tool, or a short question with numbered options in plain text.
> Named MCP tools (`mcp__github__*`, `mcp__Trello__*`) mean whatever GitHub or Trello
> integration you have — an MCP server, `gh` — and with none, say so and skip that step.
> Never skip a step silently because a Claude-specific name did not match.

The fleet standard improves from real projects. This skill carries a lesson from the project
in front of you back to `Tanveerfb/fleet-standards`, where the owner decides — without anyone editing
a copy in place.

**What can be proposed:** a rule in `project-rules.md`, a template, `adopting-the-standard.md`,
or one of the fleet skills (`checkpoint`, `relay`, `sync-standards`, this one).

**Never edit the installed plugin files** under `${CLAUDE_PLUGIN_ROOT}` to "fix" a skill or
rule. They are a cache; the next plugin update overwrites them, and the fix is lost. Every
change goes through here.

## Step 1 — Pin down the change

From the conversation, establish — and ask only for what is genuinely missing:

- **Target:** which file, and which section by anchor (`§MOTION`, `checkpoint` Step 3.5).
- **Problem:** what the current wording causes in practice. Concrete — the project, the
  file, what went wrong or what it blocked.
- **Proposed wording:** the actual text, not a description of it. Read the current section
  from `${CLAUDE_PLUGIN_ROOT}` and write the replacement against it.
- **Kind:** fix, addition, loosening, removal. A removal says what the rule was protecting
  and why that no longer matters.

## Step 2 — Check it is not already proposed

Search open issues on `Tanveerfb/fleet-standards` for the same section or topic. If one exists, the
new evidence goes on it as a comment rather than a duplicate issue.

## Step 3 — Show the draft, file on a yes

Show the owner the draft — title and body — and ask once with the question tool: file it,
edit it, or drop it.

Issue format:

- **Title:** `[proposal] <target>: <change in a few words>` — e.g.
  `[proposal] §FORMS: allow server-only forms without useActionState`
- **Body:** the fields of the repo's `.github/ISSUE_TEMPLATE/proposal.yml`, in order —
  **Target** · **Kind** · **Problem** (with the project name and evidence) · **Proposed
  wording** (as a quoted block or a diff) · **Impact elsewhere** in the fleet.

Use the GitHub MCP tools (`mcp__github__*`) where available, otherwise `gh`. In a cloud
session `fleet-standards` is usually outside the session's repository scope — attach it first
(`add_repo`), which the owner approves.

Report the issue link.

## Step 4 — A pull request, only when asked

Only when the owner says to make the PR — now, or later against an existing proposal issue:

1. Branch `proposal/<short-slug>` from `main` of `fleet-standards`. Never commit to `main`.
2. Make the edit. For `project-rules.md`, also bump its `**Version:**` (patch for wording,
   minor for an addition or loosening, major for a renumbering or removal) and add a
   `CHANGELOG.md` entry that says *why*, in the existing voice. A skill change needs no
   version bump — the plugin tracks commits.
3. Keep anchors stable. Never rename or renumber a section as a side effect.
4. Open the PR referencing the issue (`Closes #<n>`). **Never merge it** — the owner reviews
   and merges in `fleet-standards`.

## Meanwhile, in this project

A proposal is not a decision. Until it is merged, this project still follows the current
standard. If it genuinely cannot wait, that is an exception: raise it with the owner and,
on a yes, record it in `conventions.md` and `decisions.md` with the proposal's link (§SCOPE).
Once the proposal merges, `sync-standards` brings it in and the exception can be retired.

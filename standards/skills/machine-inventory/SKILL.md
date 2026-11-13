---
name: machine-inventory
description: Use to record or refresh what this machine has installed, so projects know before proposing a tool — e.g. "machine inventory", "update the machine file", "what tools does this machine have", "I just installed ffmpeg", "refresh the inventory", "what can this PC run". Probes the machine read-only for media, AI and file tools and for the hardware that matters, then writes the owner's ~/.claude/machine.md and makes sure ~/.claude/CLAUDE.md imports it. Never installs anything and never records a credential.
---

# Machine inventory

> **Outside Claude Code** (Codex, Copilot, Cursor, Gemini CLI): this skill is written in
> Claude Code's terms; map them to your own. "The question tool" means your own ask-the-user
> tool, or a short question with numbered options in plain text. The file lives where your
> agent keeps the owner's global instructions; say where you put it.

A project does not know what the machine it runs on has unless the owner says so each time.
This skill keeps one file that says it: `~/.claude/machine.md`, imported from the owner's
`~/.claude/CLAUDE.md`, so every local session on this machine loads it. §AGENTS has the rule
that reads it: before proposing a tool for media, AI or file work, prefer what is installed.

It is about the machine, so it lives in the owner's own files, never in a project. One file
per machine. **A cloud session has no machine to inventory: say so and stop.**

**This skill installs nothing.** It reads, and writes one file. A hand-kept list goes stale;
run this when something is installed or removed, or when the owner asks.

## Step 1 — Read what is there

Read `~/.claude/machine.md` if it exists, and `~/.claude/CLAUDE.md`. Keep the owner's own
words: a note beside a tool ("slow on long clips", "use for subtitles") is not something a
probe can rediscover, so it survives the rewrite.

## Step 2 — Probe, read-only

Ask each tool for its version; a command that is not found means not installed, which is a
result, not an error. Run them as plain commands, one tool per line, never an inline script
(§AGENTS). Adapt to the platform: `where` on Windows, `command -v` elsewhere.

| Kind | Look for | How |
| --- | --- | --- |
| Media | ffmpeg and ffprobe, yt-dlp, ImageMagick, Blender, HandBrake | `<tool> -version` or `--version` |
| Local AI | Ollama, LM Studio, ComfyUI, whisper.cpp, Python with torch | `ollama --version` and `ollama list`; the app's own CLI or install folder |
| Runtimes | Node and its version manager, Python, git, Docker | `--version` |
| Engines and editors | Godot, Unity, Unreal, Android Studio | their CLI, or the install folder |
| Hardware | GPU model and memory, system memory, free disk on the work drive | `nvidia-smi` or the platform's system report |

Three things the first run on a Windows PC taught (2026-11-13):

- **Give every probe a short timeout** (`timeout 15 <command>`). A tool whose service is not
  running can hang instead of failing: `ollama list` did, with Ollama installed but stopped.
  Ask for the version only, and read the model list only when the service answers.
- **Apps are often installed but not on the path.** On Windows, `winget list` names them
  with their versions (Blender, DaVinci Resolve, OBS, ComfyUI); elsewhere the package
  manager's list does the same. Use it before concluding a tool is missing.
- **A model folder may be elsewhere.** `OLLAMA_MODELS` says where Ollama keeps its models.
  If the models cannot be listed, write that in the file rather than leaving the section out.

The table is a starting list, not a limit: probe anything the existing file names, and
anything the owner mentions. **Never read a credential, a token or a config file's secrets**
(§SECURITY): versions and paths only. Where a tool is installed but not on the path (an app
with no CLI), ask the owner rather than searching the whole disk.

## Step 3 — Show what changed

Compare with the old file and tell the owner, briefly: added, removed, version changed. Ask
once, with the question tool, about anything the probe cannot decide: a tool found in two
versions, a tool the old file lists that no longer answers (removed, or moved off the path?).

## Step 4 — Write the file

Write `~/.claude/machine.md` with the editor tools, in this shape:

```markdown
# This machine

*Kept by the `machine-inventory` skill. Checked <DATE>. Before proposing a tool for media, AI
or file work: prefer what is installed here; if nothing fits, suggest from the last list;
only then search.*

**Hardware:** <GPU and its memory> · <system memory> · <OS>

## Installed

| Tool | Version | Good for |
| --- | --- | --- |
| ffmpeg | 7.1 | cutting, converting and measuring video and audio |

## Local models

<what Ollama or LM Studio have pulled, and the largest size this GPU runs comfortably>

## Not installed, worth suggesting

- <tool> — <what it would be for>
```

Keep it short: it is loaded in every local session on this machine. A tool the owner never
uses in project work does not need a row. **Never a credential, a licence key or an account
name.**

## Step 5 — Make sure it is imported

`~/.claude/CLAUDE.md` needs the line `@machine.md` (the path is relative to that file). If it
is missing, **show the owner the one line and ask before adding it**: that file is the
owner's own. If the file does not exist, ask before creating it.

## Step 6 — Report

- What was found, in one line per kind, and what changed since the last run.
- The path written, and whether the import line was already there, added, or declined.
- Anything a project should record: if this run was started because a project needs a tool
  the machine lacks, say so and name the project's `environment.md` as the place it goes.

No git step: these are the owner's own files, outside any repository.

## Common mistakes

- Installing a missing tool. This skill reports; installing is the owner's call.
- Listing everything on the machine. The file is read every session: tools that matter to
  project work, nothing else.
- Dropping the owner's notes on a rewrite. Read first, carry them over.
- Writing the file into a project. It describes the machine, and a project is opened on
  more than one.

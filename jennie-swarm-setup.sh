#!/usr/bin/env bash
# jennie-swarm v0.1 portable scaffold
# Usage: bash jennie-swarm-setup.sh [target-dir]
# Default target: ~/jennie-swarm

set -euo pipefail

TARGET="${1:-$HOME/jennie-swarm}"
REMOTE="https://github.com/jenniv27/jennie-swarm.git"

echo "→ Setting up jennie-swarm at: $TARGET"

if [ -e "$TARGET" ]; then
  echo "ERROR: $TARGET already exists. Move it aside or pass a different path:"
  echo "  bash jennie-swarm-setup.sh /some/other/path"
  exit 1
fi

mkdir -p "$TARGET"/.claude
mkdir -p "$TARGET"/_Swarm/Conductor
mkdir -p "$TARGET"/_Swarm/Scribe
mkdir -p "$TARGET"/_Swarm/Notifications
mkdir -p "$TARGET"/Stores/Learning
cd "$TARGET"

# ---------- .claude/settings.json ----------
cat > .claude/settings.json <<'EOF_JENNIE_SCAFFOLD'
{
  "customInstructions": "Follow _Swarm/Conductor/CLAUDE.md + _Swarm/SpawnRules.md. When Jennie talks to you, you ARE the Conductor — route work silently to the right subagent, never make her pick. Start every session by checking _Swarm/Notifications/INBOX.md and surfacing unread items. Git: main only. Commit+push autonomous. Be concise — Jennie values brevity over fluff. Jennie is technical: code/config are fair game when relevant, but default to plain English unless she asks.",
  "permissions": {
    "allow": [
      "Bash(git status)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git add*)",
      "Bash(git commit*)",
      "Bash(git push*)",
      "Bash(git checkout*)",
      "Bash(git branch*)",
      "Bash(git fetch*)",
      "Bash(git pull*)",
      "Bash(git rev-parse*)",
      "Bash(mkdir -p*)",
      "Bash(ls*)",
      "Bash(date*)",
      "Bash(cat*)"
    ],
    "deny": [
      "Bash(rm -rf /)",
      "Bash(rm -rf _Swarm)",
      "Bash(rm -rf Stores)",
      "Bash(git push --force*)",
      "Bash(git reset --hard*)",
      "Bash(curl * | bash)",
      "Bash(wget * | bash)"
    ]
  }
}
EOF_JENNIE_SCAFFOLD

# ---------- .mcp.json ----------
cat > .mcp.json <<'EOF_JENNIE_SCAFFOLD'
{
  "mcpServers": {
    "jennie-swarm-fs": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "."
      ]
    }
  }
}
EOF_JENNIE_SCAFFOLD

# ---------- .gitignore ----------
cat > .gitignore <<'EOF_JENNIE_SCAFFOLD'
.DS_Store
.env
.env.local
node_modules/
*.log
.claude/cache/
EOF_JENNIE_SCAFFOLD

# ---------- AGENTS.md ----------
cat > AGENTS.md <<'EOF_JENNIE_SCAFFOLD'
# Jennie's Personal Swarm — Agent Registry

Updated: 2026-05-11 | Owner: Jennie | v0.1

## How to Talk to Your Swarm

Open Claude Code (terminal at desk or claude.ai/code on phone) and type in plain English. Examples:

- "Add a todo: email landlord about the leak by Friday"
- "Note: my LSAT logic-games speed is killing me"
- "I just learned 蒲公英 means dandelion"
- "What did I capture today?"
- "Show me my open tasks"

Conductor handles routing — you never pick an agent.

## Agents (v0.1)

| Agent | What it does | Model |
|-------|-------------|-------|
| Conductor | Your only contact. Routes everything. | Sonnet |
| Scribe | Captures anything → routes to Tasks / Notes / Learning logs | Sonnet |

## Planned (later)

- **Curator** — organizes notes, links related ideas
- **Postman** — Gmail triage + daily digest
- **Scheduler** — Google Calendar prep + briefings
- **Linguist** — Mandarin (pulls from second-brain PWA flashcards, builds drills)
- **Counselor** — LSAT (weak-spot tracking, logic-games practice)
- **Watchdog** — daily alerts on stale tasks, overdue items
- **PriorityEngine** — owns Dashboard.md "Your Next Hour"

## How It Works

```
You (Jennie)
 └── Conductor (main contact)
      └── Scribe (captures → stores)
```

## Stores (where stuff actually lives)

- `Stores/Tasks.md` — to-dos with optional due dates
- `Stores/Notes.md` — ideas, observations, journal
- `Stores/Learning/Mandarin.md` — vocab, grammar, reflections
- `Stores/Learning/LSAT.md` — weak spots, observations

## Spawn Pattern

On spawn, every subagent loads:
1. `_Swarm/SpawnRules.md` — swarm-wide rules
2. `_Swarm/JennieProfile.md` — Jennie's context and preferences
3. Its own `CLAUDE.md` + `CONTEXT.md`
4. Task-specific context only

## Git
- main branch only. Autonomous commit+push. Never managed by Jennie.
EOF_JENNIE_SCAFFOLD

# ---------- _Swarm/JennieProfile.md ----------
cat > _Swarm/JennieProfile.md <<'EOF_JENNIE_SCAFFOLD'
# Jennie — Personal Profile

## Who
Building a "second brain" to offload life-admin so she can focus on study, building, and creative work.

## Current Pursuits
- **Mandarin** — spaced repetition (SM-2). Active deck managed in the second-brain PWA (`useFlashcards` hook). This swarm captures vocab/reflections; PWA owns the SRS.
- **LSAT prep** — weak spots, logic-games speed, reading comp. Track weak spots so future Counselor agent can build targeted drills.
- **Building** — the second-brain PWA (React + Vite + Vercel + Supabase) and this swarm.

## Wellness Context
Jennie tracks sleep (Oura), weight, hydration, mood (5-mood log), DBT skill use, and routines (Morning / Midday / Evening) in the **second-brain PWA**. The swarm is aware of this but does NOT duplicate or write to it — the PWA is the source of truth for body/mind data.

## Communication Preferences
- Technical and direct. No hand-holding — Jennie codes.
- Concise. Bullet > paragraph. No fluff/preamble.
- Action-oriented. "Do this" not "consider this."
- Recommend then act — don't ask permission for low-stakes work.

## Tools She Uses
- Claude Code (terminal + claude.ai/code on phone)
- Gmail, Google Calendar (not integrated yet — future Postman/Scheduler)
- second-brain PWA (deployed on Vercel)
- Oura ring (sleep data)

## Other Context
- Has at least one cat; brushes cat's teeth on alternating days (routines reference).

## What the Swarm Should NEVER Do
- Send emails, messages, or calendar invites without explicit approval
- Make purchases or financial decisions
- Modify the second-brain PWA codebase (different repo, different scope)
- Surface "should I?" decision-paralysis questions — recommend, then act
- Duplicate body/mind data already tracked in the PWA
EOF_JENNIE_SCAFFOLD

# ---------- _Swarm/SpawnRules.md ----------
cat > _Swarm/SpawnRules.md <<'EOF_JENNIE_SCAFFOLD'
# Spawn Rules — load on every agent spawn

## Git
- main branch only. autonomous commit+push. no feature branches.
- merge immediately if harness creates a feature branch.

## Context Loading
- On spawn: read ONLY `## Focus` section of your CONTEXT.md (1-3 lines)
- Load Queue/Log/Patterns/Open Questions ONLY when current task needs them
- Use Grep to find specific sections — never read full file top-to-bottom
- Read other agents' CONTEXT.md by section only — never full file
- Prefer `Grep -A 10 "## SectionName" path` over `Read path`

## Memory
- CONTEXT.md namespaces: Focus / Queue / Patterns / Log / Open Questions
- pattern format: `[PATTERN] name | score:0.0-1.0 | used:Nx | desc`
- no duplication across agents. one source of truth per fact
- delete completed entries immediately

## Task Sizing
- Max 3 files per subagent for read+write (prevents timeout)
- Research-only (read, no write): up to 5 files
- Every agent must have: bounded scope, exit condition, defined output

## Token Rules
- no prose where list works. no list where line works
- abbreviate: `→` `⏳` `⊡` `✓`
- no fluff/preamble/filler. meaning-only
- CLAUDE.md hard limit: 150 lines

## Model Routing (always pass `model` param on Agent spawn)
- haiku: Watchdog (when added in v0.2)
- sonnet: Conductor, Scribe, all reasoning agents
- opus: only when Jennie explicitly requests deep reasoning

## Jennie Interaction
- Concise. Bullets > paragraphs.
- Technical-OK — no need to dumb down code or config
- Action-oriented. Recommend, then act.
- Respect her time — she's juggling LSAT + Mandarin + building

## Stores (v0.1)
- `Stores/Tasks.md` — append new under `## Open`. Move to `## Done` when complete.
- `Stores/Notes.md` — append new under `## Captured` with timestamp.
- `Stores/Learning/Mandarin.md` — vocab + grammar + reflections
- `Stores/Learning/LSAT.md` — weak spots + observations

## Dashboard
- `_Swarm/Dashboard.md` is a stub in v0.1. Don't update unless explicitly asked.
- Owned by PriorityEngine + Watchdog in v0.2+.

## Escalation
- Ambiguous capture (could be 2+ stores) → ask Jennie ONE clarifying question, then act
- Missing context → ask, don't guess
- Cross-agent conflicts → Conductor decides, presents recommendation

## Security
- never store credentials in repo files (.env stays gitignored)
- never send emails, messages, or calendar invites without explicit approval
- never modify the second-brain PWA repo
- no config file writes (.env, settings.json) without Jennie's explicit approval
EOF_JENNIE_SCAFFOLD

# ---------- _Swarm/SharedContext.md ----------
cat > _Swarm/SharedContext.md <<'EOF_JENNIE_SCAFFOLD'
# Shared Context — Jennie's Personal Swarm

Append-only. One line per entry. Format: `[YYYY-MM-DD] [Agent] summary`
Max 20 entries. Archive older to `SharedContext-Archive.md`.

## Log

[2026-05-11] [Setup] Swarm v0.1 initialized — Conductor + Scribe, 4 stores (Tasks, Notes, Mandarin, LSAT)
EOF_JENNIE_SCAFFOLD

# ---------- _Swarm/Dashboard.md ----------
cat > _Swarm/Dashboard.md <<'EOF_JENNIE_SCAFFOLD'
# Jennie's Priority Dashboard

_Stub for v0.1. Will be owned by PriorityEngine + Watchdog in v0.2._

Last updated: 2026-05-11 (initial scaffold)

---

## Your Next Hour

> _Not populated in v0.1. Capture some tasks via Scribe first, then v0.2 will compute this._

---

## Today

_Not populated yet._
EOF_JENNIE_SCAFFOLD

# ---------- _Swarm/Notifications/INBOX.md ----------
cat > _Swarm/Notifications/INBOX.md <<'EOF_JENNIE_SCAFFOLD'
# Inbox — Jennie's Swarm Notifications

## Unread

- [INFO] 2026-05-11 Swarm v0.1 initialized. Try: "add a todo to test this thing" or "note: testing the scribe"

## Read

_(cleared after surfacing to Jennie)_
EOF_JENNIE_SCAFFOLD

# ---------- _Swarm/Conductor/CLAUDE.md ----------
cat > _Swarm/Conductor/CLAUDE.md <<'EOF_JENNIE_SCAFFOLD'
# Conductor

Jennie's primary swarm interface. Receive plain English. Route to the right subagent. Surface results clearly and briefly.

**Model:** Sonnet 4.6

## Scope
- Receive Jennie's input → classify intent → spawn the right subagent (or answer directly for recall queries)
- v0.1 routing:
  - Capture intent (any "add", "note:", "I learned", "remind me", random observation) → spawn **Scribe**
  - Recall query ("what did I capture?", "show me my tasks", "any Mandarin from this week?") → answer directly via Read/Grep on `Stores/`
  - Out-of-scope (anything needing Gmail, Calendar, Watchdog, Curator, etc.) → tell Jennie it's not built yet, ask if she wants to add to backlog

## How Jennie Talks to You
- "Add a todo to email the landlord by Friday" → Scribe → `Stores/Tasks.md`
- "Note: my LSAT logic-games speed is killing me" → Scribe → `Stores/Notes.md` or `Stores/Learning/LSAT.md` (Scribe decides)
- "I just learned 蒲公英 = dandelion" → Scribe → `Stores/Learning/Mandarin.md`
- "What did I capture today?" → you Grep stores directly, summarize
- "What's slipping?" → not built (v0.2 Watchdog). Offer to add to backlog.

## Session Start
1. Read `_Swarm/Notifications/INBOX.md`. Surface unread items (concise).
2. Clear the `## Unread` section after surfacing.
3. Don't proactively scan stores. Wait for Jennie's input.

## Handoffs
- Single-purpose tasks: spawn one subagent, return result
- Multi-step: own the sequence, parallelize when independent

## Boundaries
- Never surface git operations to Jennie unless she asks
- Never send emails / messages / calendar invites
- Never modify the second-brain PWA codebase (different repo)
- When unsure which store a capture belongs in: ask ONE clarifying question, then act

## Memory
- SharedContext.md: `[YYYY-MM-DD] [Conductor] one-line summary`
- CONTEXT.md: routing decisions, recurring patterns
- Standard: SpawnRules.md

## Tools
- Read, Edit, Glob, Grep
- Task / Agent (spawn subagents)
- Bash (git only)
EOF_JENNIE_SCAFFOLD

# ---------- _Swarm/Conductor/CONTEXT.md ----------
cat > _Swarm/Conductor/CONTEXT.md <<'EOF_JENNIE_SCAFFOLD'
# Conductor Context

## Focus
Swarm just initialized. Awaiting Jennie's first capture or query.

## Queue
`→` active · `⏳` pending · `⊡` blocked

(none)

## Log
2026-05-11 v0.1 initialized — Conductor + Scribe

## Patterns
(none yet)

## Open Questions
(none yet)
EOF_JENNIE_SCAFFOLD

# ---------- _Swarm/Scribe/CLAUDE.md ----------
cat > _Swarm/Scribe/CLAUDE.md <<'EOF_JENNIE_SCAFFOLD'
# Scribe

Capture-anything router. Take what Jennie said, classify it, write it to the right store.

**Model:** Sonnet 4.6

## Scope
Classify each capture into exactly ONE primary store:

| Type | Signals | Destination |
|------|---------|-------------|
| Task | "add a todo", "remind me", "I need to", verb-first, includes a date/deadline | `Stores/Tasks.md` |
| Mandarin | Chinese characters present, "X means Y" with non-English, pinyin, HSK terms | `Stores/Learning/Mandarin.md` |
| LSAT | "LSAT", "logic games", "RC", "LR", question number, weak-spot language | `Stores/Learning/LSAT.md` |
| Note | Everything else: ideas, observations, journal-y reflections | `Stores/Notes.md` |

Multi-part capture (`"add hummus to shopping AND note that I'm exhausted"`): split + write each part to its store. Shopping items currently go to Tasks (v0.1 has no shopping store).

## Write Formats

### Tasks.md — append under `## Open`
```
- [ ] [YYYY-MM-DD] task description [due: YYYY-MM-DD if known] [tag: optional]
```

### Notes.md — append under `## Captured`
```
### YYYY-MM-DD HH:MM
note body verbatim (preserve Jennie's voice)
```

### Learning/Mandarin.md — append under `## Vocab`
```
- 字 (pinyin) — meaning [YYYY-MM-DD] [optional context sentence]
```

### Learning/LSAT.md — append under `## Weak Spots` (or `## Observations` if not a weak spot)
```
- YYYY-MM-DD [section: LG/LR/RC] description / what was missed / why
```

## Boundaries
- If ambiguous (could be 2+ stores): ask Jennie ONE clarifying question, then write
- Never modify existing entries — only append
- Never delete — Jennie marks done / archives, not you
- Preserve Jennie's exact wording for notes; only normalize structure for tasks/vocab/LSAT

## Output to Conductor
After writing, return a single line per file written:
```
✓ Stores/Tasks.md: "[ ] email landlord by 2026-05-15"
```

## Memory
- SharedContext.md: `[YYYY-MM-DD] [Scribe] N captures: types`
- CONTEXT.md: classification patterns that recur, ambiguity edge cases
- Standard: SpawnRules.md

## Tools
- Read, Edit, Glob, Grep
EOF_JENNIE_SCAFFOLD

# ---------- _Swarm/Scribe/CONTEXT.md ----------
cat > _Swarm/Scribe/CONTEXT.md <<'EOF_JENNIE_SCAFFOLD'
# Scribe Context

## Focus
No captures yet. Default classification rules in CLAUDE.md apply.

## Queue
(none)

## Log
2026-05-11 initialized

## Patterns
(none yet — will populate as classification edge cases appear)

## Open Questions
(none)
EOF_JENNIE_SCAFFOLD

# ---------- Stores/Tasks.md ----------
cat > Stores/Tasks.md <<'EOF_JENNIE_SCAFFOLD'
# Tasks

Captured by Scribe. Format: `- [ ] [captured-date] description [due: date] [tag]`

## Open

_(none yet)_

## Done

_(none yet — move tasks here with date completed when finished)_
EOF_JENNIE_SCAFFOLD

# ---------- Stores/Notes.md ----------
cat > Stores/Notes.md <<'EOF_JENNIE_SCAFFOLD'
# Notes

Free-form capture: ideas, observations, journal-y reflections.

## Captured

_(none yet)_

## Archive

_(none yet — move stale entries here quarterly)_
EOF_JENNIE_SCAFFOLD

# ---------- Stores/Learning/Mandarin.md ----------
cat > Stores/Learning/Mandarin.md <<'EOF_JENNIE_SCAFFOLD'
# Mandarin Learning Log

Quick capture for vocab, grammar observations, listening insights.
The active SRS deck lives in the **second-brain PWA** (`useFlashcards`). This file is for raw capture + reflection — Linguist agent (future) will sync curated entries to the PWA deck.

## Vocab

_(none yet — format: `- 字 (pinyin) — meaning [YYYY-MM-DD] [optional context]`)_

## Grammar / Patterns

_(none yet)_

## Reflections

_(none yet)_
EOF_JENNIE_SCAFFOLD

# ---------- Stores/Learning/LSAT.md ----------
cat > Stores/Learning/LSAT.md <<'EOF_JENNIE_SCAFFOLD'
# LSAT Study Log

## Weak Spots

_(none yet — format: `- YYYY-MM-DD [section: LG/LR/RC] description of weak spot`)_

## Logic Games (LG)

_(none yet)_

## Reading Comp (RC)

_(none yet)_

## Logical Reasoning (LR)

_(none yet)_

## Observations

_(none yet — strategy notes, pacing, mental state during practice)_
EOF_JENNIE_SCAFFOLD

# ---------- git init + commit ----------
echo "→ Initializing git repo"
git init -b main >/dev/null 2>&1
git add .
git commit -m "init: scaffold jennie-swarm v0.1 (Conductor + Scribe)" >/dev/null

echo ""
echo "✓ jennie-swarm scaffolded at $TARGET"
echo ""
echo "Next steps:"
echo "  cd $TARGET"
echo "  git remote add origin $REMOTE"
echo "  git push -u origin main"
echo ""
echo "Then open Claude Code in this directory and say hi to the Conductor."

# Unloop restart: start here

_Written 2026-11-11. This pack restarts Unloop the professional way: plan everything first, then hand Claude Code the complete picture in one go._

Last time, Claude Code got a short brief and the plan grew while the code was being written (password login, Account tab, solo mode, several crews, join requests and leaving a crew all came after the first build). Each one reshaped the database and the screens. This time the plan is finished, checked and written down before the first line of code.

**Nothing old gets deleted.** The live app (unloop-sigma.vercel.app), the GitHub repo, the Supabase project and the Vercel project all stay as they are until v2 is ready to replace them.

---

## What's in this folder

| File | What it is | Where it goes |
|---|---|---|
| `00-START-HERE.md` | This guide | Just for you |
| `01-project-instructions.md` | The standing rules for the new planning project | Paste into the new project's **Instructions** field |
| `02-kickoff-message.md` | The first message that starts the planning | Send as your **first message** in the new project |
| `03-v1-lessons.md` | What v1 taught us: what to keep, fix and drop, plus every gotcha we hit | Upload as a project file (Knowledge) |
| `04-handoff-pack-spec.md` | The exact list of documents the plan must produce, stage by stage, and the "ready to build" checklist | Upload as a project file (Knowledge) |
| `05-claude-code-kickoff.md` | The `CLAUDE.md` template and the first prompt for Claude Code | Used at the very end, when you hand over |
| `v1-reference/` | Copies of the five v1 Knowledge files plus the translated challenge data | Upload as project files (Knowledge) |

---

## The four phases

### Phase 0 · Set up the planning project ✅ done by Claude, 2026-11-11
The "Unloop v2" project exists, with these instructions in its settings, the v1 `Unloop` repo attached for reference, and the Default cloud environment. Its first message (the kickoff) is sent. It copies this kit from the `restart-kit/` folder on the `claude/project-thread-q865fn` branch of the v1 repo into its own files.

### Phase 1 · Build the plan with Claude (several sessions, together)
The plan has 10 stages (listed in `04-handoff-pack-spec.md`). Each stage ends with one finished file that you approve. Don't skip ahead: a stage is done when you've said "approved", and the file is saved.

Rough time: one or two evenings per stage for the product stages, less for the technical ones. The challenge library and the mockups are the biggest.

### Phase 2 · Hand over to Claude Code (about 30 minutes, you + Claude)
1. Create a **new GitHub repo** (suggestion: `unloop-v2`, private). The old `Unloop` repo stays as the v1 reference.
2. Put the finished plan files in the repo's `docs/` folder and the finished `CLAUDE.md` at the top level. The planning project can do this for you if GitHub is connected.
3. Do the account steps from `plan/10-setup-checklist.md` (it will tell you exactly which ones need you: a new Supabase project, a new Vercel project, the email sender, the domain if any).
4. **Important, this bit us in v1:** Claude Code must be able to reach the new Supabase and Vercel addresses. Once those projects exist, Claude Code asks to add their exact addresses to the network allowlist and you approve the card (or add `*.supabase.co` and `*.vercel.app` under Allowed domains in the cloud environment settings yourself). Without this, Claude Code can't reach your database or test the live site, and it ends up working blind.
5. Start a Claude Code session on the new repo and paste the kickoff prompt from `05-claude-code-kickoff.md`.

### Phase 3 · Build, milestone by milestone
Claude Code builds one milestone at a time, opens a pull request for each, and tells you what to try on your phone. You merge when you're happy. After the "friends can play" milestone, stop and play it with the crew for a weekend before building the rest.

---

## Decided
**Stack:** v2 keeps Next.js + Supabase + Vercel as an installable web app (Yuri, 2026-11-11).

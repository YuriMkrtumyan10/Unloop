# Handing over to Claude Code

_Used at the end of planning (Stage 10). Part A is the `CLAUDE.md` template the planning project fills in. Part B is the first message for Claude Code. Part C is the message for each later milestone._

---

## Part A · `CLAUDE.md` template
_The planning project fills in the `<…>` parts and saves the result as `CLAUDE.md` at the top of the new repo. Claude Code reads this file automatically at the start of every session._

```markdown
# CLAUDE.md · Unloop v2

## What this is
Unloop breaks friend groups out of their routine. The crew spins, gets a challenge, does it, adds photo proof, and it lands in a shared scrapbook with points. There is also a solo "Just me" mode.
The first real users are one friend group of <n> people who always do the same thing on Friday nights. Build for them.

This is a rebuild. v1 (repo YuriMkrtumyan10/Unloop) is reference only: don't copy its code or data model unless a doc here says to.

## The docs are the source of truth
Everything was planned and approved before the build. Read the relevant doc before each change:
- docs/01-product-brief.md: what we're building, MVP in and out, glossary
- docs/02-game-rules.md: numbered rules (R1, R2, …); every rule needs a test
- docs/03-screens.md: every screen and every state
- docs/04-engagement.md: how friends get pulled back in
- docs/05-challenges.md + docs/challenges.json: the challenge library (seed data)
- docs/06-design.md: tokens, components, motion, mockup links
- docs/07-copy.md: voice and key texts
- docs/08-tech.md: architecture, data model, security, environments
- docs/09-build-plan.md: the milestones, in order, with acceptance criteria
- docs/decisions-log.md: decisions already made; don't re-open them

If a doc is unclear, contradicts another doc, or doesn't cover something, **stop and ask**. Don't guess and don't invent features. If you think a doc is wrong, say so and suggest the fix; don't quietly build something different.
When a decision is made during the build, add it to docs/decisions-log.md and update the affected doc in the same commit.

## Stack
<Next.js (App Router) + TypeScript strict, Tailwind CSS, next-intl (en, hy, ru), Supabase (auth, Postgres, storage), Vercel, PWA. Exact versions from docs/08-tech.md.>

## Conventions
- Mobile first. Every screen is checked at 375 px wide.
- TypeScript strict; no `any` unless justified in a comment.
- Small components, one per file in `src/components/`.
- No hard-coded UI text: every string lives in `messages/en.json`, `messages/hy.json`, `messages/ru.json`. Check Armenian and Russian layouts; they run longer.
- Game rules live on the server (Postgres functions under row-level security). The phone never decides points, locks or who can do what.
- Database changes only through migration files in `supabase/migrations/`. Never edit the live database by hand.
- Secrets live in `.env.local` (never committed). Keep `.env.example` complete.
- Challenge seed comes from `docs/challenges.json` via <script name>.

## How to work
- Build one milestone from docs/09-build-plan.md at a time, in order. Don't start the next one until the current one is merged.
- Before coding a milestone, post a short plan: what you'll build, the files you'll touch, the rule numbers and screens it covers, the tests. Wait for a go-ahead.
- One branch and one pull request per milestone. Never push to main, never merge without Yuri's explicit go-ahead. Main deploys straight to the live site.
- Definition of done for a milestone:
  - lint, type check, tests and production build pass
  - every rule in the milestone has a passing automated test
  - every screen in the milestone clicked through at 375 px in en, hy and ru, with screenshots in the PR
  - docs updated if anything changed
- After each milestone, summarize in plain language: what changed, what Yuri should try on a phone, anything that needs Yuri.
- Yuri is not a developer. Explain git, PRs and setup steps plainly. If something needs Yuri (an account, a login, a payment, a setting), say so at the top of the message, with the exact link and steps.
- Suggest extras; don't build them unasked. They go on the Later list in docs/01-product-brief.md.

## Known gotchas (learned in v1)
- Supabase free projects pause after about 7 days without use. If the database is unreachable, check the project status first.
- Supabase's built-in email only reaches the Supabase team. Sign-up and reset emails go through <the custom email sender from docs/08-tech.md>. Emails are English only.
- Sign-in and reset links must work when opened in a different browser from the one that asked for them.
- Supabase actions that delete data may ask Yuri for approval and time out. Prefer migrations; if live data needs deleting, ask Yuri first.

## Commands
<filled in at Milestone 0: dev, build, lint, typecheck, test, e2e, seed>
```

---

## Part B · First message to Claude Code
_Paste this into the first Claude Code session on the new repo, after the setup checklist is done._

```
We're building Unloop v2 from a complete, approved plan. Everything you need is in CLAUDE.md and the docs/ folder. Please don't write any code yet.

First, read CLAUDE.md and every file in docs/, in numbered order. Then reply with:

1. What you're building, in 10 bullets or fewer, so I can check you understood it.
2. Every question, gap or contradiction you found in the docs, each with the doc and section, and your suggested answer. If there are none, say so.
3. An environment check: can you reach our Supabase project and Vercel; are the environment variables in .env.example all set; can you run the app, the tests and a phone-width browser check here? List anything that's blocked and exactly what I need to do about it.
4. Your plan for Milestone 0 from docs/09-build-plan.md: what you'll build, the files, the tests, and how I'll know it worked.

Then wait for my go-ahead.
```

---

## Part C · Message for each later milestone
_Paste this when the previous milestone is merged._

```
Milestone <n> is next (docs/09-build-plan.md). Re-read the docs it touches, then post your plan for it: what you'll build, which rules and screens it covers, the tests, and what I should try on my phone afterwards. Wait for my go-ahead before coding.
```

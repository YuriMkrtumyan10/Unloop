# CLAUDE.md — Unloop

> This file goes in the root of the code repository. Claude Code reads it automatically at the start of every session.

## What this is
A challenge app that breaks friend groups out of their routine. The group spins, gets a challenge (hike, cook something new, etc.), does it, uploads photo proof, and it lands in a shared timeline with points.

Full product context lives in `docs/`: product brief, decisions log, challenge library, design notes, and tech stack. **These files are the source of truth.** Read the relevant one before a big change, and when a decision is made, add it to `docs/02-decisions-log.md` (and update the brief or other docs if it changes them) in the same commit.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (auth, Postgres, storage for proof photos)
- Deployed on Vercel
- PWA (installable on phones)
- next-intl for translations: English, Armenian (hy), Russian (ru)

## Conventions
- Mobile-first. Test every screen at phone width.
- TypeScript strict mode; no `any` unless justified in a comment.
- Keep components small; one component per file in `src/components/`.
- Database changes go through Supabase migrations in `supabase/migrations/`. Never edit the production database by hand.
- Secrets live in `.env.local` (never committed). Keep `.env.example` up to date.
- Challenge seed data lives in `supabase/seed/challenges.json`, with title/description in en, hy, ru.
- No hard-coded UI text: every string goes in `messages/en.json`, `messages/hy.json`, `messages/ru.json`. Check Armenian and Russian layouts too; they run longer than English.

## Commands
_(fill in once the project is created)_
- `npm run dev`: run locally
- `npm run build`: production build
- `npm run lint`: lint

## Working rules
- MVP scope only (see product brief). Suggest extras; don't build them unasked.
- Before a large change, outline the plan and wait for a go-ahead.
- After each feature: run lint + build, then summarize what changed in plain language.

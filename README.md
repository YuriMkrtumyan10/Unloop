# Unloop

Break your group out of the loop. Spin for a challenge, go do it, prove it with a photo, and build a shared timeline of things you actually did together.

- Product docs: [`docs/`](docs/)
- Instructions for Claude: [`CLAUDE.md`](CLAUDE.md)

## Run it locally

```bash
cp .env.example .env.local   # fill in the Supabase URL and publishable key
npm install
npm run dev                  # http://localhost:3000
```

## Where things live

- `src/app/`: screens (welcome, group, spin, run = reveal/active, run/proof, scrapbook, leaderboard, account, new-password)
- `src/components/`: one component per file
- `messages/{en,hy,ru}.json`: every piece of UI text
- `supabase/migrations/`: database schema, rules and the challenge seed
- `supabase/seed/challenges.json`: the 60 challenges in three languages

# Decisions log

Every important choice goes here with the reason, so we never re-argue it by accident.
Format: date · decision · why · status

---

### 2026-10-19 · Plan before building
**Decision:** Set up the Project, brief, and stack before writing any code.
**Why:** Claude works best when it has stable context to refer back to.
**Status:** ✅ Decided

### 2026-10-19 · App name: Unloop
**Decision:** The app is called **Unloop** (replaces the working title "Plot Twist"). GitHub repo, Supabase org, and Vercel project all use this name.
**Why:** It names exactly the problem: friend groups stuck in the same loop every week. Short and memorable.
**Status:** ✅ Decided

### 2026-10-19 · Accounts and connections in place
**Decision:** GitHub repo `YuriMkrtumyan10/Unloop` (empty), Supabase org "Unloop Org" (no project yet), Vercel project `unloop` (not linked to the repo yet). All three connected to Claude.
**Why:** Ready for building; the Supabase project and the repo link get created when the first code exists.
**Status:** ✅ Done

### 2026-10-19 · Web app (PWA) first, native apps later
**Decision:** v1 is a web app that friends open from a link and can "add to home screen" like a real app.
**Why:** Fastest to build and test with our friend group. No App Store review, no fees. Native apps can come once the idea is proven.
**Status:** ✅ Decided (accounts created 2026-10-19)

### 2026-10-19 · Tech stack: Next.js + Supabase + Vercel
**Decision:** See `05-tech-stack.md`.
**Why:** All have generous free tiers, are very well known to Claude, and cover everything v1 needs (login, database, photo storage, hosting).
**Status:** ✅ Decided (accounts created 2026-10-19)

### 2026-10-19 · Difficulty levels: easy / spicy / extreme
**Decision:** Every challenge has a level. Groups can filter by it. Starting rule: 🟢 Easy ≤15 pts, 🟠 Spicy 20–30, 🔴 Extreme 35+ (adjust per challenge freely).
**Why:** Lets the group match the challenge to their mood and energy.
**Status:** ✅ Decided

### 2026-10-19 · Photo proof optional, with bonus points
**Decision:** A challenge can be marked done without a photo. Adding a photo gives +5 bonus points.
**Why:** Encourages photos (they make the timeline fun) without blocking anyone whose phone died.
**Status:** ✅ Decided

### 2026-10-19 · Three languages from v1: English, Armenian, Russian
**Decision:** The app and all challenges are available in English, Armenian, and Russian.
**Why:** Our first users are local friend groups.
**Consequence:** Translation support is built in from day one: every screen's text lives in translation files, and every challenge has a title in all three languages. Adding text later means adding it three times.
**Status:** ✅ Decided

### 2026-10-19 · Whoever spins decides
**Decision:** The person who spins accepts the challenge (or uses the one re-roll) for the group. No voting in v1.
**Why:** Fast, keeps the game feel. Voting goes on the "Later" list.
**Status:** ✅ Decided

# Decisions log

Every important choice goes here with the reason, so we never re-argue it by accident.
Format: date · decision · why · status

---

### 2026-10-18 · Visual direction for v1
**Decision:** Dark background (#131210) with one loud accent (electric lime #C8F03C). Unbounded for titles, Figtree for body text. The reveal is a tilted card; the timeline is a polaroid scrapbook. Bottom nav: Spin / Scrapbook / Leaderboard.
**Why:** Feels like game night, not a productivity app. One accent keeps "Spin" and points the loudest things on screen.
**Status:** ✅ Decided 2026-10-18. Yuri reviewed and approved the mockups (https://claude.ai/artifact/VNJdYw2hQALm1exTgk5bLY).

### 2026-10-18 · Points go to whoever showed up
**Decision:** When logging a challenge, the person logging it ticks who actually took part. Only those people get the challenge's points, plus the +5 photo bonus each if a photo is added.
**Why:** The leaderboard counts points per person, so the app has to know who was there. Skipping the night shouldn't earn you points.
**Status:** ✅ Decided

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

### 2026-10-19 · Supabase project lives in Frankfurt (free tier)
**Decision:** One Supabase project, "unloop", in the EU Central (Frankfurt) region on the free plan. Database changes only through `supabase/migrations/`.
**Why:** Closest region to our first users; the free tier covers v1 easily.
**Status:** ✅ Done

### 2026-10-19 · How the spin picks a challenge
**Decision:** Filters are "up to": picking 2–3h also allows shorter challenges; "Either" challenges match both inside and outside; no budget or level picked means any. Challenges the group already finished are skipped until nothing else fits. Each group has one open challenge at a time; someone else can take over a reveal that was left hanging, but your own reveal stays put, so backing out isn't a free re-roll.
**Why:** Keeps 60 challenges from running dry too fast, and keeps the one re-roll rule honest.
**Status:** ✅ Decided

### 2026-10-19 · Language is picked per phone, not in the link
**Decision:** The EN / HY / RU switch is on the welcome screen (and at the bottom of the leaderboard) and is remembered on that phone. Links don't change with language, so one invite link works for everyone.
**Why:** Friends in one group may read different languages; the invite link should be the same for all.
**Status:** ✅ Decided

### 2026-10-19 · Small screen additions beyond the mockups
**Decision:** The group screen asks "What do your friends call you?" (names show on the crew, proof and leaderboard screens). The bottom of the leaderboard holds the invite link, language switch and sign out, since the mockups had no settings screen.
**Why:** Without them, names would come from email addresses and there'd be no way to invite a late friend or sign out.
**Status:** ✅ Decided

### 2026-10-19 · Log in with a password, and an Account tab
**Decision:** The welcome screen has separate Log in and Sign up buttons, both with email and password (Google still works). "Forgot password?" emails a link to set a new one. The email-link-only sign-in is gone. A fourth bottom tab, Account, holds your name, avatar color, password change, language and sign out (moved from the bottom of the leaderboard; the invite link stays there). Change email, notifications, leave crew and delete account are shown as "Soon" until they're built.
**Why:** On a second phone the old screen only offered what looked like signing up again. Yuri asked for a proper log in, password reset and an account page.
**Needs:** Supabase's built-in email only reaches members of the Supabase team, so friends get sign-up and reset emails only once a custom email sender (SMTP) is set up in Supabase.
**Status:** ✅ Decided (Yuri, 2026-10-19)


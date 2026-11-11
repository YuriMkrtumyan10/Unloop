# Unloop v1: lessons for the restart

_Written 2026-11-11 from the v1 docs, the code, the build history and an honest review of the live app played as a new user. Read this before planning anything._

## 1. What v1 is
A web app (PWA) built between 2026-10-18 and 2026-11-10, live at unloop-sigma.vercel.app, code in the GitHub repo `YuriMkrtumyan10/Unloop`. Next.js 15 (App Router), Tailwind v4, next-intl (EN / HY / RU), Supabase in Frankfurt (auth, Postgres, photo storage), Vercel.

What a user can do: sign up with email and password or Google, reset a password, pick "Just me" or start, find or join a crew, spin a challenge with filters (people, time, budget, in/out, level), re-roll once, accept, log it as done with an optional photo and a one-line note, tick who showed up, see the crew scrapbook and leaderboard, switch between several crews, ask to join a crew by name, leave a crew, change name, avatar color, password and language.

The library has 81 challenges (60 for groups, 21 solo-only), each with a title in all three languages, a category, people, time, cost, place, points and level. No descriptions.

## 2. What worked: keep it
- **The look.** Dark ground, lime accent, the tilted cream challenge card and the polaroid scrapbook. It feels like game night, not a to-do app. Strongest part of v1.
- **The voice.** Lines like "Resistance is futile", "No re-rolls left. Destiny." and "no photo, just vibes" gave it personality.
- **One re-roll.** Keeps it a game, not a menu.
- **Points go to whoever showed up.** The person logging ticks who took part; only they score. Fair and simple.
- **The challenges fit the real group.** 28 of the 60 crew challenges work for 4 people, indoors, cheap, in under 3 hours, so the friends can do them right at the usual spot.
- **Armenian and Russian fit on a phone** even though they run longer.
- **Game rules live on the server** (Postgres functions for spin, re-roll, accept, complete). The phone only reads. Nobody can cheat by editing requests.
- **Solo mode** answered a real need: people wanted to use it alone too.

## 3. What didn't work: fix in v2

### Product gaps (from the live review)
1. **No way out after "Let's do it".** If a crew accepts "Camp overnight" and it rains for a month, nobody in that crew can spin again. Biggest logic gap. v2 needs a way to drop or swap an accepted challenge (no points, and the rule for how often has to be decided).
2. **Nothing pulls friends back.** No notification or message when the crew spins, accepts or logs something. Friends only find out if they open the app, so it all depends on one person. This is the reason the app wouldn't get opened on a Tuesday.
3. **The cards are thin.** A title only. "Go to a meetup or workshop": where, and what counts as done? The challenges are the product; each needs at least a "how" line and what counts as proof.
4. **The "Happening now" screen is half empty** and its only button is "Done". No sharing, no plan, no countdown, nothing for the friends who weren't there when it was spun.
5. **The reveal is too quick.** The icon spins for under a second, then the card pops in. The design notes call the reveal the heart of the app; it should feel like rolling dice (about 1 to 2 seconds of suspense).
6. **Logging works on trust.** You can log a 3-hour challenge 10 seconds after accepting it. Probably fine for friends, but it should be a conscious decision.
7. **Small things that made it feel unfinished:** "Friday again?" greeting shown on a Wednesday; "Yurec spun. Yurec decides." in solo; "Create group" on one button while everything else says crew; filters looking tappable while a spin is locked; the Spin button dropping below the screen when a spin is waiting; three greyed-out "Soon" rows on the Account page.
8. **Five bottom tabs** (Spin, Scrapbook, Leaderboard, Crews, Account) is a lot for an app with one main button.

### Process problems (how we built it)
1. **The plan grew during the build.** Password login, the Account tab, solo mode, several crews, join requests and leaving a crew were all added after the first build, across five pull requests. Each one reshaped the database and screens. Lesson: decide the whole MVP first, including accounts, crews and solo.
2. **Claude Code never had the full context.** It got a short brief, so it guessed, and the guesses had to be corrected later.
3. **Only 8 screens had mockups.** The Account, Crews and crew pages were built without approved designs. Lesson: every screen in the MVP gets a mockup before the build.
4. **Email was discovered late.** Supabase's built-in email only reaches members of the Supabase team, so friends couldn't confirm sign-up or reset a password until a Gmail sender was set up on 2026-11-10. Lesson: email sending is part of the plan from day one.
5. **No automated tests.** Checking was done by hand. Lesson: every game rule gets a test, and every milestone ends with a phone-width click-through in all three languages.

### Operational gotchas (tell Claude Code up front)
- The Claude Code cloud container blocked `supabase.co` and `vercel.app`, so it couldn't reach the real database or the live site and had to build a local stand-in. Fix: allow `*.supabase.co` and `*.vercel.app` in the cloud environment's network settings before the build.
- Supabase approval pop-ups (for database changes that delete data) never reached Yuri and timed out. The working fallback was running SQL in the Supabase SQL Editor through the browser. Avoid needing deletes on the live database through that tool.
- Supabase's free plan **pauses a project after about 7 days without use**. If the app suddenly says the database isn't reachable, check that first.
- Emails: Gmail as the sender (free, about 500 a day, no domain needed); Supabase caps auth emails at 30 an hour once a custom sender is on. Yuri wants emails in **English only** (three languages in one email felt too busy).
- Sign-in links must keep working when opened in a different browser from the one that asked for them (the reset email had to be fixed for this).
- Every merge to main deployed straight to the live site. Work on branches with pull requests; Yuri gives the go-ahead to merge.

## 4. Decisions from v1

**Carry forward (✅ unless Yuri says otherwise)**
- Name: Unloop.
- Installable web app first; native apps later.
- Three languages from day one, challenges included. Language is picked per phone, so one invite link works for everyone.
- Difficulty levels: easy (≤15 pts) / spicy (20–30) / extreme (35+).
- Photo proof optional, +5 bonus points with a photo.
- Points go only to the people who showed up.
- One re-roll per spin.
- Filters are "up to": 2–3h also allows shorter challenges; "either" matches in and out; no pick means any. Challenges the group already did are skipped until nothing else fits.
- Log in with email and password or Google, with password reset.
- Solo "Just me" space, private, with its own points; solo-only challenges only come up for one person.
- Several crews per person.
- Visual direction (dark, lime, Unbounded + Figtree, tilted card, scrapbook).
- Sign-up and reset emails through Gmail, English only.

**Open again in the restart (decide during planning)**
- **Dropping an accepted challenge.** Add it; decide the rule (who can, how often, any cost).
- **Bringing friends back.** Was on the "Later" list (weekly push). Needs at least a small version in the MVP: share to the group chat (Telegram, WhatsApp, Viber), and possibly web push for "your crew spun / logged something".
- **Whoever spins decides.** Still fast, but it's why the app depends on one person. Consider a lightweight "I'm in" from the others.
- **The spin lock** (your unanswered spin stays yours). Keep the rule, fix how it looks.
- **Navigation.** Five tabs down to four or fewer.
- **Find a crew by name + join requests + one admin per crew.** Friend groups join by invite link; search added an admin role and a request flow. Candidate to cut from the MVP.
- **Challenge card content.** Add a how line, what counts as done, maybe a tip or safety line.
- **The reveal animation.** Longer, more suspense.
- **Account page.** Only what works; no "Soon" rows.

## 5. What can be reused from v1
- **The challenge data** in `v1-reference/challenges.json`: 81 challenges with titles already translated into Armenian and Russian. Saves a lot of translation work; v2 adds the how lines.
- The app icons and the brand colors and fonts.
- The email templates (confirm sign-up, reset password) in the v1 repo.
- The database design as a reference: profiles, groups (with a solo flag), group members (with a role), challenges, runs (revealed → accepted → done), run participants, join requests, and a leaderboard view, with game rules in server functions (`spin`, `reroll`, `accept_run`, `complete_run`, `create_group`, `join_group`, `leave_group` and others). v2 should design its own data model from the plan, not copy this one.

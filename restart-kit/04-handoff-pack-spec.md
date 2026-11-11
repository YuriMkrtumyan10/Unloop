# Handoff pack: what the plan must produce

_This is the contract between the planning project and Claude Code. The plan is finished when every file below exists, is approved by Yuri, and passes the "ready to build" checklist at the bottom._

All files live in `plan/` and are later copied into the new repo's `docs/` folder, except `CLAUDE.md`, which goes at the top of the repo.

## Rules for every plan file
- Starts with a status line: `Status: draft | approved (date)`.
- Has an **Open questions** list at the top. A file can't be approved while it has open questions.
- No "TBD", "etc.", "and so on" or "something like". If it's not decided, it's an open question.
- Uses the same names everywhere (one word for a crew, one for a challenge run, one for each screen). The glossary in `01-product-brief.md` is the source.
- Anything not in the MVP goes on the Later list in `01-product-brief.md`, not into other files.

---

## The stages

### Stage 1 · Product brief → `plan/01-product-brief.md`
- The problem and who it's for (primary: friend groups of 3–8; secondary: solo).
- The core loop for v2 in 5–7 steps, including what happens between spinning and doing.
- **MVP: In**, as a numbered list of features, each with one line on why it earns its place.
- **Later**, as a list.
- Success metrics for the first month.
- Glossary: every product word the app uses (crew, Just me, spin, re-roll, challenge, run, proof, points, scrapbook, and so on), in EN / HY / RU.

### Stage 2 · Game rules → `plan/02-game-rules.md`
Numbered rules, each one testable as true or false. Covers at least:
- Spinning: who can spin, filters and how they match, which challenges are excluded, what happens when nothing fits.
- Re-roll: how many, who, when.
- Accepting, and what the others in the crew see and can do.
- **Dropping or swapping an accepted challenge**: who, how often, consequences.
- The lock: what blocks a new spin and how it's released, including a spin left hanging.
- Logging it as done: who can log, how long after accepting, who showed up, photo, note, editing or deleting a log.
- Points: base, photo bonus, solo vs crew, what leaving and rejoining does.
- Crews: create, invite, join, leave, the last person leaving, admin (if kept).
- Solo: what's different.
- Accounts: sign-up, confirm, log in, reset, delete account (if in MVP).
- An **edge cases** section: two people spinning at the same moment, someone leaving mid-challenge, a challenge deactivated mid-run, offline, a photo that fails to upload.

### Stage 3 · Screens and flows → `plan/03-screens.md`
- A navigation map (which tabs, what's reachable from where).
- The main flows as numbered steps: first-time sign-up to first spin; joining by invite link; a full challenge from spin to scrapbook; dropping a challenge; a friend who wasn't there catching up.
- For **every screen**: purpose in one line, what's on it top to bottom, every action and where it leads, and every state: empty, loading, error, offline, locked/waiting, solo vs crew, first time vs returning. What it looks like in the longest language (usually Armenian).

### Stage 4 · Bringing friends back → `plan/04-engagement.md`
The biggest v1 gap gets its own stage.
- Which moments reach the friends who aren't looking at the app (a spin, an accepted challenge, a log, a reminder, a drop), and through what: share to the group chat, web push, email.
- The exact message for each, in EN / HY / RU, and what tapping it opens.
- What the person can turn off.
- What's MVP and what's Later.

### Stage 5 · Challenge library v2 → `plan/05-challenges.md` + `plan/challenges.json`
- Start from `v1-reference/challenges.json` (81 challenges, titles already translated).
- Each challenge gets, in EN / HY / RU: title, a one- or two-line "how", what counts as done (the proof), and an optional safety note.
- Review every challenge against the real friend group: cut the weak ones, add new ones where the filters run dry (check counts per filter combination).
- `challenges.json` is the exact seed format for the build. Yuri (or a native speaker) checks the Armenian and Russian.

### Stage 6 · Design → `plan/06-design.md` + mockups
- Design tokens: colors, fonts, sizes, spacing, corner radius, shadows.
- Components: buttons, chips, cards, the challenge card, polaroid, avatars, tabs, sheets, toasts.
- Motion: the reveal (about 1–2 s of suspense), transitions, what happens on success.
- **A mockup for every screen in `03-screens.md`**, at phone width, including the main empty and locked states, linked from the file. Yuri approves them.
- Icons and the app icon.

### Stage 7 · Voice and copy → `plan/07-copy.md`
- A short voice guide (playful, cheeky, never preachy) with do and don't examples.
- Every user-facing line for the key moments (welcome, reveal, accept, drop, log, empty states, errors) in English. The build translates the rest; Armenian and Russian get a review step in the build plan.
- Email texts (English only).

### Stage 8 · Tech and data → `plan/08-tech.md`
- Architecture in plain language plus the technical version.
- Data model: every table and column, what it means, and who can read or write it (row-level security).
- Server functions for every rule in `02-game-rules.md` (rules stay on the server).
- Auth setup (email + password, Google, redirect URLs, email sender), photo storage (size limits, compression), notifications tech (if web push), PWA (install prompt, offline behavior).
- Environments: local, preview, live. Every environment variable, listed in `.env.example`.
- How Claude Code tests: a local Supabase or stand-in, automated tests for every game rule, phone-width click-throughs.
- Every account and service needed, and which steps only Yuri can do.

### Stage 9 · Build plan → `plan/09-build-plan.md`
- Milestones, small enough for one pull request each, in order. Suggested shape:
  0. Project skeleton, environments, CI, deploy of an empty app.
  1. Accounts and sign-in, in three languages.
  2. Crews, invites and Just me.
  3. Spin, re-roll, accept, drop.
  4. Log it, proof, scrapbook, points.
  5. Bringing friends back.
  6. Polish, PWA, real-device check. → **Stop: the friend group plays it for a weekend.**
  7. Fixes from the weekend.
- For each milestone: what's in it, the acceptance criteria (copied rule numbers and screen names), the tests, and what Yuri tries on a phone.
- Definition of done for every milestone: lint, type check, tests and build pass; every screen checked at 375 px wide in EN, HY and RU; screenshots in the pull request; docs updated.

### Stage 10 · Handoff → `CLAUDE.md`, `plan/decisions-log.md`, `plan/10-setup-checklist.md`
- `CLAUDE.md` filled in from the template in `05-claude-code-kickoff.md`.
- The decisions log for v2 (carried-over decisions plus everything decided in planning).
- The setup checklist: new GitHub repo, new Supabase project, new Vercel project, Google sign-in, email sender, Claude Code network access for `*.supabase.co` and `*.vercel.app`, environment variables. Each step marked **Yuri** or **Claude**.

---

## "Ready to build" checklist
Go through this out loud with Yuri before the handoff.
- [ ] Every file above exists and says `approved`.
- [ ] No open questions left in any file.
- [ ] Every MVP feature in the brief appears in the game rules, the screens and a milestone.
- [ ] Every game rule has a number, and every number appears in a milestone's acceptance criteria.
- [ ] Every screen has a mockup and all of its states.
- [ ] The challenge library has the how line and proof in all three languages, and the Armenian and Russian have been checked.
- [ ] The three v1 gaps are solved on paper: dropping a challenge, bringing friends back, rich challenge cards.
- [ ] Every account step in the setup checklist is done, including the network access.
- [ ] The Later list exists, and nothing on it sneaks into the milestones.

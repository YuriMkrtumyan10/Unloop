# Product brief: Unloop

_Status: v0.3. Open questions answered 2026-10-19; solo mode and several crews added 2026-10-22._

## 1. The problem
Friend groups fall into a loop: same place, same activity, same night every week. Nobody hates it, but nobody remembers any of those nights either. Breaking the routine takes effort: someone has to come up with an idea, convince everyone, and plan it. Usually nobody does, so the group defaults to the usual.

## 2. The solution
An app that removes the "someone has to come up with an idea" step. Open it, tell it a little about the situation (how many people, how much time, budget, indoors/outdoors), and it hands you a challenge. Do it, snap a photo as proof, and build up a shared history of things you've actually done together.

## 3. Who it's for
- **Primary:** friend groups (3–8 people) who hang out regularly and are stuck in a routine.
- **Secondary:** individuals who want to push themselves to try new things (solo mode).
- **First real users:** our own friend group. If they use it for a month, we've got something.

## 4. Core loop
1. **Pick:** the group (or one person) opens the app and sets filters: group size, time available, budget, indoor/outdoor, energy level.
2. **Spin:** the app reveals a challenge. One re-roll allowed; after that you're committed. This keeps it a game, not a menu.
3. **Do it:** go do the thing.
4. **Prove it:** upload a photo and an optional one-line note.
5. **Remember it:** it lands in the group's timeline. Earn points or streaks.

## 5. MVP scope (version 1)
**In:**
- Sign up or log in (email and password, or Google), with password reset
- Account page: name, avatar color, password, language, sign out
- Create a crew and invite friends by link
- Solo mode: use the app alone ("Just me"), no crew needed
- Be in several crews and switch between them (Crews tab); leave a crew
- Find a crew by name and ask to join; the crew's admin lets you in or says no
- Challenge library (starting with ~60 hand-written challenges, see `03-challenges.md`)
- Filters: group size, time, budget, indoor/outdoor, difficulty (easy / spicy / extreme)
- Three languages: English, Armenian, Russian (user picks; challenges translated too)
- "Spin" with one re-roll
- Mark a challenge as done; photo proof optional, but earns bonus points
- Group timeline of completed challenges
- Simple points per challenge, shown on a group leaderboard

**Later (not in v1):**
- Weekly challenge sent automatically to the group (push notifications)
- Users submit their own challenges; group votes
- Group voting on which challenge to accept after a spin
- AI-generated challenges tailored to the group's history and location
- Location-aware suggestions (nearby trails, restaurants, events)
- Badges, seasons, streaks
- Public challenges between different groups
- Crew admins remove members or hand the admin role to someone else
- Native App Store / Google Play apps

## 6. Success for v1
- Our friend group completes at least **4 challenges in the first month**.
- At least one other friend group starts using it without us pushing.

## 7. Answered questions ✅
- [x] Final app name: **Unloop**
- [x] Difficulty levels: **yes**, easy / spicy / extreme
- [x] Photo proof: **optional**, but a photo earns bonus points
- [x] Languages for v1: **English, Armenian, Russian**
- [x] Who decides: **whoever spins**

# Tech stack

_Status: ✅ decided 2026-10-19._

| Need | Tool | Why | Cost to start |
|---|---|---|---|
| App framework | **Next.js** (React, TypeScript) | Most popular way to build web apps; Claude knows it very well | Free |
| Installable on phones | **PWA** (Progressive Web App) | Friends can "Add to Home Screen" and it behaves like an app | Free |
| Styling | **Tailwind CSS** | Fast, consistent styling | Free |
| Translations (EN / HY / RU) | **next-intl** | Standard way to run a Next.js app in several languages | Free |
| Login, database, photo storage | **Supabase** | One service covers accounts, data, and image uploads | Free tier |
| Hosting | **Vercel** | Push code, and it's live at a link in about a minute | Free tier |
| Code storage and history | **GitHub** | Backup, history, and how Claude Code and Vercel connect | Free |
| Building | **Claude Code** | Writes and runs the code directly in the project | Included with your Claude plan* |
| App visuals and promo | **Higgsfield** (already connected) | Icons, promo images, launch video | Your Higgsfield plan |

\* Check your plan's limits on support.claude.com.

## Path to native apps later
If v1 works, we can wrap the same app for the App Store / Google Play, or rebuild the front end in **React Native (Expo)** and reuse the same Supabase backend. Nothing in v1 locks us out.

## Accounts
- [x] GitHub: repo `Unloop`
- [x] Supabase: org "Unloop Org"
- [x] Vercel: project `unloop`

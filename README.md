# Everon

Mobile-first youth ministry game app built with Vite, React, TypeScript, Tailwind CSS, and Supabase.

## Local setup

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and add the Supabase project URL and anon key.
4. Run `npm run dev`.

The first vertical slice includes the responsive app shell, local Bible trivia game, leaderboard preview, and profile progress view. Supabase schema, authentication, and score persistence are the next implementation slice.

## Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` runs TypeScript checks and creates a production build.
- `npm run lint` checks the source tree.
- `npm run preview` serves the production build locally.

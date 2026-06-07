# Setup Requirements

## Goal

A deployable Next.js project with auth, database, PWA capabilities, and dev tooling —
ready to build features on top of.

## Features

### 1. Project Scaffold
- Next.js 16 with App Router and Turbopack
- Tailwind CSS 4 with dark/light mode (system preference)
- All shadcn/ui components installed
- Biome for linting and formatting

### 2. Authentication
- Better Auth with Google OAuth
- Drizzle adapter (built-in)
- API route handler for auth flows
- Auth client for React

### 3. Database
- Neon PostgreSQL with Drizzle ORM
- Schema: auth tables (user, session, account, verification) +
  app tables (events, preferences, comparisons, recommendations, chat, push subscriptions)
- drizzle-kit configured for push/generate/studio

### 4. PWA
- Serwist service worker (precache + runtime cache)
- Web manifest (installable)
- Offline fallback page

### 5. Dev Tooling
- Lefthook (pre-commit: biome, lockfile-lint, sort-package-json, typecheck)
- Commitlint (conventional commits)
- .kiro agent config, steering, hooks

## Success Criteria

- `npm run build` passes without errors
- App is installable as PWA
- Auth flow works with Google OAuth
- Database schema can be pushed to Neon
- Biome + lefthook hooks run on commit

## Non-Goals

- No actual UI beyond a placeholder home page
- No scraping, preferences, or recommendation logic
- No Vercel deployment (done manually later)

# Setup Tasks

## Dependency Order

```
T0 (Scaffold) → T1 (Auth) → T2 (Database) → T3 (PWA) → T4 (Tooling)
```

## T0 — Project Scaffold ✅

- [x] Init Next.js 16 with TypeScript, Tailwind CSS 4, App Router
- [x] Install all shadcn/ui components
- [x] Dark/light mode via system preference (class strategy)
- [x] Basic layout and placeholder home page

## T1 — Authentication ✅

- [x] Install and configure Better Auth (Google OAuth)
- [x] API route handler at `/api/auth/[...all]`
- [x] Auth client for React (`lib/auth-client.ts`)
- [x] Middleware for route protection

## T2 — Database ✅

- [x] Neon connection via `@neondatabase/serverless`
- [x] Drizzle ORM 1.0 RC configured
- [x] Full schema (auth tables + app tables)
- [x] drizzle-kit config (output to `db/`)

## T3 — PWA ✅

- [x] Serwist service worker with precache and runtime cache
- [x] Web manifest (`app/manifest.json`)
- [x] Offline fallback page (`/~offline`)
- [x] SerwistProvider in root layout

## T4 — Dev Tooling ✅

- [x] Biome 2.4 (replaces ESLint) with components/ui excluded
- [x] Lefthook (pre-commit + commit-msg hooks)
- [x] Commitlint with conventional config
- [x] lockfile-lint, sort-package-json
- [x] .kiro agent, prompts, steering, hooks

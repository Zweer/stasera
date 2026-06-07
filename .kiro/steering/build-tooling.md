# Build & Tooling

## Scripts

```bash
npm run dev           # next dev --turbopack
npm run build         # next build
npm run lint          # biome check .
npm run lint:fix      # biome check --write .
npm run db:push       # drizzle-kit push
npm run db:generate   # drizzle-kit generate
npm run db:studio     # drizzle-kit studio
```

## Linting & Formatting

- **Biome** for linting and formatting (NOT ESLint/Prettier)
- Double quotes, semicolons, 2-space indent
- `components/ui/` excluded from linting (auto-generated)

## Package Manager

- **npm** (no yarn, no pnpm, no bun)
- Lock file: `package-lock.json`

## Database

- **Drizzle ORM** 1.0 RC with `@neondatabase/serverless`
- Migrations output: `db/` folder
- Schema: `db/schema.ts`
- Use `drizzle-kit push` for development, `generate` + `migrate` for production

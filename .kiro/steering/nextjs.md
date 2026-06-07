# Next.js Conventions

## App Router

- Server Components by default — `'use client'` only for event handlers, hooks, browser APIs
- Colocate: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` in the same route folder
- Route Handlers in `app/api/` using `route.ts`

## Data Fetching

- Server Components fetch data directly (no `useEffect`)
- Client-side: use hooks or AI SDK's `useChat`/`useCompletion`
- Always validate input (Zod schemas)

## Components Structure

```
components/
├── ui/           # shadcn (auto-generated, don't touch)
├── features/     # Feature-specific (EventCard, PreferenceQuiz)
└── layouts/      # Layout components (Header, BottomNav)
```

## Styling

- Tailwind CSS 4 for all styling
- Dark mode via `class` strategy (synced to system preference)
- Mobile-first responsive design

## Environment Variables

- Server-only: `process.env.VAR_NAME` (no prefix)
- Client-exposed: `NEXT_PUBLIC_` prefix
- Never log or expose server env vars to the client

## Performance

- `next/image` for images, `next/link` for navigation
- Dynamic imports (`next/dynamic`) for heavy client components
- Metadata API for SEO

# Performance Requirements

## Goal

Optimize the app for production-quality speed, efficiency, and PWA compliance.
Two axes: frontend (Lighthouse, loading UX) and backend (LLM cost/latency reduction).

## Features

### 1. Lighthouse PWA Audit
- Target: PWA score > 90, Performance > 85
- Fix any flagged issues (manifest, icons, HTTPS, service worker)
- Ensure all pages pass Core Web Vitals (LCP < 2.5s, CLS < 0.1)

### 2. App Icon & Splash Screen
- Design 192x192 and 512x512 icons (maskable + any)
- Apple touch icon
- Splash screen for iOS add-to-home

### 3. Loading Skeletons
- Skeleton UI for: suggestions page, explore page, profile page
- Shimmer animation consistent with design system
- Replace current "Caricamento..." text states

### 4. LLM Call Optimization
- **Enrichment batching**: group multiple raw events into fewer LLM calls
- **Reason caching**: cache generated reasons for same event across users
- **Prompt dedup**: don't re-enrich events already in DB (check before calling LLM)
- **Token budgeting**: monitor and log token usage per cron run

### 5. Image Optimization
- Configure `next.config.ts` `images.remotePatterns` for known event image domains
- Use `next/image` with optimization for scraped images (not just `unoptimized`)
- Lazy load below-fold images

### 6. Edge Caching
- Cache `/api/events` response at edge (revalidate every 1h)
- Cache `/api/recommendations` per user with short TTL (5 min)
- Use `next/headers` cache control headers

## Success Criteria

- Lighthouse PWA > 90
- Lighthouse Performance > 85
- LLM token usage reduced by ~40% (batching + dedup)
- No layout shift on page load (skeletons match final layout)
- Event images load fast (optimized, lazy loaded)

## Non-Goals

- CDN for user-uploaded images (keep simple for now)
- Multi-region deployment
- Real-time event updates (daily refresh is fine)
- Spending money on caching infrastructure (use Vercel built-in)

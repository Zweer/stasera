# Performance Tasks

## Dependency Order

```
T1 (Lighthouse) → T2 (Icons/Splash)
T3 (Skeletons) — independent
T4 (LLM Optimization) — independent
T5 (Image Optimization) → T6 (Edge Caching)
```

## T1 — Lighthouse Audit ⬜

- [ ] Run Lighthouse audit on all main pages (suggestions, explore, chat, profile)
- [ ] Fix manifest issues (if any)
- [ ] Fix service worker registration issues (if any)
- [ ] Ensure HTTPS + offline fallback pass
- [ ] Fix accessibility issues flagged by Lighthouse
- [ ] Target: PWA > 90, Performance > 85, Accessibility > 90

## T2 — App Icon & Splash Screen ⬜

- [ ] Design app icon (moon/amber theme, 192x192 + 512x512)
- [ ] Add maskable icon variant
- [ ] Apple touch icon (180x180)
- [ ] iOS splash screens (multiple sizes or meta tags)
- [ ] Update manifest.json with final icons

## T3 — Loading Skeletons ⬜

- [ ] Create reusable `Skeleton` component (shimmer animation)
- [ ] Suggestions page: 3 card skeletons matching final card dimensions
- [ ] Explore page: search bar + 4 horizontal card skeletons
- [ ] Profile page: avatar + bars skeleton
- [ ] Replace all "Caricamento..." text with skeletons

## T4 — LLM Call Optimization ⬜

- [ ] Enrichment: skip events already in DB (check by sourceUrl before calling LLM)
- [ ] Enrichment: batch prompt (multiple events in one call, structured array output)
- [ ] Reason generation: cache by eventId (don't regenerate for same event)
- [ ] Token logging: log input/output tokens per cron run for monitoring
- [ ] Evaluate cost savings vs baseline

## T5 — Image Optimization ⬜

- [ ] Identify domains for scraped event images
- [ ] Configure `next.config.ts` `images.remotePatterns`
- [ ] Replace `unoptimized` prop with proper next/image optimization where possible
- [ ] Add `loading="lazy"` / priority flags appropriately
- [ ] Placeholder blur for event images

## T6 — Edge Caching ⬜

- [ ] Add `Cache-Control` headers to `/api/events` (revalidate 1h)
- [ ] Add per-user short TTL cache for `/api/recommendations`
- [ ] Verify caching behavior with Vercel analytics

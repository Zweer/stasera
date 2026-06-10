# Performance Tasks

## Dependency Order

```
T1 (Lighthouse) → T2 (Icons/Splash)
T3 (Skeletons) — independent
T4 (LLM Optimization) — independent
T5 (Image Optimization) → T6 (Edge Caching)
```

## T1 — Lighthouse Audit ⬜

- [ ] Run Lighthouse audit on all main pages (deploy required)
- [ ] Fix manifest issues (if any)
- [ ] Fix service worker registration issues (if any)
- [ ] Fix accessibility issues flagged by Lighthouse
- [ ] Target: PWA > 90, Performance > 85, Accessibility > 90

## T2 — App Icon & Splash Screen → moved to 07-rebrand

Depends on final brand name/identity. See `.kiro/specs/07-rebrand/tasks.md`.

## T3 — Loading Skeletons ✅

- [x] Reuse shadcn `Skeleton` component (already available)
- [x] Suggestions page: `loading.tsx` with 3 card skeletons
- [x] Explore page: `loading.tsx` with search + 4 card skeletons
- [x] Profile page: `loading.tsx` with avatar + bars skeleton

## T4 — LLM Call Optimization ✅

- [x] Pre-enrichment URL dedup: skip events already in DB by sourceUrl
- [x] Reason generation: in-memory cache by eventId (same run, same event → no re-call)
- [ ] Enrichment batch prompt (multiple events in one call) — future optimization
- [ ] Token logging per cron run — future monitoring

## T5 — Image Optimization ✅

- [x] Configure `next.config.ts` `images.remotePatterns` for mentelocale, genovatoday, googleusercontent
- [x] Profile avatar uses next/image with optimization
- [x] Event images use next/image (unoptimized for unknown domains, optimized for known)

## T6 — Edge Caching ✅

- [x] `/api/events`: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=7200`
- [x] `/api/recommendations`: `Cache-Control: private, s-maxage=300, stale-while-revalidate=600`

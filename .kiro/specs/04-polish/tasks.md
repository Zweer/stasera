# Polish Tasks

## Dependency Order

```
T1 (Offline) ──┐
T2 (UI Polish) ├→ T5 (Performance)
T3 (Dedup) ────┘
T4 (Feedback) ─────→ T5
```

## T1 — Offline Support

- [ ] Cache last recommendations in service worker
- [ ] Offline-aware UI (stale data indicator)
- [ ] Graceful error handling when network unavailable

## T2 — UI Polish

- [ ] Page transition animations
- [ ] Loading skeletons for all async pages
- [ ] Typography and spacing audit
- [ ] App icon design (192px + 512px)
- [ ] Splash screen
- [ ] Dark mode refinement (contrast, readability)

## T3 — Event Dedup (Advanced)

- [ ] LLM-assisted duplicate detection for ambiguous cases
- [ ] Merge strategy (combine metadata from both sources)
- [ ] Admin/debug view for duplicate resolution

## T4 — Feedback Loop (Advanced)

- [ ] Post-event follow-up prompt ("How was it?")
- [ ] Stronger profile signal from post-event feedback
- [ ] Profile drift notification ("Your tastes are evolving")
- [ ] Historical view of profile changes

## T5 — Performance

- [ ] LLM call optimization (batching, caching)
- [ ] Image optimization for event thumbnails
- [ ] Lighthouse audit and fixes (target PWA > 90)
- [ ] Edge caching for static recommendation pages

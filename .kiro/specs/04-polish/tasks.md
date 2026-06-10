# Polish Tasks

## T1 — Offline Support ✅

- [x] NetworkFirst cache for /api/recommendations (timeout 5s, serve stale)
- [x] NetworkFirst cache for /api/events (timeout 5s, serve stale)
- [x] Fallback offline page for navigation requests

## T2 — UI Design System ✅

- [x] Nocturnal Urban Pulse palette (warm dark amber)
- [x] Font setup: Inter (body) + Geist (display) via next/font
- [x] Custom spacing scale (xs → xl)
- [x] Typography utility classes (.text-display-lg → .text-label-sm)
- [x] TopBar component (Moon logo + notifications)
- [x] BottomNav 4 tab (Lucide icons, glass effect)
- [x] Suggestion cards (full-bleed image, gradient, reason, accept/reject)
- [x] Event cards (horizontal, image 1/3)
- [x] Chat bubbles (asymmetric, AI avatar)
- [x] Onboarding comparison cards (3/5 aspect, side-by-side, chips)
- [x] Welcome hero (blurred bg, centered logo, Google CTA)
- [x] Upload page (drag/drop, progress)
- [x] Confirm event page (form edit, chips)
- [x] Profile (avatar, taste bars, settings, push toggle, logout)
- [x] Dark mode default (system preference sync)

## T3 — Event Dedup ✅ (basic)

- [x] Cross-source dedup by name/date similarity
- [ ] LLM-assisted duplicate detection for ambiguous cases (post-MVP)
- [ ] Admin view for duplicate resolution (post-MVP)

## T4 — Feedback & Toast ✅

- [x] Sonner Toaster in app layout
- [x] Toast on accept ("Ci vado! 🎉") and reject ("Rimosso dai suggerimenti")
- [x] Preference vector update on feedback (backend)

## T5 — Performance (post-MVP)

- [ ] LLM call optimization (batching, caching)
- [ ] Image optimization for event thumbnails (next/image configured)
- [ ] Lighthouse audit and fixes (target PWA > 90)
- [ ] Loading skeletons for all async pages
- [ ] App icon design (192px + 512px)
- [ ] Splash screen

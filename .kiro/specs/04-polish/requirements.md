# Polish Requirements

## Goal

Refine the app for daily use: offline support, visual polish, and closing the
feedback loop so the system improves over time.

## Features (MVP — all done ✅)

### 1. Offline Support
- NetworkFirst caching for `/api/recommendations` and `/api/events`
- Timeout 5s, then serve cached (stale) data
- Fallback offline page for navigation

### 2. UI Design System (Nocturnal Urban Pulse)
- Dark mode default with warm amber palette
- Inter (body) + Geist (display/labels) fonts
- Full page redesign: Welcome, Onboarding, Suggestions, Explore, Chat, Upload, Confirm, Profile
- TopBar + BottomNav (4 tabs, glass effect)
- Responsive mobile-first design

### 3. Event Dedup (Cross-source)
- Basic dedup by name/date/location similarity across sources
- Events from MenteLocale + GenovaToday + uploads unified

### 4. Feedback Loop
- Accept/reject updates preference vector (+0.2 / -0.15 per tag)
- Tags extracted from event: genre, vibe, energyLevel, dayMoment, indoorOutdoor
- Toast confirmation on actions (sonner)
- Profile continuously improves with usage

## Features (Post-MVP)

### 5. Performance & Polish
- LLM call optimization (batching, caching)
- Image optimization for event thumbnails
- Loading skeletons for async content
- App icon and splash screen design
- Lighthouse PWA audit (target > 90)

### 6. Advanced Dedup
- LLM-assisted duplicate detection for ambiguous cases
- Merge strategy: keep richer metadata
- Admin view for manual resolution

### 7. Advanced Feedback
- Post-event follow-up ("How was it?")
- Stronger signal from post-event feedback
- Profile drift notification

## Success Criteria (MVP)

- [x] App usable offline (last recommendations visible from cache)
- [x] Dark mode design feels polished and intentional
- [x] No visible duplicate events in suggestions
- [x] Profile improves with each accept/reject interaction
- [x] Toast feedback confirms user actions

## Non-Goals

- Native mobile app
- User accounts beyond Google OAuth (guest mode is post-MVP)
- Multi-city support
- Public event listing (app is personal/private)

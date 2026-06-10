# Recommendations Tasks

## Dependency Order

```
T1 (Scoring) → T2 (Matching Job) → T3 (Suggestions UI) → T4 (Chat)
                                          ↓
                                    T5 (Push) → T6 (Feedback)
```

## T1 — Scoring Algorithm ✅

- [x] Tag-based scoring function (event tags × user weights)
- [x] Score normalization (0-1 range)
- [x] Bonus/penalty logic for strong matches and anti-preferences
- [x] Unit tests with sample profiles and events

## T2 — Matching Job (Cron) ✅

- [x] Vercel Cron config (Friday + Saturday 14:00)
- [x] Fetch active weekend events from DB
- [x] Score all events per user
- [x] Select top 3, generate reason text (LLM)
- [x] Save recommendations to DB
- [x] Protected with CRON_SECRET
- [x] Returns MatchingResult[] with userId for push targeting

## T3 — Suggestions UI ✅

- [x] Suggestions page with 3 recommendation cards (full-bleed image design)
- [x] Card: event info + personalized reason + accept/reject
- [x] Empty state ("I tuoi suggerimenti arrivano venerdì")
- [x] Toast feedback on accept/reject (sonner)
- [x] Link from push notification opens /suggestions

## T4 — Chat (Re-ranking) ✅

- [x] Chat UI (asymmetric bubbles, AI avatar, styled input)
- [x] Streaming response with real-time display
- [x] LLM interprets user's mood/request
- [x] Re-rank events based on chat context

## T5 — Push Notifications ✅

- [x] VAPID key generation and configuration
- [x] Subscription management (POST/DELETE /api/push)
- [x] Notification sending logic (from cron job via web-push)
- [x] Permission prompt UI (toggle in profile page)
- [x] Service worker push + notificationclick handlers
- [x] Cleanup expired subscriptions (410 Gone)

## T6 — Feedback Loop ✅

- [x] Accept/reject UI on recommendation cards
- [x] Save feedback to DB (recommendation status update)
- [x] Preference vector adjustment: +0.2 (accepted) / -0.15 (rejected) per event tag
- [x] Tags used: genre, vibe, energyLevel, dayMoment, indoorOutdoor

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

## T3 — Suggestions UI ✅

- [x] Suggestions page with 3 recommendation cards
- [x] Card: event info + personalized reason + accept/reject
- [x] Empty state (no recommendations yet)
- [ ] Link from push notification (needs T5)

## T4 — Chat (Re-ranking) ✅

- [x] Chat UI (input + streaming response)
- [x] One-shot session (no history persistence)
- [x] LLM interprets user's mood/request
- [x] Re-rank events based on chat context
- [ ] Update displayed suggestions (currently shows text response only)

## T5 — Push Notifications ⬜

- [ ] VAPID key generation and configuration
- [ ] Subscription management (save endpoint to DB)
- [ ] Notification sending logic (from cron job)
- [ ] Permission prompt UI
- [ ] Service worker push event handler

## T6 — Feedback Loop ✅ (basic)

- [x] Accept/reject UI on recommendation cards
- [x] Save feedback to DB (recommendation status update)
- [ ] Preference vector adjustment based on feedback
- [ ] Decay function (older feedback matters less)

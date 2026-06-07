# Recommendations Tasks

## Dependency Order

```
T1 (Scoring) → T2 (Matching Job) → T3 (Suggestions UI) → T4 (Chat)
                                          ↓
                                    T5 (Push) → T6 (Feedback)
```

## T1 — Scoring Algorithm

- [ ] Tag-based scoring function (event tags × user weights)
- [ ] Score normalization (0-1 range)
- [ ] Bonus/penalty logic for strong matches and anti-preferences
- [ ] Unit tests with sample profiles and events

## T2 — Matching Job (Cron)

- [ ] Vercel Cron config (Friday + Saturday triggers)
- [ ] Fetch active weekend events from DB
- [ ] Score all events per user
- [ ] Select top 3, generate reason text (LLM)
- [ ] Save recommendations to DB

## T3 — Suggestions UI

- [ ] Suggestions page with 3 recommendation cards
- [ ] Card: event info + personalized reason + accept/reject
- [ ] Empty state (no recommendations yet)
- [ ] Link from push notification

## T4 — Chat (Re-ranking)

- [ ] Chat UI (input + streaming response)
- [ ] One-shot session (no history persistence)
- [ ] LLM interprets user's mood/request
- [ ] Re-rank events based on chat context
- [ ] Update displayed suggestions

## T5 — Push Notifications

- [ ] VAPID key generation and configuration
- [ ] Subscription management (save endpoint to DB)
- [ ] Notification sending logic (from cron job)
- [ ] Permission prompt UI
- [ ] Service worker push event handler

## T6 — Feedback Loop

- [ ] Accept/reject UI on recommendation cards
- [ ] Save feedback to DB (recommendation status update)
- [ ] Preference vector adjustment based on feedback
- [ ] Decay function (older feedback matters less)

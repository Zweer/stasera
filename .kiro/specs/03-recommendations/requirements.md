# Recommendations Requirements

## Goal

Match user preference profiles to upcoming weekend events, deliver personalized
suggestions with explanations, and allow natural-language refinement via chat.

## Core Flow

```
Friday/Saturday trigger (cron)
  → Fetch active events for the weekend
  → Score each event against user's preference vector
  → Top 3 events per user → save as recommendations
  → Push notification: "Ho 3 suggerimenti per stasera! 🎉"

User opens app
  → Sees 3 recommendation cards with reasoning
  → Can chat: "Oggi ho voglia di qualcosa di romantico"
  → LLM re-ranks events based on chat input
  → Updated suggestions shown
```

## Features

### 1. Matching Job (Automated)
- Triggered Friday afternoon and/or Saturday morning
- For each user with a preference profile:
  - Score all active weekend events against their preference vector
  - Select top 3 highest-scoring events
  - Generate a short reason for each ("Te lo consiglio perché...")
- Save recommendations to DB

### 2. Scoring Algorithm
- Tag-based weighted sum: event tags × user preference weights
- Bonus for strong matches (tag weight > 0.7 AND event has that tag)
- Penalty for anti-preferences (negative weights)
- Normalize scores to 0-1 range

### 3. Suggestions Page
- 3 cards, each showing:
  - Event name, date/time, location
  - Vibe/genre tags
  - Personalized reason ("Perché ti piace il jazz e l'atmosfera intima")
  - Accept/Reject buttons (for feedback loop)

### 4. Chat (Re-ranking)
- One-shot chat session (no persistent history)
- User types natural language preference for tonight
- LLM interprets and re-ranks available events
- Updated suggestions replace previous ones
- Powered by AI SDK streaming

### 5. Push Notifications
- Web Push API with VAPID keys
- User subscribes via browser prompt
- Notification sent by cron when recommendations are ready
- Tapping notification opens the suggestions page

### 6. Feedback Loop
- User accepts or rejects each recommendation
- Acceptance/rejection updates preference vector slightly
- Strengthens or weakens tags associated with that event

## Success Criteria

- Recommendations feel relevant ("this knows my taste")
- Chat refinement produces meaningfully different results
- Push notification arrives Friday/Saturday
- Feedback visibly improves future recommendations
- Response time under 3 seconds for chat re-ranking

## Non-Goals

- Group recommendations ("what should we do as a group")
- Calendar integration
- Booking/ticket purchase
- Recommendations for non-weekend days

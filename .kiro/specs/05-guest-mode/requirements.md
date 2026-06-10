# Guest Mode Requirements

## Goal

Allow users to explore the app without signing in, reducing friction for first-time
visitors and enabling a "try before you commit" experience. Guest users can browse
events and upload screenshots, but personalized features require sign-up.

## Core Flow

```
Welcome page
  → "Continua come ospite"
  → Browse Explore (read-only event list)
  → View generic suggestions (not personalized)
  → Upload screenshots (stored temporarily)
  → Banner prompts sign-up for full experience

Sign-up
  → Merge guest uploads into new user account
  → Redirect to onboarding
```

## Features

### 1. Anonymous Session
- "Continua come ospite" link on Welcome page
- Creates an anonymous session (Better Auth guest/anonymous flow)
- Session has `role: "guest"` flag
- Persists across page reloads (cookie-based)

### 2. Guest Capabilities
- Browse `/explore` (full event list, search, filters)
- View `/suggestions` with generic (non-personalized) recommendations
- Upload screenshots via `/upload` (stored with guest session ID)
- View `/upload/confirm` and publish events

### 3. Guest Limitations
- No onboarding / taste profile
- No personalized suggestions (show top-scored events for all users)
- No chat AI (or limited to 2 messages with CTA to sign up)
- No push notifications
- No profile page (redirects to sign-up prompt)

### 4. Conversion Prompts
- Persistent banner on suggestions page: "Accedi per suggerimenti personalizzati"
- After 2nd chat message: "Per continuare la conversazione, accedi"
- After upload confirm: "Accedi per salvare i tuoi contributi"

### 5. Account Merge on Sign-up
- When guest signs up with Google:
  - Transfer all guest-uploaded events to the new user
  - Delete anonymous session
  - Redirect to onboarding

### 6. Middleware Protection
- Personalized routes (`/onboarding`, `/profile`, push API) require authenticated user
- Guest-accessible routes: `/`, `/explore`, `/suggestions`, `/upload`, `/chat` (limited)
- API routes check `role !== "guest"` for preference/feedback endpoints

## Success Criteria

- Guest can browse events and upload screenshots without friction
- Conversion to sign-up feels natural (not aggressive)
- Guest uploads are preserved after sign-up
- No data leaks between guest sessions

## Non-Goals

- Full personalization for guests
- Persistent guest accounts (they expire)
- Guest-to-guest social features
- Analytics on guest conversion funnel (post-launch)

# Guest Mode Tasks

## Dependency Order

```
T1 (Anonymous Auth) → T2 (Middleware) → T3 (UI Prompts)
                                    ↓
                              T4 (Account Merge)
```

## T1 — Anonymous Session ⬜

- [ ] Configure Better Auth anonymous/guest session support
- [ ] Add `role` field to user/session (or separate guest table)
- [ ] "Continua come ospite" button on Welcome page
- [ ] Guest session creation (cookie-persisted, no OAuth)
- [ ] Auto-expire guest sessions after 7 days

## T2 — Middleware & Route Guards ⬜

- [ ] Update `middleware.ts` to allow guest access to explore/suggestions/upload/chat
- [ ] Block guests from: `/onboarding`, `/profile`, push subscribe API, feedback API
- [ ] API route guards: check `role !== "guest"` on preference endpoints
- [ ] Generic suggestions endpoint (top events, no user profile needed)

## T3 — UI Conversion Prompts ⬜

- [ ] Banner component ("Accedi per suggerimenti personalizzati")
- [ ] Show banner on suggestions page for guests
- [ ] Chat limit: after 2 messages, show sign-up CTA instead of input
- [ ] Profile page: redirect guests to sign-up prompt page
- [ ] Post-upload confirm: subtle "Accedi per salvare i tuoi contributi"

## T4 — Account Merge ⬜

- [ ] On Google sign-up: check for existing guest session
- [ ] Transfer guest-uploaded events (update `source` metadata with new userId)
- [ ] Delete guest session record
- [ ] Redirect to onboarding after merge

## T5 — Testing ⬜

- [ ] E2E: guest can browse explore without login
- [ ] E2E: guest upload → sign up → event preserved
- [ ] E2E: guest cannot access profile/onboarding
- [ ] E2E: chat limit enforced for guests

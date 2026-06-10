# Guest Mode Tasks

## Dependency Order

```
T1 (Anonymous Auth) → T2 (Middleware) → T3 (UI Prompts)
                                    ↓
                              T4 (Account Merge)
```

## T1 — Anonymous Session ✅

- [x] Configure Better Auth anonymous plugin
- [x] Add `isAnonymous` field to user table (DB migration)
- [x] "Continua come ospite" button on Welcome page
- [x] Guest session creation (cookie-persisted, no OAuth)
- [ ] Auto-expire guest sessions after 7 days (future: cron cleanup)

## T2 — Middleware & Route Guards ✅

- [x] Create `middleware.ts` to protect personalized routes from guests
- [x] Block guests from: `/onboarding`, `/profile`, push subscribe API, feedback API
- [x] Allow guest access to: explore, suggestions (generic), upload, chat (limited)
- [x] Guest suggestions: show same cards without personalization (banner prompts sign-up)

## T3 — UI Conversion Prompts ✅

- [x] Banner component (SignUpBanner, reusable)
- [x] Show banner on suggestions page for guests
- [x] Chat limit: after 2 messages, show sign-up CTA instead of input
- [x] Profile page: guests see sign-up prompt instead of profile
- [x] Post-upload confirm: banner "Accedi per salvare i tuoi contributi"

## T4 — Account Merge ✅

- [x] Better Auth `onLinkAccount` callback configured
- [x] Transfer guest-uploaded events to new user on sign-up
- [x] Anonymous user auto-deleted by plugin after link
- [x] Redirect to onboarding after merge (handled by root page.tsx)

## T5 — Testing ⬜

- [ ] E2E: guest can browse explore without login
- [ ] E2E: guest upload → sign up → event preserved
- [ ] E2E: guest cannot access profile/onboarding
- [ ] E2E: chat limit enforced for guests

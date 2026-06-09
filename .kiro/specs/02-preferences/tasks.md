# Preferences Tasks

## Dependency Order

```
T1 (Archetypes) → T2 (Quiz UI) → T3 (Reasons LLM) → T4 (Profile Computation) → T5 (Profile View)
```

## T1 — Archetype Library ✅

- [x] Define 10 event archetypes (title, description, tags, vibe, energy)
- [x] Seed data as TypeScript const (lib/preferences/archetypes.ts)
- [x] Logic to decide: use archetypes vs real events (>15 threshold)

## T2 — Quiz UI (Pairwise Comparisons) ✅

- [x] Comparison card component (two options stacked vertically)
- [x] Selection animation/feedback (scale + ring)
- [x] Progress indicator (dot indicators)
- [x] Mobile-first responsive design
- [x] Onboarding flow routing (/ → /onboarding → /profile)
- [x] "Nessuno dei due" skip button (penalizes both)
- [x] Fade-in animation between rounds

## T3 — Reason Generation (LLM) ✅

- [x] Prompt for generating "why" options given a pair
- [x] AI SDK integration (Gemini 3.5 Flash, structured output → reasons array)
- [x] Reasons mapped to preference tags
- [x] Save comparison + chosen reason to DB

## T4 — Profile Computation ✅

- [x] Algorithm: convert comparisons into weighted tag vector
- [x] Incremental update logic (boost reason tag +0.3, chosen tags +0.1)
- [x] Skip penalization (-0.1 for both options' tags)
- [x] Store profile in `user_preferences` table
- [ ] Time decay (not yet implemented)

## T5 — Profile View ✅

- [x] Page showing user's preference tags with visual bar chart
- [x] Button to trigger additional comparisons (/onboarding)
- [ ] Explanation text ("You prefer X because...")
- [ ] Edit/reset profile option

# Preferences Tasks

## Dependency Order

```
T1 (Archetypes) → T2 (Quiz UI) → T3 (Reasons LLM) → T4 (Profile Computation) → T5 (Profile View)
```

## T1 — Archetype Library

- [ ] Define 8-10 event archetypes (title, description, tags, vibe, energy)
- [ ] Seed data structure (can be JSON or DB)
- [ ] Logic to decide: use archetypes vs real events

## T2 — Quiz UI (Pairwise Comparisons)

- [ ] Comparison card component (shows two options side by side)
- [ ] Selection animation/feedback
- [ ] Progress indicator (round X of N)
- [ ] Responsive design (mobile-first, swipeable?)
- [ ] Onboarding flow routing (new user → quiz → home)

## T3 — Reason Generation (LLM)

- [ ] Prompt for generating "why" options given a pair
- [ ] AI SDK integration (Gemini, structured output → array of reasons)
- [ ] Reasons mapped to preference tags
- [ ] Save comparison + chosen reason to DB

## T4 — Profile Computation

- [ ] Algorithm: convert comparisons into weighted tag vector
- [ ] Incremental update logic (new comparison updates existing profile)
- [ ] Time decay (optional, recent choices weighted more)
- [ ] Store profile in `user_preferences` table

## T5 — Profile View

- [ ] Page showing user's preference tags with visual weights
- [ ] Explanation text ("You prefer X because...")
- [ ] Button to trigger additional comparisons
- [ ] Edit/reset profile option

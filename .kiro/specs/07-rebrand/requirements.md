# Rebrand Requirements

## Goal

Rename the app from "Stasera" to a final brand name. The new name should be
memorable, available as domain, and evoke the app's core concept: effortless
weekend nightlife discovery in an Italian city.

## Context

"Stasera" (tonight) is descriptive but generic. It's also a common Italian word,
making it hard to own as a brand (SEO, domain, social handles).

### Candidate Names

| Name | Vibe | Notes |
|---|---|---|
| Cheasyfa | "Che si fa?" (what are we doing?) | Playful, conversational, very Italian |
| Vibeasy | Vibe + easy | Modern, English-friendly, less Italian identity |
| *TBD* | — | Open to new proposals |

### Evaluation Criteria

- **Memorable**: easy to say, spell, and remember
- **Available**: .app or .it domain, Instagram handle
- **Evocative**: captures the "effortless nightlife discovery" feeling
- **Not cringe**: passes the "would I tell friends to download this?" test
- **Italian identity**: the app is for Genova — should feel local, not generic
- **Pronounceable**: works in Italian conversation ("ci vediamo su [nome]")

## Scope

### 1. Name Decision
- Evaluate candidates against criteria
- Check domain availability (.app, .it, .com)
- Check social handle availability (@name on Instagram)
- Final decision (requires human approval)

### 2. Visual Identity Update
- Logo design (wordmark + icon)
- App icon redesign with new brand
- Splash screen with new name
- Favicon update
- Color palette: keep or evolve? (Nocturnal Urban Pulse may stay)

### 3. Code Rename
- Update all instances of "Stasera" in:
  - `package.json` (name field)
  - `manifest.json` (name, short_name)
  - Meta tags (title, description, og:title)
  - TopBar logo text
  - Welcome hero
  - Chat welcome message
  - Service worker notification text
  - README, docs, specs
- Update Vercel project name
- Update domain/URL

### 4. Content & Copy
- Tagline update (currently "Cosa facciamo stasera a Genova?")
- Notification text ("Stasera ha 3 idee per te!")
- AI chat persona name ("Stasera AI" → new name)
- All user-facing copy referencing the app name

## Success Criteria

- New name feels right to the team
- Domain and social handles secured
- All code references updated (zero "Stasera" except in git history)
- App icon and logo feel cohesive with the new name
- Users (friends) recognize and remember the new name

## Non-Goals

- Full redesign (just name + logo, not UI overhaul)
- Marketing materials
- App Store listing (it's a PWA)
- Trademark registration

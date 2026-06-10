# Rebrand Tasks

## Dependency Order

```
T1 (Name Decision) → T2 (Domain/Handles) → T3 (Visual Identity) → T4 (Code Rename)
                                                                  → T5 (Copy Update)
```

## T1 — Name Decision ⬜

- [ ] Brainstorm additional candidates beyond Cheasyfa/Vibeasy
- [ ] Evaluate all candidates against criteria (memorable, available, evocative, not cringe, Italian, pronounceable)
- [ ] Short-list top 3
- [ ] Poll friends/team for gut reaction
- [ ] Final decision (human approval required)

## T2 — Domain & Social Handles ⬜

- [ ] Check .app domain availability for chosen name
- [ ] Check .it domain availability
- [ ] Check Instagram handle availability
- [ ] Register domain
- [ ] Secure social handles

## T3 — Visual Identity ⬜

- [ ] Logo wordmark design (fits TopBar, fits icon)
- [ ] App icon: 192x192 + 512x512 (new brand, amber/dark theme)
- [ ] Favicon (16x16, 32x32, SVG)
- [ ] Apple touch icon (180x180)
- [ ] Splash screen concept
- [ ] Decide if color palette changes or stays (likely stays)

## T4 — Code Rename ⬜

- [ ] `package.json` → name field
- [ ] `app/manifest.json` → name, short_name
- [ ] `app/layout.tsx` → metadata (title, description)
- [ ] `components/layouts/top-bar.tsx` → logo text
- [ ] `components/features/welcome-hero.tsx` → app name
- [ ] `app/sw.ts` → notification title text
- [ ] `lib/push/index.ts` or cron → push notification copy
- [ ] `app/(app)/chat/client.tsx` → "Stasera AI" label
- [ ] README.md + all docs/specs → rename references
- [ ] Vercel project settings → project name + domain
- [ ] Update `.kiro/docs/design-system.md` brand section

## T5 — Copy Update ⬜

- [ ] Tagline: replace "Cosa facciamo stasera a Genova?"
- [ ] Push text: replace "Stasera ha 3 idee per te!"
- [ ] Chat persona: replace "Stasera AI"
- [ ] Empty state: replace "I tuoi 3 suggerimenti arrivano venerdì"
- [ ] Profile footer: version label
- [ ] Welcome page: subtitle/description

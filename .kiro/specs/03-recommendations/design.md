# Recommendations Design

## Suggestions Page

### Layout (Mobile-first)
- Stack of 3 cards, vertically scrollable
- Each card is prominent — nearly full-width, generous padding
- Slight overlap/peek from the next card to encourage scrolling

### Recommendation Card
- Hero section: event image (if available) or gradient background with genre icon
- Event name (large, bold)
- Date/time + location line
- Vibe tags as small pills
- Personalized reason in a quote-style box:
  "Te lo consiglio perché ti piace il jazz e l'atmosfera intima"
- Action buttons at bottom: ✓ Accept (primary) / ✗ Not tonight (muted)

### Empty State
- Warm illustration (moon/stars/city silhouette)
- "Non ho ancora suggerimenti per te"
- CTA: "Completa il profilo" (if no preferences) or "Torna venerdì!" (if waiting)

## Chat Interface

### Layout
- Floating input at bottom of suggestions page
- Expandable: tap to open a chat-like panel (half screen)
- Streaming response appears in a single bubble above input

### Interaction
- Placeholder: "Stasera ho voglia di..."
- User types → LLM response streams in
- Suggestions cards above animate/reorder based on new ranking
- Chat disappears after re-rank is complete (ephemeral)

### Visual Style
- Chat bubble: subtle glass/blur background
- Input: large, rounded, warm border on focus
- Streaming text: typewriter feel, no loading spinner

## Push Notification

### Content
- Title: "Stasera 🎉"
- Body: "Ho 3 idee per te! Tap per scoprirle."
- Icon: app icon
- Action: opens `/suggestions` page

## Feedback Animation
- Accept: card slides right with a subtle ✓ flash, green tint
- Reject: card fades down/shrinks, muted
- After feedback: next card slides up smoothly

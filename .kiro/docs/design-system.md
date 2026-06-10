# Design System — Stasera

Visual identity: **Nocturnal Urban Pulse**. Dark mode default, warm amber/gold accents representing city lights at night.

---

## Color Palette

### Dark Theme (Default)

| Token | Hex | Role |
|---|---|---|
| `background` | `#19120a` | Page background |
| `foreground` | `#f0e0d1` | Primary text |
| `surface` | `#19120a` | Base surface |
| `surface-container-lowest` | `#140d06` | Deepest level |
| `surface-container-low` | `#221a12` | Low elevation |
| `surface-container` | `#261e15` | Default card bg |
| `surface-container-high` | `#31281f` | Elevated (chat AI, hover) |
| `surface-container-highest` | `#3c3329` | Top elevation |
| `surface-bright` | `#41382e` | Brightest surface |
| `on-surface` | `#f0e0d1` | Text on surface |
| `on-surface-variant` | `#d8c3ad` | Secondary/muted text |
| `outline` | `#a08e7a` | Subtle UI borders |
| `outline-variant` | `#534434` | Default border |
| `primary` | `#ffc174` | Primary accent (amber) |
| `primary-container` | `#f59e0b` | Strong primary (CTA, FAB) |
| `on-primary` | `#472a00` | Text on primary |
| `on-primary-container` | `#613b00` | Text on primary-container |
| `secondary` | `#ffb2b9` | Secondary (pink/coral) |
| `secondary-container` | `#891933` | Secondary container |
| `on-secondary-container` | `#ff97a3` | Text on secondary-container |
| `tertiary` | `#8fd5ff` | Tertiary (blue/info) |
| `tertiary-container` | `#1abdff` | Tertiary strong |
| `on-tertiary-container` | `#004966` | Text on tertiary-container |
| `error` | `#ffb4ab` | Error text |
| `error-container` | `#93000a` | Error background |
| `on-error` | `#690005` | Text on error |
| `inverse-surface` | `#f0e0d1` | Inverted surface |
| `inverse-on-surface` | `#382f25` | Text on inverse-surface |

### Light Theme

Warm inverted tones (`background: #f0e0d1`, `foreground: #19120a`). Full mapping in `globals.css`.

### shadcn Token Mapping

| shadcn token | Dark value | Usage |
|---|---|---|
| `card` | `#261e15` (surface-container) | Card backgrounds |
| `muted` | `#3c3329` (surface-container-highest) | Disabled/muted bg |
| `muted-foreground` | `#a08e7a` (outline) | Muted text |
| `accent` | `#31281f` (surface-container-high) | Hover/focus bg |
| `border` | `#534434` (outline-variant) | All borders |
| `ring` | `#ffc174` (primary) | Focus rings |
| `destructive` | `#ffb4ab` (error) | Delete/danger |

---

## Typography

### Fonts

| Role | Font | CSS Variable | Usage |
|---|---|---|---|
| Body (sans) | Inter | `--font-sans` | Body text, paragraphs |
| Display | Geist | `--font-display` | Headings, labels, UI chrome |
| Mono | Geist Mono | `--font-mono` | Code, data |

### Type Scale

| Class | Font | Size | Weight | Line Height | Tracking |
|---|---|---|---|---|---|
| `.text-display-lg` | Geist | 40px | 700 | 1.1 | -0.04em |
| `.text-headline-lg` | Geist | 32px | 600 | 1.2 | -0.02em |
| `.text-headline-lg-mobile` | Geist | 28px | 600 | 1.2 | — |
| `.text-headline-md` | Geist | 24px | 600 | 1.3 | — |
| `.text-body-lg` | Inter | 18px | 400 | 1.6 | — |
| `.text-body-md` | Inter | 16px | 400 | 1.5 | — |
| `.text-label-md` | Geist | 14px | 500 | 1.0 | 0.02em |
| `.text-label-sm` | Geist | 12px | 600 | 1.0 | — |

Use `.text-headline-lg-mobile` on mobile, `.text-headline-lg` on `md:` breakpoint.

---

## Spacing

| Token | Value | Tailwind class |
|---|---|---|
| `xs` | 4px | `p-xs`, `gap-xs` |
| `sm` | 8px | `p-sm`, `gap-sm` |
| `gutter` | 12px | `gap-gutter` |
| `md` | 16px | `p-md`, `gap-md` |
| `container-margin` | 20px | `px-container-margin` |
| `lg` | 24px | `p-lg`, `gap-lg` |
| `xl` | 48px | `py-xl`, `gap-xl` |

---

## Border Radius

Base `--radius: 0.75rem` (12px). Scale:

| Token | Value |
|---|---|
| `rounded-sm` | ~7px |
| `rounded-md` | ~10px |
| `rounded-lg` | 12px (base) |
| `rounded-xl` | ~17px |
| `rounded-full` | pill |

Cards: `rounded-xl`. Buttons/inputs: `rounded-xl` or `rounded-full` (pills). Chips: `rounded-full`.

---

## Icons

- **Library**: Lucide React (via shadcn/ui)
- **Size**: 16px (inline), 20px (buttons), 24px (nav)
- **Brand icon**: `Moon` from Lucide (replaces Material `nightlight`)
- **Active nav**: filled variant where available, `text-primary`
- **Inactive nav**: default stroke, `text-on-surface-variant`

---

## Navigation

Bottom nav, 4 tabs:

| Tab | Label (IT) | Icon | Route |
|---|---|---|---|
| Suggerimenti | Suggerimenti | `Sparkles` | `/` |
| Esplora | Esplora | `Compass` | `/explore` |
| Chat | Chat | `MessageCircle` | `/chat` |
| Profilo | Profilo | `User` | `/profile` |

Style: `bg-surface/80 backdrop-blur-xl border-t border-outline-variant`. Fixed bottom, safe-area padding.

---

## Key Components

### Suggestion Card (Home)
- Full-width image (`aspect-[4/3]` or fixed height) with gradient overlay `from-surface via-transparent to-transparent`
- Tag chips overlaid on image bottom (genre + vibe)
- Title + location below
- "Stasera's Reason" section: `Sparkles` icon + italic AI explanation
- Binary actions: RIFIUTA (outline) / ACCETTA (filled primary), grid 2 cols

### Event Card (Explore)
- Horizontal: image 1/3, content 2/3, `h-36`
- Glass bg: `bg-surface-container border border-outline-variant rounded-xl`
- Optional badges: LIVE (pulse dot + tertiary), NEW (primary-container dot)
- Tags: small chips `text-[10px] uppercase`

### Chat Bubble (AI)
- `bg-surface-container-high rounded-tr-xl rounded-br-xl rounded-bl-xl border border-outline-variant`
- Small avatar: circle with `Sparkles` icon, `bg-primary-container`

### Chat Bubble (User)
- `bg-primary-container rounded-tl-xl rounded-bl-xl rounded-br-xl`
- Right-aligned, no avatar

### Onboarding Comparison Card
- `aspect-[3/5]` image, `rounded-xl`, full cover
- Gradient overlay bottom → title + category label
- Selected: `ring-2 ring-primary` + check badge top-right

### Chip / Tag
- `rounded-full border font-display text-label-sm uppercase tracking-wider`
- Active: `border-primary text-primary bg-primary/10`
- Inactive: `border-outline-variant text-on-surface-variant`
- Colored variants: `border-tertiary/30 bg-tertiary/10 text-tertiary`, `border-secondary/30 bg-secondary/10 text-secondary`

### Button
- Primary: `bg-primary text-on-primary rounded-xl font-display font-bold`
- Outline: `border border-outline-variant text-on-surface-variant rounded-xl`
- Pill: add `rounded-full`
- FAB: `bg-primary-container text-on-primary-container rounded-full shadow-lg`

### Input
- Chat: `bg-surface-container border border-outline-variant rounded-full`
- Form: `bg-surface-container-low border border-outline-variant rounded-lg`
- Focus: `ring-1 ring-primary border-primary`

---

## Screens

1. **Welcome / Login** — background image blurred, logo centered, Google sign-in CTA
2. **Onboarding** — progress bar, comparison cards (10 rounds), motivation chips
3. **Home — Suggerimenti** — 3 suggestion cards stacked vertically
4. **Home — Empty State** — hero image, "I tuoi suggerimenti arrivano venerdì"
5. **Esplora** — search bar, filter chips, event list, FAB "Carica"
6. **Chat** — AI chat with inline recommendation cards
7. **Upload Screenshot** — drag/drop area, processing state, recent uploads
8. **Conferma Evento** — edit form with extracted data, original screenshot preview
9. **Profilo** — taste radar/bars, settings list, logout

---

## Micro-interactions

- Cards: `active:scale-[0.98]` on tap, `group-hover:scale-110` on images (desktop)
- Buttons: `active:scale-95 transition-transform duration-200`
- Nav items: `active:scale-90 transition-transform duration-150`
- Cards entrance: fade-in + slide-up via IntersectionObserver
- Accept: button changes to "PRENOTATO" with tertiary color
- Reject: card slides out left with opacity fade

---

## Decisions

- **Dark mode default**, light mode supported (system preference sync)
- **Lucide React** for icons (not Material Symbols) — lighter, shadcn-native
- **Inter** as body font, **Geist** as display/UI font
- **No particles/ambient animations** — performance-first on mobile
- **No grayscale-to-color on hover** — irrelevant on touch devices
- **4 tabs + FAB** for navigation (not 5 tabs)
- **shadcn/ui base-nova** style as component foundation
- **Toast** (sonner) for feedback on accept/reject
- Labels in Italian

---

## Future Specs

### Guest Mode (post-MVP)

Allow users to explore without signing in:

- **Access**: "Continua come ospite" link on Welcome screen
- **Capabilities**:
  - Browse Explore page (read-only event list)
  - View suggestion cards (generic, not personalized)
  - Upload screenshots (stored temporarily, attributed on sign-up)
- **Limitations**:
  - No taste profile / onboarding
  - No personalized suggestions
  - No chat AI (or limited to 2 messages)
  - No push notifications
  - Banner prompting sign-up for full experience
- **Conversion**: on sign-up, merge any guest uploads into the new user account
- **Implementation**: anonymous session via Better Auth, `role: "guest"` flag, middleware guard on personalized routes

### Additional Future Specs

- **Custom scraping sources**: user requests a new site → admin approves → scraper added
- **Source selection per user**: toggle which sources feed your recommendations
- **Social features**: see what friends accepted, group suggestions
- **Semantic matching**: pgvector embeddings for advanced event↔preference matching
- **Multi-city expansion**: city selector, city-specific sources and events

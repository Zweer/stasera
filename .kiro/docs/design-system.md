# Design System — Stasera

Reference extracted from Stitch AI (Google). Use this as the source of truth for all UI implementation.

## Color Palette (Dark Mode — Default)

| Token | Hex | Usage |
|---|---|---|
| `background` | `#19120a` | Page background |
| `surface` | `#19120a` | Same as bg (base level) |
| `surface-container-lowest` | `#140d06` | Deepest container |
| `surface-container-low` | `#221a12` | Low elevation container |
| `surface-container` | `#261e15` | Default card/container bg |
| `surface-container-high` | `#31281f` | Elevated container, chat bubbles AI |
| `surface-container-highest` | `#3c3329` | Highest elevation |
| `surface-bright` | `#41382e` | Brightest surface |
| `on-surface` | `#f0e0d1` | Primary text on surfaces |
| `on-surface-variant` | `#d8c3ad` | Secondary text |
| `on-background` | `#f0e0d1` | Text on background |
| `outline` | `#a08e7a` | Subtle borders, dividers |
| `outline-variant` | `#534434` | Default border color |
| `primary` | `#ffc174` | Primary accent (amber/gold) |
| `primary-container` | `#f59e0b` | Strong primary (buttons, FAB) |
| `on-primary` | `#472a00` | Text on primary |
| `on-primary-container` | `#613b00` | Text on primary-container |
| `secondary` | `#ffb2b9` | Secondary accent (pink/coral) |
| `secondary-container` | `#891933` | Secondary container |
| `on-secondary-container` | `#ff97a3` | Text on secondary-container |
| `tertiary` | `#8fd5ff` | Tertiary accent (blue/info) |
| `tertiary-container` | `#1abdff` | Tertiary strong |
| `on-tertiary-container` | `#004966` | Text on tertiary-container |
| `error` | `#ffb4ab` | Error text |
| `error-container` | `#93000a` | Error bg |
| `inverse-surface` | `#f0e0d1` | Light surface (for contrast elements) |
| `inverse-on-surface` | `#382f25` | Text on inverse-surface |

## Typography

| Token | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| `display-lg` | Geist | 40px | 700 | 1.1 | -0.04em |
| `headline-lg` | Geist | 32px | 600 | 1.2 | -0.02em |
| `headline-lg-mobile` | Geist | 28px | 600 | 1.2 | — |
| `headline-md` | Geist | 24px | 600 | 1.3 | — |
| `body-lg` | Inter | 18px | 400 | 1.6 | — |
| `body-md` | Inter | 16px | 400 | 1.5 | — |
| `label-md` | Geist | 14px | 500 | 1.0 | 0.02em |
| `label-sm` | Geist | 12px | 600 | 1.0 | — |

## Spacing

| Token | Value |
|---|---|
| `xs` / `base` | 4px |
| `sm` | 8px |
| `gutter` | 12px |
| `md` | 16px |
| `container-margin` | 20px |
| `lg` | 24px |
| `xl` | 48px |

## Border Radius

| Token | Value |
|---|---|
| `DEFAULT` | 4px |
| `lg` | 8px |
| `xl` | 12px |
| `full` | 9999px |

## Icons

- **Library**: Material Symbols Outlined (variable font)
- **Active tab**: `font-variation-settings: 'FILL' 1`
- **Inactive**: default (outlined)
- **Brand icon**: `nightlight` (filled, primary color)

## Navigation

- **Bottom nav**: 4 tabs — Suggerimenti, Esplora, Chat, Profilo
- **Icons**: `auto_awesome`, `explore`, `chat_bubble`, `person`
- **Active state**: `text-primary` + filled icon
- **Inactive state**: `text-on-surface-variant` + outlined icon
- **Style**: Glass effect (`bg-surface/80 backdrop-blur-xl`), border-top `outline-variant`

## Key Components

### Suggestion Card
- Full-width image (480px height) with gradient overlay
- Tag chips on image (genre + vibe)
- Title + location below image
- "Stasera's Reason" section with AI icon
- Accept/Reject buttons (grid 2 cols)

### Chat Bubble (AI)
- `bg-surface-container-high`, rounded (tr, br, bl), border
- Avatar: small circle with `auto_awesome` icon filled

### Chat Bubble (User)
- `bg-primary-container`, rounded (tl, bl, br)
- Right-aligned

### Onboarding Card (Comparison)
- Aspect ratio 3/5, rounded-xl, image cover
- Selected state: `ring-2 ring-primary` + glow shadow + check badge top-right
- Label (category) + title overlay at bottom

### Chip / Tag
- `rounded-full`, border, `font-label-sm`, uppercase tracking-wider
- Active: `border-primary text-primary bg-primary/10`
- Inactive: `border-outline-variant text-on-surface-variant`

### Input Field
- `bg-surface-container border-outline-variant rounded-full` (chat)
- `bg-surface-container-low border-outline-variant rounded-lg` (forms)
- Focus: `ring-1 ring-primary border-primary`

## Screens Inventory

1. Welcome / Login
2. Onboarding (10 confronti a coppie, progress bar)
3. Home — Suggerimenti (3 cards)
4. Home — Empty State (waiting for weekend)
5. Esplora (event list + filters + search + FAB upload)
6. Chat AI
7. Upload Screenshot
8. Conferma Evento Estratto (post-upload edit form)
9. Profilo (taste radar + settings + logout)

## Decisions

- Dark mode default, light mode supported
- Nav labels in Italian
- No guest mode for MVP (Google login only, guest mode in future spec)
- Upload accessible via FAB in Explore page
- Toast feedback after accept/reject suggestions
- Onboarding: same comparison UI repeated 10 times, progress bar 1/10 → 10/10, recap at end

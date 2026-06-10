# Stasera

App PWA che consiglia cosa fare il sabato sera a Genova, in base alle tue preferenze.

**URL**: `stasera.vercel.app`

## Concept

L'app risolve il problema "che facciamo stasera?" in tre fasi:

1. **Recupero eventi**: scraping automatico + upload manuale di screenshot Instagram
2. **Profiling preferenze**: confronti a coppie + analisi del motivo della scelta
3. **Raccomandazione**: job automatico venerdì/sabato + chat libera per raffinare

## Architettura

```
┌─────────────────────────────────────────────────┐
│              FONTI EVENTI                        │
├─────────────────────────────────────────────────┤
│  Scraper automatico     │  Upload manuale       │
│  • MenteLocale          │  • Screenshot IG      │
│  • GenovaToday          │  • (foto locandina)   │
│         ↓               │         ↓             │
│    HTML parsing         │   Vision LLM (OCR)    │
│         ↓               │         ↓             │
│         └───────┬───────┘                       │
│                 ↓                               │
│     Estrazione metadati (Gemini 3.5 Flash)      │
│     → nome, data, luogo, genere, vibe,          │
│       prezzo, indoor/outdoor, energia...        │
│                 ↓                               │
│         Neon PostgreSQL + pgvector              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            PREFERENZE                           │
├─────────────────────────────────────────────────┤
│  Onboarding: 8-10 confronti a coppie           │
│  "Quale preferisci?" + "Perché?" (LLM genera   │
│  le opzioni di motivazione)                     │
│  → profilo gusti (vettore preferenze)           │
│  → profilo visibile all'utente                  │
│  → possibilità di fare altre domande per        │
│    raffinare in qualsiasi momento               │
│  → si affina col tempo (feedback sui consigli)  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│           RACCOMANDAZIONE                       │
├─────────────────────────────────────────────────┤
│  Venerdì/Sabato → cron automatico              │
│  Matching profilo ↔ eventi weekend             │
│  → 3 suggerimenti con motivazione              │
│  → push notification sulla PWA                 │
│  → chat libera: "oggi ho voglia di qualcosa    │
│    di più romantico" → Gemini re-ranking       │
└─────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Tecnologia | Motivazione |
|---|---|---|
| Framework | Next.js 16 (App Router, Server Actions) | Full-stack in un unico progetto, ottimo DX |
| UI | shadcn/ui + Tailwind CSS 4 | Componenti belli, accessibili, customizzabili |
| Design System | Nocturnal Urban Pulse (Geist + Inter) | Dark-first, warm amber accents, mobile-native |
| Auth | Better Auth (Google OAuth) | Adapter Drizzle nativo, zero costi |
| DB | Neon (PostgreSQL + pgvector) | Serverless, generous free tier, pgvector nativo |
| ORM | Drizzle 1.0 | Type-safe, leggero, ottimo con Neon |
| LLM | Gemini 3.5 Flash (via Vercel AI SDK 6) | Vision + testo, ultimo modello Google I/O 2026 |
| Hosting | Vercel | Deploy immediato, cron jobs, edge functions |
| PWA | @serwist/turbopack | Installabile, offline-capable |
| Notifiche | Web Push API (VAPID) + web-push | Native nelle PWA, nessun servizio esterno |
| Scraping | cheerio (route handler) | Semplice, gira come Vercel Cron |
| Icons | Lucide React | Leggera, shadcn-native |
| Linting | Biome | Fast, all-in-one (no ESLint/Prettier) |

## Design System

Visual identity: **Nocturnal Urban Pulse**. Documentazione completa in `.kiro/docs/design-system.md`.

- **Palette**: Dark-first con amber/gold (`#ffc174`) su fondi warm-black (`#19120a`)
- **Font**: Inter (body), Geist (headings/labels/UI chrome)
- **Spacing**: `xs(4)` → `xl(48)` scale semantico
- **Components**: Suggestion cards full-bleed, chat bubbles asimmetriche, comparison cards, glass nav

## Pagine dell'app

| Route | Descrizione |
|---|---|
| `/` | Welcome/Login (hero + Google sign-in) |
| `/onboarding` | 8 confronti a coppie con progress bar + chips motivazione |
| `/suggestions` | 3 suggestion cards con reason AI + accept/reject |
| `/explore` | Lista eventi con search, filtri genere, FAB upload |
| `/chat` | Chat AI con bolle asimmetriche + streaming |
| `/upload` | Drag/drop screenshot, progress OCR |
| `/upload/confirm` | Form edit dati estratti, chips genere/vibe, conferma |
| `/profile` | Taste bars, toggle notifiche push, settings, logout |

## Decisioni chiave

### Perché NON Instagram come fonte eventi
L'API ufficiale Instagram è limitatissima, lo scraping viola i ToS ed è bloccato aggressivamente. Compromesso scelto: **l'utente fa screenshot** degli eventi che vede su IG e li carica nell'app → Vision LLM estrae i dati. Così l'utente fa il "discovery" che già fa naturalmente, l'app ci mette l'intelligenza.

### Perché tag+scoring e non embeddings per l'MVP
- Più facile da debuggare e spiegare ("te lo consiglio perché ti piace il jazz")
- Sufficiente con il volume di eventi di Genova
- pgvector è attivo da subito nel DB (Neon lo supporta) → quando serve, si aggiungono embeddings senza migrazioni infrastrutturali

### Perché chat libera e non bottoni per il feedback
Esperienza più naturale. "Ho voglia di qualcosa di romantico" è più espressivo di un set fisso di opzioni. Gemini interpreta e ri-filtra.

### Perché confronti a coppie per le preferenze
Approccio collaudato (stile Elo rating / preferential learning). 8-10 confronti iniziali bastano per un profilo decente. Il "perché?" con opzioni generate da LLM accelera il profiling (es: "preferisco questo perché è a teatro / perché è musicale / perché è all'aperto").

### Perché monorepo
Next.js 16 full-stack gestisce tutto: frontend, API, cron jobs. Lo scraper è un route handler + Vercel Cron. Non serve separare.

### Perché Gemini 3.5 Flash
- Appena uscito (Google I/O 2026), stato dell'arte per vision
- Tier gratuito generoso — per un'app tra amici costo potenzialmente zero
- Ottimo per: OCR screenshot, estrazione metadati eventi, generazione opzioni "perché", chat di re-ranking

### Perché Web Push e non email
Più immediato, mobile-native, coerente con l'esperienza PWA. Implementazione: Service Worker + chiavi VAPID + endpoint Next.js + Vercel Cron che triggera venerdì/sabato.

### Perché feedback loop asincrono
Quando l'utente accetta/rifiuta un suggerimento, i tag dell'evento (genere, vibe, energy, dayMoment, indoorOutdoor) vengono usati per aggiornare il `preferenceVector` (+0.2 accepted, -0.15 rejected). Il prossimo ciclo di raccomandazioni usa il profilo aggiornato.

## Target utenti

Solo amici per ora (no waitlist, no rate limiting pesante). Multi-utente da subito nel design del DB.

**Evoluzione futura**: possibilità per gli utenti di richiedere scraping da altri siti e selezionare quali fonti usare.

## Fonti eventi (MVP)

| Fonte | Metodo | Note |
|---|---|---|
| MenteLocale (Genova) | Scraping HTML | Struttura regolare, paginazione semplice |
| GenovaToday (eventi) | Scraping HTML / RSS | Sezione eventi dedicata |
| Screenshot Instagram | Upload → Gemini Vision | L'utente carica, l'LLM estrae |

### Metadati estratti per ogni evento
- Nome
- Data e ora
- Luogo (nome + coordinate se possibile)
- Tipologia/genere (musica, teatro, aperitivo, mostra, sport...)
- Vibe/energia (tranquillo, movimentato, romantico, sociale...)
- Indoor/outdoor
- Fascia di prezzo (gratis, economico, medio, costoso)
- Durata stimata
- Momento del giorno (pomeriggio, aperitivo, sera, notte)
- Descrizione breve
- URL originale (se da scraping)
- Immagine (se disponibile)

## Scraping

- **Frequenza**: una volta al giorno (mattina, 06:00 UTC)
- **Orizzonte**: prossimi 7 giorni di eventi
- **Implementazione**: Vercel Cron → Route Handler che fetcha e parsa HTML → Gemini per arricchimento metadati → dedup → salvataggio su Neon

## Notifiche Push

- **Quando**: venerdì alle 14:00 e sabato alle 14:00 (Vercel Cron)
- **Trigger**: dopo che il job di raccomandazione genera i 3 suggerimenti
- **Contenuto**: "Stasera ha 3 idee per te! 🎉" → apre `/suggestions`
- **Tech**: web-push (VAPID), Service Worker push event handler, subscription salvata su Neon
- **Gestione**: toggle on/off nella pagina profilo, cleanup automatico subscription scadute (410)

## PWA

- Mobile-first design (dark mode default)
- Installabile (manifest + service worker)
- Offline: NetworkFirst cache per `/api/recommendations` e `/api/events` (timeout 5s, poi serve stale)
- Fallback offline page per navigazione
- Icona e splash screen da definire

## Upload Flow

1. Utente carica screenshot (drag/drop o file picker)
2. `POST /api/events/upload` → OCR via Gemini Vision → enrichment metadati strutturati
3. Ritorna dati estratti **senza salvare**
4. Redirect a `/upload/confirm` → form editabile (nome, data, ora, luogo, genere, vibe)
5. "Conferma e Pubblica" → `POST /api/events/confirm` → salva su DB

## Schema DB

```sql
-- Utenti (gestiti da Better Auth, estesi con preferenze)
users (id, email, name, image, created_at)

-- Profilo preferenze calcolato
user_preferences (id, user_id, preference_vector jsonb, updated_at)

-- Storico confronti a coppie
preference_comparisons (id, user_id, option_a jsonb, option_b jsonb, chosen, reason, created_at)

-- Eventi (da tutte le fonti)
events (id, name, description, date, time, location_name, location_lat, location_lng,
        genre, vibe, energy_level, indoor_outdoor, price_range, duration,
        day_moment, source, source_url, image_url, raw_text,
        metadata jsonb, status, created_at, expires_at)

-- Raccomandazioni generate
recommendations (id, user_id, event_id, score, reason, status, created_at)

-- Chat di re-ranking
chat_messages (id, user_id, role, content, created_at)

-- Subscription push
push_subscriptions (id, user_id, endpoint, p256dh, auth, created_at)
```

## Roadmap MVP ✅

### Fase 1 — Setup & Fondamenta
- [x] Init Next.js 16 + Tailwind 4 + shadcn/ui
- [x] Better Auth con Google OAuth
- [x] Neon DB + Drizzle schema + migrazioni
- [x] PWA setup (manifest, service worker, installazione)

### Fase 2 — Recupero eventi
- [x] Scraper MenteLocale (parser HTML → eventi grezzi)
- [x] Scraper GenovaToday (parser HTML → eventi grezzi)
- [x] Pipeline arricchimento LLM (testo → metadati strutturati)
- [x] Upload screenshot → Gemini Vision → evento
- [x] Vercel Cron giornaliero
- [x] Pagina conferma evento post-upload

### Fase 3 — Preferenze
- [x] Onboarding: UI confronti a coppie (card affiancate + progress bar)
- [x] Generazione opzioni "perché" con LLM
- [x] Calcolo profilo preferenze
- [x] Pagina "il mio profilo" (taste bars + raffinamento)
- [x] Feedback loop (accettato/rifiutato → aggiorna profilo)

### Fase 4 — Raccomandazione
- [x] Job venerdì/sabato: matching profilo ↔ eventi
- [x] Pagina suggerimenti (3 card full-bleed con motivazione AI)
- [x] Chat libera per re-ranking (streaming)
- [x] Push notification (VAPID + web-push + SW)

### Fase 5 — Polish
- [x] Offline support (NetworkFirst cache per API)
- [x] UI design system completo (Nocturnal Urban Pulse)
- [x] Gestione eventi duplicati (dedup cross-fonte)
- [x] Toast feedback su accept/reject (sonner)
- [x] Pagina Esplora con search + filtri
- [x] Bottom nav 4 tab + top bar

### Futuro (post-MVP)
- [ ] Guest mode (navigazione senza login)
- [ ] Aggiunta fonti scraping custom (utente richiede un sito)
- [ ] Selezione fonti per utente
- [ ] Embeddings per matching semantico avanzato
- [ ] Espansione oltre Genova (altre città)
- [ ] Social: vedere cosa fanno gli amici, gruppi

## Comandi

```bash
npm run dev           # Dev server (Turbopack)
npm run build         # Build produzione
npm run lint          # Biome check
npm run lint:fix      # Biome check --write
npm run db:push       # Apply schema to Neon (dev)
npm run db:generate   # Generate migration
npm run db:studio     # Visual DB browser
npm run test          # Vitest run
```

## Variabili d'ambiente

```env
# Auth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
BETTER_AUTH_SECRET=        # openssl rand -base64 32

# Database
DATABASE_URL=              # Neon connection string

# LLM
GOOGLE_GENERATIVE_AI_API_KEY=

# Cron
CRON_SECRET=               # openssl rand -hex 32

# Push
NEXT_PUBLIC_VAPID_PUBLIC_KEY=   # npx web-push generate-vapid-keys
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:you@example.com
```

## Struttura progetto

```
stasera/
├── app/
│   ├── (app)/              # Route group con TopBar + BottomNav
│   │   ├── suggestions/    # Home: 3 card suggerimenti
│   │   ├── explore/        # Lista eventi + search + filtri
│   │   ├── chat/           # Chat AI concierge
│   │   ├── upload/         # Upload screenshot + conferma
│   │   └── profile/        # Profilo + settings + push toggle
│   ├── onboarding/         # Quiz preferenze (fuori dal nav)
│   ├── api/                # Route handlers
│   │   ├── auth/           # Better Auth
│   │   ├── events/         # CRUD eventi + upload + confirm
│   │   ├── preferences/    # Confronti + profilo
│   │   ├── recommendations/ # Suggerimenti + chat + feedback
│   │   ├── push/           # Subscribe/unsubscribe push
│   │   └── cron/           # Scrape + recommend jobs
│   └── sw.ts               # Service Worker (push + cache)
├── components/
│   ├── ui/                 # shadcn/ui (auto-generated)
│   ├── features/           # PreferenceQuiz, WelcomeHero, GoogleSignIn
│   └── layouts/            # TopBar, BottomNav
├── db/                     # Drizzle schema + migrations
├── hooks/                  # usePushSubscription
├── lib/
│   ├── enrichment/         # Pipeline LLM per metadati eventi
│   ├── preferences/        # Pairs, profile, reasons
│   ├── push/               # web-push utility
│   ├── recommendations/    # Matching + scoring
│   └── scrapers/           # MenteLocale, GenovaToday
└── .kiro/docs/             # Design system, specs
```

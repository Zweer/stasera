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
| Auth | Auth.js v5 (Google OAuth) | Standard de facto per Next.js, zero costi |
| DB | Neon (PostgreSQL + pgvector) | Serverless, generous free tier, pgvector nativo |
| ORM | Drizzle 1.0 | Type-safe, leggero, ottimo con Neon |
| LLM | Gemini 3.5 Flash | Vision + testo, ultimo modello Google I/O 2026 |
| Hosting | Vercel | Deploy immediato, cron jobs, edge functions |
| PWA | @serwist/next (o next-pwa) | Installabile, offline-capable |
| Notifiche | Web Push API (VAPID) | Native nelle PWA, nessun servizio esterno |
| Scraping | cheerio (route handler) | Semplice, gira come Vercel Cron |

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

- **Frequenza**: una volta al giorno (mattina, es. 06:00)
- **Orizzonte**: prossimi 7 giorni di eventi
- **Implementazione**: Vercel Cron → Route Handler che fetcha e parsa HTML → Gemini per arricchimento metadati → salvataggio su Neon

## Notifiche

- **Quando**: venerdì pomeriggio e/o sabato mattina
- **Contenuto**: "Ho 3 suggerimenti per stasera! 🎉" → link alla pagina consigli
- **Tech**: Web Push API, chiavi VAPID generate in locale, subscription salvata su Neon

## PWA

- Mobile-first design
- Installabile (manifest + service worker)
- Offline: almeno la visualizzazione degli ultimi consigli ricevuti
- Icona e splash screen da definire

## Schema DB (bozza)

```sql
-- Utenti (gestiti da Auth.js, estesi con preferenze)
users (id, email, name, image, created_at)

-- Profilo preferenze calcolato
user_preferences (id, user_id, preference_vector jsonb, updated_at)

-- Storico confronti a coppie
preference_comparisons (id, user_id, event_a_id, event_b_id, chosen, reason, created_at)

-- Eventi (da tutte le fonti)
events (id, name, description, date, time, location_name, location_lat, location_lng,
        genre, vibe, energy_level, indoor_outdoor, price_range, duration,
        day_moment, source, source_url, image_url, raw_text,
        metadata jsonb, embedding vector, created_at, expires_at)

-- Raccomandazioni generate
recommendations (id, user_id, event_id, score, reason, status, created_at)

-- Chat di re-ranking
chat_messages (id, user_id, role, content, created_at)

-- Subscription push
push_subscriptions (id, user_id, endpoint, p256dh, auth, created_at)
```

## Roadmap MVP

### Fase 1 — Setup & Fondamenta
- [ ] Init Next.js 16 + Tailwind 4 + shadcn/ui
- [ ] Auth.js v5 con Google OAuth
- [ ] Neon DB + Drizzle schema + migrazioni
- [ ] PWA setup (manifest, service worker, installazione)

### Fase 2 — Recupero eventi
- [ ] Scraper MenteLocale (parser HTML → eventi grezzi)
- [ ] Scraper GenovaToday (parser HTML → eventi grezzi)
- [ ] Pipeline arricchimento LLM (testo → metadati strutturati)
- [ ] Upload screenshot → Gemini Vision → evento
- [ ] Vercel Cron giornaliero

### Fase 3 — Preferenze
- [ ] Onboarding: UI confronti a coppie
- [ ] Generazione opzioni "perché" con LLM
- [ ] Calcolo profilo preferenze
- [ ] Pagina "il mio profilo" (visualizzazione + raffinamento)

### Fase 4 — Raccomandazione
- [ ] Job venerdì/sabato: matching profilo ↔ eventi
- [ ] Pagina suggerimenti (3 card con motivazione)
- [ ] Chat libera per re-ranking
- [ ] Push notification

### Fase 5 — Polish
- [ ] Offline support (cache ultimi consigli)
- [ ] UI polish, animazioni, dark mode
- [ ] Gestione eventi duplicati (dedup cross-fonte)
- [ ] Feedback loop (accettato/rifiutato → aggiorna profilo)

### Futuro (post-MVP)
- [ ] Aggiunta fonti scraping custom (utente richiede un sito)
- [ ] Selezione fonti per utente
- [ ] Embeddings per matching semantico avanzato
- [ ] Espansione oltre Genova (altre città)
- [ ] Social: vedere cosa fanno gli amici, gruppi

## Comandi

```bash
npm run dev           # Dev server
npm run build         # Build produzione
npm run lint          # Lint
npx drizzle-kit push  # Apply schema to Neon
npx drizzle-kit studio # Visual DB browser
```

## Variabili d'ambiente

```env
# Auth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_SECRET=

# Database
DATABASE_URL=          # Neon connection string

# LLM
GEMINI_API_KEY=

# Push
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:you@example.com
```

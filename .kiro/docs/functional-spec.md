# Stasera — Documento Funzionale Completo

> Ultimo aggiornamento: 9 giugno 2026

---

## 1. Cos'è Stasera

**Stasera** è una PWA (Progressive Web App) mobile-first che risolve il problema "che facciamo stasera?" per un gruppo di amici a Genova.

Ogni weekend, l'app suggerisce **3 eventi personalizzati** basati sui gusti dell'utente, con una spiegazione del perché. L'utente può raffinare i suggerimenti chattando con un'AI concierge.

**URL**: `stasera.vercel.app`

---

## 2. Target

- **Primario**: gruppo ristretto di amici (20-30 anni), Genova
- **Profilo**: tech-savvy, abituati a decidere via smartphone, frustrati dal dover scrollare Instagram/Google per trovare eventi
- **Contesto d'uso**: venerdì sera, sabato mattina — "cosa facciamo stasera?"
- **Scala**: multi-utente nel design, ma inizialmente solo amici (no waitlist, no marketing)

---

## 3. Mood & Identità Visiva

### Concept: "Nocturnal Urban Pulse"

L'app deve evocare la sensazione di scegliere cosa fare con gli amici il venerdì sera guardando il telefono. Il mood è:

- **Serale/notturno** — dark mode di default
- **Caldo e invitante** — toni ambra/oro sullo sfondo scuro
- **Sociale e playful** — non serioso, non corporate
- **Genovese ma non folkloristico** — identità locale senza essere kitsch

### Palette

| Ruolo | Colore | Hex |
|---|---|---|
| Background | Nero caldo | `#19120a` |
| Superfici | Marroni scuri | `#221a12` → `#3c3329` |
| Testo primario | Crema caldo | `#f0e0d1` |
| Testo secondario | Beige attenuato | `#d8c3ad` |
| Accent primario | Ambra/Oro | `#ffc174` |
| Accent forte (CTA) | Arancio | `#f59e0b` |
| Bordi | Marrone medio | `#534434` |
| Secondario (rare) | Rosa corallo | `#ffb2b9` |
| Terziario (info) | Blu cielo | `#8fd5ff` |
| Errore | Rosso salmone | `#ffb4ab` |

### Tipografia

- **Headlines**: Geist (sans-serif moderna, sharp)
- **Body text**: Inter (alta leggibilità su mobile)
- Gerarchia: Display 40px → Headline 32/28/24px → Body 18/16px → Label 14/12px

### Icone

- Lucide React (shadcn-native, leggera)
- Icona brand: `Moon` (luna, richiama la sera)

---

## 4. Architettura Funzionale

L'app si divide in 3 macro-flussi:

```
FONTI EVENTI → DATABASE → RACCOMANDAZIONE → UTENTE
                              ↑
                        PREFERENZE
```

### 4.1 Recupero Eventi

**Fonti automatiche (scraping giornaliero):**
- MenteLocale Genova (HTML parsing)
- GenovaToday sezione eventi (HTML/RSS)

**Fonte manuale (crowdsourcing):**
- L'utente carica uno screenshot Instagram/locandina
- Un LLM con vision (Gemini) estrae i metadati
- L'utente verifica/corregge → l'evento viene pubblicato nel DB

**Frequenza scraping**: ogni giorno alle 06:00, orizzonte 7 giorni.

**Metadati per ogni evento:**
- Nome, descrizione breve
- Data, ora, durata stimata
- Luogo (nome + coordinate)
- Genere (musica, teatro, aperitivo, mostra, sport...)
- Vibe (tranquillo, movimentato, romantico, sociale...)
- Energia (bassa → alta)
- Indoor/outdoor
- Fascia prezzo (gratis, economico, medio, costoso)
- Momento del giorno (pomeriggio, aperitivo, sera, notte)
- URL originale, immagine

**Deduplicazione**: eventi da fonti diverse vengono riconosciuti come duplicati (cross-fonte) e unificati.

### 4.2 Preferenze Utente

**Onboarding (prima volta):**
- 10 confronti a coppie ("Quale preferisci?")
- Ogni confronto: 2 card con immagine (es. "Club Notturno" vs "Cocktail Bar Tranquillo")
- Dopo la scelta: "Perché?" con chip selezionabili (opzioni generate dall'AI)
- Progress bar 1/10 → 10/10
- Alla fine: recap del profilo generato ("Ecco cosa ho capito di te")

**Raffinamento continuo:**
- L'utente può rifare confronti in qualsiasi momento (dal profilo)
- Ogni accettazione/rifiuto di suggerimento affina il profilo (feedback loop)
- La chat può influenzare le preferenze future

**Profilo visibile:**
- L'utente vede il proprio "taste radar" (visualizzazione a radar dei gusti)
- Top vibes con percentuali (es. "Deep House 80%", "Vista Mare 65%")

### 4.3 Raccomandazione

**Job automatico:**
- Venerdì pomeriggio e/o sabato mattina
- Matching profilo utente ↔ eventi disponibili nel weekend
- Output: 3 suggerimenti con motivazione ("Te lo consiglio perché...")

**Presentazione:**
- 3 card full-screen con immagine, tag, location, orario
- Sezione "Stasera's Reason" con spiegazione AI
- Azioni binarie: ACCETTA / RIFIUTA
- Toast feedback dopo l'azione ("Noto che preferisci posti intimi")

**Chat di re-ranking:**
- L'utente può scrivere in linguaggio naturale: "ho voglia di qualcosa di romantico"
- L'AI re-filtra e propone alternative dal DB eventi
- La chat può mostrare card evento inline

**Notifica push:**
- Venerdì/sabato → "Ho 3 suggerimenti per stasera! 🎉"
- Web Push API (VAPID), nessun servizio esterno

---

## 5. Schermate

### 5.1 Welcome / Login
- Prima schermata in assoluto
- Background: foto Genova notturna (blurred)
- Logo "Stasera" + icona luna + tagline
- CTA: "Accedi con Google"
- Solo Google login per l'MVP (guest mode in futuro)

### 5.2 Onboarding Preferenze
- Schermata ripetuta 10 volte (progress bar)
- Due card affiancate (aspect ratio 3:5) con immagini evocative
- Tap su una → si illumina (ring + check) → compare sezione "Perché?" con chip
- Chip selezionati + card scelta → "Continua"
- Alla fine: recap profilo

### 5.3 Home — Suggerimenti
- Header: "Suggerimenti per te" + subtitle
- Stack verticale di 3 card evento (scroll)
- Ogni card: immagine grande, tag genere/vibe, titolo, luogo+ora, reason AI, bottoni

### 5.4 Home — Stato Vuoto
- Quando non ci sono suggerimenti (es. mercoledì)
- Immagine Genova + "I tuoi 3 suggerimenti arrivano venerdì"
- CTA: "Esplora Eventi" e "Chiedi un consiglio live" (chat)

### 5.5 Esplora
- Search bar + filtri chip scrollabili (Oggi, Weekend, Musica, Aperitivo, Cocktail...)
- Lista verticale di card orizzontali (immagine + titolo + luogo + tag)
- Badge "LIVE" e "NEW" sugli eventi
- FAB (Floating Action Button) "Carica" per upload screenshot

### 5.6 Chat AI
- Header: "Chat con Stasera"
- Messaggi AI (sinistra) e utente (destra)
- L'AI può mostrare card evento inline
- Input in basso: campo testo + bottone invio + bottone allegato (+)
- Primo messaggio: "Ciao! Sono il tuo concierge per la serata..."

### 5.7 Upload Screenshot
- Accessibile dal FAB nella Explore
- Drop zone ("Trascina qui lo screenshot o scatta una foto")
- Stato processing con barra animata
- Griglia "Upload Recenti"
- Tips per l'upload

### 5.8 Conferma Evento Estratto
- Post-upload, dopo estrazione AI
- Form editabile: nome, data, ora, luogo (con mini-mappa), genere/vibe (chip)
- Screenshot originale affiancato
- Suggerimento AI (es. "questo locale è affollato il venerdì, consiglia prenotazione")
- CTA: "Conferma e Pubblica"

### 5.9 Profilo
- Avatar + nome + label ("Explorer • Genova, IT")
- Taste Profile: radar chart + top vibes con barre percentuale
- Sezione "Affina i tuoi Gusti" (rilancia i confronti a coppie)
- Impostazioni: notifiche toggle, privacy, lingua
- Logout

---

## 6. Navigazione

**Bottom nav fissa** su tutte le schermate (post-login):

| Tab | Icona | Label |
|---|---|---|
| Home | `Sparkles` | Suggerimenti |
| Explore | `Compass` | Esplora |
| Chat | `MessageCircle` | Chat |
| Profile | `User` | Profilo |

- Tab attiva: stroke più spesso + colore primary
- Tab inattiva: stroke leggero + colore secondario
- Stile: glass effect (semi-trasparente con blur)

**Flussi senza bottom nav:**
- Welcome/Login
- Onboarding (progress bar al posto della nav)
- Conferma evento (back button nell'header)

---

## 7. Logica di Business

### Matching profilo ↔ eventi

Per l'MVP: **tag-based scoring** (non embeddings).

Ogni utente ha un profilo preferenze (vettore JSON con pesi per ogni tag/vibe). Ogni evento ha tag strutturati. Lo score è calcolato come somma pesata dei match.

Top 3 per score → suggerimenti della settimana.

Il motivo viene generato dall'AI in linguaggio naturale basandosi sui tag che hanno matchato.

### Feedback loop

- **ACCETTA** → rinforza i tag dell'evento nel profilo utente
- **RIFIUTA** → attenua i tag dell'evento
- **Chat** → l'AI può aggiornare il profilo in base alla conversazione
- Toast visivo che comunica all'utente che sta "allenando" il sistema

### Deduplicazione

Eventi da fonti diverse (MenteLocale + GenovaToday + upload utente) vengono confrontati per nome/data/luogo e unificati se rappresentano lo stesso evento.

---

## 8. Decisioni Chiave

| Decisione | Motivazione |
|---|---|
| Non Instagram come fonte diretta | API limitate, scraping blocca. L'utente fa screenshot manualmente. |
| Tag+scoring, non embeddings (MVP) | Più facile da debuggare e spiegare. Si evolve dopo. |
| Chat libera, non bottoni | Più espressiva. "Voglia di romantico" > set fisso di opzioni. |
| Confronti a coppie per preferenze | Approccio collaudato (Elo rating). 10 confronti bastano per un profilo base. |
| Dark mode default | Coerente col mood "serata". Light mode supportato. |
| 3 suggerimenti, non 10 | Curazione > abbondanza. Riduce il paradosso della scelta. |
| Solo Google login (MVP) | Zero friction, un solo tap. Guest mode in futuro. |

---

## 9. Roadmap

### ✅ MVP Completato

- Setup progetto (Next.js 16, Tailwind 4, shadcn/ui, PWA)
- Autenticazione Google (Better Auth)
- Database (Neon PostgreSQL + Drizzle ORM + migrazioni)
- Scraper MenteLocale e GenovaToday
- Pipeline arricchimento LLM (estrazione metadati con Gemini)
- Upload screenshot → Gemini Vision → conferma evento → salvataggio
- Cron job giornaliero per scraping
- Onboarding confronti a coppie + generazione opzioni "perché"
- Calcolo profilo preferenze
- Job raccomandazione (matching profilo ↔ eventi)
- Pagina suggerimenti con 3 card full-bleed + motivazione AI
- Chat libera per re-ranking (streaming)
- Deduplicazione cross-fonte
- Design system completo (Nocturnal Urban Pulse)
- Feedback loop (accept/reject → aggiorna profilo: +0.2/-0.15 per tag)
- Push notification (VAPID + web-push + SW + cron trigger)
- Offline support (NetworkFirst cache per API con timeout 5s)
- Pagina Esplora con search + filtri genere
- Pagina conferma evento post-upload (form editabile)
- Toast feedback su accept/reject (sonner)
- Bottom nav 4 tab + top bar
- Toggle notifiche push nel profilo

### 📋 Backlog (post-MVP)

- Modalità ospite (navigazione senza login)
- Aggiunta fonti scraping custom (l'utente richiede un sito)
- Selezione fonti per utente
- Embeddings per matching semantico avanzato
- Espansione oltre Genova (altre città)
- Social: vedere cosa fanno gli amici, gruppi

---

## 10. Vincoli Tecnici (per contesto)

| Area | Scelta |
|---|---|
| Framework | Next.js 16 (App Router, full-stack) |
| UI | shadcn/ui + Tailwind CSS 4 |
| Font | Geist (headlines/labels) + Inter (body) |
| Icone | Lucide React |
| Auth | Better Auth (Google OAuth) |
| Database | Neon PostgreSQL + pgvector |
| ORM | Drizzle 1.0 |
| LLM | Gemini 3.5 Flash via Vercel AI SDK 6 |
| Hosting | Vercel (deploy, cron, edge) |
| PWA | @serwist/turbopack |
| Notifiche | Web Push API (VAPID) + web-push |
| Scraping | cheerio (server-side) |
| Linting | Biome (non ESLint) |
| Package manager | npm |

---

## 11. Fonti Eventi

| Fonte | Metodo | Frequenza |
|---|---|---|
| MenteLocale | Scraping HTML | Giornaliero 06:00 |
| GenovaToday | Scraping HTML/RSS | Giornaliero 06:00 |
| Screenshot utente | Upload → Gemini Vision → conferma | On-demand |

**Orizzonte**: prossimi 7 giorni.

**Evoluzione futura**: utenti potranno richiedere nuovi siti da scrappare.

---

## 12. Notifiche Push

- **Quando**: venerdì ~16:00 e/o sabato ~10:00
- **Contenuto**: "Ho 3 suggerimenti per stasera! 🎉" + deep link alla home
- **Tech**: Service Worker + VAPID keys + subscription salvata in DB
- **Opt-in**: toggle nel profilo utente

---

## 13. Note per chi collabora

- Il codice è in un monorepo (Next.js gestisce tutto)
- La UI è mobile-first (390x844 come viewport di riferimento)
- Dark mode è lo stato default — il light mode è secondario
- L'app è pensata per essere installata come PWA (icona sulla home)
- Tutto il copy dell'app è in italiano
- I nomi dei tab nella nav: Suggerimenti, Esplora, Chat, Profilo
- L'upload screenshot NON è un tab dedicato — si accede dal FAB nella pagina Esplora

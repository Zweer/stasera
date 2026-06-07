# Scraping Architecture

## Pipeline Overview

```
┌──────────────────────────────────────────────────────────┐
│                     TRIGGER                               │
│   Vercel Cron (daily 06:00) OR Manual (admin button)     │
└──────────────┬───────────────────────────────────────────┘
               ↓
┌──────────────────────────────────────────────────────────┐
│                  FETCH & PARSE                            │
│   MenteLocale parser ─→ raw events[]                     │
│   GenovaToday parser ─→ raw events[]                     │
└──────────────┬───────────────────────────────────────────┘
               ↓
┌──────────────────────────────────────────────────────────┐
│                LLM ENRICHMENT                             │
│   Raw text → Gemini 3.5 Flash → Structured metadata      │
│   (name, date, genre, vibe, energy, price, etc.)         │
└──────────────┬───────────────────────────────────────────┘
               ↓
┌──────────────────────────────────────────────────────────┐
│                 DEDUP & SAVE                              │
│   Fuzzy match against existing events in DB              │
│   New → insert  |  Duplicate → skip/merge                │
└──────────────────────────────────────────────────────────┘
```

## Upload Flow (User-initiated)

```
User uploads image → API endpoint
  → Gemini Vision (OCR) → extracted text
  → Same enrichment pipeline
  → Dedup check → save to DB
```

## File Organization

```
app/api/
├── cron/scrape/route.ts       # Vercel Cron entry point
├── events/upload/route.ts     # Screenshot upload endpoint
lib/
├── scrapers/
│   ├── mentelocale.ts         # HTML parser
│   ├── genovatoday.ts         # HTML parser
│   └── types.ts               # Shared raw event type
├── enrichment/
│   ├── pipeline.ts            # Orchestrator
│   ├── schema.ts              # Zod schema for structured output
│   └── prompts.ts             # LLM prompts
└── dedup.ts                   # Fuzzy matching logic
```

## Key Decisions

- **cheerio** for HTML parsing (lightweight, no browser needed)
- **AI SDK structured output** for metadata extraction (Zod schema → guaranteed shape)
- **Dedup at save time** (not at fetch time) — simpler, handles cross-source dupes
- **Vercel Cron** (no external scheduler) — free tier, integrated
- **Soft-delete** for expired events — keeps history, filterable

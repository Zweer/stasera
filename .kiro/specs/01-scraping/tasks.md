# Scraping Tasks

## Dependency Order

```
T0 (Interface) ─┐
T1 (MenteLocale)├→ T3 (LLM Enrichment) → T5 (Dedup) → T6 (Cron)
T2 (GenovaToday)┘                    ↑
                                      │
                       T4 (Upload) ───┘
```

## T0 — Scraper Interface & Registry ✅

- [x] Common Scraper interface (types.ts)
- [x] Registry pattern for scraper registration

## T1 — Scraper: MenteLocale ✅

- [x] Analyze site structure (URL patterns, HTML layout, pagination)
- [x] Implement HTML parser (list + detail pages)
- [x] Route handler for manual trigger (/api/scrape/mentelocale)
- [x] Tests with mock HTML fixtures

## T2 — Scraper: GenovaToday ✅

- [x] Analyze site structure (URL patterns, date filter in URL)
- [x] Implement HTML parser (list + detail pages)
- [x] Route handler for manual trigger (/api/scrape/genovatoday)
- [x] Tests with mock HTML fixtures

## T3 — LLM Enrichment Pipeline ✅

- [x] Define Zod schema for structured event metadata
- [x] Prompt engineering for metadata extraction
- [x] AI SDK integration (Gemini 3.5 Flash, structured output)
- [x] Batch processing support (Promise.all)
- [x] Save enriched events to DB

## T4 — Screenshot Upload ✅

- [x] Upload API endpoint (POST /api/events/upload, accepts image)
- [x] Gemini Vision OCR (extract text from image)
- [x] Feed extracted text into enrichment pipeline
- [ ] Upload UI (drag & drop or file picker) — API only for now

## T5 — Deduplication ✅

- [x] Title normalization function
- [x] Dedup by normalized title + date against DB
- [x] Integration in save pipeline (cron filters before insert)

## T6 — Cron Job ✅

- [x] Vercel Cron configuration (daily 06:00)
- [x] Orchestrator: scrape → enrich → dedup → save
- [x] Protected with CRON_SECRET bearer token
- [ ] Soft-delete expired events (not yet implemented)

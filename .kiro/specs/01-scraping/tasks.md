# Scraping Tasks

## Dependency Order

```
T1 (MenteLocale) ──┐
                    ├→ T3 (LLM Enrichment) → T5 (Dedup) → T6 (Cron)
T2 (GenovaToday) ──┘                    ↑
                                         │
                          T4 (Upload) ───┘
```

## T1 — Scraper: MenteLocale

- [ ] Analyze site structure (URL patterns, HTML layout, pagination)
- [ ] Implement HTML parser (raw event extraction)
- [ ] Route handler for manual trigger
- [ ] Tests with sample HTML fixtures

## T2 — Scraper: GenovaToday

- [ ] Analyze site structure (URL patterns, HTML layout)
- [ ] Implement HTML parser (raw event extraction)
- [ ] Route handler for manual trigger
- [ ] Tests with sample HTML fixtures

## T3 — LLM Enrichment Pipeline

- [ ] Define Zod schema for structured event metadata
- [ ] Prompt engineering for metadata extraction
- [ ] AI SDK integration (Gemini 3.5 Flash, structured output)
- [ ] Batch processing support
- [ ] Save enriched events to DB

## T4 — Screenshot Upload

- [ ] Upload API endpoint (accepts image)
- [ ] Gemini Vision OCR (extract text from image)
- [ ] Feed extracted text into enrichment pipeline
- [ ] Upload UI (drag & drop or file picker)

## T5 — Deduplication

- [ ] Title normalization function
- [ ] Fuzzy matching logic (title + date + location)
- [ ] Integration in save pipeline (skip or merge duplicates)

## T6 — Cron Job

- [ ] Vercel Cron configuration (daily morning trigger)
- [ ] Orchestrator: run scrapers → enrich → dedup → save
- [ ] Error handling and logging
- [ ] Soft-delete expired events (date in the past)

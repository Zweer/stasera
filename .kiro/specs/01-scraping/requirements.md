# Scraping Requirements

## Goal

Automatically collect events happening in Genova from multiple sources, enrich them
with structured metadata via LLM, and allow users to upload event screenshots for
OCR extraction.

## Core Flow

```
Sources (MenteLocale, GenovaToday)
  → Scraper fetches HTML/RSS
  → Extract raw event data (title, date, URL, raw text)
  → LLM enrichment (Gemini): structured metadata extraction
  → Save to DB (events table)

User uploads screenshot
  → Gemini Vision OCR
  → Same LLM enrichment pipeline
  → Save to DB
```

## Features

### 1. Scraper — MenteLocale
- Fetch events page for the upcoming 7 days
- Parse HTML to extract individual event entries
- Extract: title, date/time, location, URL, raw text

### 2. Scraper — GenovaToday
- Fetch events section for the upcoming 7 days
- Parse HTML to extract individual event entries
- Extract: title, date/time, location, URL, raw text

### 3. LLM Enrichment Pipeline
- Takes raw event text and produces structured metadata:
  name, date, time, location, genre, vibe, energy level,
  indoor/outdoor, price range, duration, day moment, description
- Uses Gemini 3.5 Flash via AI SDK
- Handles batch processing (multiple events per scrape run)

### 4. Screenshot Upload
- User uploads an image (photo/screenshot of event flyer)
- Gemini Vision extracts text from image
- Same enrichment pipeline produces structured event
- Event saved with source = "upload"

### 5. Scheduling
- Daily cron job (morning) triggers scrapers
- Horizon: next 7 days of events
- Deduplication: fuzzy match on normalized title + date + location

### 6. Deduplication
- Prevent duplicate events across sources
- Fuzzy matching on title (normalized) + date + location
- Similarity threshold configurable

## Success Criteria

- MenteLocale scraper extracts events correctly
- GenovaToday scraper extracts events correctly
- LLM enrichment produces valid structured metadata
- Screenshot upload extracts event data from image
- No duplicate events from overlapping sources
- Cron runs daily without manual intervention

## Non-Goals

- Real-time scraping (once daily is sufficient)
- Scraping Instagram or other social media
- User-configurable scraping sources (post-MVP)
- Image storage for event flyers (just extract data)

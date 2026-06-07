import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import type { RawEvent } from "@/lib/scrapers/types";
import { type EnrichedEvent, enrichedEventSchema } from "./schema";

const model = google("gemini-3.5-flash");

export interface EnrichmentResult {
  raw: RawEvent;
  enriched: EnrichedEvent;
}

export async function enrichEvents(
  rawEvents: RawEvent[],
): Promise<EnrichmentResult[]> {
  const results = await Promise.all(rawEvents.map((raw) => enrichOne(raw)));
  return results;
}

async function enrichOne(raw: RawEvent): Promise<EnrichmentResult> {
  const prompt = buildPrompt(raw);
  const { object } = await generateObject({
    model,
    schema: enrichedEventSchema,
    prompt,
  });
  return { raw, enriched: object };
}

function buildPrompt(raw: RawEvent): string {
  const parts = [
    `Estrai i metadati strutturati da questo evento a Genova.`,
    ``,
    `TITOLO: ${raw.title}`,
    `DATA GREZZA: ${raw.date}`,
    raw.location ? `LUOGO: ${raw.location}` : null,
    raw.tags?.length ? `TAG: ${raw.tags.join(", ")}` : null,
    raw.price ? `PREZZO: ${raw.price}` : null,
    raw.description ? `DESCRIZIONE:\n${raw.description}` : null,
  ];
  return parts.filter(Boolean).join("\n");
}

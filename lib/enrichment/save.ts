import { db } from "@/db";
import { events } from "@/db/schema";
import type { EnrichmentResult } from "./pipeline";

export async function saveEnrichedEvents(
  results: EnrichmentResult[],
): Promise<number> {
  if (results.length === 0) return 0;

  const rows = results.map(({ raw, enriched }) => ({
    name: enriched.name,
    description: enriched.description,
    date: new Date(enriched.date),
    time: enriched.time,
    locationName: enriched.locationName,
    genre: enriched.genre,
    vibe: enriched.vibe,
    energyLevel: enriched.energyLevel,
    indoorOutdoor: enriched.indoorOutdoor,
    priceRange: enriched.priceRange,
    duration: enriched.duration,
    dayMoment: enriched.dayMoment,
    source: raw.source,
    sourceUrl: raw.url,
    imageUrl: raw.imageUrl ?? null,
    rawText: raw.description ?? raw.title,
  }));

  const inserted = await db
    .insert(events)
    .values(rows)
    .returning({ id: events.id });
  return inserted.length;
}

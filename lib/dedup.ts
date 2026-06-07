import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";
import type { EnrichmentResult } from "@/lib/enrichment";
import { dedupKey } from "./dedup.utils";

export { normalize } from "./dedup.utils";

/**
 * Filters out events that already exist in DB (same normalized title + date).
 * Returns only new events to insert.
 */
export async function dedup(
  results: EnrichmentResult[],
): Promise<EnrichmentResult[]> {
  if (results.length === 0) return [];

  const dates = results.map((r) => new Date(r.enriched.date));
  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

  const existing = await db
    .select({ name: events.name, date: events.date })
    .from(events)
    .where(
      and(
        gte(events.date, minDate),
        lte(events.date, maxDate),
        eq(events.status, "active"),
      ),
    );

  const existingKeys = new Set(existing.map((e) => dedupKey(e.name, e.date)));

  return results.filter(
    (r) =>
      !existingKeys.has(dedupKey(r.enriched.name, new Date(r.enriched.date))),
  );
}

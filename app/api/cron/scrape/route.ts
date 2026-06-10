import { and, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { dedup } from "@/lib/dedup";
import { enrichEvents, saveEnrichedEvents } from "@/lib/enrichment";
import { getScrapers } from "@/lib/scrapers";

export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const log: string[] = [];

  // 1. Scrape all sources
  const scrapeResults = await Promise.allSettled(
    getScrapers().map(async (s) => {
      const rawEvents = await s.scrape();
      log.push(`[${s.meta.id}] scraped ${rawEvents.length} events`);
      return rawEvents;
    }),
  );

  const rawEvents = scrapeResults.flatMap((r) =>
    r.status === "fulfilled" ? r.value : [],
  );
  log.push(`Total raw events: ${rawEvents.length}`);

  if (rawEvents.length === 0) {
    return NextResponse.json({ ok: true, log, saved: 0 });
  }

  // 2. Skip events already in DB by sourceUrl (avoid LLM calls)
  const urls = rawEvents.map((e) => e.url).filter(Boolean);
  const existing =
    urls.length > 0
      ? await db
          .select({ sourceUrl: events.sourceUrl })
          .from(events)
          .where(
            and(eq(events.status, "active"), inArray(events.sourceUrl, urls)),
          )
      : [];
  const existingUrls = new Set(existing.map((e) => e.sourceUrl));
  const newRawEvents = rawEvents.filter(
    (e) => !e.url || !existingUrls.has(e.url),
  );
  log.push(
    `After URL dedup: ${newRawEvents.length} new (skipped ${rawEvents.length - newRawEvents.length})`,
  );

  if (newRawEvents.length === 0) {
    return NextResponse.json({ ok: true, log, saved: 0 });
  }

  // 3. Enrich via LLM (only new events)
  const enriched = await enrichEvents(newRawEvents);
  log.push(`Enriched: ${enriched.length} events`);

  // 4. Dedup against existing DB events (by name+date)
  const fresh = await dedup(enriched);
  log.push(`After name dedup: ${fresh.length} new events`);

  // 5. Save to DB
  const saved = await saveEnrichedEvents(fresh);
  log.push(`Saved: ${saved} events`);

  return NextResponse.json({ ok: true, log, saved });
}

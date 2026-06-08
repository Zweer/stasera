import { NextResponse } from "next/server";
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
      const events = await s.scrape();
      log.push(`[${s.meta.id}] scraped ${events.length} events`);
      return events;
    }),
  );

  const rawEvents = scrapeResults.flatMap((r) =>
    r.status === "fulfilled" ? r.value : [],
  );
  log.push(`Total raw events: ${rawEvents.length}`);

  if (rawEvents.length === 0) {
    return NextResponse.json({ ok: true, log, saved: 0 });
  }

  // 2. Enrich via LLM
  const enriched = await enrichEvents(rawEvents);
  log.push(`Enriched: ${enriched.length} events`);

  // 3. Dedup against existing DB events
  const fresh = await dedup(enriched);
  log.push(`After dedup: ${fresh.length} new events`);

  // 4. Save to DB
  const saved = await saveEnrichedEvents(fresh);
  log.push(`Saved: ${saved} events`);

  return NextResponse.json({ ok: true, log, saved });
}

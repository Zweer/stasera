import { NextResponse } from "next/server";
import { getScrapers } from "@/lib/scrapers";

export async function GET(): Promise<NextResponse> {
  const results = await Promise.allSettled(
    getScrapers().map(async (s) => ({
      source: s.meta.id,
      events: await s.scrape(),
    })),
  );

  const data = results.map((r) =>
    r.status === "fulfilled"
      ? {
          source: r.value.source,
          count: r.value.events.length,
          events: r.value.events,
        }
      : { source: "unknown", count: 0, error: String(r.reason) },
  );

  return NextResponse.json(data);
}

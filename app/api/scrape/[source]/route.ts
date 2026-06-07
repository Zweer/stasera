import { NextResponse } from "next/server";
import { getScrapers } from "@/lib/scrapers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ source: string }> },
): Promise<NextResponse> {
  const { source } = await params;
  const scraper = getScrapers().find((s) => s.meta.id === source);

  if (!scraper) {
    return NextResponse.json(
      { error: `Scraper "${source}" not found` },
      { status: 404 },
    );
  }

  const events = await scraper.scrape();
  return NextResponse.json({ source, count: events.length, events });
}

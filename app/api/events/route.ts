import { and, desc, eq, gte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";

export async function GET(): Promise<NextResponse> {
  const now = new Date();
  const rows = await db
    .select()
    .from(events)
    .where(and(gte(events.date, now), eq(events.status, "active")))
    .orderBy(desc(events.date))
    .limit(50);

  return NextResponse.json(
    { count: rows.length, events: rows },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    },
  );
}

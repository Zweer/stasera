import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { events } from "@/db/schema";
import { enrichedEventSchema } from "@/lib/enrichment/schema";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = enrichedEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const data = parsed.data;

  const [inserted] = await db
    .insert(events)
    .values({
      name: data.name,
      description: data.description,
      date: new Date(data.date),
      time: data.time,
      locationName: data.locationName,
      genre: data.genre,
      vibe: data.vibe,
      energyLevel: data.energyLevel,
      indoorOutdoor: data.indoorOutdoor,
      priceRange: data.priceRange,
      duration: data.duration,
      dayMoment: data.dayMoment,
      source: "upload",
      rawText: data.description,
    })
    .returning({ id: events.id });

  return NextResponse.json({ ok: true, id: inserted.id });
}

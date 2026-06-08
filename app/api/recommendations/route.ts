import { and, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { events, recommendations } from "@/db/schema";

export async function GET(): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: recommendations.id,
      score: recommendations.score,
      reason: recommendations.reason,
      status: recommendations.status,
      event: {
        id: events.id,
        name: events.name,
        description: events.description,
        date: events.date,
        time: events.time,
        locationName: events.locationName,
        genre: events.genre,
        vibe: events.vibe,
        imageUrl: events.imageUrl,
      },
    })
    .from(recommendations)
    .innerJoin(events, eq(recommendations.eventId, events.id))
    .where(
      and(
        eq(recommendations.userId, session.user.id),
        eq(recommendations.status, "pending"),
      ),
    )
    .orderBy(desc(recommendations.score))
    .limit(3);

  return NextResponse.json(rows);
}

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import { events, recommendations, userPreferences } from "@/db/schema";

const schema = z.object({
  id: z.string(),
  status: z.enum(["accepted", "rejected"]),
  reason: z.string().optional(),
});

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { id, status, reason } = parsed.data;

  // Update recommendation status
  await db
    .update(recommendations)
    .set({ status, feedbackReason: reason ?? null })
    .where(eq(recommendations.id, id));

  // Fetch the event to get its tags
  const rec = await db
    .select({ eventId: recommendations.eventId })
    .from(recommendations)
    .where(eq(recommendations.id, id))
    .limit(1);

  if (rec.length === 0) {
    return NextResponse.json({ ok: true });
  }

  const event = await db
    .select({
      genre: events.genre,
      vibe: events.vibe,
      energyLevel: events.energyLevel,
      dayMoment: events.dayMoment,
      indoorOutdoor: events.indoorOutdoor,
    })
    .from(events)
    .where(eq(events.id, rec[0].eventId))
    .limit(1);

  if (event.length === 0) {
    return NextResponse.json({ ok: true });
  }

  // Collect non-null tags from the event
  const eventData = event[0];
  const tags = [
    eventData.genre,
    eventData.vibe,
    eventData.energyLevel,
    eventData.dayMoment,
    eventData.indoorOutdoor,
  ].filter((t): t is string => t !== null);

  if (tags.length === 0) {
    return NextResponse.json({ ok: true });
  }

  // Update preference vector
  const existing = await db
    .select({ preferenceVector: userPreferences.preferenceVector })
    .from(userPreferences)
    .where(eq(userPreferences.userId, session.user.id))
    .limit(1);

  const vector: Record<string, number> = existing[0]?.preferenceVector ?? {};
  const delta = status === "accepted" ? 0.2 : -0.15;

  for (const tag of tags) {
    vector[tag] = (vector[tag] ?? 0) + delta;
  }

  if (existing.length > 0) {
    await db
      .update(userPreferences)
      .set({ preferenceVector: vector, updatedAt: new Date() })
      .where(eq(userPreferences.userId, session.user.id));
  } else {
    await db.insert(userPreferences).values({
      userId: session.user.id,
      preferenceVector: vector,
    });
  }

  return NextResponse.json({ ok: true });
}

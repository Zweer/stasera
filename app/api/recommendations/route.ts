import { and, asc, eq, gte, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { events, recommendations, userPreferences } from "@/db/schema";
import { generateReason } from "@/lib/recommendations/matching";
import { scoreEvents } from "@/lib/recommendations/scoring";

const TOP_N = 3;

export async function GET(): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // 1. Check if user already has pending recommendations for future events
  const existing = await db
    .select({
      id: recommendations.id,
      score: recommendations.score,
      reason: recommendations.reason,
      status: recommendations.status,
      eventId: recommendations.eventId,
      event: {
        id: events.id,
        name: events.name,
        description: events.description,
        date: events.date,
        time: events.time,
        locationName: events.locationName,
        genre: events.genre,
        vibe: events.vibe,
        energyLevel: events.energyLevel,
        indoorOutdoor: events.indoorOutdoor,
        imageUrl: events.imageUrl,
      },
    })
    .from(recommendations)
    .innerJoin(events, eq(recommendations.eventId, events.id))
    .where(
      and(
        eq(recommendations.userId, userId),
        eq(recommendations.status, "pending"),
        gte(events.date, startOfToday()),
      ),
    )
    .orderBy(asc(recommendations.score))
    .limit(TOP_N);

  if (existing.length >= TOP_N) {
    // Already have fresh pending recommendations — return them
    const rows = existing.map(({ id, score, reason, status, event }) => ({
      id,
      score,
      reason,
      status,
      event,
    }));
    return NextResponse.json(rows, { headers: cacheHeaders() });
  }

  // 2. Get user preference profile
  const profile = await db
    .select({ preferenceVector: userPreferences.preferenceVector })
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  if (!profile[0]?.preferenceVector) {
    // No profile yet — return existing (possibly empty)
    const rows = existing.map(({ id, score, reason, status, event }) => ({
      id,
      score,
      reason,
      status,
      event,
    }));
    return NextResponse.json(rows, { headers: cacheHeaders() });
  }

  // 3. Get future events (next 7 days)
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);

  const futureEvents = await db
    .select()
    .from(events)
    .where(and(eq(events.status, "active"), gte(events.date, startOfToday())))
    .orderBy(asc(events.date));

  if (futureEvents.length === 0) {
    return NextResponse.json([], { headers: cacheHeaders() });
  }

  // 4. Exclude events already recommended (any status) to this user
  const alreadyRecommended = await db
    .select({ eventId: recommendations.eventId })
    .from(recommendations)
    .where(eq(recommendations.userId, userId));

  const excludeIds = new Set(alreadyRecommended.map((r) => r.eventId));
  const candidateEvents = futureEvents.filter((e) => !excludeIds.has(e.id));

  if (candidateEvents.length === 0) {
    // All future events already recommended — return existing pending
    const rows = existing.map(({ id, score, reason, status, event }) => ({
      id,
      score,
      reason,
      status,
      event,
    }));
    return NextResponse.json(rows, { headers: cacheHeaders() });
  }

  // 5. Score and pick top N
  const scored = scoreEvents(candidateEvents, profile[0].preferenceVector);
  const needed = TOP_N - existing.length;
  const top = scored.slice(0, needed);

  // 6. Generate reasons and insert
  const newRecs: Array<{
    id: string;
    score: number;
    reason: string;
    status: string;
    event: {
      id: string;
      name: string;
      description: string | null;
      date: Date;
      time: string | null;
      locationName: string | null;
      genre: string | null;
      vibe: string | null;
      energyLevel: string | null;
      indoorOutdoor: string | null;
      imageUrl: string | null;
    };
  }> = [];

  for (const { event, score } of top) {
    const reason = await generateReason(
      event.id,
      event.name,
      event.genre,
      event.vibe,
    );

    const [inserted] = await db
      .insert(recommendations)
      .values({
        userId,
        eventId: event.id,
        score,
        reason,
      })
      .returning({ id: recommendations.id });

    newRecs.push({
      id: inserted.id,
      score,
      reason,
      status: "pending",
      event: {
        id: event.id,
        name: event.name,
        description: event.description,
        date: event.date,
        time: event.time,
        locationName: event.locationName,
        genre: event.genre,
        vibe: event.vibe,
        energyLevel: event.energyLevel,
        indoorOutdoor: event.indoorOutdoor,
        imageUrl: event.imageUrl,
      },
    });
  }

  // 7. Combine existing + new
  const allRecs = [
    ...existing.map(({ id, score, reason, status, event }) => ({
      id,
      score,
      reason,
      status,
      event,
    })),
    ...newRecs,
  ].sort((a, b) => b.score - a.score);

  return NextResponse.json(allRecs, { headers: cacheHeaders() });
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function cacheHeaders(): HeadersInit {
  return {
    "Cache-Control": "private, s-maxage=300, stale-while-revalidate=600",
  };
}

import { and, eq, gte, lt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { events, recommendations, userPreferences } from "@/db/schema";
import { sendPushToUser } from "@/lib/push";

export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = startOfToday();

  // 1. Expire stale recommendations (pending but event already passed)
  const staleRecs = await db
    .select({ id: recommendations.id })
    .from(recommendations)
    .innerJoin(events, eq(recommendations.eventId, events.id))
    .where(and(eq(recommendations.status, "pending"), lt(events.date, today)));

  if (staleRecs.length > 0) {
    for (const rec of staleRecs) {
      await db
        .update(recommendations)
        .set({ status: "expired" })
        .where(eq(recommendations.id, rec.id));
    }
  }

  // 2. Check if there are future events
  const futureEvents = await db
    .select({ id: events.id })
    .from(events)
    .where(and(eq(events.status, "active"), gte(events.date, today)))
    .limit(1);

  const hasEvents = futureEvents.length > 0;

  if (!hasEvents) {
    return NextResponse.json({
      ok: true,
      expired: staleRecs.length,
      notified: 0,
      reason: "No future events",
    });
  }

  // 3. Send push to all users with profiles
  const profiles = await db
    .select({ userId: userPreferences.userId })
    .from(userPreferences);

  const pushResults = await Promise.allSettled(
    profiles.map((p) =>
      sendPushToUser(p.userId, {
        title: "InGiro ha idee per il tuo weekend! 🎉",
        body: "Apri per scoprire i suggerimenti su misura.",
        url: "/suggestions",
      }),
    ),
  );

  const notified = pushResults.filter((r) => r.status === "fulfilled").length;

  return NextResponse.json({
    ok: true,
    expired: staleRecs.length,
    notified,
  });
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

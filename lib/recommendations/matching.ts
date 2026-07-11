import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { and, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { events, recommendations, userPreferences } from "@/db/schema";
import { scoreEvents } from "./scoring";

const TOP_N = 3;

export interface MatchingResult {
  userId: string;
  count: number;
}

export async function runMatchingJob(): Promise<MatchingResult[]> {
  // 1. Get weekend events
  const weekendEvents = await getWeekendEvents();
  if (weekendEvents.length === 0) return [];

  // 2. Get all users with profiles
  const profiles = await db.select().from(userPreferences);
  const results: MatchingResult[] = [];

  // 3. For each user, score + save top 3
  for (const profile of profiles) {
    if (!profile.preferenceVector) continue;

    const scored = scoreEvents(weekendEvents, profile.preferenceVector);
    const top = scored.slice(0, TOP_N);
    let count = 0;

    for (const { event, score } of top) {
      const reason = await generateReason(
        event.id,
        event.name,
        event.genre,
        event.vibe,
      );
      await db.insert(recommendations).values({
        userId: profile.userId,
        eventId: event.id,
        score,
        reason,
      });
      count++;
    }

    if (count > 0) {
      results.push({ userId: profile.userId, count });
    }
  }

  return results;
}

async function getWeekendEvents() {
  const now = new Date();
  const endOfWeekend = new Date(now);
  endOfWeekend.setDate(endOfWeekend.getDate() + 3);

  return db
    .select()
    .from(events)
    .where(
      and(
        eq(events.status, "active"),
        gte(events.date, now),
        lte(events.date, endOfWeekend),
      ),
    );
}

const reasonCache = new Map<string, string>();

export async function generateReason(
  eventId: string,
  name: string,
  genre: string | null,
  vibe: string | null,
): Promise<string> {
  const cached = reasonCache.get(eventId);
  if (cached) return cached;

  const { object } = await generateObject({
    model: google("gemini-3.5-flash"),
    schema: z.object({ reason: z.string() }),
    prompt: `Genera una breve motivazione (max 15 parole, in italiano) per consigliare questo evento: "${name}" (genere: ${genre ?? "vario"}, vibe: ${vibe ?? "non specificata"}). Inizia con "Perché" o "Te lo consiglio perché".`,
  });
  reasonCache.set(eventId, object.reason);
  return object.reason;
}

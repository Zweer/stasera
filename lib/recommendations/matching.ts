import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { and, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { events, recommendations, userPreferences } from "@/db/schema";
import { scoreEvents } from "./scoring";

const TOP_N = 3;

export async function runMatchingJob(): Promise<number> {
  // 1. Get weekend events
  const weekendEvents = await getWeekendEvents();
  if (weekendEvents.length === 0) return 0;

  // 2. Get all users with profiles
  const profiles = await db.select().from(userPreferences);
  let totalSaved = 0;

  // 3. For each user, score + save top 3
  for (const profile of profiles) {
    if (!profile.preferenceVector) continue;

    const scored = scoreEvents(weekendEvents, profile.preferenceVector);
    const top = scored.slice(0, TOP_N);

    for (const { event, score } of top) {
      const reason = await generateReason(event.name, event.genre, event.vibe);
      await db.insert(recommendations).values({
        userId: profile.userId,
        eventId: event.id,
        score,
        reason,
      });
      totalSaved++;
    }
  }

  return totalSaved;
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

async function generateReason(
  name: string,
  genre: string | null,
  vibe: string | null,
): Promise<string> {
  const { object } = await generateObject({
    model: google("gemini-3.5-flash"),
    schema: z.object({ reason: z.string() }),
    prompt: `Genera una breve motivazione (max 15 parole, in italiano) per consigliare questo evento: "${name}" (genere: ${genre ?? "vario"}, vibe: ${vibe ?? "non specificata"}). Inizia con "Perché" o "Te lo consiglio perché".`,
  });
  return object.reason;
}

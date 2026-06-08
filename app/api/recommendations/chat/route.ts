import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { and, eq, gte } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { db } from "@/db";
import { events } from "@/db/schema";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { message } = await request.json();

  // Fetch upcoming events
  const now = new Date();
  const weekend = new Date(now);
  weekend.setDate(weekend.getDate() + 3);

  const availableEvents = await db
    .select({
      id: events.id,
      name: events.name,
      genre: events.genre,
      vibe: events.vibe,
      locationName: events.locationName,
      date: events.date,
      time: events.time,
    })
    .from(events)
    .where(and(eq(events.status, "active"), gte(events.date, now)))
    .limit(30);

  const eventList = availableEvents
    .map(
      (e) =>
        `- ${e.name} (${e.genre ?? "vario"}, ${e.vibe ?? ""}, ${e.locationName ?? ""}, ${e.date.toLocaleDateString("it-IT")})`,
    )
    .join("\n");

  const result = streamText({
    model: google("gemini-3.5-flash"),
    prompt: `Sei l'assistente dell'app "Stasera" che consiglia eventi a Genova.

L'utente dice: "${message}"

Ecco gli eventi disponibili:
${eventList}

Rispondi in italiano, suggerendo i 3 eventi più adatti alla richiesta dell'utente. Per ognuno spiega brevemente perché lo consigli. Sii conciso e amichevole.`,
  });

  return result.toTextStreamResponse();
}

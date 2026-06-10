import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { enrichEvents } from "@/lib/enrichment";
import type { RawEvent } from "@/lib/scrapers/types";

export async function POST(request: Request): Promise<NextResponse> {
  const formData = await request.formData();
  const file = formData.get("image") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mimeType = file.type || "image/jpeg";

  // 1. OCR via Gemini Vision
  const { text } = await generateText({
    model: google("gemini-3.5-flash"),
    messages: [
      {
        role: "user",
        content: [
          { type: "image", image: `data:${mimeType};base64,${base64}` },
          {
            type: "text",
            text: "Estrai tutto il testo visibile in questa immagine di un evento a Genova. Includi: nome evento, data, luogo, orario, prezzo, descrizione. Rispondi solo con il testo estratto, senza commenti.",
          },
        ],
      },
    ],
  });

  // 2. Enrich (extract structured metadata)
  const raw: RawEvent = {
    title: text.split("\n")[0] || "Evento da screenshot",
    date: "",
    url: "",
    description: text,
    rawText: text,
    source: "upload",
  };

  const enriched = await enrichEvents([raw]);

  // Return extracted data for user confirmation (don't save yet)
  return NextResponse.json({
    ok: true,
    rawText: text,
    event: enriched[0]?.enriched ?? null,
  });
}

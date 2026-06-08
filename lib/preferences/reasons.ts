import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import type { ComparisonOption } from "./pairs";

const reasonsSchema = z.object({
  reasons: z
    .array(
      z.object({
        text: z.string().describe("Short reason in Italian, max 6 words"),
        tag: z.string().describe("The preference tag this reason maps to"),
      }),
    )
    .describe("3-4 reasons why someone might prefer option A over option B"),
});

export type Reason = z.infer<typeof reasonsSchema>["reasons"][number];

export async function generateReasons(
  chosen: ComparisonOption,
  other: ComparisonOption,
): Promise<Reason[]> {
  const { object } = await generateObject({
    model: google("gemini-3.5-flash"),
    schema: reasonsSchema,
    prompt: `L'utente ha preferito "${chosen.title}" (${chosen.description}) rispetto a "${other.title}" (${other.description}).

Genera 3-4 possibili motivazioni brevi (max 6 parole ciascuna, in italiano) per cui qualcuno potrebbe preferire la prima opzione.
Ogni motivazione deve mappare a un tag di preferenza specifico (es: "outdoor", "jazz", "intimo", "energia", "romantico", "sociale", "culturale").`,
  });

  return object.reasons;
}

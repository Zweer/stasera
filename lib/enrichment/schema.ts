import { z } from "zod";

export const enrichedEventSchema = z.object({
  name: z.string().describe("Event name, clean and concise"),
  description: z.string().describe("Brief description (1-2 sentences)"),
  date: z.string().describe("ISO date string YYYY-MM-DD"),
  time: z.string().nullable().describe("Start time HH:MM or null if unknown"),
  locationName: z.string().nullable().describe("Venue or place name"),
  genre: z
    .string()
    .nullable()
    .describe(
      "Category: musica, teatro, aperitivo, mostra, sport, food, cinema, nightlife, escursione, altro",
    ),
  vibe: z
    .string()
    .nullable()
    .describe(
      "Atmosphere: tranquillo, movimentato, romantico, sociale, culturale, festoso, alternativo",
    ),
  energyLevel: z
    .enum(["bassa", "media", "alta"])
    .nullable()
    .describe("Energy level of the event"),
  indoorOutdoor: z
    .enum(["indoor", "outdoor", "both"])
    .nullable()
    .describe("Indoor, outdoor, or both"),
  priceRange: z
    .enum(["gratis", "economico", "medio", "costoso"])
    .nullable()
    .describe("Price range"),
  duration: z
    .string()
    .nullable()
    .describe("Estimated duration (e.g. '2h', 'mezza giornata')"),
  dayMoment: z
    .enum(["mattina", "pomeriggio", "aperitivo", "sera", "notte"])
    .nullable()
    .describe("Time of day the event takes place"),
});

export type EnrichedEvent = z.infer<typeof enrichedEventSchema>;

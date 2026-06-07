import { describe, expect, it, vi } from "vitest";

vi.mock("ai", () => ({
  generateObject: vi.fn(() =>
    Promise.resolve({
      object: {
        name: "Jazz al Porto",
        description: "Concerto jazz sul mare",
        date: "2026-06-12",
        time: "21:00",
        locationName: "Porto Antico",
        genre: "musica",
        vibe: "sociale",
        energyLevel: "media",
        indoorOutdoor: "outdoor",
        priceRange: "gratis",
        duration: "2h",
        dayMoment: "sera",
      },
    }),
  ),
}));

vi.mock("@ai-sdk/google", () => ({
  google: vi.fn(() => "mock-model"),
}));

import type { RawEvent } from "@/lib/scrapers/types";
import { enrichEvents } from "./pipeline";

describe("enrichEvents", () => {
  it("enriches raw events via LLM", async () => {
    const raw: RawEvent[] = [
      {
        title: "Jazz al Porto Antico",
        date: "12 giugno 2026",
        location: "Porto Antico",
        url: "https://example.com/jazz",
        tags: ["Musica"],
        source: "mentelocale",
      },
    ];

    const results = await enrichEvents(raw);

    expect(results).toHaveLength(1);
    expect(results[0].enriched.name).toBe("Jazz al Porto");
    expect(results[0].enriched.genre).toBe("musica");
    expect(results[0].enriched.date).toBe("2026-06-12");
    expect(results[0].raw).toBe(raw[0]);
  });
});

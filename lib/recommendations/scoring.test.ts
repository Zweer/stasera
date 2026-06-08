import { describe, expect, it } from "vitest";
import { scoreEvents } from "./scoring";

const makeEvent = (overrides: Record<string, unknown>) =>
  ({
    id: "1",
    name: "Test",
    description: null,
    date: new Date(),
    time: null,
    locationName: null,
    locationLat: null,
    locationLng: null,
    genre: null,
    vibe: null,
    energyLevel: null,
    indoorOutdoor: null,
    priceRange: null,
    duration: null,
    dayMoment: null,
    source: null,
    sourceUrl: null,
    imageUrl: null,
    rawText: null,
    metadata: null,
    status: "active",
    createdAt: new Date(),
    expiresAt: null,
    ...overrides,
  }) as Parameters<typeof scoreEvents>[0][number];

describe("scoreEvents", () => {
  it("returns empty for empty profile", () => {
    expect(scoreEvents([makeEvent({})], {})).toEqual([]);
  });

  it("scores higher for matching tags", () => {
    const events = [
      makeEvent({ id: "jazz", genre: "jazz", vibe: "romantico" }),
      makeEvent({ id: "rock", genre: "rock", vibe: "festoso" }),
    ];
    const profile = { jazz: 0.8, romantico: 0.5, rock: -0.2 };

    const result = scoreEvents(events, profile);
    expect(result[0].event.id).toBe("jazz");
    expect(result[0].score).toBeGreaterThan(result[1].score);
  });

  it("normalizes scores to 0-1", () => {
    const events = [
      makeEvent({ id: "a", genre: "jazz" }),
      makeEvent({ id: "b", genre: "rock" }),
    ];
    const profile = { jazz: 1, rock: 0.5 };

    const result = scoreEvents(events, profile);
    expect(result[0].score).toBe(1);
    expect(result[1].score).toBeGreaterThanOrEqual(0);
    expect(result[1].score).toBeLessThanOrEqual(1);
  });
});

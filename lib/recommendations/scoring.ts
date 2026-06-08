import type { InferSelectModel } from "drizzle-orm";
import type { events } from "@/db/schema";

type Event = InferSelectModel<typeof events>;

export interface ScoredEvent {
  event: Event;
  score: number;
}

export function scoreEvents(
  eventList: Event[],
  profile: Record<string, number>,
): ScoredEvent[] {
  if (Object.keys(profile).length === 0) return [];

  const scored = eventList.map((event) => ({
    event,
    score: scoreOne(event, profile),
  }));

  // Normalize to 0-1
  const max = Math.max(...scored.map((s) => s.score), 0.01);
  const min = Math.min(...scored.map((s) => s.score), 0);
  const range = max - min || 1;

  return scored
    .map((s) => ({ ...s, score: (s.score - min) / range }))
    .sort((a, b) => b.score - a.score);
}

function scoreOne(event: Event, profile: Record<string, number>): number {
  const eventTags = extractTags(event);
  let score = 0;

  for (const tag of eventTags) {
    const weight = profile[tag] ?? 0;
    score += weight;
    // Bonus for strong match
    if (weight > 0.7) score += 0.3;
    // Penalty already encoded in negative weights
  }

  return score;
}

function extractTags(event: Event): string[] {
  const tags: string[] = [];
  if (event.genre) tags.push(event.genre);
  if (event.vibe) tags.push(event.vibe);
  if (event.energyLevel) tags.push(event.energyLevel);
  if (event.indoorOutdoor) tags.push(event.indoorOutdoor);
  if (event.dayMoment) tags.push(event.dayMoment);
  return tags;
}

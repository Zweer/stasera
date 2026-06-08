import { and, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";
import { type Archetype, archetypes } from "./archetypes";

export interface ComparisonPair {
  optionA: ComparisonOption;
  optionB: ComparisonOption;
}

export interface ComparisonOption {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

const MIN_REAL_EVENTS = 15;
const PAIR_COUNT = 8;

export async function generatePairs(): Promise<ComparisonPair[]> {
  const options = await getOptions();
  return pickPairs(options, PAIR_COUNT);
}

async function getOptions(): Promise<ComparisonOption[]> {
  const now = new Date();
  const realEvents = await db
    .select({
      id: events.id,
      name: events.name,
      description: events.description,
      genre: events.genre,
      vibe: events.vibe,
    })
    .from(events)
    .where(and(eq(events.status, "active"), gte(events.date, now)))
    .limit(30);

  if (realEvents.length >= MIN_REAL_EVENTS) {
    return realEvents.map((e) => ({
      id: e.id,
      title: e.name,
      description: e.description ?? "",
      tags: [e.genre, e.vibe].filter(Boolean) as string[],
    }));
  }

  return archetypes.map(archetypeToOption);
}

function archetypeToOption(a: Archetype): ComparisonOption {
  return {
    id: a.id,
    title: a.title,
    description: a.description,
    tags: a.tags,
  };
}

function pickPairs(
  options: ComparisonOption[],
  count: number,
): ComparisonPair[] {
  const pairs: ComparisonPair[] = [];
  const shuffled = [...options].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(count, Math.floor(shuffled.length / 2)); i++) {
    pairs.push({
      optionA: shuffled[i * 2],
      optionB: shuffled[i * 2 + 1],
    });
  }

  return pairs;
}

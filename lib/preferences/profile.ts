import { eq } from "drizzle-orm";
import { db } from "@/db";
import { preferenceComparisons, userPreferences } from "@/db/schema";
import type { ComparisonOption } from "./pairs";
import type { Reason } from "./reasons";

export async function saveComparison(
  userId: string,
  optionA: ComparisonOption,
  optionB: ComparisonOption,
  chosen: "a" | "b",
  reason: Reason,
): Promise<void> {
  await db.insert(preferenceComparisons).values({
    userId,
    optionA,
    optionB,
    chosen,
    reason: reason.text,
  });

  await updateProfile(userId, chosen === "a" ? optionA : optionB, reason);
}

async function updateProfile(
  userId: string,
  chosenOption: ComparisonOption,
  reason: Reason,
): Promise<void> {
  const existing = await db
    .select({ preferenceVector: userPreferences.preferenceVector })
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  const vector: Record<string, number> = existing[0]?.preferenceVector ?? {};

  // Boost the reason tag
  vector[reason.tag] = (vector[reason.tag] ?? 0) + 0.3;

  // Boost all tags of the chosen option (smaller weight)
  for (const tag of chosenOption.tags) {
    vector[tag] = (vector[tag] ?? 0) + 0.1;
  }

  // Upsert profile
  if (existing.length > 0) {
    await db
      .update(userPreferences)
      .set({ preferenceVector: vector, updatedAt: new Date() })
      .where(eq(userPreferences.userId, userId));
  } else {
    await db.insert(userPreferences).values({
      userId,
      preferenceVector: vector,
    });
  }
}

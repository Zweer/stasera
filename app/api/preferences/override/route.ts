import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import { userPreferences } from "@/db/schema";

const schema = z.object({
  tag: z.string(),
  action: z.enum(["boost", "reset", "penalize"]),
});

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { tag, action } = parsed.data;

  const existing = await db
    .select({ preferenceVector: userPreferences.preferenceVector })
    .from(userPreferences)
    .where(eq(userPreferences.userId, session.user.id))
    .limit(1);

  const vector: Record<string, number> = existing[0]?.preferenceVector ?? {};

  if (action === "boost") {
    vector[tag] = 0.5;
  } else if (action === "penalize") {
    vector[tag] = -0.5;
  } else {
    delete vector[tag];
  }

  if (existing.length > 0) {
    await db
      .update(userPreferences)
      .set({ preferenceVector: vector, updatedAt: new Date() })
      .where(eq(userPreferences.userId, session.user.id));
  } else {
    await db.insert(userPreferences).values({
      userId: session.user.id,
      preferenceVector: vector,
    });
  }

  return NextResponse.json({ ok: true });
}

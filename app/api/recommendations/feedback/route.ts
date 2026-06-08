import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import { recommendations } from "@/db/schema";

const schema = z.object({
  id: z.string(),
  status: z.enum(["accepted", "rejected"]),
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

  await db
    .update(recommendations)
    .set({ status: parsed.data.status })
    .where(eq(recommendations.id, parsed.data.id));

  return NextResponse.json({ ok: true });
}

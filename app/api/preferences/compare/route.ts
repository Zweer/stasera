import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import type { ComparisonOption } from "@/lib/preferences";
import { generateReasons, saveComparison } from "@/lib/preferences";

const reasonsRequestSchema = z.object({
  chosen: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
  }),
  other: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
  }),
});

const compareRequestSchema = z.object({
  optionA: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
  }),
  optionB: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
  }),
  chosen: z.enum(["a", "b"]),
  reason: z.object({
    text: z.string(),
    tag: z.string(),
  }),
});

// Generate reasons for a choice
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const body = searchParams.get("data");
  if (!body) {
    return NextResponse.json({ error: "Missing data param" }, { status: 400 });
  }

  const parsed = reasonsRequestSchema.safeParse(JSON.parse(body));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const reasons = await generateReasons(parsed.data.chosen, parsed.data.other);
  return NextResponse.json(reasons);
}

// Save a comparison
export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = compareRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { optionA, optionB, chosen, reason } = parsed.data;
  await saveComparison(
    session.user.id,
    optionA as ComparisonOption,
    optionB as ComparisonOption,
    chosen,
    reason,
  );

  return NextResponse.json({ ok: true });
}

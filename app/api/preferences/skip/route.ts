import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { saveSkip } from "@/lib/preferences";

const schema = z.object({
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

  await saveSkip(session.user.id, parsed.data.optionA, parsed.data.optionB);
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { runMatchingJob } from "@/lib/recommendations/matching";

export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const saved = await runMatchingJob();
  return NextResponse.json({ ok: true, recommendations: saved });
}

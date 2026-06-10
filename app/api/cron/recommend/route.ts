import { NextResponse } from "next/server";
import { sendPushToUser } from "@/lib/push";
import { runMatchingJob } from "@/lib/recommendations/matching";

export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await runMatchingJob();

  // Send push to each user who got new recommendations
  await Promise.allSettled(
    results.map((r) =>
      sendPushToUser(r.userId, {
        title: "Stasera ha 3 idee per te! 🎉",
        body: "I tuoi suggerimenti per il weekend sono pronti.",
        url: "/suggestions",
      }),
    ),
  );

  return NextResponse.json({
    ok: true,
    recommendations: results.reduce((sum, r) => sum + r.count, 0),
    notified: results.length,
  });
}

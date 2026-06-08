import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { getScrapers } from "@/lib/scrapers";

interface Check {
  name: string;
  status: "ok" | "error";
  detail?: string;
}

export async function GET(): Promise<NextResponse> {
  const checks: Check[] = await Promise.all([
    checkDb(),
    checkGemini(),
    checkScrapers(),
  ]);

  const healthy = checks.every((c) => c.status === "ok");
  return NextResponse.json(
    { healthy, checks },
    { status: healthy ? 200 : 503 },
  );
}

async function checkDb(): Promise<Check> {
  try {
    await db.execute(sql`SELECT 1`);
    return { name: "database", status: "ok" };
  } catch (e) {
    return { name: "database", status: "error", detail: String(e) };
  }
}

async function checkGemini(): Promise<Check> {
  try {
    const { text } = await generateText({
      model: google("gemini-3.5-flash"),
      prompt: "Rispondi solo: ok",
    });
    return {
      name: "gemini",
      status: text.toLowerCase().includes("ok") ? "ok" : "error",
    };
  } catch (e) {
    return { name: "gemini", status: "error", detail: String(e) };
  }
}

async function checkScrapers(): Promise<Check> {
  const scrapers = getScrapers();
  return {
    name: "scrapers",
    status: scrapers.length > 0 ? "ok" : "error",
    detail: `${scrapers.length} registered: ${scrapers.map((s) => s.meta.id).join(", ")}`,
  };
}

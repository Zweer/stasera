import { NextResponse } from "next/server";
import { generatePairs } from "@/lib/preferences";

export async function GET(): Promise<NextResponse> {
  const pairs = await generatePairs();
  return NextResponse.json(pairs);
}

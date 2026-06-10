import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { generatePairs } from "@/lib/preferences";
import { OnboardingClient } from "./client";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/");

  const pairs = await generatePairs();
  return <OnboardingClient pairs={pairs} />;
}

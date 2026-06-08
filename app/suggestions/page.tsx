import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SuggestionsClient } from "./client";

export default async function SuggestionsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  return <SuggestionsClient />;
}

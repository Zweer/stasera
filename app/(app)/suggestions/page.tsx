import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignUpBanner } from "@/components/features/sign-up-banner";
import { SuggestionsClient } from "./client";

export default async function SuggestionsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/");

  const user = session.user as { id: string; isAnonymous?: boolean };

  return (
    <>
      {user.isAnonymous && <SignUpBanner />}
      <SuggestionsClient />
    </>
  );
}

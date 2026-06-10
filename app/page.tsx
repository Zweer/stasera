import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GoogleSignInButton } from "@/components/features/google-sign-in-button";
import { db } from "@/db";
import { userPreferences } from "@/db/schema";
import { WelcomeHero } from "@/components/features/welcome-hero";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    const profile = await db
      .select({ id: userPreferences.id })
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1);

    redirect(profile.length > 0 ? "/suggestions" : "/onboarding");
  }

  return <WelcomeHero />;
}

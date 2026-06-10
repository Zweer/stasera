import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { WelcomeHero } from "@/components/features/welcome-hero";
import { db } from "@/db";
import { userPreferences } from "@/db/schema";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return <WelcomeHero />;
  }

  // Guest users go to explore (no personalized content)
  const user = session.user as { id: string; isAnonymous?: boolean };
  if (user.isAnonymous) {
    redirect("/explore");
  }

  // Authenticated users: check onboarding status
  const profile = await db
    .select({ id: userPreferences.id })
    .from(userPreferences)
    .where(eq(userPreferences.userId, session.user.id))
    .limit(1);

  redirect(profile.length > 0 ? "/suggestions" : "/onboarding");
}

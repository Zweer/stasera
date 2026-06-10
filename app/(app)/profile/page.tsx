import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignUpBanner } from "@/components/features/sign-up-banner";
import { db } from "@/db";
import { userPreferences } from "@/db/schema";
import { ProfileClient } from "./client";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/");

  const user = session.user as {
    id: string;
    name: string;
    image?: string | null;
    isAnonymous?: boolean;
  };

  // Guest users see sign-up prompt instead of profile
  if (user.isAnonymous) {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center px-5">
        <SignUpBanner message="Accedi per creare il tuo profilo gusti e ricevere suggerimenti personalizzati" />
      </div>
    );
  }

  const result = await db
    .select({ preferenceVector: userPreferences.preferenceVector })
    .from(userPreferences)
    .where(eq(userPreferences.userId, session.user.id))
    .limit(1);

  const profile = result[0]?.preferenceVector ?? null;

  return (
    <ProfileClient
      profile={profile}
      userName={user.name}
      userImage={user.image}
    />
  );
}

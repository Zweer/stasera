import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { userPreferences } from "@/db/schema";
import { ProfileClient } from "./client";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const result = await db
    .select({ preferenceVector: userPreferences.preferenceVector })
    .from(userPreferences)
    .where(eq(userPreferences.userId, session.user.id))
    .limit(1);

  const profile = result[0]?.preferenceVector ?? null;
  return <ProfileClient profile={profile} />;
}

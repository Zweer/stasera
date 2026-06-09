import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/auth";
import { GoogleSignInButton } from "@/components/features/google-sign-in-button";
import { SignOutButton } from "@/components/features/sign-out-button";
import { db } from "@/db";
import { userPreferences } from "@/db/schema";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  // Not logged in → landing
  if (!session) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="text-6xl">🌙</div>
        <h1 className="text-4xl font-bold">Stasera</h1>
        <p className="text-muted-foreground max-w-xs text-lg">
          Cosa facciamo stasera a Genova? Ti consiglio io.
        </p>
        <GoogleSignInButton />
      </main>
    );
  }

  // Logged in → check if has profile
  const profile = await db
    .select({ id: userPreferences.id })
    .from(userPreferences)
    .where(eq(userPreferences.userId, session.user.id))
    .limit(1);

  const hasProfile = profile.length > 0;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="text-5xl">👋</div>
      <h1 className="text-3xl font-bold">
        Ciao, {session.user.name?.split(" ")[0]}!
      </h1>
      <SignOutButton />

      {!hasProfile ? (
        <>
          <p className="text-muted-foreground max-w-xs">
            Per consigliarti al meglio, ho bisogno di conoscerti un po'.
          </p>
          <Link
            href="/onboarding"
            className="bg-primary text-primary-foreground rounded-full px-8 py-3 font-medium shadow-lg"
          >
            Inizia il quiz ✨
          </Link>
        </>
      ) : (
        <>
          <p className="text-muted-foreground max-w-xs">
            Pronto per stasera? Ecco i miei suggerimenti.
          </p>
          <div className="flex gap-3">
            <Link
              href="/suggestions"
              className="bg-primary text-primary-foreground rounded-full px-6 py-3 font-medium shadow-lg"
            >
              Vedi suggerimenti 🎉
            </Link>
            <Link
              href="/profile"
              className="rounded-full border px-6 py-3 font-medium"
            >
              Il mio profilo
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

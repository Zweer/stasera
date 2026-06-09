"use client";

import { authClient } from "@/lib/auth-client";

export function GoogleSignInButton() {
  return (
    <button
      type="button"
      onClick={() =>
        authClient.signIn.social({
          provider: "google",
          callbackURL: "/",
        })
      }
      className="bg-primary text-primary-foreground mt-4 rounded-full px-8 py-3 text-lg font-medium shadow-lg transition-transform hover:scale-105"
    >
      Accedi con Google
    </button>
  );
}

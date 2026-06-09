"use client";

import { authClient } from "@/lib/auth-client";

export function GoogleSignInButton() {
  const handleSignIn = async () => {
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      if (result.error) {
        alert(`Errore login: ${JSON.stringify(result.error)}`);
      }
    } catch (e) {
      alert(`Eccezione: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      className="bg-primary text-primary-foreground mt-4 rounded-full px-8 py-3 text-lg font-medium shadow-lg transition-transform hover:scale-105"
    >
      Accedi con Google
    </button>
  );
}

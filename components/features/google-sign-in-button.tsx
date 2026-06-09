"use client";

import { authClient } from "@/lib/auth-client";

export function GoogleSignInButton() {
  const handleSignIn = async () => {
    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
    if (result.error) {
      console.error("Sign-in error:", result.error);
      alert(`Errore login: ${result.error.message ?? result.error.code}`);
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

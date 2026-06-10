"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function GuestSignInButton() {
  const router = useRouter();

  const handleGuest = async () => {
    await authClient.signIn.anonymous();
    router.push("/explore");
  };

  return (
    <button
      type="button"
      onClick={handleGuest}
      className="text-label-md block w-full py-4 text-on-surface-variant transition-colors duration-200 hover:text-primary"
    >
      Continua come ospite
    </button>
  );
}

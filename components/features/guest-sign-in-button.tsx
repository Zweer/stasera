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
      className="w-full py-4 text-sm text-[#d8c3ad] transition-colors hover:text-[#ffc174]"
    >
      Continua come ospite
    </button>
  );
}

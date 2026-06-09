"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        router.refresh();
      }}
      className="text-muted-foreground cursor-pointer text-sm underline underline-offset-4"
    >
      Esci
    </button>
  );
}

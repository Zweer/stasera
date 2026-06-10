"use client";

import { Sparkles } from "lucide-react";
import { GoogleSignInButton } from "@/components/features/google-sign-in-button";

interface Props {
  message?: string;
}

export function SignUpBanner({
  message = "Accedi per suggerimenti personalizzati",
}: Props) {
  return (
    <div className="mx-container-margin rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
      <Sparkles className="mx-auto mb-2 h-6 w-6 text-primary" />
      <p className="text-base mb-4 text-on-surface">{message}</p>
      <GoogleSignInButton />
    </div>
  );
}

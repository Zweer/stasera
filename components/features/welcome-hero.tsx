"use client";

import { Moon } from "lucide-react";
import { GoogleSignInButton } from "@/components/features/google-sign-in-button";
import { GuestSignInButton } from "@/components/features/guest-sign-in-button";

export function WelcomeHero() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#19120a] px-6">
      <div className="flex w-full max-w-md flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-12 flex flex-col items-center">
          <div className="mb-4 rounded-full bg-[#ffc174]/10 p-4 shadow-[0_0_20px_rgba(255,193,116,0.2)]">
            <Moon className="h-10 w-10 fill-[#ffc174] text-[#ffc174]" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-[#ffc174]">
            InGiro
          </h1>
        </div>

        {/* Headline */}
        <div className="mb-10 space-y-3">
          <h2 className="text-2xl font-semibold leading-tight text-[#f0e0d1] sm:text-3xl">
            La tua notte a Genova, curata dall'AI.
          </h2>
          <p className="mx-auto max-w-[280px] text-base leading-relaxed text-[#d8c3ad]">
            Ricevi ogni weekend i 3 migliori eventi scelti apposta per te.
          </p>
        </div>

        {/* CTA */}
        <div className="flex w-full flex-col gap-3">
          <GoogleSignInButton />
          <GuestSignInButton />
        </div>

        {/* Decorative */}
        <div className="mt-10 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ffc174]/40" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffc174]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#ffc174]/40" />
        </div>
        <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-[#ffc174]/80">
          AI-Powered Experience
        </p>
      </div>
    </div>
  );
}

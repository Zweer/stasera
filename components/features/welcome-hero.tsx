"use client";

import { Moon } from "lucide-react";
import { GoogleSignInButton } from "@/components/features/google-sign-in-button";
import { GuestSignInButton } from "@/components/features/guest-sign-in-button";

export function WelcomeHero() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-container-margin">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 h-48 w-48 rounded-full bg-tertiary/5 blur-3xl" />
      </div>

      <main className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-xl flex flex-col items-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4 shadow-[0_0_20px_rgba(255,193,116,0.2)]">
            <Moon className="h-12 w-12 fill-primary text-primary" />
          </div>
          <h1 className="font-display text-display-lg font-bold tracking-tighter text-primary">
            Stasera
          </h1>
        </div>

        {/* Headline */}
        <div className="mb-xl space-y-md">
          <h2 className="font-display text-headline-lg-mobile font-semibold text-on-surface md:text-headline-lg">
            La tua notte a Genova,
            <br />
            curata dall'AI.
          </h2>
          <p className="text-body-lg mx-auto max-w-[280px] text-on-surface-variant opacity-90">
            Ricevi ogni weekend i 3 migliori eventi scelti apposta per te.
          </p>
        </div>

        {/* CTA */}
        <div className="w-full space-y-md">
          <GoogleSignInButton />
          <GuestSignInButton />
        </div>

        {/* Decorative dots */}
        <div className="mt-xl flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
        </div>
        <p className="text-label-sm mt-2 uppercase tracking-widest text-primary opacity-80">
          AI-Powered Experience
        </p>
      </main>
    </div>
  );
}

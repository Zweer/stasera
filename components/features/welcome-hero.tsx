"use client";

import { Moon } from "lucide-react";
import { GoogleSignInButton } from "@/components/features/google-sign-in-button";
import { GuestSignInButton } from "@/components/features/guest-sign-in-button";

export function WelcomeHero() {
  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-12 flex flex-col items-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4 shadow-[0_0_20px_rgba(255,193,116,0.2)]">
            <Moon className="h-10 w-10 fill-primary text-primary" />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tighter text-primary">
            Stasera
          </h1>
        </div>

        {/* Headline */}
        <div className="mb-10 space-y-3">
          <h2 className="font-display text-2xl font-semibold leading-tight text-on-surface sm:text-3xl">
            La tua notte a Genova, curata dall'AI.
          </h2>
          <p className="mx-auto max-w-[260px] text-base leading-relaxed text-on-surface-variant">
            Ricevi ogni weekend i 3 migliori eventi scelti apposta per te.
          </p>
        </div>

        {/* CTA */}
        <div className="w-full space-y-3">
          <GoogleSignInButton />
          <GuestSignInButton />
        </div>

        {/* Decorative */}
        <div className="mt-10 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
        </div>
        <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-primary/80">
          AI-Powered Experience
        </p>
      </main>
    </div>
  );
}

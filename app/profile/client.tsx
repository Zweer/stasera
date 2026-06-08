"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  profile: Record<string, number> | null;
}

export function ProfileClient({ profile }: Props) {
  if (!profile) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-2xl font-bold">Nessun profilo ancora</h1>
        <p className="text-muted-foreground">
          Completa il quiz per creare il tuo profilo gusti.
        </p>
        <Link
          href="/onboarding"
          className="bg-primary text-primary-foreground rounded-full px-6 py-3 font-medium"
        >
          Inizia il quiz
        </Link>
      </div>
    );
  }

  const sorted = Object.entries(profile).sort(([, a], [, b]) => b - a);
  const maxWeight = Math.max(...sorted.map(([, w]) => Math.abs(w)));

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">I tuoi gusti</h1>
      <p className="text-muted-foreground text-sm">
        Ecco cosa abbiamo capito delle tue preferenze.
      </p>

      <div className="flex flex-col gap-3">
        {sorted.map(([tag, weight]) => (
          <div key={tag} className="flex items-center gap-3">
            <span className="w-24 text-sm font-medium capitalize">{tag}</span>
            <div className="bg-muted relative h-4 flex-1 overflow-hidden rounded-full">
              <div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full transition-all",
                  weight > 0 ? "bg-primary" : "bg-destructive",
                )}
                style={{ width: `${(Math.abs(weight) / maxWeight) * 100}%` }}
              />
            </div>
            <span className="text-muted-foreground w-10 text-right text-xs">
              {weight > 0 ? "+" : ""}
              {weight.toFixed(1)}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/onboarding"
        className="bg-secondary mt-4 self-center rounded-full px-6 py-3 text-sm font-medium"
      >
        Raffina il profilo
      </Link>
    </div>
  );
}

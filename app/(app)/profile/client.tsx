"use client";

import {
  ArrowRightLeft,
  Bell,
  Globe,
  LogOut,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface Props {
  profile: Record<string, number> | null;
  userName?: string | null;
  userImage?: string | null;
}

export function ProfileClient({ profile, userName, userImage }: Props) {
  const router = useRouter();

  const sorted = profile
    ? Object.entries(profile)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : [];
  const maxWeight = sorted.length > 0 ? Math.max(...sorted.map(([, w]) => Math.abs(w))) : 1;

  return (
    <div className="space-y-lg px-container-margin pt-lg pb-32">
      {/* User identity */}
      <section className="flex flex-col items-center py-md">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-2 border-primary p-1">
            {userImage ? (
              <img
                src={userImage}
                alt={userName ?? "Avatar"}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-surface-container-high text-2xl">
                👤
              </div>
            )}
          </div>
        </div>
        <h2 className="text-headline-md mt-4 text-on-surface">
          {userName ?? "Utente"}
        </h2>
        <p className="text-label-md text-on-surface-variant">
          Explorer · Genova, IT
        </p>
      </section>

      {/* Taste profile */}
      {sorted.length > 0 && (
        <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low p-lg">
          <div className="mb-md flex items-center justify-between">
            <h3 className="text-headline-md text-primary">Taste Profile</h3>
          </div>
          <div className="space-y-md">
            {sorted.map(([tag, weight]) => {
              const pct = Math.round((Math.abs(weight) / maxWeight) * 100);
              return (
                <div key={tag}>
                  <div className="flex items-center justify-between">
                    <span className="text-body-md capitalize text-on-surface">
                      {tag}
                    </span>
                    <span className="text-label-md text-primary">{pct}%</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-container-highest">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        weight > 0 ? "bg-primary" : "bg-error",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Refine CTA */}
      <section className="flex flex-col items-center rounded-xl border border-primary/20 bg-primary/5 p-lg text-center">
        <h3 className="text-headline-md text-primary">Affina i tuoi Gusti</h3>
        <p className="mb-lg mt-2 max-w-md text-on-surface-variant">
          Aiutaci a suggerirti la serata perfetta confrontando nuovi locali e
          atmosfere.
        </p>
        <Link
          href="/onboarding"
          className="text-label-md flex items-center gap-2 rounded-full bg-primary px-lg py-md text-on-primary transition-transform active:scale-95"
        >
          <ArrowRightLeft className="h-4 w-4" />
          INIZIA CONFRONTI
        </Link>
      </section>

      {/* Settings */}
      <section className="space-y-sm">
        <h3 className="text-label-md px-1 uppercase tracking-widest text-on-surface-variant">
          Impostazioni
        </h3>
        <div className="divide-y divide-outline-variant/30 overflow-hidden rounded-xl border border-outline-variant bg-surface-container">
          <SettingsRow icon={Bell} label="Notifiche" sub="Aggiornamenti live e inviti" />
          <SettingsRow icon={Shield} label="Privacy & Sicurezza" sub="Gestisci dati e visibilità" />
          <SettingsRow icon={Globe} label="Lingua" sub="Italiano (IT)" />
        </div>

        {/* Logout */}
        <div className="pt-md">
          <button
            type="button"
            onClick={async () => {
              await authClient.signOut();
              router.refresh();
            }}
            className="text-label-md flex w-full items-center justify-center gap-2 rounded-xl border border-error/30 bg-surface-container-low p-md text-error transition-colors hover:bg-error/10 active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            LOGOUT
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-xl text-center">
        <p className="text-[12px] text-on-surface-variant">
          Stasera v0.1.0
        </p>
      </footer>
    </div>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  sub,
}: {
  icon: typeof Bell;
  label: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between p-md transition-colors hover:bg-surface-container-high"
    >
      <div className="flex items-center gap-md">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high">
          <Icon className="h-5 w-5 text-on-surface" />
        </div>
        <div className="text-left">
          <p className="text-body-md text-on-surface">{label}</p>
          <p className="text-[12px] text-on-surface-variant">{sub}</p>
        </div>
      </div>
    </button>
  );
}

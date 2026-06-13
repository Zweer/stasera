"use client";

import {
  ArrowRightLeft,
  Bell,
  Globe,
  LogOut,
  Moon,
  Shield,
  Sun,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { usePushSubscription } from "@/hooks/use-push-subscription";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface Props {
  profile: Record<string, number> | null;
  userName?: string | null;
  userImage?: string | null;
}

export function ProfileClient({ profile, userName, userImage }: Props) {
  const router = useRouter();
  const {
    state: pushState,
    subscribed,
    subscribe,
    unsubscribe,
  } = usePushSubscription();

  const sorted = profile
    ? Object.entries(profile)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : [];
  const maxWeight =
    sorted.length > 0 ? Math.max(...sorted.map(([, w]) => Math.abs(w))) : 1;

  return (
    <div className="space-y-6 px-5 pt-6 pb-32">
      {/* User identity */}
      <section className="flex flex-col items-center py-4">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-2 border-primary p-1">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName ?? "Avatar"}
                width={88}
                height={88}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-surface-container-high text-2xl">
                👤
              </div>
            )}
          </div>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-on-surface">
          {userName ?? "Utente"}
        </h2>
      </section>

      {/* Taste profile */}
      {sorted.length > 0 && (
        <TasteProfile entries={sorted} maxWeight={maxWeight} />
      )}

      {/* Refine CTA */}
      <section className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
        <h3 className="text-xl font-semibold text-primary">
          Affina i tuoi Gusti
        </h3>
        <p className="mx-auto mb-6 mt-2 max-w-md text-sm text-on-surface-variant">
          Aiutaci a suggerirti la serata perfetta confrontando nuovi locali e
          atmosfere.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-on-primary transition-transform active:scale-95"
        >
          <ArrowRightLeft className="h-4 w-4" />
          INIZIA CONFRONTI
        </Link>
      </section>

      {/* Settings */}
      <section className="space-y-2">
        <h3 className="text-sm px-1 uppercase tracking-widest text-on-surface-variant">
          Impostazioni
        </h3>
        <div className="divide-y divide-outline-variant/30 overflow-hidden rounded-xl border border-outline-variant bg-surface-container">
          <NotificationToggle
            pushState={pushState}
            subscribed={subscribed}
            onToggle={subscribed ? unsubscribe : subscribe}
          />
          <ThemeToggle />
          <SettingsRow
            icon={Shield}
            label="Privacy & Sicurezza"
            sub="Gestisci dati e visibilità"
          />
          <SettingsRow icon={Globe} label="Lingua" sub="Italiano (IT)" />
        </div>

        {/* Logout */}
        <div className="pt-4">
          <button
            type="button"
            onClick={async () => {
              await authClient.signOut();
              router.refresh();
            }}
            className="text-sm flex w-full items-center justify-center gap-2 rounded-xl border border-error/30 bg-surface-container-low p-4 text-error transition-colors hover:bg-error/10 active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            LOGOUT
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <p className="text-[12px] text-on-surface-variant">InGiro v0.1.0</p>
      </footer>
    </div>
  );
}

function NotificationToggle({
  pushState,
  subscribed,
  onToggle,
}: {
  pushState: string;
  subscribed: boolean;
  onToggle: () => void;
}) {
  const disabled = pushState === "denied" || pushState === "unsupported";

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high">
          <Bell className="h-5 w-5 text-on-surface" />
        </div>
        <div>
          <p className="text-base text-on-surface">Notifiche</p>
          <p className="text-[12px] text-on-surface-variant">
            {pushState === "denied"
              ? "Bloccate dal browser"
              : pushState === "unsupported"
                ? "Non supportate"
                : "Suggerimenti weekend"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className={cn(
          "relative h-6 w-12 rounded-full transition-colors",
          subscribed ? "bg-primary" : "bg-outline-variant",
          disabled && "opacity-40",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full transition-transform",
            subscribed ? "translate-x-6 bg-on-primary" : "bg-on-surface",
          )}
        />
      </button>
    </div>
  );
}

function TasteProfile({
  entries,
  maxWeight,
}: {
  entries: [string, number][];
  maxWeight: number;
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const handleOverride = async (
    tag: string,
    value: "boost" | "reset" | "penalize",
  ) => {
    setUpdating(true);
    await fetch("/api/preferences/override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag, action: value }),
    });
    setActiveTag(null);
    setUpdating(false);
    window.location.reload();
  };

  return (
    <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl text-primary">I tuoi Gusti</h3>
      </div>
      <div className="space-y-4">
        {entries.map(([tag, weight]) => {
          const pct = Math.round((Math.abs(weight) / maxWeight) * 100);
          return (
            <div key={tag}>
              <button
                type="button"
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className="flex w-full items-center justify-between"
              >
                <span className="text-base capitalize text-on-surface">
                  {tag}
                </span>
                <span className="text-sm text-primary">{pct}%</span>
              </button>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-container-highest">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    weight > 0 ? "bg-primary" : "bg-error",
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {activeTag === tag && (
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleOverride(tag, "boost")}
                    className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary active:scale-95"
                  >
                    Mi piace
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleOverride(tag, "reset")}
                    className="rounded-full border border-outline-variant px-3 py-1 text-xs text-on-surface-variant active:scale-95"
                  >
                    Neutro
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleOverride(tag, "penalize")}
                    className="rounded-full border border-error/40 bg-error/10 px-3 py-1 text-xs text-error active:scale-95"
                  >
                    Non mi piace
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const options = ["light", "system", "dark"] as const;

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high">
          <Sun className="h-5 w-5 text-on-surface" />
        </div>
        <div>
          <p className="text-base text-on-surface">Tema</p>
          <p className="text-[12px] text-on-surface-variant capitalize">
            {theme === "system"
              ? "Sistema"
              : theme === "dark"
                ? "Scuro"
                : "Chiaro"}
          </p>
        </div>
      </div>
      <div className="flex gap-1 rounded-full bg-surface-container-highest p-1">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setTheme(opt)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
              theme === opt && "bg-primary text-on-primary",
            )}
          >
            {opt === "light" && <Sun className="h-3.5 w-3.5" />}
            {opt === "system" && <Globe className="h-3.5 w-3.5" />}
            {opt === "dark" && <Moon className="h-3.5 w-3.5" />}
          </button>
        ))}
      </div>
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
      className="flex w-full items-center justify-between p-4 transition-colors hover:bg-surface-container-high"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high">
          <Icon className="h-5 w-5 text-on-surface" />
        </div>
        <div className="text-left">
          <p className="text-base text-on-surface">{label}</p>
          <p className="text-[12px] text-on-surface-variant">{sub}</p>
        </div>
      </div>
    </button>
  );
}

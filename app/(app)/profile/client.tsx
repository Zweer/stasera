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

  const hasProfile = profile && Object.keys(profile).length > 0;

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
      {hasProfile && <TasteProfile profile={profile} />}

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

// ─── Taste Profile Dimensions ──────────────────────────────────────────────────

const GENRES = [
  "musica",
  "teatro",
  "aperitivo",
  "mostra",
  "sport",
  "food",
  "cinema",
  "nightlife",
  "escursione",
  "altro",
];
const VIBES = [
  "tranquillo",
  "movimentato",
  "romantico",
  "sociale",
  "culturale",
  "festoso",
  "alternativo",
];
const ENERGY = ["bassa", "media", "alta"];
const INDOOR_OUTDOOR = ["indoor", "both", "outdoor"];
const DAY_MOMENT = ["mattina", "pomeriggio", "aperitivo", "sera", "notte"];

function segmentProfile(profile: Record<string, number>) {
  const genre: [string, number][] = [];
  const vibe: [string, number][] = [];
  const energy: Record<string, number> = {};
  const indoorOutdoor: Record<string, number> = {};
  const dayMoment: Record<string, number> = {};

  for (const [tag, weight] of Object.entries(profile)) {
    if (GENRES.includes(tag)) genre.push([tag, weight]);
    else if (VIBES.includes(tag)) vibe.push([tag, weight]);
    else if (ENERGY.includes(tag)) energy[tag] = weight;
    else if (INDOOR_OUTDOOR.includes(tag)) indoorOutdoor[tag] = weight;
    else if (DAY_MOMENT.includes(tag)) dayMoment[tag] = weight;
  }

  genre.sort(([, a], [, b]) => b - a);
  vibe.sort(([, a], [, b]) => b - a);

  return { genre, vibe, energy, indoorOutdoor, dayMoment };
}

function TasteProfile({ profile }: { profile: Record<string, number> }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const { genre, vibe, energy, indoorOutdoor, dayMoment } =
    segmentProfile(profile);

  const handleOverride = async (
    tag: string,
    action: "boost" | "reset" | "penalize",
  ) => {
    setUpdating(true);
    await fetch("/api/preferences/override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag, action }),
    });
    setActiveTag(null);
    setUpdating(false);
    window.location.reload();
  };

  return (
    <section className="space-y-4">
      <h3 className="text-xl text-primary">I tuoi Gusti</h3>

      {genre.length > 0 && (
        <DimensionCard title="Genere">
          <CenteredSliders
            entries={genre}
            activeTag={activeTag}
            updating={updating}
            onTagClick={setActiveTag}
            onOverride={handleOverride}
          />
        </DimensionCard>
      )}

      {vibe.length > 0 && (
        <DimensionCard title="Atmosfera">
          <CenteredSliders
            entries={vibe}
            activeTag={activeTag}
            updating={updating}
            onTagClick={setActiveTag}
            onOverride={handleOverride}
          />
        </DimensionCard>
      )}

      {Object.keys(energy).length > 0 && (
        <DimensionCard title="Energia">
          <SpectrumSlider
            labels={ENERGY}
            displayLabels={["Bassa", "Media", "Alta"]}
            weights={energy}
          />
        </DimensionCard>
      )}

      {Object.keys(indoorOutdoor).length > 0 && (
        <DimensionCard title="Location">
          <SpectrumSlider
            labels={INDOOR_OUTDOOR}
            displayLabels={["Indoor", "Mix", "Outdoor"]}
            weights={indoorOutdoor}
          />
        </DimensionCard>
      )}

      {Object.keys(dayMoment).length > 0 && (
        <DimensionCard title="Quando">
          <MomentPills
            weights={dayMoment}
            activeTag={activeTag}
            updating={updating}
            onTagClick={setActiveTag}
            onOverride={handleOverride}
          />
        </DimensionCard>
      )}
    </section>
  );
}

function DimensionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
      <p className="mb-3 text-sm font-medium uppercase tracking-wider text-on-surface-variant">
        {title}
      </p>
      {children}
    </div>
  );
}

function CenteredSliders({
  entries,
  activeTag,
  updating,
  onTagClick,
  onOverride,
}: {
  entries: [string, number][];
  activeTag: string | null;
  updating: boolean;
  onTagClick: (tag: string | null) => void;
  onOverride: (tag: string, action: "boost" | "reset" | "penalize") => void;
}) {
  return (
    <div className="space-y-4">
      {entries.map(([tag, weight]) => {
        const normalized = Math.max(-1, Math.min(1, weight));
        const position = (normalized + 1) / 2;

        return (
          <div key={tag}>
            <button
              type="button"
              onClick={() => onTagClick(activeTag === tag ? null : tag)}
              className="mb-1.5 block text-sm capitalize text-on-surface"
            >
              {tag}
            </button>
            <div className="relative h-5">
              <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-surface-container-highest" />
              <div className="absolute top-1/2 left-1/2 h-3 w-px -translate-x-1/2 -translate-y-1/2 bg-outline-variant" />
              <div
                className={cn(
                  "absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full",
                  normalized >= 0 ? "bg-primary" : "bg-error",
                )}
                style={
                  normalized >= 0
                    ? { left: "50%", width: `${normalized * 50}%` }
                    : {
                        left: `${position * 100}%`,
                        width: `${Math.abs(normalized) * 50}%`,
                      }
                }
              />
              <div
                className={cn(
                  "absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-sm transition-all",
                  normalized >= 0
                    ? "border-primary bg-primary"
                    : "border-error bg-error",
                )}
                style={{ left: `${position * 100}%` }}
              />
            </div>
            {activeTag === tag && (
              <OverrideButtons
                tag={tag}
                updating={updating}
                onOverride={onOverride}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SpectrumSlider({
  labels,
  displayLabels,
  weights,
}: {
  labels: string[];
  displayLabels: string[];
  weights: Record<string, number>;
}) {
  let totalWeight = 0;
  let weightedPos = 0;
  for (let i = 0; i < labels.length; i++) {
    const w = weights[labels[i]] ?? 0;
    if (w > 0) {
      const pos = i / (labels.length - 1);
      weightedPos += pos * w;
      totalWeight += w;
    }
  }
  const position = totalWeight > 0 ? weightedPos / totalWeight : 0.5;

  return (
    <div>
      <div className="relative h-5">
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-surface-container-highest" />
        <div
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-primary shadow-sm transition-all"
          style={{ left: `${position * 100}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between">
        {displayLabels.map((label) => (
          <span key={label} className="text-xs text-on-surface-variant">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function MomentPills({
  weights,
  activeTag,
  updating,
  onTagClick,
  onOverride,
}: {
  weights: Record<string, number>;
  activeTag: string | null;
  updating: boolean;
  onTagClick: (tag: string | null) => void;
  onOverride: (tag: string, action: "boost" | "reset" | "penalize") => void;
}) {
  const maxW = Math.max(...Object.values(weights).map(Math.abs), 0.1);
  const labels = ["Mattina", "Pome", "Aperitivo", "Sera", "Notte"];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {DAY_MOMENT.map((key, i) => {
          const w = weights[key] ?? 0;
          const intensity = Math.abs(w) / maxW;
          // Scale: 0 intensity → text-xs px-2 py-1, 1 intensity → text-sm px-4 py-2
          const isActive = w > 0;
          const isNegative = w < 0;

          return (
            <button
              key={key}
              type="button"
              onClick={() => onTagClick(activeTag === key ? null : key)}
              className={cn(
                "rounded-full font-medium transition-all active:scale-95",
                isActive
                  ? "bg-primary text-on-primary"
                  : isNegative
                    ? "border border-error/40 text-error/70"
                    : "border border-outline-variant text-on-surface-variant",
                // Size based on intensity
                isActive && intensity > 0.6
                  ? "px-4 py-2 text-sm"
                  : isActive && intensity > 0.3
                    ? "px-3 py-1.5 text-xs"
                    : "px-2.5 py-1 text-xs",
              )}
            >
              {labels[i]}
            </button>
          );
        })}
      </div>
      {activeTag && DAY_MOMENT.includes(activeTag) && (
        <OverrideButtons
          tag={activeTag}
          updating={updating}
          onOverride={onOverride}
        />
      )}
    </div>
  );
}

function OverrideButtons({
  tag,
  updating,
  onOverride,
}: {
  tag: string;
  updating: boolean;
  onOverride: (tag: string, action: "boost" | "reset" | "penalize") => void;
}) {
  return (
    <div className="mt-2 flex gap-2">
      <button
        type="button"
        disabled={updating}
        onClick={() => onOverride(tag, "boost")}
        className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs text-primary active:scale-95"
      >
        Mi piace
      </button>
      <button
        type="button"
        disabled={updating}
        onClick={() => onOverride(tag, "reset")}
        className="rounded-full border border-outline-variant px-3 py-1 text-xs text-on-surface-variant active:scale-95"
      >
        Neutro
      </button>
      <button
        type="button"
        disabled={updating}
        onClick={() => onOverride(tag, "penalize")}
        className="rounded-full border border-error/40 bg-error/10 px-3 py-1 text-xs text-error active:scale-95"
      >
        Non mi piace
      </button>
    </div>
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

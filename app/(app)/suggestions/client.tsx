"use client";

import { ArrowRightLeft, Calendar, MapPin, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { formatEventDate } from "@/lib/format-event-date";
import { cn } from "@/lib/utils";

interface Recommendation {
  id: string;
  score: number;
  reason: string;
  status: string;
  event: {
    id: string;
    name: string;
    description: string | null;
    date: string;
    time: string | null;
    locationName: string | null;
    genre: string | null;
    vibe: string | null;
    imageUrl: string | null;
  };
}

export function SuggestionsClient() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipDismissed, setTipDismissed] = useState(false);
  const [swipeHintShown, setSwipeHintShown] = useState(false);

  useEffect(() => {
    setTipDismissed(localStorage.getItem("ingiro:tip-dismissed") === "1");
    setSwipeHintShown(localStorage.getItem("ingiro:swipe-hinted") === "1");
  }, []);

  useEffect(() => {
    fetch("/api/recommendations")
      .then((r) => r.json())
      .then((data) => setRecs(data))
      .finally(() => setLoading(false));
  }, []);

  const handleFeedback = useCallback(
    async (id: string, status: "accepted" | "rejected") => {
      setRecs((prev) => prev.filter((r) => r.id !== id));
      toast(status === "accepted" ? "Ci vado! 🎉" : "Rimosso dai suggerimenti");
      if (!swipeHintShown) {
        setSwipeHintShown(true);
        localStorage.setItem("ingiro:swipe-hinted", "1");
      }
      await fetch("/api/recommendations/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    },
    [swipeHintShown],
  );

  const dismissTip = useCallback(() => {
    setTipDismissed(true);
    localStorage.setItem("ingiro:tip-dismissed", "1");
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-sm animate-pulse text-on-surface-variant">
          Caricamento...
        </p>
      </div>
    );
  }

  if (recs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="px-5 pt-6 pb-32">
      <header className="mb-4">
        <h2 className="text-2xl text-on-surface md:text-3xl">
          Suggerimenti per te
        </h2>
        <p className="text-sm mt-1 text-on-surface-variant">
          Creati su misura per il tuo weekend a Genova.
        </p>
      </header>

      {/* Educational tip */}
      {!tipDismissed && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
          <ArrowRightLeft className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="flex-1 text-sm text-on-surface-variant">
            I suggerimenti migliorano col tempo. Rifiuta quelli che non ti
            piacciono e{" "}
            <Link href="/onboarding" className="text-primary underline">
              fai altri confronti
            </Link>{" "}
            per affinare i tuoi gusti!
          </p>
          <button
            type="button"
            onClick={dismissTip}
            className="shrink-0 text-on-surface-variant hover:text-on-surface"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mx-auto flex max-w-lg flex-col gap-4">
        {recs.map((rec) => (
          <SwipeableCard
            key={rec.id}
            rec={rec}
            showHint={!swipeHintShown}
            onAccept={() => handleFeedback(rec.id, "accepted")}
            onReject={() => handleFeedback(rec.id, "rejected")}
          />
        ))}
      </div>
    </div>
  );
}

function SwipeableCard({
  rec,
  showHint,
  onAccept,
  onReject,
}: {
  rec: Recommendation;
  showHint: boolean;
  onAccept: () => void;
  onReject: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const [offset, setOffset] = useState(0);
  const [swiping, setSwiping] = useState<"left" | "right" | null>(null);
  const [exiting, setExiting] = useState<"left" | "right" | null>(null);

  const threshold = 100;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    currentX.current = e.touches[0].clientX - startX.current;
    setOffset(currentX.current);
    setSwiping(
      currentX.current > 40 ? "right" : currentX.current < -40 ? "left" : null,
    );
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    if (currentX.current > threshold) {
      setExiting("right");
      setTimeout(onAccept, 300);
    } else if (currentX.current < -threshold) {
      setExiting("left");
      setTimeout(onReject, 300);
    } else {
      setOffset(0);
      setSwiping(null);
    }
    currentX.current = 0;
  }, [onAccept, onReject]);

  const { event, reason } = rec;

  return (
    <div
      ref={cardRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={cn(
        "relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container transition-transform",
        exiting === "left" &&
          "translate-x-[-120%] opacity-0 transition-all duration-300",
        exiting === "right" &&
          "translate-x-[120%] opacity-0 transition-all duration-300",
        !exiting && "transition-none",
      )}
      style={!exiting ? { transform: `translateX(${offset}px)` } : undefined}
    >
      {/* Swipe indicator overlays */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl border-2 transition-opacity",
          swiping === "right"
            ? "border-green-500 bg-green-500/10 opacity-100"
            : "opacity-0",
        )}
      >
        <span className="text-lg font-bold text-green-500">ACCETTA ✓</span>
      </div>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl border-2 transition-opacity",
          swiping === "left"
            ? "border-red-400 bg-red-400/10 opacity-100"
            : "opacity-0",
        )}
      >
        <span className="text-lg font-bold text-red-400">RIFIUTA ✗</span>
      </div>

      {/* Swipe hint animation */}
      {showHint && (
        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center">
          <span className="animate-pulse rounded-full bg-surface-container-highest/90 px-3 py-1 text-xs text-on-surface-variant">
            ← Rifiuta · Accetta →
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.name}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-container-high">
            <Sparkles className="h-10 w-10 text-outline" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />

        {/* Tags overlay */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
          <div className="flex gap-1.5">
            {event.genre && (
              <span className="rounded-full border border-primary bg-primary/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary">
                {event.genre}
              </span>
            )}
            {event.vibe && (
              <span className="rounded-full border border-outline-variant bg-surface-container-high/80 px-2 py-0.5 text-[10px] text-on-surface-variant">
                {event.vibe}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-on-surface">{event.name}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formatEventDate(event.date)}
            {event.time && ` · ${event.time}`}
          </span>
          {event.locationName && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {event.locationName}
            </span>
          )}
        </div>

        {/* Reason */}
        {reason && (
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-primary/5 p-2.5">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <p className="text-sm italic leading-snug text-on-surface-variant">
              {reason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-12">
        <div className="flex h-48 w-48 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-low">
          <Sparkles className="h-16 w-16 text-outline opacity-40" />
        </div>
      </div>

      <h2 className="w-full text-2xl font-semibold text-on-surface">
        I tuoi 3 suggerimenti arrivano venerdì
      </h2>
      <p className="mt-3 w-full max-w-sm text-base text-on-surface-variant">
        Stiamo analizzando i nuovi eventi per preparare il tuo weekend perfetto.
      </p>

      <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
        <a
          href="/explore"
          className="flex items-center justify-center rounded-xl bg-primary px-8 py-4 text-sm font-bold text-on-primary shadow-lg transition-transform active:scale-95"
        >
          Esplora Eventi
        </a>
        <a
          href="/chat"
          className="rounded-xl border border-outline-variant px-8 py-4 text-sm text-on-surface transition-colors hover:bg-surface-container active:scale-95"
        >
          Chiedi un consiglio live
        </a>
      </div>
    </div>
  );
}

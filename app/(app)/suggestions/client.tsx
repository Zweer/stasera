"use client";

import { Check, MapPin, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

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
      await fetch("/api/recommendations/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    },
    [],
  );

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
    <div className="px-5 pt-6">
      <header className="mb-6">
        <h2 className="text-2xl text-on-surface md:text-3xl">
          Suggerimenti per te
        </h2>
        <p className="text-base mt-1 text-on-surface-variant">
          Creati su misura per il tuo weekend a Genova.
        </p>
      </header>

      <div className="mx-auto flex max-w-lg flex-col gap-6">
        {recs.map((rec) => (
          <SuggestionCard
            key={rec.id}
            rec={rec}
            onAccept={() => handleFeedback(rec.id, "accepted")}
            onReject={() => handleFeedback(rec.id, "rejected")}
          />
        ))}
      </div>
    </div>
  );
}

function SuggestionCard({
  rec,
  onAccept,
  onReject,
}: {
  rec: Recommendation;
  onAccept: () => void;
  onReject: () => void;
}) {
  const { event, reason } = rec;

  return (
    <article className="group overflow-hidden rounded-xl border border-outline-variant bg-surface-container transition-transform active:scale-[0.98]">
      {/* Image */}
      <div className="relative h-[320px] w-full overflow-hidden sm:h-[400px]">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.name}
            fill
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-container-high">
            <Sparkles className="h-12 w-12 text-outline" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />

        {/* Tags + title overlay */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-6">
          <div className="mb-2 flex gap-2">
            {event.genre && (
              <span className="text-xs rounded-full border border-primary bg-primary/20 px-3 py-1 uppercase tracking-wider text-primary">
                {event.genre}
              </span>
            )}
            {event.vibe && (
              <span className="text-xs rounded-full border border-outline-variant bg-surface-container-high/80 px-3 py-1 text-on-surface-variant">
                {event.vibe}
              </span>
            )}
          </div>
          <h3 className="text-xl text-on-surface">{event.name}</h3>
          {(event.locationName || event.time) && (
            <div className="mt-1 flex items-center gap-1 text-on-surface-variant">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">
                {[event.locationName, event.time].filter(Boolean).join(" · ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Reason + actions */}
      <div className="border-t border-outline-variant p-6">
        {reason && (
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-lg bg-primary-container/20 p-2">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm mb-1 uppercase text-primary">
                Stasera's Reason
              </p>
              <p className="text-base italic leading-relaxed text-on-surface">
                "{reason}"
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onReject}
            className="text-sm flex items-center justify-center gap-2 rounded-xl border border-outline-variant px-6 py-4 text-on-surface-variant transition-all hover:bg-surface-container-high active:scale-95"
          >
            <X className="h-4 w-4" />
            RIFIUTA
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="text-sm flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-on-primary shadow-lg shadow-primary/10 transition-all hover:brightness-110 active:scale-95"
          >
            <Check className="h-4 w-4" />
            ACCETTA
          </button>
        </div>
      </div>
    </article>
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

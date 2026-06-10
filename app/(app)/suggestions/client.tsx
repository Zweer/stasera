"use client";

import { Check, MapPin, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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

  useEffect(() => {
    fetch("/api/recommendations")
      .then((r) => r.json())
      .then((data) => setRecs(data))
      .finally(() => setLoading(false));
  }, []);

  const handleFeedback = useCallback(
    async (id: string, status: "accepted" | "rejected") => {
      setRecs((prev) => prev.filter((r) => r.id !== id));
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
        <p className="text-label-md animate-pulse text-on-surface-variant">
          Caricamento...
        </p>
      </div>
    );
  }

  if (recs.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="px-container-margin pt-lg">
      <header className="mb-lg">
        <h2 className="text-headline-lg-mobile text-on-surface md:text-headline-lg">
          Suggerimenti per te
        </h2>
        <p className="text-body-md mt-1 text-on-surface-variant">
          Creati su misura per il tuo weekend a Genova.
        </p>
      </header>

      <div className="mx-auto flex max-w-lg flex-col gap-lg">
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
          <img
            src={event.imageUrl}
            alt={event.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-container-high">
            <Sparkles className="h-12 w-12 text-outline" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />

        {/* Tags + title overlay */}
        <div className="absolute inset-x-0 bottom-0 px-md pb-6">
          <div className="mb-sm flex gap-2">
            {event.genre && (
              <span className="text-label-sm rounded-full border border-primary bg-primary/20 px-3 py-1 uppercase tracking-wider text-primary">
                {event.genre}
              </span>
            )}
            {event.vibe && (
              <span className="text-label-sm rounded-full border border-outline-variant bg-surface-container-high/80 px-3 py-1 text-on-surface-variant">
                {event.vibe}
              </span>
            )}
          </div>
          <h3 className="text-headline-md text-on-surface">{event.name}</h3>
          {(event.locationName || event.time) && (
            <div className="mt-1 flex items-center gap-1 text-on-surface-variant">
              <MapPin className="h-4 w-4" />
              <span className="text-label-md">
                {[event.locationName, event.time].filter(Boolean).join(" · ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Reason + actions */}
      <div className="border-t border-outline-variant p-lg">
        {reason && (
          <div className="mb-lg flex items-start gap-md">
            <div className="rounded-lg bg-primary-container/20 p-2">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-label-md mb-1 uppercase text-primary">
                Stasera's Reason
              </p>
              <p className="text-body-md italic leading-relaxed text-on-surface">
                "{reason}"
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-md">
          <button
            type="button"
            onClick={onReject}
            className="text-label-md flex items-center justify-center gap-2 rounded-xl border border-outline-variant px-6 py-4 text-on-surface-variant transition-all hover:bg-surface-container-high active:scale-95"
          >
            <X className="h-4 w-4" />
            RIFIUTA
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="text-label-md flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-on-primary shadow-lg shadow-primary/10 transition-all hover:brightness-110 active:scale-95"
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
    <div className="flex min-h-[70dvh] flex-col items-center justify-center px-container-margin text-center">
      <div className="relative mb-xl">
        <div className="flex h-48 w-48 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-low">
          <Sparkles className="h-16 w-16 text-outline opacity-40" />
        </div>
        <div className="absolute -top-4 -right-4 h-24 w-24 animate-pulse rounded-full bg-primary/10 blur-3xl" />
      </div>

      <h2 className="text-headline-lg-mobile text-on-surface">
        I tuoi 3 suggerimenti arrivano venerdì
      </h2>
      <p className="text-body-md mt-md max-w-sm text-on-surface-variant">
        Stiamo analizzando i nuovi eventi per preparare il tuo weekend perfetto.
      </p>

      <div className="mt-xl flex flex-col gap-md">
        <a
          href="/explore"
          className="text-label-md flex items-center justify-center gap-md rounded-xl bg-primary px-8 py-4 font-bold text-on-primary shadow-lg transition-transform active:scale-95"
        >
          Esplora Eventi
        </a>
        <a
          href="/chat"
          className="text-label-md rounded-xl border border-outline-variant px-8 py-4 text-on-surface transition-colors hover:bg-surface-container active:scale-95"
        >
          Chiedi un consiglio live
        </a>
      </div>
    </div>
  );
}

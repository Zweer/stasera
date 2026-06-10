"use client";

import { Camera, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const FILTERS = [
  "Tutti",
  "Musica",
  "Aperitivo",
  "Nightlife",
  "Teatro",
  "Food",
] as const;

interface Event {
  id: string;
  name: string;
  locationName: string | null;
  genre: string | null;
  vibe: string | null;
  imageUrl: string | null;
  date: string;
  time: string | null;
}

export function ExploreClient() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("Tutti");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => setEvents(data.events ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    if (
      activeFilter !== "Tutti" &&
      e.genre?.toLowerCase() !== activeFilter.toLowerCase()
    ) {
      return false;
    }
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="px-5 pt-6 pb-32">
      {/* Search */}
      <div className="group relative mb-6">
        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cerca eventi o locali a Genova..."
          className="text-base w-full rounded-xl border border-outline-variant bg-surface-container py-4 pr-4 pl-12 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Filter chips */}
      <div className="mb-12 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFilter(f)}
            className={cn(
              "text-sm shrink-0 rounded-full border px-4 py-2 transition-colors",
              activeFilter === f
                ? "border-primary bg-primary/10 text-primary"
                : "border-outline-variant text-on-surface-variant hover:bg-surface-container-high",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Event list */}
      <h2 className="text-xl mb-4">Eventi in arrivo</h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-xl bg-surface-container"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-base py-12 text-center text-on-surface-variant">
          Nessun evento trovato.
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* FAB Upload */}
      <Link
        href="/upload"
        className="text-sm fixed right-container-margin bottom-24 z-50 flex items-center gap-2 rounded-full bg-primary-container px-6 py-3 text-on-primary-container shadow-lg transition-transform active:scale-90"
      >
        <Camera className="h-5 w-5" />
        Carica
      </Link>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  return (
    <article className="group flex h-36 cursor-pointer overflow-hidden rounded-xl border border-outline-variant bg-surface-container transition-transform active:scale-[0.98]">
      <div className="relative h-full w-1/3 overflow-hidden bg-surface-container-high">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.name}
            fill
            unoptimized
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-container-highest/50">
            <span className="text-2xl text-outline">🎵</span>
          </div>
        )}
      </div>
      <div className="flex w-2/3 flex-col justify-between p-4">
        <div>
          <h3 className="text-lg line-clamp-1 font-semibold text-on-surface transition-colors group-hover:text-primary">
            {event.name}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-on-surface-variant">
            <MapPin className="h-3.5 w-3.5" />
            <p className="text-sm">
              {[event.locationName, event.time].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {event.genre && (
            <span className="rounded border border-tertiary/30 bg-tertiary/10 px-2 py-0.5 text-[10px] uppercase text-tertiary">
              {event.genre}
            </span>
          )}
          {event.vibe && (
            <span className="rounded border border-outline-variant px-2 py-0.5 text-[10px] uppercase text-on-surface-variant">
              {event.vibe}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

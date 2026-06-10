"use client";

import { Camera, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const FILTERS = ["Oggi", "Weekend", "Musica", "Aperitivo", "Cocktail"] as const;

const MOCK_EVENTS = [
  {
    id: "1",
    name: "Jazz in Boccadasse",
    location: "La Perla del Borgo",
    genre: "Jazz",
    vibe: "Cocktail bar",
    imageUrl: null,
    live: true,
  },
  {
    id: "2",
    name: "Underground Techno Night",
    location: "Magazzini del Cotone",
    genre: "Clubbing",
    vibe: "Urban",
    imageUrl: null,
    live: false,
  },
  {
    id: "3",
    name: "Degustazione Vini Liguri",
    location: "Enoteca del Centro",
    genre: "Wine",
    vibe: "Slow",
    imageUrl: null,
    live: false,
  },
  {
    id: "4",
    name: "Aperitivo al Porto",
    location: "Nassa Rooftop",
    genre: "Sunset",
    vibe: "Lounge",
    imageUrl: null,
    live: false,
    isNew: true,
  },
] as const;

export function ExploreClient() {
  const [activeFilter, setActiveFilter] = useState<string>("Oggi");

  return (
    <div className="px-container-margin pt-lg pb-32">
      {/* Search */}
      <div className="group relative mb-lg">
        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary" />
        <input
          type="text"
          placeholder="Cerca eventi o locali a Genova..."
          className="text-body-md w-full rounded-xl border border-outline-variant bg-surface-container py-4 pr-4 pl-12 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Filter chips */}
      <div className="mb-xl flex gap-sm overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFilter(f)}
            className={cn(
              "text-label-md shrink-0 rounded-full border px-md py-2 transition-colors",
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
      <h2 className="text-headline-md mb-md">Consigliati per stasera</h2>
      <div className="space-y-md">
        {MOCK_EVENTS.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* FAB Upload */}
      <Link
        href="/upload"
        className="text-label-md fixed right-container-margin bottom-24 z-50 flex items-center gap-2 rounded-full bg-primary-container px-6 py-3 text-on-primary-container shadow-lg transition-transform active:scale-90"
      >
        <Camera className="h-5 w-5" />
        Carica
      </Link>
    </div>
  );
}

function EventCard({
  event,
}: {
  event: (typeof MOCK_EVENTS)[number];
}) {
  return (
    <article className="group flex h-36 cursor-pointer overflow-hidden rounded-xl border border-outline-variant bg-surface-container transition-transform active:scale-[0.98]">
      {/* Image placeholder */}
      <div className="relative h-full w-1/3 overflow-hidden bg-surface-container-high">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-container-highest/50">
            <span className="text-2xl text-outline">🎵</span>
          </div>
        )}
        {/* Badges */}
        {"live" in event && event.live && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-surface/80 px-2 py-0.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tertiary" />
            <span className="text-label-sm uppercase tracking-wider text-on-surface">
              LIVE
            </span>
          </div>
        )}
        {"isNew" in event && event.isNew && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-surface/80 px-2 py-0.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-container" />
            <span className="text-label-sm uppercase tracking-wider text-on-surface">
              NEW
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex w-2/3 flex-col justify-between p-md">
        <div>
          <h3 className="text-body-lg line-clamp-1 font-semibold text-on-surface transition-colors group-hover:text-primary">
            {event.name}
          </h3>
          <div className="mt-1 flex items-center gap-1 text-on-surface-variant">
            <MapPin className="h-3.5 w-3.5" />
            <p className="text-label-md">{event.location}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <span className="rounded border border-tertiary/30 bg-tertiary/10 px-2 py-0.5 text-[10px] uppercase text-tertiary">
            {event.genre}
          </span>
          <span className="rounded border border-outline-variant px-2 py-0.5 text-[10px] uppercase text-on-surface-variant">
            {event.vibe}
          </span>
        </div>
      </div>
    </article>
  );
}

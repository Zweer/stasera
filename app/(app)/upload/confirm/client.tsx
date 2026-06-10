"use client";

import { Send, Sparkles, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
] as const;

const VIBES = [
  "tranquillo",
  "movimentato",
  "romantico",
  "sociale",
  "culturale",
  "festoso",
  "alternativo",
] as const;

interface ExtractedData {
  rawText: string;
  event: {
    name: string;
    description: string;
    date: string;
    time: string | null;
    locationName: string | null;
    genre: string | null;
    vibe: string | null;
    energyLevel: string | null;
    indoorOutdoor: string | null;
    priceRange: string | null;
    duration: string | null;
    dayMoment: string | null;
  } | null;
}

export function ConfirmClient() {
  const router = useRouter();
  const [data, setData] = useState<ExtractedData | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    locationName: "",
    genre: "",
    vibe: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("extractedEvent");
    if (!stored) {
      router.replace("/upload");
      return;
    }
    const parsed = JSON.parse(stored) as ExtractedData;
    setData(parsed);
    if (parsed.event) {
      setForm({
        name: parsed.event.name,
        description: parsed.event.description,
        date: parsed.event.date,
        time: parsed.event.time ?? "",
        locationName: parsed.event.locationName ?? "",
        genre: parsed.event.genre ?? "",
        vibe: parsed.event.vibe ?? "",
      });
    }
  }, [router]);

  const handleConfirm = async () => {
    if (!data?.event) return;
    setSaving(true);

    const payload = {
      ...data.event,
      ...form,
      time: form.time || null,
      locationName: form.locationName || null,
      genre: form.genre || null,
      vibe: form.vibe || null,
    };

    const res = await fetch("/api/events/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      sessionStorage.removeItem("extractedEvent");
      router.push("/explore");
    }
    setSaving(false);
  };

  if (!data) return null;

  return (
    <div className="space-y-lg px-container-margin pt-lg pb-32">
      {/* Header */}
      <section className="space-y-sm">
        <h1 className="text-headline-lg-mobile text-on-surface">
          Verifica i dati
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Controlla che i dati estratti siano corretti.
        </p>
      </section>

      {/* Form */}
      <section className="space-y-md rounded-xl border border-outline-variant bg-surface-container-low p-lg">
        {/* Name */}
        <Field label="Nome Evento">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="text-body-lg w-full rounded-lg border border-outline-variant bg-surface-container-low px-md py-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </Field>

        {/* Date + Time */}
        <div className="grid grid-cols-2 gap-md">
          <Field label="Data">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-md py-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </Field>
          <Field label="Ora">
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-md py-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </Field>
        </div>

        {/* Location */}
        <Field label="Luogo">
          <input
            type="text"
            value={form.locationName}
            onChange={(e) => setForm({ ...form, locationName: e.target.value })}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-md py-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </Field>

        {/* Genre chips */}
        <Field label="Genere">
          <div className="flex flex-wrap gap-sm">
            {GENRES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() =>
                  setForm({ ...form, genre: form.genre === g ? "" : g })
                }
                className={cn(
                  "text-label-sm rounded-full border px-md py-sm capitalize transition-colors",
                  form.genre === g
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary",
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </Field>

        {/* Vibe chips */}
        <Field label="Vibe">
          <div className="flex flex-wrap gap-sm">
            {VIBES.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() =>
                  setForm({ ...form, vibe: form.vibe === v ? "" : v })
                }
                className={cn(
                  "text-label-sm rounded-full border px-md py-sm capitalize transition-colors",
                  form.vibe === v
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </Field>
      </section>

      {/* Raw text preview */}
      {data.rawText && (
        <section className="rounded-xl border border-secondary-container/40 bg-secondary-container/10 p-md">
          <div className="mb-2 flex items-start gap-md">
            <Sparkles className="h-5 w-5 shrink-0 text-secondary" />
            <div>
              <h4 className="text-label-md text-on-secondary-container">
                Testo estratto dall'immagine
              </h4>
              <p className="mt-1 text-[13px] leading-relaxed text-on-surface-variant whitespace-pre-wrap">
                {data.rawText}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Actions */}
      <section className="flex flex-col gap-md">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={saving || !form.name || !form.date}
          className="text-headline-md flex h-14 w-full items-center justify-center gap-md rounded-xl bg-primary text-on-primary shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          Conferma e Pubblica
          <Send className="h-5 w-5" />
        </button>
        <div className="flex items-center justify-center gap-md">
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("extractedEvent");
              router.push("/upload");
            }}
            className="text-label-md flex items-center gap-1 text-on-surface-variant transition-colors hover:text-primary"
          >
            <Trash2 className="h-4 w-4" />
            Elimina
          </button>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <span className="text-label-md text-outline">{label}</span>
      {children}
    </div>
  );
}

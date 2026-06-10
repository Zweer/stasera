"use client";

import { Camera, ImageIcon, Lightbulb, Zap } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function UploadClient() {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/events/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        // Store extracted data and navigate to confirm
        sessionStorage.setItem("extractedEvent", JSON.stringify(data));
        window.location.href = "/upload/confirm";
      }
    } finally {
      setUploading(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith("image/")) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div className="space-y-6 px-5 pt-6 pb-32">
      {/* Header */}
      <section className="space-y-2">
        <h1 className="text-2xl text-on-surface">Carica Evento</h1>
        <p className="text-base text-on-surface-variant">
          Hai visto un evento su Instagram? Carica lo screen e lo aggiungiamo
          per te.
        </p>
      </section>

      {/* Upload area */}
      <section>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "flex aspect-[4/3] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed bg-surface-container-low p-6 transition-all duration-300 md:aspect-[21/9]",
            dragOver
              ? "border-primary bg-surface-container shadow-[0_0_0_2px_var(--primary)]"
              : "border-outline-variant hover:border-primary hover:bg-surface-container",
          )}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high transition-transform group-hover:scale-110">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <span className="text-xl text-center text-on-surface">
            Trascina qui lo screenshot
          </span>
          <span className="text-sm mt-1 text-on-surface-variant">
            o scatta una foto
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </section>

      {/* Processing state */}
      {uploading && (
        <section className="rounded-xl border border-outline-variant bg-surface-container-high p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-primary">
                Estraendo dettagli dall'immagine...
              </span>
            </div>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-lowest">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
          </div>
        </section>
      )}

      {/* Empty state */}
      {!uploading && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-on-surface">Upload Recenti</h2>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-outline-variant/30 bg-surface-container-lowest py-12 text-center">
            <ImageIcon className="mb-4 h-12 w-12 opacity-20 text-on-surface-variant" />
            <p className="text-base italic text-on-surface-variant">
              Ancora nessun caricamento. Inizia a mappare la notte di Genova.
            </p>
          </div>
        </section>
      )}

      {/* Tips */}
      <section className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
        <div className="flex items-start gap-4 rounded-xl border border-outline-variant bg-surface-container p-4">
          <Lightbulb className="h-5 w-5 shrink-0 text-tertiary" />
          <div className="space-y-1">
            <h3 className="text-sm text-on-surface">Tips per l'upload</h3>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              Assicurati che la data e il luogo siano visibili nello screenshot.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 rounded-xl border border-outline-variant bg-surface-container p-4">
          <Zap className="h-5 w-5 shrink-0 text-primary" />
          <div className="space-y-1">
            <h3 className="text-sm text-on-surface">IA Potenziata</h3>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              Il sistema riconosce i font e i loghi dei club più popolari di
              Genova.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

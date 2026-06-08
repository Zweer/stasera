"use client";

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
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetch("/api/recommendations")
      .then((r) => r.json())
      .then((data) => setRecs(data))
      .finally(() => setLoading(false));
  }, []);

  const handleFeedback = useCallback(
    async (id: string, status: "accepted" | "rejected") => {
      await fetch("/api/recommendations/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setRecs((prev) => prev.filter((r) => r.id !== id));
    },
    [],
  );

  const handleChat = useCallback(async () => {
    if (!chatInput.trim()) return;
    setChatLoading(true);
    setChatResponse("");

    const res = await fetch("/api/recommendations/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: chatInput }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    if (reader) {
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value);
        setChatResponse(text);
      }
    }
    setChatLoading(false);
    setChatInput("");
  }, [chatInput]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Caricamento...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col gap-4 p-4 pb-32">
      <h1 className="text-2xl font-bold">Stasera 🎉</h1>

      {recs.length === 0 && !chatResponse && (
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-lg">
            Nessun suggerimento per ora
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Torna venerdì o chiedimi cosa ti va!
          </p>
        </div>
      )}

      {recs.map((rec) => (
        <div key={rec.id} className="rounded-xl border p-4">
          <h3 className="text-lg font-semibold">{rec.event.name}</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {rec.event.date
              ? new Date(rec.event.date).toLocaleDateString("it-IT", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })
              : ""}
            {rec.event.time && ` · ${rec.event.time}`}
            {rec.event.locationName && ` · ${rec.event.locationName}`}
          </p>
          <div className="mt-2 flex gap-1">
            {[rec.event.genre, rec.event.vibe].filter(Boolean).map((tag) => (
              <span
                key={tag}
                className="bg-muted rounded-full px-2 py-0.5 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          {rec.reason && (
            <p className="bg-muted/50 mt-3 rounded-lg p-2 text-sm italic">
              {rec.reason}
            </p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => handleFeedback(rec.id, "accepted")}
              className="bg-primary text-primary-foreground rounded-full px-4 py-1.5 text-sm"
            >
              ✓ Ci vado
            </button>
            <button
              type="button"
              onClick={() => handleFeedback(rec.id, "rejected")}
              className="text-muted-foreground rounded-full border px-4 py-1.5 text-sm"
            >
              ✗ Stasera no
            </button>
          </div>
        </div>
      ))}

      {chatResponse && (
        <div className="bg-muted/30 mt-4 rounded-xl border p-4">
          <p className="whitespace-pre-wrap text-sm">{chatResponse}</p>
        </div>
      )}

      {/* Chat input */}
      <div className="fixed inset-x-0 bottom-0 border-t bg-background p-4">
        <div className="mx-auto flex max-w-md gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleChat()}
            placeholder="Stasera ho voglia di..."
            className="flex-1 rounded-full border px-4 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleChat}
            disabled={chatLoading}
            className={cn(
              "bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm",
              chatLoading && "opacity-50",
            )}
          >
            {chatLoading ? "..." : "→"}
          </button>
        </div>
      </div>
    </div>
  );
}

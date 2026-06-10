"use client";

import { Check } from "lucide-react";
import { useCallback, useState } from "react";
import type {
  ComparisonOption,
  ComparisonPair,
  Reason,
} from "@/lib/preferences";
import { cn } from "@/lib/utils";

interface QuizProps {
  pairs: ComparisonPair[];
  onComplete: () => void;
}

export function PreferenceQuiz({ pairs, onComplete }: QuizProps) {
  const [round, setRound] = useState(0);
  const [chosen, setChosen] = useState<"a" | "b" | null>(null);
  const [reasons, setReasons] = useState<Reason[] | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentPair = pairs[round];
  const total = pairs.length;
  const progress = ((round + (chosen ? 0.5 : 0)) / total) * 100;

  const handleChoice = useCallback(
    async (choice: "a" | "b") => {
      setChosen(choice);
      setLoading(true);
      setSelectedReason(null);

      const selected =
        choice === "a" ? currentPair.optionA : currentPair.optionB;
      const other = choice === "a" ? currentPair.optionB : currentPair.optionA;

      const data = encodeURIComponent(
        JSON.stringify({ chosen: selected, other }),
      );
      const res = await fetch(`/api/preferences/compare?data=${data}`);
      const reasonsList: Reason[] = await res.json();
      setReasons(reasonsList);
      setLoading(false);
    },
    [currentPair],
  );

  const handleReason = useCallback(
    async (reason: Reason) => {
      setSelectedReason(reason.tag);
      const choice = chosen ?? "a";
      await fetch("/api/preferences/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          optionA: currentPair.optionA,
          optionB: currentPair.optionB,
          chosen: choice,
          reason,
        }),
      });

      setTimeout(() => {
        setChosen(null);
        setReasons(null);
        setSelectedReason(null);
        if (round + 1 >= total) {
          onComplete();
        } else {
          setRound((r) => r + 1);
        }
      }, 300);
    },
    [chosen, currentPair, round, total, onComplete],
  );

  if (!currentPair) return null;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Progress header */}
      <header className="fixed top-0 left-0 z-50 flex h-16 w-full flex-col justify-center border-b border-outline-variant/30 bg-background/80 px-5 backdrop-blur-md">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-primary">
            Step {round + 1} di {total}
          </span>
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/preferences/skip", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  optionA: currentPair.optionA,
                  optionB: currentPair.optionB,
                }),
              });
              if (round + 1 >= total) onComplete();
              else {
                setRound((r) => r + 1);
                setChosen(null);
                setReasons(null);
              }
            }}
            className="text-sm text-on-surface-variant transition-colors hover:text-primary"
          >
            Salta
          </button>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pt-24 pb-32">
        {/* Headline */}
        <section className="mb-6">
          <h1 className="text-2xl text-on-surface">Cosa ti ispira di più?</h1>
          <p className="text-base mt-1 text-on-surface-variant">
            Scegli l'atmosfera perfetta per la tua serata.
          </p>
        </section>

        {/* Comparison cards */}
        <section key={round} className="mb-8 flex flex-col gap-4">
          <ComparisonCard
            option={currentPair.optionA}
            selected={chosen === "a"}
            dimmed={chosen === "b"}
            onSelect={() => !chosen && handleChoice("a")}
          />
          <p className="text-center text-sm text-on-surface-variant">oppure</p>
          <ComparisonCard
            option={currentPair.optionB}
            selected={chosen === "b"}
            dimmed={chosen === "a"}
            onSelect={() => !chosen && handleChoice("b")}
          />
        </section>

        {/* Motivation chips */}
        <section
          className={cn(
            "transition-opacity duration-500",
            chosen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <h2 className="text-xl mb-4 text-on-surface">Perché?</h2>
          {loading ? (
            <p className="text-sm animate-pulse text-on-surface-variant">
              Analizzo la scelta...
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {reasons?.map((r) => (
                <button
                  key={r.tag}
                  type="button"
                  onClick={() => handleReason(r)}
                  className={cn(
                    "text-sm flex items-center gap-1 rounded-full border px-4 py-2 transition-all active:scale-95",
                    selectedReason === r.tag
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-outline-variant bg-surface text-on-surface-variant hover:border-primary hover:text-primary",
                  )}
                >
                  {r.text}
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function ComparisonCard({
  option,
  selected,
  dimmed,
  onSelect,
}: {
  option: ComparisonOption;
  selected: boolean;
  dimmed: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative w-full rounded-xl border p-5 text-left transition-all duration-300 active:scale-[0.98]",
        selected
          ? "border-primary ring-2 ring-primary shadow-[0_0_20px_rgba(255,185,95,0.2)]"
          : "border-outline-variant bg-surface-container",
        dimmed && !selected && "opacity-40",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {option.tags[0] ?? ""}
          </span>
          <h3 className="mt-1 text-lg font-semibold leading-tight text-on-surface">
            {option.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            {option.description}
          </p>
          {option.tags.length > 1 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {option.tags.slice(1).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-outline-variant px-2 py-0.5 text-xs text-on-surface-variant"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {selected && (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>
    </button>
  );
}

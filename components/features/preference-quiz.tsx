"use client";

import { ArrowRight, Check } from "lucide-react";
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
      <header className="fixed top-0 left-0 z-50 flex h-16 w-full flex-col justify-center border-b border-outline-variant/30 bg-background/80 px-container-margin backdrop-blur-md">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-label-md text-primary">
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
            className="text-label-md text-on-surface-variant transition-colors hover:text-primary"
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

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-container-margin pt-24 pb-32">
        {/* Headline */}
        <section className="mb-lg">
          <h1 className="text-headline-lg-mobile text-on-surface">
            Cosa ti ispira di più?
          </h1>
          <p className="text-body-md mt-1 text-on-surface-variant">
            Scegli l'atmosfera perfetta per la tua serata.
          </p>
        </section>

        {/* Comparison cards */}
        <section key={round} className="mb-xl grid grid-cols-2 gap-md">
          <ComparisonCard
            option={currentPair.optionA}
            selected={chosen === "a"}
            dimmed={chosen === "b"}
            onSelect={() => !chosen && handleChoice("a")}
          />
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
          <h2 className="text-headline-md mb-md text-on-surface">Perché?</h2>
          {loading ? (
            <p className="text-label-md animate-pulse text-on-surface-variant">
              Analizzo la scelta...
            </p>
          ) : (
            <div className="flex flex-wrap gap-sm">
              {reasons?.map((r) => (
                <button
                  key={r.tag}
                  type="button"
                  onClick={() => handleReason(r)}
                  className={cn(
                    "text-label-md flex items-center gap-1 rounded-full border px-md py-sm transition-all active:scale-95",
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
        "group relative flex aspect-[3/5] flex-col items-stretch overflow-hidden rounded-xl border text-left transition-all duration-300 active:scale-95",
        selected
          ? "ring-2 ring-primary border-primary shadow-[0_0_20px_rgba(255,185,95,0.2)]"
          : "border-outline-variant",
        dimmed && !selected && "opacity-40",
      )}
    >
      {/* Background gradient placeholder */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-container-high to-surface-container" />

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col justify-end p-md">
        <span className="text-label-sm mb-1 uppercase tracking-wider text-primary">
          {option.tags[0] ?? ""}
        </span>
        <h3 className="text-headline-md leading-tight text-on-surface">
          {option.title}
        </h3>
        <p className="text-label-sm mt-1 line-clamp-2 text-on-surface-variant">
          {option.description}
        </p>
      </div>

      {/* Check badge */}
      {selected && (
        <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary">
          <Check className="h-4 w-4" />
        </div>
      )}
    </button>
  );
}

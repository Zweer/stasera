"use client";

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
  const [loading, setLoading] = useState(false);

  const currentPair = pairs[round];
  const total = pairs.length;

  const handleChoice = useCallback(
    async (choice: "a" | "b") => {
      setChosen(choice);
      setLoading(true);

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

      // Next round
      setChosen(null);
      setReasons(null);
      if (round + 1 >= total) {
        onComplete();
      } else {
        setRound((r) => r + 1);
      }
    },
    [chosen, currentPair, round, total, onComplete],
  );

  if (!currentPair) return null;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-4">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {pairs.map((pair, i) => (
          <div
            key={pair.optionA.id}
            className={cn(
              "h-2 w-2 rounded-full",
              i < round
                ? "bg-primary"
                : i === round
                  ? "bg-primary/60"
                  : "bg-muted",
            )}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-sm">
        {round + 1} di {total}
      </p>

      {/* Cards */}
      <div className="flex w-full max-w-md flex-col gap-4">
        <OptionCard
          option={currentPair.optionA}
          selected={chosen === "a"}
          disabled={chosen !== null}
          onClick={() => handleChoice("a")}
        />
        <div className="text-muted-foreground text-center text-sm font-medium">
          oppure
        </div>
        <OptionCard
          option={currentPair.optionB}
          selected={chosen === "b"}
          disabled={chosen !== null}
          onClick={() => handleChoice("b")}
        />
      </div>

      {/* Skip */}
      {!chosen && (
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
            if (round + 1 >= total) {
              onComplete();
            } else {
              setRound((r) => r + 1);
            }
          }}
          className="text-muted-foreground cursor-pointer text-sm underline underline-offset-4"
        >
          Nessuno dei due
        </button>
      )}

      {/* Reasons */}
      {loading && (
        <p className="text-muted-foreground text-sm animate-pulse">
          Analizzo la scelta...
        </p>
      )}
      {reasons && (
        <div className="flex flex-wrap justify-center gap-2">
          <p className="text-muted-foreground mb-1 w-full text-center text-sm">
            Perché?
          </p>
          {reasons.map((r) => (
            <button
              type="button"
              key={r.tag}
              onClick={() => handleReason(r)}
              className="bg-secondary hover:bg-secondary/80 rounded-full px-4 py-2 text-sm transition-colors"
            >
              {r.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function OptionCard({
  option,
  selected,
  disabled,
  onClick,
}: {
  option: ComparisonOption;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !selected}
      className={cn(
        "rounded-xl border p-5 text-left transition-all",
        selected && "ring-primary scale-[1.02] border-transparent ring-2",
        !selected && disabled && "opacity-40",
        !disabled && "hover:border-primary/50 cursor-pointer",
      )}
    >
      <h3 className="text-lg font-semibold">{option.title}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{option.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {option.tags.map((tag) => (
          <span key={tag} className="bg-muted rounded-full px-2 py-0.5 text-xs">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

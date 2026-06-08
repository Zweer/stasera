"use client";

import { useRouter } from "next/navigation";
import { PreferenceQuiz } from "@/components/features/preference-quiz";
import type { ComparisonPair } from "@/lib/preferences";

interface Props {
  pairs: ComparisonPair[];
}

export function OnboardingClient({ pairs }: Props) {
  const router = useRouter();

  return (
    <PreferenceQuiz pairs={pairs} onComplete={() => router.push("/profile")} />
  );
}

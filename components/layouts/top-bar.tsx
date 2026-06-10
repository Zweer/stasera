"use client";

import { Bell, Moon } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-outline-variant bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-5">
        <Link href="/suggestions" className="flex items-center gap-2">
          <Moon className="h-6 w-6 fill-primary text-primary" />
          <span className="font-display text-2xl font-bold tracking-tighter text-primary">
            Stasera
          </span>
        </Link>
        <Link
          href="/profile"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container-high active:scale-95"
          aria-label="Profilo"
        >
          <Bell className="h-5 w-5 text-on-surface-variant" />
        </Link>
      </div>
    </header>
  );
}

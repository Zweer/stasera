"use client";

import { Bell, Moon } from "lucide-react";

export function TopBar() {
  return (
    <header className="bg-background/80 fixed top-0 left-0 z-50 w-full border-b border-outline-variant backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <Moon className="h-6 w-6 fill-primary text-primary" />
          <span className="font-display text-2xl font-bold tracking-tighter text-primary">
            Stasera
          </span>
        </div>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container-high active:scale-95"
        >
          <Bell className="h-5 w-5 text-on-surface-variant" />
        </button>
      </div>
    </header>
  );
}

"use client";

import { Compass, MessageCircle, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/suggestions", label: "Suggerimenti", icon: Sparkles },
  { href: "/explore", label: "Esplora", icon: Compass },
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/profile", label: "Profilo", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-outline-variant bg-surface/80 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center transition-transform duration-150 active:scale-90",
              active ? "text-primary" : "text-on-surface-variant",
            )}
          >
            <Icon
              className={cn("h-6 w-6", active && "fill-primary/20")}
              strokeWidth={active ? 2.5 : 1.5}
            />
            <span className="text-label-sm mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

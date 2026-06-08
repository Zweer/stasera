"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/suggestions", label: "Stasera", icon: "🎉" },
  { href: "/profile", label: "Profilo", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-background fixed inset-x-0 bottom-0 z-50 border-t">
      <div className="mx-auto flex max-w-md justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-4 py-1 text-xs transition-colors",
              pathname === item.href ? "text-primary" : "text-muted-foreground",
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

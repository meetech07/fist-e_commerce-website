"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Boxes } from "lucide-react";
import { useBusinessSettings } from "@/lib/business-store";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { settings } = useBusinessSettings();
  const parts = settings.companyName.trim().split(/\s+/);
  const first = parts[0] ?? "DIA";
  const rest = parts.slice(1).join(" ");

  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)} aria-label={`${settings.companyName} Home`}>
      <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl gold-gradient shadow-lg shadow-accent/30 transition-transform duration-500 group-hover:rotate-6">
        {settings.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings.logo} alt="" className="h-full w-full object-contain p-1" />
        ) : (
          <Boxes className="h-5 w-5 text-charcoal" />
        )}
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-bold tracking-tight">
            {first}
            {rest && <span className="gold-text"> {rest}</span>}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {settings.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}

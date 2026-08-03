import * as React from "react";
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  size = "sm",
  className,
  showValue = false,
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showValue?: boolean;
}) {
  const sizes = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <Star key={i} className={cn(sizes[size], "fill-accent text-accent")} />;
        if (i === full && half)
          return (
            <span key={i} className="relative inline-flex">
              <Star className={cn(sizes[size], "text-muted-foreground/40")} />
              <StarHalf className={cn(sizes[size], "absolute inset-0 fill-accent text-accent")} />
            </span>
          );
        return <Star key={i} className={cn(sizes[size], "text-muted-foreground/40")} />;
      })}
      {showValue && <span className="ml-1 text-xs font-semibold text-foreground">{value.toFixed(1)}</span>}
    </span>
  );
}

"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checkbox({ checked, onCheckedChange, className, id, label }: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  className?: string;
  id?: string;
  label?: string;
}) {
  return (
    <label htmlFor={id} className={cn("flex cursor-pointer items-center gap-2.5 text-sm", className)}>
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all",
          checked ? "border-accent bg-accent text-accent-foreground" : "border-input bg-background hover:border-accent",
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" />}
      </button>
      {label && <span>{label}</span>}
    </label>
  );
}

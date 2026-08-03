"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Slider({
  min,
  max,
  step = 1,
  value,
  onValueChange,
  className,
}: {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onValueChange: (v: [number, number]) => void;
  className?: string;
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [minVal, maxVal] = value;

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const handleDrag = (e: React.PointerEvent, which: "min" | "max") => {
    e.preventDefault();
    const onMove = (ev: PointerEvent) => {
      const rect = trackRef.current!.getBoundingClientRect();
      const ratio = Math.min(Math.max((ev.clientX - rect.left) / rect.width, 0), 1);
      const raw = min + ratio * (max - min);
      const snapped = Math.round(raw / step) * step;
      if (which === "min") {
        onValueChange([Math.min(snapped, maxVal - step), maxVal]);
      } else {
        onValueChange([minVal, Math.max(snapped, minVal + step)]);
      }
    };
    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  };

  return (
    <div className={cn("relative pt-4 pb-1", className)}>
      <div ref={trackRef} className="relative h-2 rounded-full bg-secondary">
        <div
          className="absolute inset-y-0 rounded-full gold-gradient"
          style={{ left: `${pct(minVal)}%`, right: `${100 - pct(maxVal)}%` }}
        />
      </div>
      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={minVal}
        onPointerDown={(e) => handleDrag(e, "min")}
        className="absolute -top-0.5 h-5 w-5 cursor-grab rounded-full border-2 border-accent bg-white shadow-md active:cursor-grabbing"
        style={{ left: `calc(${pct(minVal)}% - 10px)` }}
      />
      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={maxVal}
        onPointerDown={(e) => handleDrag(e, "max")}
        className="absolute -top-0.5 h-5 w-5 cursor-grab rounded-full border-2 border-accent bg-white shadow-md active:cursor-grabbing"
        style={{ left: `calc(${pct(maxVal)}% - 10px)` }}
      />
    </div>
  );
}

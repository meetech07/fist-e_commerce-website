"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = React.useState(0);
  const [zoom, setZoom] = React.useState(false);
  const [pos, setPos] = React.useState({ x: 50, y: 50 });
  const ref = React.useRef<HTMLDivElement>(null);

  const list = images.length > 0 ? images : ["/placeholder.png"];

  const onMove = (e: React.MouseEvent) => {
    if (!zoom || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const prev = () => setIndex((i) => (i - 1 + list.length) % list.length);
  const next = () => setIndex((i) => (i + 1) % list.length);

  return (
    <div className="space-y-3">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        className="relative aspect-square overflow-hidden rounded-3xl border bg-secondary/40"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
            style={
              zoom
                ? {
                    transformOrigin: `${pos.x}% ${pos.y}%`,
                    transform: "scale(2)",
                    transition: "transform 0.1s ease-out",
                  }
                : {}
            }
          >
            <Image src={list[index]} alt={`${alt} — view ${index + 1}`} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </motion.div>
        </AnimatePresence>

        <span className="glass pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium">
          <ZoomIn className="h-3.5 w-3.5 text-accent" /> Hover to zoom
        </span>

        <div className="absolute inset-y-0 left-2 flex items-center">
          <button onClick={prev} className="glass flex h-10 w-10 items-center justify-center rounded-full shadow transition hover:text-accent" aria-label="Previous image">
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button onClick={next} className="glass flex h-10 w-10 items-center justify-center rounded-full shadow transition hover:text-accent" aria-label="Next image">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
        {list.map((img, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition",
              i === index ? "border-accent shadow-glow" : "border-transparent opacity-70 hover:opacity-100",
            )}
            aria-label={`View image ${i + 1}`}
          >
            <Image src={img} alt={`${alt} thumbnail ${i + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

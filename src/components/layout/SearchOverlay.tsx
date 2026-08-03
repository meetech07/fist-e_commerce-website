"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Search, TrendingUp, X } from "lucide-react";
import type { Product } from "@/types";
import { formatINR } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => {
      lang: string;
      interimResults: boolean;
      continuous: boolean;
      onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
      onend: () => void;
      start: () => void;
    };
  }
}

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>(null);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
      setQuery("");
      setResults([]);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const runSearch = React.useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`);
      const data = (await res.json()) as { products: Product[] };
      setResults(data.products ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onQueryChange = (q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(q), 280);
  };

  const startVoice = () => {
    const SR = window.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice search is not supported in this browser. Try Google Chrome.");
      return;
    }
    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      runSearch(transcript);
    };
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  };

  const popularSearches = ["PVC Ceiling", "WPC Panel", "Gypsum Board", "Louver", "3D Panel", "Ceiling Channel"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] bg-charcoal/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="mx-auto mt-20 w-full max-w-2xl px-4"
          >
            <div className="glass overflow-hidden rounded-2xl shadow-2xl">
              <div className="flex items-center gap-3 border-b p-4">
                <Search className="h-5 w-5 shrink-0 text-accent" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onClose();
                      router.push(`/search?q=${encodeURIComponent(query)}`);
                    }
                  }}
                  placeholder="Search ceilings, panels, WPC, gypsum, louvers…"
                  className="w-full bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={startVoice}
                  className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
                    listening ? "border-accent bg-accent text-accent-foreground animate-pulse-glow" : "border-border text-muted-foreground hover:text-accent"
                  }`}
                  aria-label="Voice search"
                >
                  <Mic className="h-4 w-4" />
                </button>
                <button onClick={onClose} className="shrink-0 text-muted-foreground hover:text-foreground" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[55vh] overflow-y-auto p-4">
                {loading && (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="skeleton h-14 rounded-xl" />
                    ))}
                  </div>
                )}

                {!loading && !query && (
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <TrendingUp className="h-3.5 w-3.5" /> Popular searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setQuery(s);
                            runSearch(s);
                          }}
                          className="rounded-full border bg-secondary/50 px-3 py-1.5 text-sm transition hover:border-accent hover:text-accent"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!loading && results.length > 0 && (
                  <div className="space-y-1">
                    {results.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onClose();
                          router.push(`/products/${p.slug}`);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-secondary"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0]} alt={p.name} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-semibold">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.brand_name}</p>
                        </div>
                        <span className="shrink-0 text-sm font-bold text-accent">{formatINR(p.price)}</span>
                      </button>
                    ))}
                    <Button
                      variant="ghost"
                      className="mt-2 w-full"
                      onClick={() => {
                        onClose();
                        router.push(`/search?q=${encodeURIComponent(query)}`);
                      }}
                    >
                      See all results for “{query}”
                    </Button>
                  </div>
                )}

                {!loading && query && results.length === 0 && (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    No products found for “{query}”.
                    <div className="mt-2">
                      <Button variant="gold" size="sm" onClick={() => onClose()}>
                        Request this product
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-white/80">
              <span className="uppercase tracking-wider">Quick links:</span>
              {NAV_LINKS.slice(1, 5).map((link) => (
                <button
                  key={link.href}
                  onClick={() => {
                    onClose();
                    router.push(link.href);
                  }}
                  className="rounded-full border border-white/20 px-3 py-1 transition hover:border-white/60 hover:text-white"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

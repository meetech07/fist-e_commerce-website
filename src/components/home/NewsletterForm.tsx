"use client";

import * as React from "react";
import { Send, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { isValidEmail } from "@/lib/utils";
import { toast } from "sonner";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return toast.error("Please enter a valid email");
    setLoading(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setDone(true);
      toast.success("Subscribed! Welcome to the family.");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className={cn("mt-5", dark && "mt-4")}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">Newsletter</p>
      {done ? (
        <div className="flex items-center gap-2 rounded-full bg-success/15 px-4 py-2.5 text-sm font-medium text-success">
          <Check className="h-4 w-4" /> You&apos;re subscribed!
        </div>
      ) : (
        <div className="flex overflow-hidden rounded-full border border-white/15 bg-white/5 focus-within:border-accent">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-white/40"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex shrink-0 items-center gap-1.5 bg-accent px-4 text-sm font-semibold text-charcoal transition hover:brightness-110 disabled:opacity-50"
            aria-label="Subscribe"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Subscribe</span>
          </button>
        </div>
      )}
    </form>
  );
}

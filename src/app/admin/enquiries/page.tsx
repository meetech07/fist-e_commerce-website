"use client";

import * as React from "react";
import { Mail, MailOpen, Phone, Quote as QuoteIcon, Search, Trash2 } from "lucide-react";
import type { Enquiry } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  listEnquiries,
  removeEnquiry as apiRemoveEnquiry,
  setEnquiryRead as apiSetEnquiryRead,
  isDbConfigured,
} from "@/lib/admin-api";
import {
  getEnquiries,
  removeEnquiry as localRemoveEnquiry,
  updateEnquiry as localUpdateEnquiry,
} from "@/lib/enquiries-local";

type Filter = "all" | "unread" | "quote" | "contact";

export default function AdminEnquiries() {
  const [items, setItems] = React.useState<Enquiry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");

  const refresh = React.useCallback(async () => {
    if (isDbConfigured()) {
      const data = await listEnquiries();
      if (data.length) setItems(data);
    } else {
      setItems(getEnquiries() as Enquiry[]);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleRead = async (id: string, is_read: boolean) => {
    setItems((prev) => prev.map((e) => (e.id === id ? { ...e, is_read } : e)));
    if (isDbConfigured()) {
      const ok = await apiSetEnquiryRead(id, is_read);
      if (!ok) toast.error("Could not update on server");
    } else {
      localUpdateEnquiry(id, { is_read });
    }
  };

  const remove = async (id: string) => {
    if (isDbConfigured()) {
      const ok = await apiRemoveEnquiry(id);
      if (!ok) return toast.error("Could not delete on server");
    } else {
      localRemoveEnquiry(id);
    }
    setItems((prev) => prev.filter((e) => e.id !== id));
    toast.success("Enquiry deleted");
  };

  const filtered = items.filter((e) => {
    const q = query.trim().toLowerCase();
    const matchQ =
      !q ||
      [e.name, e.email, e.phone, e.subject, e.message].filter(Boolean).join(" ").toLowerCase().includes(q);
    const matchFilter =
      filter === "all" ||
      (filter === "unread" && !e.is_read) ||
      e.type === filter;
    return matchQ && matchFilter;
  });

  const unread = items.filter((e) => !e.is_read).length;

  const tabs: Array<{ key: Filter; label: string }> = [
    { key: "all", label: `All (${items.length})` },
    { key: "unread", label: `Unread (${unread})` },
    { key: "quote", label: "Quotes" },
    { key: "contact", label: "Messages" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Enquiries & Quotes</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} enquiries · {unread} unread
            {isDbConfigured() ? " · synced to database" : " · saved in this browser (demo mode)"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium transition",
              filter === t.key ? "bg-primary text-primary-foreground" : "border",
            )}
          >
            {t.label}
          </button>
        ))}
        <div className="relative ml-auto min-w-56 flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, message…" className="pl-10" />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-44 rounded-3xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border bg-card py-16 text-center text-sm text-muted-foreground">
          No enquiries found. New contact & quote form submissions will appear here.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((e) => (
            <div
              key={e.id}
              className={cn(
                "rounded-3xl border bg-card p-5 transition",
                !e.is_read && "border-accent/60 shadow-sm",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", e.type === "quote" ? "gold-gradient text-charcoal" : "bg-secondary")}>
                    {e.type === "quote" ? <QuoteIcon className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold">{e.name}</p>
                      {!e.is_read && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" title="Unread" />}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{e.email}{e.phone ? ` · ${e.phone}` : ""}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" title={e.is_read ? "Mark unread" : "Mark read"} onClick={() => toggleRead(e.id, !e.is_read)}>
                    {e.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" title="Delete" onClick={() => remove(e.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant={e.type === "quote" ? "gold" : "default"}>{e.type}</Badge>
                {e.subject && <span className="text-xs font-medium">{e.subject}</span>}
                <span className="ml-auto text-[11px] text-muted-foreground">{formatDateTime(e.created_at)}</span>
              </div>

              <p className="mt-3 whitespace-pre-line rounded-2xl bg-secondary/40 p-3 text-sm leading-relaxed">
                {e.message}
              </p>

              {e.phone && (
                <a
                  href={`tel:${e.phone}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" /> Call {e.phone}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

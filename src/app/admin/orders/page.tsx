"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronDown, Search } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import type { OrderStatus } from "@/types";
import { formatINR, formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/account/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "processing", "dispatched", "delivered", "cancelled", "returned"];

export default function AdminOrders() {
  const { orders, setCollection } = useAdminStore();
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || [o.order_number, o.customer_name, o.customer_phone, o.customer_email].filter(Boolean).join(" ").toLowerCase().includes(q);
    return matchQ && (statusFilter === "all" || o.status === statusFilter);
  });

  const setStatus = (orderNumber: string, status: OrderStatus) => {
    setCollection("orders", orders.map((o) => (o.order_number === orderNumber ? { ...o, status, updated_at: new Date().toISOString() } : o)));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">{orders.length} orders · {formatINR(orders.reduce((s, o) => s + o.total, 0))} lifetime value</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-60 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order #, customer, phone…" className="pl-10" />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          options={[{ label: "All statuses", value: "all" }, ...STATUSES.map((s) => ({ label: s[0].toUpperCase() + s.slice(1), value: s }))]}
          className="w-44"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-3xl border border-dashed py-16 text-center text-sm text-muted-foreground">No orders found.</div>
        )}
        {filtered.map((o) => {
          const open = expanded === o.order_number;
          return (
            <div key={o.order_number} className="overflow-hidden rounded-3xl border bg-card">
              <button onClick={() => setExpanded(open ? null : o.order_number)} className="flex w-full flex-wrap items-center gap-4 p-4 text-left transition hover:bg-secondary/30">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-xs font-bold">
                  {formatINR(o.total).replace("₹", "")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{o.order_number}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {o.customer_name} · {o.customer_phone} · {formatDateTime(o.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={o.payment_status === "paid" ? "gold" : "outline"}>{o.payment_status}</Badge>
                  <StatusBadge status={o.status} />
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition", open && "rotate-180")} />
                </div>
              </button>

              {open && (
                <div className="border-t bg-secondary/20 p-5">
                  <div className="mb-4">
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Update status</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Select
                        value={o.status}
                        onValueChange={(v) => setStatus(o.order_number, v as OrderStatus)}
                        options={STATUSES.map((s) => ({ label: s[0].toUpperCase() + s.slice(1), value: s }))}
                        className="w-44"
                      />
                      <p className="text-xs text-muted-foreground">
                        {o.payment_method} · {o.payment_status} {o.payment_id && `· ${o.payment_id}`}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                    <div className="space-y-2">
                      {o.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-2xl border bg-card p-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.unit} · Qty {item.quantity} × {formatINR(item.price)}</p>
                          </div>
                          <span className="text-sm font-semibold">{formatINR(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <div className="rounded-2xl border bg-card p-4 text-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Billing</p>
                        <p className="mt-2">{o.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{o.address.line1}, {o.address.city}, {o.address.state} — {o.address.pincode}</p>
                        {o.gstin && <p className="mt-1 text-xs text-muted-foreground">GSTIN: {o.gstin}</p>}
                        {o.notes && <p className="mt-2 rounded-xl bg-secondary/60 p-2 text-xs">Note: {o.notes}</p>}
                      </div>
                      <div className="rounded-2xl border bg-card p-4 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(o.subtotal)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>− {formatINR(o.discount)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span>{formatINR(o.gst_amount)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{o.shipping === 0 ? "FREE" : formatINR(o.shipping)}</span></div>
                        <div className="mt-2 flex justify-between border-t pt-2 font-bold"><span>Total</span><span>{formatINR(o.total)}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

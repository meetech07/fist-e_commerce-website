"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, PackageSearch } from "lucide-react";
import { useOrders } from "@/lib/hooks/useOrders";
import { formatINR, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/account/StatusBadge";
import { EmptyOrders } from "@/app/account/page";
import { Skeleton } from "@/components/ui/skeleton";

const FILTERS = ["all", "pending", "confirmed", "processing", "dispatched", "delivered", "cancelled"];

export default function OrdersPage() {
  const { orders, loading } = useOrders();
  const [filter, setFilter] = React.useState("all");

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">My Orders</h1>
      <div className="mb-5 mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition ${
              filter === f ? "bg-primary text-primary-foreground" : "border hover:border-accent"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="space-y-3"><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
      ) : filtered.length === 0 ? (
        filter === "all" ? <EmptyOrders /> : <div className="py-16 text-center text-sm text-muted-foreground">No {filter} orders</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Link
              key={order.order_number}
              href={`/account/orders/${order.order_number}`}
              className="group flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card p-5 transition hover:border-accent hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
                  <PackageSearch className="h-5 w-5 text-accent" />
                </span>
                <div>
                  <p className="font-semibold">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.created_at)} · {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold">{formatINR(order.total)}</p>
                  <p className="text-[11px] capitalize text-muted-foreground">{order.payment_method} · {order.payment_status}</p>
                </div>
                <StatusBadge status={order.status} />
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-accent" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

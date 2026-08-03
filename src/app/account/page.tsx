"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Package, TrendingDown, TrendingUp } from "lucide-react";
import { useOrders } from "@/lib/hooks/useOrders";
import { formatINR, formatDate } from "@/lib/utils";
import { useWishlist } from "@/lib/store/store";
import { StatusBadge } from "@/components/account/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { orders, loading } = useOrders();
  const { wishlist } = useWishlist();

  const totalSpent = orders
    .filter((o) => o.status !== "cancelled" && o.payment_status !== "refunded")
    .reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => ["pending", "confirmed", "processing"].includes(o.status)).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Package className="h-5 w-5" />} label="Total Orders" value={String(orders.length)} />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Total Spent" value={formatINR(totalSpent)} />
        <StatCard icon={<TrendingDown className="h-5 w-5" />} label="Pending / Active" value={String(pending)} />
      </div>

      <div className="rounded-3xl border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Recent Orders</h2>
          <Link href="/account/orders" className="flex items-center gap-1 text-sm text-accent hover:underline">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {loading ? (
          <div className="space-y-3"><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
        ) : orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <Link
                key={order.order_number}
                href={`/account/orders/${order.order_number}`}
                className="flex items-center justify-between gap-3 rounded-2xl border p-4 transition hover:border-accent"
              >
                <div>
                  <p className="font-semibold">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatINR(order.total)}</p>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border bg-card p-6">
          <h3 className="font-display text-lg font-semibold">Wishlist</h3>
          <p className="mt-1 text-sm text-muted-foreground">{wishlist.length} products saved</p>
          <Link href="/account/wishlist">
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:underline">
              View wishlist <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
        <div className="rounded-3xl border bg-card p-6">
          <h3 className="font-display text-lg font-semibold">Need help?</h3>
          <p className="mt-1 text-sm text-muted-foreground">Track orders, returns, or reach our support team.</p>
          <Link href="/contact">
            <span className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:underline">
              Contact support <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-3xl border bg-card p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl gold-gradient text-charcoal">{icon}</span>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function EmptyOrders() {
  return (
    <div className="py-10 text-center">
      <Package className="mx-auto h-10 w-10 text-muted-foreground/50" />
      <p className="mt-3 font-medium">No orders yet</p>
      <p className="mt-1 text-sm text-muted-foreground">When you place an order, it will show up here.</p>
      <Link href="/products">
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
          Start shopping <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </div>
  );
}

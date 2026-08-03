"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, IndianRupee, Package, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { formatINR, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/account/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const { orders, products, customers } = useAdminStore();

  const totalRevenue = orders.filter((o) => o.payment_status === "paid" || o.status === "delivered").reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter((o) => ["pending", "confirmed", "processing"].includes(o.status)).length;
  const lowStock = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 20);
  const outOfStock = products.filter((p) => p.stock_quantity <= 0);
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const recentOrders = orders.slice(0, 6);

  const stats = [
    { label: "Total Revenue", value: formatINR(totalRevenue), icon: IndianRupee, tint: "text-accent" },
    { label: "Total Orders", value: String(orders.length), icon: ShoppingBag, tint: "text-primary" },
    { label: "Pending Fulfilment", value: String(pendingOrders), icon: TrendingUp, tint: "text-warning" },
    { label: "Products", value: String(products.length), icon: Package, tint: "text-primary" },
    { label: "Customers", value: String(customers.length), icon: Users, tint: "text-accent" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <Link href="/admin/products/new" className={cn(buttonVariants({ size: "sm" }))}>Add Product</Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {stats.map(({ label, value, icon: Icon, tint }) => (
          <div key={label} className="rounded-3xl border bg-card p-4">
            <Icon className={cn("h-5 w-5", tint)} />
            <p className="mt-3 font-display text-xl font-bold">{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="rounded-3xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-accent hover:underline">View all</Link>
          </div>
          <div className="mt-4 space-y-2">
            {recentOrders.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No orders yet.</p>}
            {recentOrders.map((o) => (
              <Link key={o.order_number} href="/admin/orders" className="flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-secondary/60">
                <div>
                  <p className="text-sm font-semibold">{o.order_number}</p>
                  <p className="text-xs text-muted-foreground">{o.customer_name} · {formatDate(o.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">{formatINR(o.total)}</span>
                  <StatusBadge status={o.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border bg-card p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <AlertTriangle className="h-4 w-4 text-warning" /> Stock Alerts
            </h2>
            <div className="mt-3 space-y-2">
              {outOfStock.length > 0 && (
                <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{outOfStock.length} out of stock</p>
              )}
              {lowStock.length === 0 && outOfStock.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">All products well stocked.</p>
              ) : (
                lowStock.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="line-clamp-1">{p.name}</span>
                    <span className="shrink-0 font-semibold text-warning">{p.stock_quantity} left</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">Top Sellers</h2>
            <div className="mt-3 space-y-2">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">{i + 1}</span>
                  <span className="line-clamp-1 flex-1">{p.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{p.sold} sold</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

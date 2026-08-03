"use client";

import * as React from "react";
import Link from "next/link";
import { Download, Receipt } from "lucide-react";
import { useOrders } from "@/lib/hooks/useOrders";
import { formatINR, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/account/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvoicesPage() {
  const { orders, loading } = useOrders();
  const invoiced = orders.filter((o) => o.payment_status === "paid" || o.status === "delivered");

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Invoices</h1>
      <p className="mt-1 text-sm text-muted-foreground">GST-compliant invoices for all paid orders.</p>
      {loading ? (
        <div className="mt-5 space-y-3"><Skeleton className="h-20" /><Skeleton className="h-20" /></div>
      ) : invoiced.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed py-16 text-center">
          <Receipt className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 font-medium">No invoices yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Invoices appear here after a successful payment.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {invoiced.map((order) => (
            <div key={order.order_number} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-5">
              <div>
                <p className="font-semibold">{order.invoice_number ?? order.order_number}</p>
                <p className="text-xs text-muted-foreground">{formatDate(order.created_at)} · {order.items.length} items</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-bold">{formatINR(order.total)}</p>
                <StatusBadge status={order.payment_status} />
                <Link href={`/account/invoices/${order.order_number}`} target="_blank">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" /> View / Print
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

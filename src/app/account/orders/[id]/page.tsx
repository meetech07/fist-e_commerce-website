"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, Ban, CheckCircle2, Download, MapPin, Package, RotateCcw, Truck } from "lucide-react";
import { useOrders } from "@/lib/hooks/useOrders";
import { formatINR, formatDateTime } from "@/lib/utils";
import { StatusBadge } from "@/components/account/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TIMELINE: Array<{ status: string; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { status: "pending", label: "Order Placed", icon: CheckCircle2 },
  { status: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { status: "processing", label: "Processing", icon: Package },
  { status: "dispatched", label: "Dispatched", icon: Truck },
  { status: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { orders, updateOrder } = useOrders();
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [returnOpen, setReturnOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");

  const order = orders.find((o) => o.order_number === id);

  if (!order) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-xl font-semibold">Order not found</p>
        <Link href="/account/orders" className="mt-3 inline-flex items-center gap-1 text-sm text-accent hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>
      </div>
    );
  }

  const currentStep = TIMELINE.findIndex((t) => t.status === order.status);
  const cancellable = ["pending", "confirmed"].includes(order.status);

  const cancelOrder = () => {
    if (!reason.trim()) return toast.error("Please tell us the reason");
    updateOrder(order.order_number, { status: "cancelled", return_reason: reason });
    setCancelOpen(false);
    setReason("");
    toast.success("Order cancelled");
  };

  const returnOrder = () => {
    if (!reason.trim()) return toast.error("Please tell us the reason");
    updateOrder(order.order_number, { status: "returned", return_reason: reason });
    setReturnOpen(false);
    setReason("");
    toast.success("Return request submitted");
  };

  const downloadInvoice = () => {
    window.open(`/account/invoices/${order.order_number}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Back to orders
          </Link>
          <h1 className="mt-2 font-display text-2xl font-semibold">{order.order_number}</h1>
          <p className="text-sm text-muted-foreground">Placed on {formatDateTime(order.created_at)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {order.payment_status === "paid" && (
            <Button variant="outline" size="sm" onClick={downloadInvoice}>
              <Download className="h-4 w-4" /> Download Invoice
            </Button>
          )}
          {order.status === "delivered" && (
            <Button variant="outline" size="sm" onClick={() => setReturnOpen(true)}>
              <RotateCcw className="h-4 w-4" /> Return Request
            </Button>
          )}
          {cancellable && (
            <Button variant="outline" size="sm" className="text-destructive" onClick={() => setCancelOpen(true)}>
              <Ban className="h-4 w-4" /> Cancel Order
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-3xl border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Order Status</h2>
          <StatusBadge status={order.status} />
        </div>
        <div className="flex items-center">
          {TIMELINE.map((step, i) => {
            const done = i <= currentStep;
            const cancelled = order.status === "cancelled" || order.status === "rejected";
            return (
              <React.Fragment key={step.status}>
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition",
                      done && !cancelled ? "border-accent bg-accent text-accent-foreground" : cancelled && i === currentStep ? "border-destructive text-destructive" : "border-border text-muted-foreground/50",
                    )}
                  >
                    <step.icon className="h-4 w-4" />
                  </span>
                  <span className={cn("text-[10px] font-medium", done ? "text-foreground" : "text-muted-foreground/60")}>
                    {step.label}
                  </span>
                </div>
                {i < TIMELINE.length - 1 && (
                  <div className={cn("mx-1 mb-5 h-0.5 flex-1 rounded", i < currentStep ? "bg-accent" : "bg-border")} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        {order.tracking_number && (
          <p className="mt-4 rounded-xl bg-secondary/60 px-4 py-2.5 text-sm">
            Courier: <span className="font-semibold">{order.courier}</span> · Tracking: <span className="font-semibold">{order.tracking_number}</span>
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Items</h2>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border bg-card p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {[item.color, item.size].filter(Boolean).join(" · ") || item.unit} · Qty {item.quantity}
                </p>
              </div>
              <span className="text-sm font-semibold">{formatINR(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border bg-card p-6">
            <h3 className="font-display text-lg font-semibold">Order Summary</h3>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={formatINR(order.subtotal)} />
              <Row label="Discount" value={`− ${formatINR(order.discount)}`} accent="text-success" />
              <Row label="GST" value={formatINR(order.gst_amount)} />
              <Row label="Shipping" value={order.shipping === 0 ? "FREE" : formatINR(order.shipping)} />
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span><span>{formatINR(order.total)}</span>
                </div>
              </div>
              <p className="capitalize text-xs text-muted-foreground">
                {order.payment_method} · {order.payment_status}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
              <MapPin className="h-4 w-4 text-accent" /> Delivery Address
            </h3>
            <p className="mt-3 text-sm">{order.address.name}</p>
            <p className="text-sm text-muted-foreground">{order.address.phone}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {order.address.line1}, {order.address.landmark && `${order.address.landmark}, `}{order.address.city}, {order.address.state} — {order.address.pincode}
            </p>
            {order.gstin && <p className="mt-2 text-xs text-muted-foreground">GSTIN: {order.gstin}</p>}
          </div>

          {order.status === "returned" && (
            <div className="rounded-3xl border bg-warning/10 p-5 text-sm">
              <p className="font-semibold text-warning">Return requested</p>
              <p className="mt-1 text-xs text-muted-foreground">{order.return_reason}</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel order {order.order_number}?</DialogTitle>
            <DialogDescription>Please share a reason so we can improve.</DialogDescription>
          </DialogHeader>
          <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for cancellation…" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>Keep Order</Button>
            <Button variant="destructive" onClick={cancelOrder}>Cancel Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={returnOpen} onOpenChange={setReturnOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request return for {order.order_number}</DialogTitle>
            <DialogDescription>Our team will review and arrange pickup within 48 hours.</DialogDescription>
          </DialogHeader>
          <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for return…" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReturnOpen(false)}>Close</Button>
            <Button variant="gold" onClick={returnOrder}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium", accent)}>{value}</span>
    </div>
  );
}

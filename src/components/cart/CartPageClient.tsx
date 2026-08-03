"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingBag, Trash2, Tag } from "lucide-react";
import { useCart } from "@/lib/store/store";
import { formatINR, cn } from "@/lib/utils";
import { calculateBreakdown, type ShippingConfig } from "@/lib/prices";
import { mockCoupons } from "@/lib/data/mock-data";
import { useBusinessSettings } from "@/lib/business-store";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { QtyControl } from "@/components/layout/CartDrawer";
import { toast } from "sonner";

export function CartPageClient() {
  const { cart, updateCartQty, removeFromCart, cartKey } = useCart();
  const [couponCode, setCouponCode] = React.useState("");
  const [coupon, setCoupon] = React.useState<{ type: "percent" | "fixed"; value: number; min_cart: number; max_discount: number } | null>(null);
  const [applied, setApplied] = React.useState(false);
  const router = useRouter();
  const { settings } = useBusinessSettings();

  const shippingConfig: ShippingConfig = {
    enabled: settings.freeShippingEnabled,
    threshold: settings.shippingThreshold,
    fee: settings.shippingFee,
  };
  const breakdown = calculateBreakdown(cart, applied ? couponCode : undefined, coupon ?? undefined, shippingConfig);

  const applyCoupon = async () => {
    const c = mockCoupons.find((x) => x.code.toLowerCase() === couponCode.trim().toLowerCase());
    if (!c) return toast.error("Invalid coupon code");
    if (cartSubtotal < c.min_cart) return toast.error(`Minimum cart value for this coupon is ${formatINR(c.min_cart)}`);
    setCoupon({ type: c.type, value: c.value, min_cart: c.min_cart, max_discount: c.max_discount });
    setApplied(true);
    toast.success(`Coupon ${c.code} applied!`);
  };

  const cartSubtotal = breakdown.subtotal;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed py-24 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl font-semibold">Your cart is empty</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Discover premium ceilings, panels and interior materials for your next project.
        </p>
        <Link href="/products" className={cn(buttonVariants({ variant: "gold", size: "lg" }), "mt-2")}>
          Start Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        {cart.map((item) => {
          const key = cartKey(item.productId, { color: item.color, size: item.size });
          return (
            <div key={key} className="flex gap-4 rounded-2xl border bg-card p-4 sm:p-5">
              <Link href={`/products/${item.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/products/${item.slug}`} className="line-clamp-2 font-display text-sm font-semibold hover:text-accent sm:text-base">
                    {item.name}
                  </Link>
                  <button onClick={() => removeFromCart(item.productId, { color: item.color, size: item.size })} className="text-muted-foreground transition hover:text-destructive" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {[item.color, item.size].filter(Boolean).join(" · ") || item.unit}
                </p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <QtyControl
                    value={item.quantity}
                    onChange={(v) => updateCartQty(item.productId, v, { color: item.color, size: item.size })}
                  />
                  <div className="text-right">
                    <p className="font-bold">{formatINR(item.price * item.quantity)}</p>
                    {item.mrp > item.price && (
                      <p className="text-xs text-muted-foreground line-through">{formatINR(item.mrp * item.quantity)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">{formatINR(breakdown.subtotal)}</span>
            </div>
            <div className="flex justify-between text-success">
              <span>Discount</span>
              <span>− {formatINR(breakdown.discount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST</span>
              <span className="font-semibold">{formatINR(breakdown.gstAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-semibold">{breakdown.shipping === 0 ? "FREE" : formatINR(breakdown.shipping)}</span>
            </div>
            {breakdown.shipping > 0 && (
              <p className="rounded-xl bg-warning/10 px-3 py-2 text-xs text-warning">
                Add {formatINR(settings.shippingThreshold - breakdown.subtotal)} more for free delivery
              </p>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatINR(breakdown.total)}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">GST invoice generated automatically</p>
          </div>

          <div className="mt-4">
            <div className="flex gap-2">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code (e.g. WELCOME10)"
                disabled={applied}
                className="flex-1"
              />
              <Button variant="outline" onClick={applyCoupon} disabled={applied}>
                <Tag className="h-4 w-4" /> Apply
              </Button>
            </div>
            {applied && (
              <button onClick={() => { setApplied(false); setCoupon(null); setCouponCode(""); }} className="mt-2 text-xs text-accent hover:underline">
                Remove coupon
              </button>
            )}
          </div>

          <Button variant="gold" size="lg" className="mt-5 w-full" onClick={() => router.push("/checkout")}>
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

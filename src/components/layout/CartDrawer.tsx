"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/lib/store/store";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { calculateBreakdown, type ShippingConfig } from "@/lib/prices";
import { useBusinessSettings } from "@/lib/business-store";

export function CartDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { cart, cartSubtotal, removeFromCart, updateCartQty, cartKey } = useCart();
  const { settings } = useBusinessSettings();
  const shippingConfig: ShippingConfig = {
    enabled: settings.freeShippingEnabled,
    threshold: settings.shippingThreshold,
    fee: settings.shippingFee,
  };
  const breakdown = calculateBreakdown(cart, undefined, undefined, shippingConfig);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col p-0">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-accent" />
            Your Cart ({cart.length})
          </SheetTitle>
          <SheetDescription>
            {settings.freeShippingEnabled
              ? `Free delivery above ${formatINR(settings.shippingThreshold)} · GST invoice included`
              : "GST invoice included"}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const key = cartKey(item.productId, { color: item.color, size: item.size });
                return (
                  <div key={key} className="flex gap-3 rounded-xl border p-3">
                    <Link href={`/products/${item.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </Link>
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/products/${item.slug}`} className="line-clamp-1 text-sm font-semibold hover:text-accent">
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId, { color: item.color, size: item.size })}
                          className="text-muted-foreground transition hover:text-destructive"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {(item.color || item.size) && (
                        <span className="text-xs text-muted-foreground">
                          {[item.color, item.size].filter(Boolean).join(" · ")}
                        </span>
                      )}
                      <div className="mt-auto flex items-center justify-between">
                        <QtyControl
                          value={item.quantity}
                          onChange={(v) => updateCartQty(item.productId, v, { color: item.color, size: item.size })}
                        />
                        <span className="text-sm font-bold">{formatINR(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="border-t">
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatINR(cartSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Savings</span>
                <span className="font-semibold text-success">− {formatINR(breakdown.discount)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">{formatINR(breakdown.total)}</span>
              </div>
              <Link href="/checkout" onClick={() => onOpenChange(false)} className="block">
                <Button variant="gold" size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/cart" onClick={() => onOpenChange(false)} className="block">
                <Button variant="outline" className="w-full">
                  View Full Cart
                </Button>
              </Link>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

function EmptyCart() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
        <ShoppingBag className="h-9 w-9 text-muted-foreground" />
      </div>
      <h3 className="font-display text-lg font-semibold">Your cart is empty</h3>
      <p className="max-w-[220px] text-sm text-muted-foreground">
        Explore our premium ceiling & interior collection
      </p>
      <Link href="/products">
        <Button variant="gold" className="mt-2">Browse Products</Button>
      </Link>
    </div>
  );
}

export function QtyControl({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border">
      <button
        onClick={() => onChange(value - 1)}
        className="flex h-7 w-7 items-center justify-center text-sm text-muted-foreground hover:text-foreground"
        aria-label="Decrease"
      >
        −
      </button>
      <span className="w-7 text-center text-xs font-semibold">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="flex h-7 w-7 items-center justify-center text-sm text-muted-foreground hover:text-foreground"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

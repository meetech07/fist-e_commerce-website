"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { formatINR, discountPercent } from "@/lib/utils";
import { useCart, useWishlist } from "@/lib/store/store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/shared/Rating";
import { Heart, ShoppingCart, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductQuickView({ product, open, onOpenChange }: { product: Product; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [color, setColor] = React.useState<string | undefined>(product.colors?.[0]);
  const [qty, setQty] = React.useState(1);
  const inStock = product.stock_quantity > 0;
  const discount = discountPercent(product.mrp, product.price);

  const handleAdd = () => addToCart(product, qty, { color });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent side="bottom" className="sm:max-w-3xl overflow-hidden p-0">
        <div className="grid gap-0 sm:grid-cols-2">
          <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[420px]">
            <Image src={product.images[0] ?? "/placeholder.png"} alt={product.name} fill className="object-cover" />
            {discount > 0 && (
              <Badge variant="destructive" className="absolute left-4 top-4">
                {discount}% OFF
              </Badge>
            )}
          </div>
          <div className="flex flex-col gap-4 p-6">
            <DialogHeader className="p-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">{product.brand_name}</span>
                {product.is_best_seller && <Badge variant="gold">Best Seller</Badge>}
              </div>
              <DialogTitle className="pr-8 font-display text-xl">{product.name}</DialogTitle>
              <DialogDescription className="line-clamp-2">{product.description}</DialogDescription>
              <div className="flex items-center gap-2 pt-1">
                <Rating value={4.8} />
                <span className="text-xs text-muted-foreground">{product.sold}+ sold</span>
              </div>
            </DialogHeader>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{formatINR(product.price)}</span>
              {product.mrp > product.price && (
                <span className="text-base text-muted-foreground line-through">{formatINR(product.mrp)}</span>
              )}
              <span className="text-xs text-muted-foreground">{product.unit}</span>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div>
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Color: {color}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition",
                        color === c ? "border-accent bg-accent/10 text-accent" : "border-border hover:border-accent/50",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <QuantityStepper value={qty} onChange={setQty} max={product.stock_quantity || 50} />
              <span className={cn("text-xs font-semibold", inStock ? "text-success" : "text-destructive")}>
                {inStock ? `In stock (${product.stock_quantity} available)` : "Out of stock"}
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleAdd} disabled={!inStock}>
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </Button>
                <Button variant="outline" size="icon" onClick={() => toggleWishlist(product)} aria-label="Wishlist">
                  <Heart className={cn("h-4 w-4", isWishlisted(product.id) && "fill-accent text-accent")} />
                </Button>
              </div>
              <Link href={`/products/${product.slug}`} className="w-full">
                <Button variant="gold" className="w-full" onClick={() => onOpenChange(false)}>
                  <Zap className="h-4 w-4" /> View Full Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function QuantityStepper({ value, onChange, max = 999, min = 1 }: { value: number; onChange: (v: number) => void; max?: number; min?: number }) {
  return (
    <div className="inline-flex items-center rounded-full border">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold text-muted-foreground transition hover:text-foreground"
        aria-label="Decrease"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-semibold">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold text-muted-foreground transition hover:text-foreground"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

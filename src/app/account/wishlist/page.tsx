"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist, useCart } from "@/lib/store/store";
import type { Product, WishlistItem } from "@/types";
import { formatINR, discountPercent, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

const toProduct = (item: WishlistItem): Product => ({
  id: item.productId,
  slug: item.slug,
  name: item.name,
  description: "",
  price: item.price,
  mrp: item.mrp,
  gst: 0,
  category_id: "",
  sku: item.slug.toUpperCase(),
  stock_quantity: item.inStock ? 1 : 0,
  unit: "unit",
  images: [item.image],
  colors: [],
  sizes: [],
  thickness: [],
  material: null,
  specifications: {},
  features: [],
  tags: [],
  is_featured: false,
  is_best_seller: false,
  is_new_arrival: false,
  is_published: true,
  views: 0,
  sold: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">My Wishlist</h1>
      <p className="mt-1 text-sm text-muted-foreground">{wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}</p>

      {wishlist.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed py-16 text-center">
          <Heart className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 font-medium">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">Tap the heart on any product to save it here.</p>
          <Link href="/products" className={cn(buttonVariants({ variant: "gold" }), "mt-5")}>Browse Products</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {wishlist.map((item) => (
            <div key={item.productId} className="group relative rounded-3xl border bg-card p-4 transition hover:border-accent hover:shadow-lg">
              <button
                onClick={() => toggleWishlist(toProduct(item))}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 shadow backdrop-blur transition hover:text-destructive"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <Link href={`/products/${item.slug}`}>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary/40">
                  <Image src={item.image} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width:768px) 50vw, 25vw" />
                  {item.mrp > item.price && (
                    <Badge variant="gold" className="absolute left-3 top-3">−{discountPercent(item.mrp, item.price)}%</Badge>
                  )}
                </div>
              </Link>
              <div className="mt-3">
                <Link href={`/products/${item.slug}`} className="line-clamp-1 text-sm font-semibold hover:text-accent">{item.name}</Link>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-bold">{formatINR(item.price)}</span>
                  {item.mrp > item.price && <span className="text-xs text-muted-foreground line-through">{formatINR(item.mrp)}</span>}
                </div>
                <Button size="sm" disabled={!item.inStock} onClick={() => addToCart(toProduct(item))} className="mt-3 w-full">
                  <ShoppingBag className="h-3.5 w-3.5" /> {item.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye, GitCompare } from "lucide-react";
import Image from "next/image";
import type { Product } from "@/types";
import { cn, discountPercent, formatINR } from "@/lib/utils";
import { useWishlist, useCompare, useCart } from "@/lib/store/store";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/shared/Rating";
import { ProductQuickView } from "@/components/products/ProductQuickView";

export function ProductCard({ product, className, priority }: { product: Product; className?: string; priority?: boolean }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { toggleCompare, isCompared } = useCompare();
  const { addToCart } = useCart();
  const [quickView, setQuickView] = React.useState(false);
  const discount = discountPercent(product.mrp, product.price);
  const inStock = product.stock_quantity > 0;

  return (
    <>
      <motion.div
        whileHover="hover"
        initial="rest"
        animate="rest"
        className={cn("group relative", className)}
      >
        <motion.div
          variants={{ rest: { y: 0, rotateX: 0 }, hover: { y: -8, rotateX: 1.5 } }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
          className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)]"
          style={{ transformStyle: "preserve-3d", perspective: 800 }}
        >
          <motion.div
            variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
            className="pointer-events-none absolute inset-0 z-10 rounded-2xl shadow-[inset_0_0_0_1px_rgba(200,162,75,0.35),0_0_40px_rgba(200,162,75,0.18)]"
          />

          <div className="relative aspect-[4/3] overflow-hidden bg-secondary/50">
            <Link href={`/products/${product.slug}`} className="absolute inset-0 z-[5]" aria-label={product.name} />
            <motion.div variants={{ hover: { scale: 1.06 } }} transition={{ duration: 0.6, ease: "easeOut" }} className="h-full w-full">
              <Image
                src={product.images[0] ?? "/placeholder.png"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                className="object-cover"
              />
            </motion.div>

            <div className="absolute left-3 top-3 z-[6] flex flex-col gap-1.5">
              {product.is_best_seller && <Badge variant="gold">Best Seller</Badge>}
              {product.is_new_arrival && <Badge variant="success">New</Badge>}
              {discount > 0 && <Badge variant="destructive">{discount}% OFF</Badge>}
            </div>

            {!inStock && (
              <div className="absolute inset-0 z-[6] flex items-center justify-center bg-charcoal/55 backdrop-blur-[2px]">
                <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-charcoal">Out of Stock</span>
              </div>
            )}

            <div className="absolute right-3 top-3 z-[7] flex flex-col gap-2 opacity-100 transition-all sm:opacity-0 sm:translate-x-2 sm:group-hover:translate-x-0 sm:group-hover:opacity-100">
              <QuickActionButton
                label="Quick view"
                onClick={() => setQuickView(true)}
                icon={<Eye className="h-4 w-4" />}
              />
              <QuickActionButton
                label={isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                active={isWishlisted(product.id)}
                onClick={() => toggleWishlist(product)}
                icon={<Heart className="h-4 w-4" />}
              />
              <QuickActionButton
                label={isCompared(product.id) ? "Remove from compare" : "Compare"}
                active={isCompared(product.id)}
                onClick={() => toggleCompare(product)}
                icon={<GitCompare className="h-4 w-4" />}
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-1.5 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                {product.brand_name ?? "DIA Premium"}
              </span>
              {product.category_name && (
                <span className="text-[11px] text-muted-foreground">{product.category_name}</span>
              )}
            </div>
            <Link href={`/products/${product.slug}`} className="z-[5] line-clamp-2 font-display text-sm font-semibold leading-snug hover:text-accent">
              {product.name}
            </Link>
            <Rating value={4.8} className="mt-0.5" />
            <div className="mt-auto flex items-end justify-between pt-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{formatINR(product.price)}</span>
                  {product.mrp > product.price && (
                    <span className="text-sm text-muted-foreground line-through">{formatINR(product.mrp)}</span>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground">{product.unit}</span>
              </div>
              <div className="flex gap-1.5">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => toggleWishlist(product)}
                  aria-label="Add to wishlist"
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border transition",
                    isWishlisted(product.id)
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border text-muted-foreground hover:border-accent hover:text-accent",
                  )}
                >
                  <Heart className={cn("h-4 w-4", isWishlisted(product.id) && "fill-current")} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => addToCart(product)}
                  disabled={!inStock}
                  aria-label="Add to cart"
                  className={cn(
                    "flex h-9 items-center justify-center gap-1.5 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:bg-accent hover:text-accent-foreground disabled:opacity-40",
                  )}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Add</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <ProductQuickView product={product} open={quickView} onOpenChange={setQuickView} />
    </>
  );
}

function QuickActionButton({ label, onClick, icon, active }: { label: string; onClick: () => void; icon: React.ReactNode; active?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full border shadow-md backdrop-blur transition-colors",
        active ? "border-accent bg-accent text-accent-foreground" : "border-border bg-card/90 text-foreground hover:border-accent hover:text-accent",
      )}
    >
      {icon}
    </motion.button>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  GitCompare,
  Heart,
  Link2,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";
import type { Product } from "@/types";
import { cn, discountPercent, formatINR } from "@/lib/utils";
import { useCart, useWishlist, useCompare } from "@/lib/store/store";
import { useRecentlyViewed } from "@/lib/store/store";
import { Rating } from "@/components/shared/Rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useBusinessSettings } from "@/lib/business-store";
import { ImageGallery } from "@/components/products/ImageGallery";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { toggleCompare, isCompared } = useCompare();
  const { addRecent } = useRecentlyViewed();
  const { settings } = useBusinessSettings();
  const [qty, setQty] = React.useState(1);
  const [color, setColor] = React.useState<string | undefined>(product.colors?.[0]);
  const [size, setSize] = React.useState<string | undefined>(product.sizes?.[0]);
  const [thickness, setThickness] = React.useState<string | undefined>(product.thickness?.[0]);

  const discount = discountPercent(product.mrp, product.price);
  const inStock = product.stock_quantity > 0;

  React.useEffect(() => {
    addRecent(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const buyNow = async () => {
    addToCart(product, qty, { color, size });
    router.push("/checkout");
  };

  const share = async () => {
    const url = `${settings.websiteUrl}/products/${product.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
        return;
      }
    } catch {
      /* noop */
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <ImageGallery images={product.images} alt={product.name} />
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/category/${product.category_name?.toLowerCase().replace(/\s+/g, "-")}`} className="text-xs font-semibold uppercase tracking-wider text-accent hover:underline">
              {product.category_name}
            </Link>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs font-medium text-muted-foreground">SKU: {product.sku}</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <Rating value={4.8} showValue />
            <span className="text-sm text-muted-foreground">· {product.sold}+ sold · {product.views} views</span>
            {product.is_best_seller && <Badge variant="gold">Best Seller</Badge>}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-bold">{formatINR(product.price)}</span>
            {product.mrp > product.price && (
              <span className="text-xl text-muted-foreground line-through">{formatINR(product.mrp)}</span>
            )}
            {discount > 0 && <Badge variant="destructive">{discount}% OFF</Badge>}
          </div>
          <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{product.unit}</span>
            <span>·</span>
            <span>Inclusive of GST {product.gst}%</span>
            {product.material && <span>· {product.material}</span>}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className={cn("inline-flex items-center gap-1.5 font-medium", inStock ? "text-success" : "text-destructive")}>
              <span className={cn("h-2 w-2 rounded-full", inStock ? "bg-success" : "bg-destructive")} />
              {inStock ? `In stock — ${product.stock_quantity} available` : "Out of stock"}
            </span>
            {product.brand_name && (
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Package className="h-4 w-4" /> Brand: {product.brand_name}
              </span>
            )}
          </div>
        </div>

        {product.colors && product.colors.length > 0 && (
          <OptionGroup label={`Color: ${color ?? ""}`}>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-all",
                    color === c ? "border-accent bg-accent/10 font-semibold text-accent" : "hover:border-accent/60",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </OptionGroup>
        )}

        {product.sizes && product.sizes.length > 0 && (
          <OptionGroup label={`Size: ${size ?? ""}`}>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-all",
                    size === s ? "border-accent bg-accent/10 font-semibold text-accent" : "hover:border-accent/60",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </OptionGroup>
        )}

        {product.thickness && product.thickness.length > 0 && (
          <OptionGroup label={`Thickness: ${thickness ?? ""}`}>
            <div className="flex flex-wrap gap-2">
              {product.thickness.map((t) => (
                <button
                  key={t}
                  onClick={() => setThickness(t)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-all",
                    thickness === t ? "border-accent bg-accent/10 font-semibold text-accent" : "hover:border-accent/60",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </OptionGroup>
        )}

        <div className="flex items-center gap-3">
          <QtyBox value={qty} onChange={setQty} max={product.stock_quantity || 50} />
          <div className="flex flex-1 gap-2">
            <Button
              size="lg"
              className="flex-1"
              disabled={!inStock}
              onClick={() => addToCart(product, qty, { color, size })}
            >
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </Button>
            <Button variant="gold" size="lg" className="flex-1" disabled={!inStock} onClick={buyNow}>
              <Zap className="h-4 w-4" /> Buy Now
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleWishlist(product)}
            className={cn(isWishlisted(product.id) && "border-accent text-accent")}
          >
            <Heart className={cn("h-4 w-4", isWishlisted(product.id) && "fill-accent")} />
            {isWishlisted(product.id) ? "Wishlisted" : "Wishlist"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => toggleCompare(product)} className={cn(isCompared(product.id) && "border-accent text-accent")}>
            <GitCompare className="h-4 w-4" /> {isCompared(product.id) ? "Added to Compare" : "Compare"}
          </Button>
          <Button variant="outline" size="sm" onClick={share}>
            <Link2 className="h-4 w-4" /> Share
          </Button>
        </div>

        <div className="grid gap-2 rounded-2xl bg-secondary/50 p-4 text-sm sm:grid-cols-2">
          <span className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-accent" /> Free delivery above ₹5,000</span>
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /> 10-year product warranty</span>
          <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-accent" /> GST invoice on every order</span>
          <span className="inline-flex items-center gap-2"><Package className="h-4 w-4 text-accent" /> Secure & protective packaging</span>
        </div>
      </div>
    </div>
  );
}

function OptionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function QtyBox({ value, onChange, max }: { value: number; onChange: (v: number) => void; max: number }) {
  return (
    <div className="inline-flex items-center rounded-full border">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-12 w-11 items-center justify-center text-muted-foreground transition hover:text-foreground"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-10 text-center text-base font-semibold">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-12 w-11 items-center justify-center text-muted-foreground transition hover:text-foreground"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ProductDescription({ product }: { product: Product }) {
  return (
    <Tabs defaultValue="description">
      <TabsList className="w-full overflow-x-auto">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="features">Features</TabsTrigger>
        <TabsTrigger value="specs">Specifications</TabsTrigger>
      </TabsList>

      <TabsContent value="description">
        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
        </div>
      </TabsContent>

      <TabsContent value="features">
        <ul className="grid gap-3 sm:grid-cols-2">
          {(product.features ?? []).map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 rounded-xl border bg-card p-3.5 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full gold-gradient">
                <Check className="h-3 w-3 text-charcoal" />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </TabsContent>

      <TabsContent value="specs">
        <div className="overflow-hidden rounded-2xl border">
          {Object.entries(product.specifications ?? {}).map(([key, value], i) => (
            <div key={key} className={cn("flex items-center justify-between gap-4 px-5 py-3.5 text-sm", i % 2 === 0 ? "bg-card" : "bg-secondary/40")}>
              <span className="font-medium text-muted-foreground">{key}</span>
              <span className="text-right font-semibold">{String(value)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 bg-secondary/40 px-5 py-3.5 text-sm">
            <span className="font-medium text-muted-foreground">Unit</span>
            <span className="font-semibold">{product.unit}</span>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

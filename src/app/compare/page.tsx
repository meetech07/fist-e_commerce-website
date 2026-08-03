"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { GitCompare, ShoppingBag, X } from "lucide-react";
import { useCompare, useCart } from "@/lib/store/store";
import type { Product } from "@/types";
import { formatINR, discountPercent } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const toProduct = (item: ReturnType<typeof useCompare>["compare"][number]): Product => ({
  id: item.productId,
  slug: item.slug,
  name: item.name,
  description: "",
  price: item.price,
  mrp: item.mrp,
  gst: 0,
  category_id: "",
  sku: item.slug.toUpperCase(),
  stock_quantity: item.stock,
  unit: "unit",
  images: [item.image],
  colors: item.colors ?? [],
  sizes: [],
  thickness: item.thickness ?? [],
  material: item.material ?? null,
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

export default function ComparePage() {
  const { compare, toggleCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Compare Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">Compare up to 4 products side by side.</p>
        </div>
        {compare.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearCompare}>Clear All</Button>
        )}
      </div>

      {compare.length === 0 ? (
        <div className="mt-16 flex flex-col items-center rounded-3xl border border-dashed py-20 text-center">
          <GitCompare className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 font-display text-xl font-semibold">Nothing to compare</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add products using the compare icon on any product card or detail page.
          </p>
          <Link href="/products" className={cn(buttonVariants(), "mt-6")}>Browse Products</Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-3xl border bg-card">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-44 p-4 text-left align-bottom text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {compare.length}/4 added
                </th>
                {compare.map((item) => (
                  <th key={item.productId} className="p-4 align-top">
                    <div className="relative">
                      <button
                        onClick={() => toggleCompare(toProduct(item))}
                        className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background shadow hover:text-destructive"
                        aria-label="Remove"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <Link href={`/products/${item.slug}`} className="block">
                        <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary/40">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <CompareRow label="Name">
                {compare.map((item) => (
                  <Link key={item.productId} href={`/products/${item.slug}`} className="font-semibold hover:text-accent">
                    {item.name}
                  </Link>
                ))}
              </CompareRow>
              <CompareRow label="Price">
                {compare.map((item) => (
                  <div key={item.productId}>
                    <span className="text-lg font-bold">{formatINR(item.price)}</span>
                    {item.mrp > item.price && (
                      <span className="ml-2 text-xs text-muted-foreground line-through">{formatINR(item.mrp)}</span>
                    )}
                    {item.mrp > item.price && (
                      <span className="ml-2 text-xs font-bold text-success">−{discountPercent(item.mrp, item.price)}%</span>
                    )}
                  </div>
                ))}
              </CompareRow>
              <CompareRow label="Brand">
                {compare.map((item) => (
                  <span key={item.productId} className="capitalize">{item.brand || "—"}</span>
                ))}
              </CompareRow>
              <CompareRow label="Material">
                {compare.map((item) => (
                  <span key={item.productId} className="capitalize">{item.material || "—"}</span>
                ))}
              </CompareRow>
              <CompareRow label="Colours">
                {compare.map((item) => (
                  <div key={item.productId} className="flex flex-wrap gap-1.5">
                    {item.colors?.length ? item.colors.map((c) => (
                      <span key={c} className="rounded-full border px-2 py-0.5 text-[11px] capitalize">{c}</span>
                    )) : <span className="text-muted-foreground">—</span>}
                  </div>
                ))}
              </CompareRow>
              <CompareRow label="Thickness">
                {compare.map((item) => (
                  <span key={item.productId}>{item.thickness?.length ? item.thickness.join(", ") : "—"}</span>
                ))}
              </CompareRow>
              <CompareRow label="Availability">
                {compare.map((item) => (
                  <span key={item.productId} className={cn("font-semibold", item.stock > 0 ? "text-success" : "text-destructive")}>
                    {item.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                ))}
              </CompareRow>
              <tr>
                <td className="border-t p-4" />
                {compare.map((item) => (
                  <td key={item.productId} className="border-t p-4 text-center">
                    <Button
                      size="sm"
                      disabled={item.stock <= 0}
                      onClick={() => addToCart(toProduct(item))}
                      className="w-full"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" /> {item.stock > 0 ? "Add to Cart" : "Sold Out"}
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CompareRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <td className="border-t bg-secondary/40 p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</td>
      {React.Children.map(children, (child, i) => (
        <td key={i} className="border-t p-4 text-center">{child}</td>
      ))}
    </tr>
  );
}

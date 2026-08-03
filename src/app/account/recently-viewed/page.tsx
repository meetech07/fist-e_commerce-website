"use client";

import * as React from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { useRecentlyViewed } from "@/lib/store/store";
import { ProductCard } from "@/components/products/ProductCard";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function RecentlyViewedPage() {
  const { recent } = useRecentlyViewed();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Recently Viewed</h1>
      <p className="mt-1 text-sm text-muted-foreground">Products you explored across sessions.</p>

      {recent.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed py-16 text-center">
          <Clock className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 font-medium">Nothing here yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Products you open will be remembered here.</p>
          <Link href="/products" className={cn(buttonVariants({ variant: "gold" }), "mt-5")}>Start Browsing</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recent.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

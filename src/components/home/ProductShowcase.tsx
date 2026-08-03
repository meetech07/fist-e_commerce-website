import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/products/ProductCardSkeleton";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function ProductShowcase({
  title,
  eyebrow,
  description,
  products,
  loading,
}: {
  title: string;
  eyebrow?: string;
  description?: string;
  products: Product[];
  loading?: boolean;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      )}
      <div className="mt-10 text-center">
        <Link
          href="/products"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "group")}
        >
          View All Products
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

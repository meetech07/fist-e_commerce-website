import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsExplorer } from "@/components/products/ProductsExplorer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { searchProducts, getCategories, getBrandNames, getAllMaterials, getAllColors } from "@/lib/data";
import { ProductGridSkeleton } from "@/components/products/ProductCardSkeleton";

export const metadata: Metadata = buildMetadata({
  title: "Search Products",
  description:
    "Search PVC ceiling panels, WPC wall panels, gypsum boards, louvers, channels and interior materials by name, brand or material.",
  path: "/search",
});

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const [products, categories, brands, materials, colors] = await Promise.all([
    searchProducts(q),
    getCategories(),
    getBrandNames(),
    getAllMaterials(),
    getAllColors(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Search", path: "/search" }])} />
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">
          {q ? (
            <>
              Results for <span className="gold-text">“{q}”</span>
            </>
          ) : (
            <>
              Search <span className="gold-text">Products</span>
            </>
          )}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {products.length} product{products.length !== 1 && "s"} found
        </p>
      </div>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductsExplorer
          products={products}
          categories={categories}
          brands={brands}
          materials={materials}
          colors={colors}
          initialQuery={q}
        />
      </Suspense>
    </div>
  );
}

import type { Metadata } from "next";
import { ProductsExplorer } from "@/components/products/ProductsExplorer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getProducts, getCategories, getBrandNames, getAllMaterials, getAllColors } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "Shop All Products",
  description:
    "Browse premium false ceiling materials, PVC ceiling panels, WPC wall panels, gypsum boards, channels, louvers and interior hardware. Trade pricing + pan-India delivery.",
  path: "/products",
});

export default async function ProductsPage() {
  const [products, categories, brands, materials, colors] = await Promise.all([
    getProducts({ sort: "popular" }),
    getCategories(),
    getBrandNames(),
    getAllMaterials(),
    getAllColors(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Products", path: "/products" }])} />
      <div className="mb-8">
        <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          <span className="h-px w-8 gold-gradient" /> Our Catalogue
        </p>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">
          Shop <span className="gold-text">All Products</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Every ceiling, panel and hardware you need for a premium interior — with honest pricing and fast delivery.
        </p>
      </div>
      <ProductsExplorer
        products={products}
        categories={categories}
        brands={brands}
        materials={materials}
        colors={colors}
      />
    </div>
  );
}

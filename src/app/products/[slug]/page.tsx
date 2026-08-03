import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductDetail, ProductDescription } from "@/components/products/ProductDetail";
import { ProductReviews } from "@/components/products/ProductReviews";
import { ProductCard } from "@/components/products/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, productJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return buildMetadata({ title: "Product not found", path: `/products/${slug}` });
  return buildMetadata({
    title: product.seo_title ?? product.name,
    description: product.seo_description ?? product.short_description ?? product.description.slice(0, 155),
    path: `/products/${slug}`,
    image: product.images[0],
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6">
      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: product.name, path: `/products/${product.slug}` },
        ])}
      />

      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 overflow-x-auto text-sm text-muted-foreground no-scrollbar">
        <Link href="/" className="shrink-0 transition hover:text-accent">Home</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <Link href="/products" className="shrink-0 transition hover:text-accent">Products</Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        {product.category_name && (
          <>
            <Link href={`/category/${product.category_name.toLowerCase().replace(/\s+/g, "-")}`} className="shrink-0 transition hover:text-accent">
              {product.category_name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          </>
        )}
        <span className="shrink-0 truncate font-medium text-foreground">{product.name}</span>
      </nav>

      <ProductDetail product={product} />

      <div className="mt-14">
        <ProductDescription product={product} />
      </div>

      <ProductReviews productId={product.id} />

      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeading eyebrow="You may also like" title="Related Products" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductsExplorer } from "@/components/products/ProductsExplorer";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { getCategoryBySlug, getProducts, getCategories, getBrandNames, getAllMaterials, getAllColors } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return buildMetadata({ title: "Category not found", path: `/category/${slug}` });
  return buildMetadata({
    title: category.name,
    description: category.description ?? `${category.name} from DIA Enterprises — premium quality at trade prices.`,
    path: `/category/${slug}`,
    image: category.image,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, categories, brands, materials, colors] = await Promise.all([
    getProducts({ categories: [category.id], sort: "popular" }),
    getCategories(),
    getBrandNames(),
    getAllMaterials(),
    getAllColors(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          { name: category.name, path: `/category/${category.slug}` },
        ])}
      />
      <div className="relative mb-10 overflow-hidden rounded-3xl">
        <div className="relative h-52 sm:h-64">
          <Image src={category.image} alt={category.name} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/55 to-charcoal/20" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-light">
              <Link href="/categories" className="hover:underline">Categories</Link> / {category.name}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-white sm:text-5xl">{category.name}</h1>
            {category.description && (
              <p className="mt-3 max-w-xl text-sm text-white/75 sm:text-base">{category.description}</p>
            )}
          </div>
        </div>
      </div>
      <ProductsExplorer
        products={products}
        categories={categories}
        brands={brands}
        materials={materials}
        colors={colors}
        initialCategory={category.slug}
      />
    </div>
  );
}

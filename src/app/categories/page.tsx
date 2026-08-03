import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getCategories } from "@/lib/data";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StaggerGroup, MotionItem } from "@/components/shared/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "All Categories",
  description: "Explore all product categories at Paras Enterprises — false ceiling, PVC panels, WPC panels, gypsum, channels, louvers and more.",
  path: "/categories",
});

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Categories", path: "/categories" }])} />
      <SectionHeading
        eyebrow="Categories"
        title="Explore our full range"
        description="Everything for a premium interior — organised by category for easy browsing."
      />
      <StaggerGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <MotionItem key={cat.id}>
            <Link href={`/category/${cat.slug}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-sm transition-all duration-500 group-hover:shadow-2xl">
                <Image src={cat.image} alt={cat.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white">{cat.name}</h3>
                    <p className="mt-1 line-clamp-1 text-xs text-white/70">{cat.description}</p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-500 group-hover:bg-gold group-hover:text-charcoal group-hover:border-gold">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          </MotionItem>
        ))}
      </StaggerGroup>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { categoriesData } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StaggerGroup, MotionItem } from "@/components/shared/Reveal";

export function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
      <SectionHeading
        eyebrow="Shop by Category"
        title="Everything your project needs"
        description="From ceiling panels to hardware — explore our complete range of premium interior materials."
      />
      <StaggerGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categoriesData.map((cat) => (
          <MotionItem key={cat.slug}>
            <Link href={`/category/${cat.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm transition-all duration-500 group-hover:shadow-2xl">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-sm font-semibold text-white sm:text-base">{cat.name}</h3>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 text-white opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:bg-gold group-hover:text-charcoal group-hover:border-gold">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-[11px] text-white/70">{cat.description}</p>
                </div>
              </div>
            </Link>
          </MotionItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

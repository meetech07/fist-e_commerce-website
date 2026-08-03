import { Hero3D } from "@/components/home/Hero3D";
import { CompanyIntro } from "@/components/home/CompanyIntro";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { Brands } from "@/components/home/Brands";
import { InstallationServices } from "@/components/home/InstallationServices";
import { Gallery } from "@/components/home/Gallery";
import { QuoteSection } from "@/components/home/QuoteSection";
import { MapSection } from "@/components/home/MapSection";
import { ContactForm } from "@/components/home/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getNewArrivals, getBestSellers, getTestimonials } from "@/lib/data";

export const metadata = {
  title: "Home",
  description:
    "DIA Enterprises — India's premium supplier of false ceiling materials, PVC ceiling panels, WPC wall panels, gypsum boards, ceiling channels, louvers and interior hardware. Shop online with pan-India delivery.",
};

export default async function HomePage() {
  const [newArrivals, bestSellers, testimonials] = await Promise.all([
    getNewArrivals(),
    getBestSellers(),
    getTestimonials(),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }])} />
      <Hero3D />
      <Brands />
      <CompanyIntro />
      <FeaturedCategories />
      <ProductShowcase
        eyebrow="Featured"
        title="New Arrivals"
        description="Fresh from our warehouses — the latest in ceilings, panels and decor."
        products={newArrivals}
      />
      <ProductShowcase
        eyebrow="Customer Favourites"
        title="Best Selling Products"
        description="Proven bestsellers chosen by thousands of customers across India."
        products={bestSellers}
      />
      <WhyChooseUs />
      <Testimonials items={testimonials} />
      <InstallationServices />
      <Gallery />
      <QuoteSection />
      <ContactForm showHeading />
      <MapSection />
    </>
  );
}

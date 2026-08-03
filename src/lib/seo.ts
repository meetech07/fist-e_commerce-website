import type { Metadata } from "next";
import type { BlogPost, Product } from "@/types";
import { SITE } from "@/lib/constants";

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const url = path ? `${SITE.url}${path}` : SITE.url;
  const ogImage = image ?? "/og-default.png";
  return {
    title: `${title} | ${SITE.name}`,
    description: description ?? SITE.description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: SITE.name,
      title: `${title} | ${SITE.name}`,
      description: description ?? SITE.description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description: description ?? SITE.description,
      images: [ogImage],
    },
    keywords: [
      "false ceiling materials",
      "PVC ceiling panels",
      "WPC wall panels",
      "gypsum boards",
      "ceiling channels",
      "PVC louvers",
      "interior decorative materials",
      "ceiling hardware",
      "DIA Enterprises",
    ],
  };
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand_name ?? "DIA Enterprises" },
    image: product.images,
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      availability: product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: product.sold > 0
      ? { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: Math.max(product.sold, 1) }
      : undefined,
  };
}

export function blogJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image,
    datePublished: post.created_at,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: `${SITE.url}/icon.png` } },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.legalName,
    url: SITE.url,
    logo: `${SITE.url}/icon.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      contactType: "sales",
      availableLanguage: ["English", "Hindi"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.line1,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.pincode,
      addressCountry: "IN",
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

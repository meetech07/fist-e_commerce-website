import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { getCategories, getBlogs, getProducts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, blogs, products] = await Promise.all([getCategories(), getBlogs(), getProducts()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/categories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/quote`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/installation`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE.url}/compare`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE.url}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE.url}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/refund-policy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE.url}/category/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE.url}/products/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: new Date(p.updated_at),
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${SITE.url}/blog/${b.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: new Date(b.created_at),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}

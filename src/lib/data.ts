import type { BlogPost, Category, Product, ProductFilters, Testimonial } from "@/types";
import { mockBlogs, mockCategories, mockProducts, mockTestimonials } from "@/lib/data/mock-data";

const isConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function getCategories(): Promise<Category[]> {
  if (!isConfigured()) return mockCategories;
  const supabase = await (await import("@/lib/supabase/server")).createServerSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data?.length) return mockCategories;
  return data as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getProducts(filters?: Partial<ProductFilters>): Promise<Product[]> {
  if (!isConfigured()) return filterProducts(mockProducts, filters);
  const supabase = await (await import("@/lib/supabase/server")).createServerSupabase();
  let q = supabase.from("products").select("*").eq("is_published", true);
  if (filters?.categories?.length) {
    q = q.in("category_id", filters.categories);
  }
  if (filters?.brands?.length) {
    q = q.in("brand_id", filters.brands);
  }
  if (filters?.materials?.length) {
    q = q.in("material", filters.materials);
  }
  if (filters?.inStock) {
    q = q.gt("stock_quantity", 0);
  }
  if (filters?.minPriceActive != null) q = q.gte("price", filters.minPriceActive);
  if (filters?.maxPriceActive != null) q = q.lte("price", filters.maxPriceActive);
  const sortMap: Record<string, [string, boolean]> = {
    "price-asc": ["price", true],
    "price-desc": ["price", false],
    newest: ["created_at", false],
    discount: ["discount", false],
    popular: ["sold", false],
  };
  const [col, asc] = sortMap[filters?.sort ?? "popular"] ?? ["sold", false];
  q = q.order(col, { ascending: asc });

  const { data, error } = await q.limit(100);
  if (error || !data?.length) return filterProducts(mockProducts, filters);
  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const local = mockProducts.find((p) => p.slug === slug);
  if (!isConfigured()) return local ?? null;
  const supabase = await (await import("@/lib/supabase/server")).createServerSupabase();
  const { data } = await supabase.from("products").select("*").eq("slug", slug).single();
  if (data) return data as Product;
  return local ?? null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getProducts();
  const featured = all.filter((p) => p.is_featured);
  return featured.length ? featured : all.slice(0, 8);
}

export async function getBestSellers(): Promise<Product[]> {
  const all = await getProducts();
  const best = all.filter((p) => p.is_best_seller);
  return (best.length ? best : all).sort((a, b) => b.sold - a.sold).slice(0, 8);
}

export async function getNewArrivals(): Promise<Product[]> {
  const all = await getProducts();
  const fresh = all.filter((p) => p.is_new_arrival);
  return (fresh.length ? fresh : all)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getProducts();
  const related = all.filter(
    (p) => p.id !== product.id && (p.category_id === product.category_id || p.tags?.some((t) => product.tags?.includes(t))),
  );
  const pool = related.length ? related : all.filter((p) => p.id !== product.id);
  return pool.slice(0, limit);
}

export async function searchProducts(query: string, filters?: Partial<ProductFilters>): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  const all = await getProducts(filters);
  if (!q) return all;
  return all.filter((p) =>
    [p.name, p.sku, p.material, p.brand_name, p.category_name, ...(p.tags ?? []), p.description]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(q)),
  );
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isConfigured()) return mockTestimonials;
  const supabase = await (await import("@/lib/supabase/server")).createServerSupabase();
  const { data, error } = await supabase.from("testimonials").select("*").eq("featured", true).limit(8);
  if (error || !data?.length) return mockTestimonials;
  return data as Testimonial[];
}

export async function getBlogs(): Promise<BlogPost[]> {
  if (!isConfigured()) return mockBlogs;
  const supabase = await (await import("@/lib/supabase/server")).createServerSupabase();
  const { data, error } = await supabase.from("blogs").select("*").eq("is_published", true).order("created_at", { ascending: false });
  if (error || !data?.length) return mockBlogs;
  return data as BlogPost[];
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const local = mockBlogs.find((b) => b.slug === slug);
  if (!isConfigured()) return local ?? null;
  const supabase = await (await import("@/lib/supabase/server")).createServerSupabase();
  const { data } = await supabase.from("blogs").select("*").eq("slug", slug).single();
  if (data) return data as BlogPost;
  return local ?? null;
}

function filterProducts(products: Product[], filters?: Partial<ProductFilters>): Product[] {
  let result = [...products];
  if (filters?.categories?.length) {
    result = result.filter((p) => filters.categories!.includes(p.category_id));
  }
  if (filters?.brands?.length) {
    result = result.filter((p) => p.brand_name && filters.brands!.includes(p.brand_name));
  }
  if (filters?.materials?.length) {
    result = result.filter((p) => p.material && filters.materials!.includes(p.material!));
  }
  if (filters?.colors?.length) {
    result = result.filter((p) => p.colors?.some((c) => filters.colors!.includes(c)));
  }
  if (filters?.inStock) {
    result = result.filter((p) => p.stock_quantity > 0);
  }
  if (filters?.minPriceActive != null) result = result.filter((p) => p.price >= filters.minPriceActive!);
  if (filters?.maxPriceActive != null) result = result.filter((p) => p.price <= filters.maxPriceActive!);

  const sort = filters?.sort ?? "popular";
  const sorters: Record<string, (a: Product, b: Product) => number> = {
    popular: (a, b) => b.sold - a.sold,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    newest: (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    discount: (a, b) => (b.discount ?? 0) - (a.discount ?? 0),
  };
  return result.sort(sorters[sort] ?? sorters.popular);
}

export async function getAllMaterials(): Promise<string[]> {
  const all = await getProducts();
  return Array.from(new Set(all.map((p) => p.material).filter(Boolean))) as string[];
}

export async function getAllColors(): Promise<string[]> {
  const all = await getProducts();
  return Array.from(new Set(all.flatMap((p) => p.colors ?? []))).slice(0, 24);
}

export async function getBrandNames(): Promise<string[]> {
  const all = await getProducts();
  return Array.from(new Set(all.map((p) => p.brand_name).filter(Boolean))) as string[];
}

"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Filter, SlidersHorizontal } from "lucide-react";
import type { Category, Product } from "@/types";
import { cn, formatINR } from "@/lib/utils";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/products/ProductCardSkeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export function ProductsExplorer({
  products,
  categories,
  brands,
  materials,
  colors,
  initialCategory,
  initialQuery,
}: {
  products: Product[];
  categories: Category[];
  brands: string[];
  materials: string[];
  colors: string[];
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [catSlugs, setCatSlugs] = React.useState<string[]>(initialCategory ? [initialCategory] : []);
  const [brandSel, setBrandSel] = React.useState<string[]>([]);
  const [materialSel, setMaterialSel] = React.useState<string[]>([]);
  const [colorSel, setColorSel] = React.useState<string[]>([]);
  const [inStock, setInStock] = React.useState(false);
  const [sort, setSort] = React.useState("popular");
  const [range, setRange] = React.useState<[number, number]>([0, 5000]);
  const [search, setSearch] = React.useState(initialQuery ?? "");
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [result, setResult] = React.useState<Product[]>([]);

  const prices = React.useMemo(() => {
    const arr = products.map((p) => p.price);
    return { min: Math.min(...arr), max: Math.max(...arr) };
  }, [products]);

  const maxPrice = Math.max(prices.max, 5000);

  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const catIds = new Set(
        categories.filter((c) => catSlugs.includes(c.slug)).map((c) => c.id),
      );
      let list = products.filter((p) => {
        if (catSlugs.length && catIds.size && !catIds.has(p.category_id)) return false;
        if (brandSel.length && !(p.brand_name && brandSel.includes(p.brand_name))) return false;
        if (materialSel.length && !(p.material && materialSel.includes(p.material))) return false;
        if (colorSel.length && !(p.colors ?? []).some((c) => colorSel.includes(c))) return false;
        if (inStock && p.stock_quantity <= 0) return false;
        if (p.price < range[0] || p.price > range[1]) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const haystack = [p.name, p.brand_name, p.material, p.sku, p.category_name, ...(p.tags ?? [])]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      });
      const sorters: Record<string, (a: Product, b: Product) => number> = {
        popular: (a, b) => b.sold - a.sold,
        "price-asc": (a, b) => a.price - b.price,
        "price-desc": (a, b) => b.price - a.price,
        newest: (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        discount: (a, b) => (b.discount ?? 0) - (a.discount ?? 0),
      };
      list = list.sort(sorters[sort] ?? sorters.popular);
      setResult(list);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [products, categories, catSlugs, brandSel, materialSel, colorSel, inStock, sort, range, search]);

  const toggle = (arr: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) =>
    setter(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);

  const activeCount =
    catSlugs.length + brandSel.length + materialSel.length + colorSel.length + (inStock ? 1 : 0);

  const clearAll = () => {
    setCatSlugs([]);
    setBrandSel([]);
    setMaterialSel([]);
    setColorSel([]);
    setInStock(false);
    setRange([0, maxPrice]);
  };

  const filterPanel = (
    <div className="space-y-6 p-1">
      <FilterSection
        title="Search"
        initialOpen
        content={
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search within results…"
            className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        }
      />
      <FilterSection
        title="Category"
        content={
          <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
            {categories.map((c) => (
              <FilterCheck
                key={c.id}
                label={c.name}
                checked={catSlugs.includes(c.slug)}
                onToggle={() => toggle(catSlugs, setCatSlugs, c.slug)}
              />
            ))}
          </div>
        }
      />
      <FilterSection
        title="Price (per unit)"
        content={
          <div>
            <Slider min={0} max={maxPrice} step={10} value={range} onValueChange={setRange} />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{formatINR(range[0])}</span>
              <span>{formatINR(range[1])}</span>
            </div>
          </div>
        }
      />
      <FilterSection
        title="Brand"
        content={
          <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
            {brands.map((b) => (
              <FilterCheck key={b} label={b} checked={brandSel.includes(b)} onToggle={() => toggle(brandSel, setBrandSel, b)} />
            ))}
          </div>
        }
      />
      <FilterSection
        title="Material"
        content={
          <div className="flex flex-wrap gap-2">
            {materials.map((m) => (
              <button
                key={m}
                onClick={() => toggle(materialSel, setMaterialSel, m)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  materialSel.includes(m) ? "border-accent bg-accent text-accent-foreground" : "hover:border-accent",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        }
      />
      <FilterSection
        title="Color"
        content={
          <div className="flex flex-wrap gap-2">
            {colors.slice(0, 16).map((c) => (
              <button
                key={c}
                onClick={() => toggle(colorSel, setColorSel, c)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  colorSel.includes(c) ? "border-accent bg-accent text-accent-foreground" : "hover:border-accent",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        }
      />
      <FilterSection
        title="Availability"
        content={
          <FilterCheck label="In stock only" checked={inStock} onToggle={() => setInStock((v) => !v)} />
        }
      />
      {activeCount > 0 && (
        <Button variant="ghost" onClick={clearAll} className="w-full text-destructive">
          Clear all filters ({activeCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-3xl border bg-card p-5">{filterPanel}</div>
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{loading ? "…" : result.length}</span> of {products.length} products
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setFilterOpen(true)}>
              <SlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && `(${activeCount})`}
            </Button>
            <div className="w-48">
              <Select
                value={sort}
                onValueChange={setSort}
                options={[
                  { value: "popular", label: "Most Popular" },
                  { value: "newest", label: "Newest First" },
                  { value: "price-asc", label: "Price: Low to High" },
                  { value: "price-desc", label: "Price: High to Low" },
                  { value: "discount", label: "Biggest Discount" },
                ]}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : result.length === 0 ? (
          <div className="rounded-3xl border border-dashed py-20 text-center">
            <p className="font-display text-xl font-semibold">No products found</p>
            <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters.</p>
            <Button variant="gold" className="mt-5" onClick={clearAll}>Clear Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {result.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-accent" /> Filters
            </SheetTitle>
          </SheetHeader>
          <div className="p-5 pt-2">{filterPanel}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function FilterSection({ title, content, initialOpen = false }: { title: string; content: React.ReactNode; initialOpen?: boolean }) {
  const [open, setOpen] = React.useState(initialOpen);
  return (
    <div className="border-b pb-4 last:border-b-0 last:pb-0">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between py-1">
        <span className="text-sm font-semibold">{title}</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3">{content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterCheck({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-sm transition hover:bg-secondary/60">
      <span
        className={cn(
          "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition",
          checked ? "border-accent bg-accent text-accent-foreground" : "border-input",
        )}
      >
        {checked && <Check className="h-3 w-3" />}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onToggle} />
      {label}
    </label>
  );
}

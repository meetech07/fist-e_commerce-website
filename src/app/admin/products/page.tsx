"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { deleteProduct, isDbConfigured, updateProduct } from "@/lib/admin-api";

export default function AdminProducts() {
  const { products, setCollection } = useAdminStore();
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [stockFilter, setStockFilter] = React.useState<"all" | "low" | "out">("all");
  const [toDelete, setToDelete] = React.useState<string | null>(null);

  const filtered = products.filter((p) => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || [p.name, p.sku, p.brand_name, p.category_name].filter(Boolean).join(" ").toLowerCase().includes(q);
    const matchStock = stockFilter === "all" || (stockFilter === "low" ? p.stock_quantity > 0 && p.stock_quantity <= 20 : p.stock_quantity <= 0);
    return matchQ && matchStock;
  });

  const togglePublish = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const updated = { ...target, is_published: !target.is_published, updated_at: new Date().toISOString() };
    setCollection("products", products.map((p) => (p.id === id ? updated : p)));
    if (isDbConfigured() && !(await updateProduct(updated))) toast.error("Could not sync to database");
    toast.success("Product updated");
  };

  const quickStock = async (id: string, delta: number) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const updated = { ...target, stock_quantity: Math.max(0, target.stock_quantity + delta), updated_at: new Date().toISOString() };
    setCollection("products", products.map((p) => (p.id === id ? updated : p)));
    if (isDbConfigured() && !(await updateProduct(updated))) toast.error("Could not sync to database");
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    if (isDbConfigured() && !(await deleteProduct(toDelete))) {
      toast.error("Could not delete from database");
      return;
    }
    setCollection("products", products.filter((p) => p.id !== toDelete));
    setToDelete(null);
    toast.success("Product deleted");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} total · {products.filter((p) => p.is_published).length} published</p>
        </div>
        <Button size="sm" onClick={() => router.push("/admin/products/new")}>
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-60 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, SKU, brand…" className="pl-10" />
        </div>
        <div className="flex gap-2">
          {(["all", "low", "out"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStockFilter(s)}
              className={cn("rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition", stockFilter === s ? "bg-primary text-primary-foreground" : "border")}
            >
              {s === "low" ? "Low stock" : s === "out" ? "Out of stock" : "All"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border bg-card">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b bg-secondary/40 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">No products match your filters.</td></tr>
            )}
            {filtered.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-secondary/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
                      <Image src={p.images[0] ?? ""} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.sku} · sold {p.sold}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{p.category_name ?? "—"}</td>
                <td className="p-4 font-semibold">
                  {formatINR(p.price)}
                  {p.mrp > p.price && <span className="ml-1.5 text-xs text-muted-foreground line-through">{formatINR(p.mrp)}</span>}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className={cn("font-semibold", p.stock_quantity === 0 ? "text-destructive" : p.stock_quantity <= 20 ? "text-warning" : "text-success")}>
                      {p.stock_quantity}
                    </span>
                    <button onClick={() => quickStock(p.id, -1)} className="flex h-6 w-6 items-center justify-center rounded-full border text-xs hover:bg-secondary">−</button>
                    <button onClick={() => quickStock(p.id, 1)} className="flex h-6 w-6 items-center justify-center rounded-full border text-xs hover:bg-secondary">+</button>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={p.is_published ? "gold" : "outline"}>{p.is_published ? "Published" : "Draft"}</Badge>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => togglePublish(p.id)} title="Toggle publish">
                      {p.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/admin/products/${p.id}/edit`)} title="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setToDelete(p.id)} title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!toDelete} onOpenChange={(v) => !v && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription>This will permanently remove the product from your catalogue. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

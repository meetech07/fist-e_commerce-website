"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { useAdminStore } from "@/lib/admin-store";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { products } = useAdminStore();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-xl font-semibold">Product not found</p>
        <Link href="/admin/products" className="mt-3 inline-block text-sm text-accent hover:underline">Back to products</Link>
      </div>
    );
  }

  return <ProductForm product={product} mode="edit" />;
}

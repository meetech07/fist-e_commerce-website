import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/data";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit") ?? "6"), 24);
  const products = await searchProducts(q);
  return NextResponse.json({ products: products.slice(0, limit), total: products.length });
}

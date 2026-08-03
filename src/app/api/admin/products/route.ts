import { NextRequest, NextResponse } from "next/server";
import { getStaffUser } from "@/lib/supabase/staff";

const isConfigured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

const COLUMNS = [
  "slug",
  "name",
  "description",
  "short_description",
  "price",
  "mrp",
  "gst",
  "category_id",
  "brand_id",
  "sku",
  "stock_quantity",
  "unit",
  "images",
  "colors",
  "sizes",
  "thickness",
  "material",
  "specifications",
  "features",
  "tags",
  "is_featured",
  "is_best_seller",
  "is_new_arrival",
  "is_published",
  "views",
  "sold",
  "seo_title",
  "seo_description",
];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function sanitize(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const key of COLUMNS) {
    if (body[key] === undefined) continue;
    out[key] = body[key];
  }
  if (out.category_id && typeof out.category_id === "string" && !UUID_RE.test(out.category_id)) {
    out.category_id = null;
  }
  if (out.brand_id && typeof out.brand_id === "string" && !UUID_RE.test(out.brand_id)) {
    out.brand_id = null;
  }
  if (typeof out.price === "string") out.price = Number(out.price);
  if (typeof out.mrp === "string") out.mrp = Number(out.mrp);
  if (typeof out.gst === "string") out.gst = Number(out.gst);
  if (typeof out.stock_quantity === "string") out.stock_quantity = Number(out.stock_quantity);
  return out;
}

export async function GET() {
  if (!isConfigured()) return NextResponse.json({ data: [] });
  const staff = await getStaffUser();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = (await import("@/lib/supabase/admin")).createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  if (!isConfigured()) return NextResponse.json({ error: "Not configured" }, { status: 400 });
  const staff = await getStaffUser();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const record = sanitize(body);
  if (!record.name || !record.slug) {
    return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
  }

  const supabase = (await import("@/lib/supabase/admin")).createAdminClient();
  const { data, error } = await supabase.from("products").insert(record).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest) {
  if (!isConfigured()) return NextResponse.json({ error: "Not configured" }, { status: 400 });
  const staff = await getStaffUser();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, ...rest } = body as { id?: string } & Record<string, unknown>;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const record = sanitize(rest);
  const supabase = (await import("@/lib/supabase/admin")).createAdminClient();
  const { data, error } = await supabase.from("products").update(record).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(request: NextRequest) {
  if (!isConfigured()) return NextResponse.json({ error: "Not configured" }, { status: 400 });
  const staff = await getStaffUser();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const supabase = (await import("@/lib/supabase/admin")).createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

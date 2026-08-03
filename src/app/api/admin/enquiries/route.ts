import { NextRequest, NextResponse } from "next/server";
import { getStaffUser } from "@/lib/supabase/staff";

const isConfigured = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

export async function GET() {
  if (!isConfigured()) return NextResponse.json({ data: [] });
  const staff = await getStaffUser();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = (await import("@/lib/supabase/admin")).createAdminClient();
  const { data, error } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest) {
  if (!isConfigured()) return NextResponse.json({ error: "Not configured" }, { status: 400 });
  const staff = await getStaffUser();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, is_read } = body as { id?: string; is_read?: boolean };
  if (!id || typeof is_read !== "boolean") {
    return NextResponse.json({ error: "id and is_read are required" }, { status: 400 });
  }

  const supabase = (await import("@/lib/supabase/admin")).createAdminClient();
  const { error } = await supabase.from("enquiries").update({ is_read }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  if (!isConfigured()) return NextResponse.json({ error: "Not configured" }, { status: 400 });
  const staff = await getStaffUser();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const supabase = (await import("@/lib/supabase/admin")).createAdminClient();
  const { error } = await supabase.from("enquiries").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? "").toLowerCase();
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = (await import("@/lib/supabase/admin")).createAdminClient();
      await supabase.from("subscribers").upsert({ email }, { onConflict: "email", ignoreDuplicates: true });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, city, material, area, message } = body as Record<string, string>;
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = (await import("@/lib/supabase/admin")).createAdminClient();
      await supabase.from("enquiries").insert({
        name: name.slice(0, 100),
        email: String(email).toLowerCase().slice(0, 150),
        phone: phone?.slice(0, 15),
        subject: `QUOTE · ${material ?? ""} · ${area ?? ""}`.slice(0, 150),
        message: `City: ${city ?? ""}\nArea: ${area ?? ""}\n\n${message ?? ""}`.slice(0, 3000),
        type: "quote",
      });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}

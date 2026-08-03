import { NextRequest, NextResponse } from "next/server";

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body as {
      name?: string;
      email?: string;
      phone?: string;
      subject?: string;
      message?: string;
    };

    if (!name || !email || !message || !isValidEmail(email ?? "")) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = (await import("@/lib/supabase/admin")).createAdminClient();
      const { error } = await supabase.from("enquiries").insert({
        name: name.slice(0, 100),
        email: email.toLowerCase().slice(0, 150),
        phone: phone?.slice(0, 15),
        subject: subject?.slice(0, 150),
        message: message.slice(0, 3000),
        type: "contact",
      });
      if (error) throw error;
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
  }
}

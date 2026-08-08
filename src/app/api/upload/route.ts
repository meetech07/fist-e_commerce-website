import { NextRequest, NextResponse } from "next/server";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = String(formData.get("folder") ?? "product-images");

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "Invalid image type" }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image too large (max 8MB)" }, { status: 400 });

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const buf = Buffer.from(await file.arrayBuffer());
      const url = `data:${file.type};base64,${buf.toString("base64")}`;
      return NextResponse.json({ url, path: "" });
    }

    const supabase = (await import("@/lib/supabase/admin")).createAdminClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`;
    const path = `${folder}/${fileName}`;

    const { error } = await supabase.storage.from(folder).upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: urlData } = supabase.storage.from(folder).getPublicUrl(path);
    return NextResponse.json({ url: urlData.publicUrl, path });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

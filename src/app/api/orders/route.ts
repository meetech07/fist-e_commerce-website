import { NextRequest, NextResponse } from "next/server";
import type { Order } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<Order>;
    if (!body.order_number || !body.items?.length || !body.customer_name || !body.address) {
      return NextResponse.json({ error: "Missing order details" }, { status: 400 });
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = (await import("@/lib/supabase/admin")).createAdminClient();
      const { data, error } = await supabase
        .from("orders")
        .insert({
          order_number: body.order_number,
          user_id: body.user_id ?? null,
          customer_name: body.customer_name,
          customer_email: body.customer_email,
          customer_phone: body.customer_phone,
          items: body.items,
          subtotal: body.subtotal,
          discount: body.discount,
          coupon_code: body.coupon_code,
          gst_amount: body.gst_amount,
          shipping: body.shipping,
          total: body.total,
          payment_method: body.payment_method,
          payment_status: body.payment_status,
          payment_id: body.payment_id,
          status: body.status,
          address: body.address,
          notes: body.notes,
          gstin: body.gstin,
        })
        .select("id")
        .single();
      if (error) throw error;
      return NextResponse.json({ ok: true, orderId: data.id });
    }

    return NextResponse.json({ ok: true, orderId: `local_${Date.now()}` });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

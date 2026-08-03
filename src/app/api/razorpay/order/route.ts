import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const amount = Math.round(Number(body?.amount));
    const currency = String(body?.currency ?? "INR");

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({
        id: `mock_${Date.now()}`,
        amount,
        currency,
        mock: true,
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `pe_${Date.now()}`,
      notes: { merchant: "DIA Enterprises" },
    });

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}

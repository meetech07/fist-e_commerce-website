"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Printer } from "lucide-react";
import { useOrders } from "@/lib/hooks/useOrders";
import { formatINR, formatDateTime, formatINRDecimal } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useBusinessSettings } from "@/lib/business-store";
import { Logo } from "@/components/layout/Logo";

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const { orders, loading } = useOrders();
  const { settings } = useBusinessSettings();
  const order = orders.find((o) => o.order_number === id);

  if (loading) return <div className="skeleton mx-auto mt-20 h-screen max-w-4xl rounded-3xl" />;

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl py-32 text-center">
        <p className="font-display text-xl font-semibold">Invoice not found</p>
        <p className="mt-2 text-sm text-muted-foreground">Please login and open the invoice from your orders.</p>
      </div>
    );
  }

  const subtotalExclGst = Math.round((order.subtotal - order.gst_amount) * 100) / 100;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="no-print mb-6 flex justify-end">
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Print / Save PDF
        </Button>
      </div>

      <div id="invoice" className="rounded-3xl border bg-white p-8 text-slate-900 shadow-xl sm:p-12">
        <div className="flex flex-wrap items-start justify-between gap-6 border-b pb-8">
          <div>
            <div className="[&_*]:!text-slate-900"><Logo /></div>
            <p className="mt-4 text-sm text-slate-600">{settings.showroom.line1}</p>
            <p className="text-sm text-slate-600">{settings.showroom.line2}</p>
            <p className="text-sm text-slate-600">{settings.showroom.city}, {settings.showroom.state} — {settings.showroom.pincode}</p>
            <p className="text-sm text-slate-600">Phone: {settings.phone}</p>
            <p className="text-sm text-slate-600">Email: {settings.email}</p>
            {settings.gstEnabled && settings.gstin && (
              <p className="mt-1 text-sm font-medium text-slate-800">GSTIN: {settings.gstin}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Tax Invoice</p>
            <p className="mt-3 font-display text-2xl font-bold">{order.invoice_number ?? order.order_number}</p>
            <p className="text-sm text-slate-600">Date: {formatDateTime(order.created_at)}</p>
            <p className="text-sm text-slate-600">Payment: {order.payment_method} ({order.payment_status})</p>
          </div>
        </div>

        <div className="grid gap-8 py-8 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Bill To</p>
            <p className="mt-2 font-semibold">{order.customer_name}</p>
            <p className="text-sm text-slate-600">{order.address.line1}</p>
            <p className="text-sm text-slate-600">{order.address.city}, {order.address.state} — {order.address.pincode}</p>
            <p className="text-sm text-slate-600">{order.customer_phone}</p>
            {order.gstin && <p className="text-sm font-medium text-slate-800">GSTIN: {order.gstin}</p>}
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Ship To</p>
            <p className="mt-2 text-sm text-slate-700">{order.address.line1}, {order.address.line2 && `${order.address.line2}, `}{order.address.city}, {order.address.state} — {order.address.pincode}</p>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-y bg-slate-50 text-left">
              <th className="px-3 py-3 font-semibold">Item</th>
              <th className="px-3 py-3 font-semibold">Qty</th>
              <th className="px-3 py-3 text-right font-semibold">Unit Price</th>
              {settings.gstEnabled && <th className="px-3 py-3 text-right font-semibold">GST</th>}
              <th className="px-3 py-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="px-3 py-3">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.unit}</p>
                </td>
                <td className="px-3 py-3">{item.quantity}</td>
                <td className="px-3 py-3 text-right">{formatINRDecimal(item.price)}</td>
                {settings.gstEnabled && <td className="px-3 py-3 text-right">{item.gst}%</td>}
                <td className="px-3 py-3 text-right font-semibold">{formatINRDecimal(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-600">Taxable Value</span><span>{formatINRDecimal(subtotalExclGst)}</span></div>
            {settings.gstEnabled && (
              <div className="flex justify-between"><span className="text-slate-600">GST Amount</span><span>{formatINRDecimal(order.gst_amount)}</span></div>
            )}
            <div className="flex justify-between"><span className="text-slate-600">Discount</span><span>− {formatINRDecimal(order.discount)}</span></div>
            <div className="flex justify-between"><span className="text-slate-600">Shipping</span><span>{order.shipping === 0 ? "FREE" : formatINRDecimal(order.shipping)}</span></div>
            <div className="flex justify-between border-t pt-2 text-base font-bold"><span>Grand Total</span><span>{formatINR(order.total)}</span></div>
          </div>
        </div>

        <div className="mt-10 flex items-end justify-between border-t pt-6">
          <p className="max-w-sm text-xs text-slate-500">
            This is a computer-generated {settings.gstEnabled ? "GST " : ""}invoice. Subject to {settings.legalName} jurisdiction.
            Goods once sold are exchangeable subject to our return policy.
          </p>
          <p className="text-sm font-semibold">For {settings.legalName}</p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { background: white; }
          .no-print, header, footer { display: none !important; }
          #invoice { box-shadow: none; border: none; margin: 0; }
        }
      `}</style>
    </div>
  );
}

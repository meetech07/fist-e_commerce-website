"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { formatDate, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function AdminCustomers() {
  const { customers } = useAdminStore();
  const [query, setQuery] = React.useState("");

  const filtered = customers.filter((c) => {
    const q = query.trim().toLowerCase();
    return !q || [c.name, c.email, c.phone, c.company].filter(Boolean).join(" ").toLowerCase().includes(q);
  });

  const b2b = customers.filter((c) => c.company || c.gstin).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">Customers</h1>
        <p className="text-sm text-muted-foreground">{customers.length} customers · {b2b} B2B accounts</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email, company…" className="pl-10" />
      </div>

      <div className="overflow-x-auto rounded-3xl border bg-card">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-b bg-secondary/40 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <th className="p-4">Customer</th>
              <th className="p-4">Company</th>
              <th className="p-4">GSTIN</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-10 text-center text-muted-foreground">No customers found.</td></tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-secondary/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">{getInitials(c.name)}</span>
                    <div>
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email} · {c.phone || "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">{c.company || "—"}</td>
                <td className="p-4 text-xs">{c.gstin || "—"}</td>
                <td className="p-4">
                  <Badge variant={c.role === "customer" ? "outline" : "gold"}>{c.role}</Badge>
                </td>
                <td className="p-4 text-muted-foreground">{formatDate(c.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

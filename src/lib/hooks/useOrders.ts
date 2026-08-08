"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import type { Order } from "@/types";
import { getLocalOrders } from "@/lib/orders-local";

export function useOrders() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    if (configured) {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (!data.user) {
          setOrders(getLocalOrders());
          setLoading(false);
          return;
        }
        supabase
          .from("orders")
          .select("*")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false })
          .then(({ data: rows }) => {
            setOrders((rows ?? []) as Order[]);
            setLoading(false);
          });
      });
    } else {
      setOrders(getLocalOrders());
      setLoading(false);
    }
  }, []);

  const updateOrder = (orderNumber: string, patch: Partial<Order>) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.order_number === orderNumber ? { ...o, ...patch, updated_at: new Date().toISOString() } : o));
      saveLocal(next);
      return next;
    });
  };

  const saveLocal = (orders: Order[]) => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      localStorage.setItem("pe_orders", JSON.stringify(orders));
    }
  };

  return { orders, loading, updateOrder };
}

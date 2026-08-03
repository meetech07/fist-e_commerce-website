"use client";

import * as React from "react";
import { toast } from "sonner";
import type { CartItem, Product, WishlistItem } from "@/types";

const CART_KEY = "pe_cart";
const WISHLIST_KEY = "pe_wishlist";
const COMPARE_KEY = "pe_compare";
const RECENT_KEY = "pe_recent";

export interface CompareItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  brand?: string | null;
  material?: string | null;
  colors: string[];
  thickness: string[];
  stock: number;
}

interface StoreContextValue {
  cart: CartItem[];
  wishlist: WishlistItem[];
  compare: CompareItem[];
  recent: Product[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, quantity?: number, options?: { color?: string; size?: string }) => void;
  removeFromCart: (productId: string, options?: { color?: string; size?: string }) => void;
  updateCartQty: (productId: string, quantity: number, options?: { color?: string; size?: string }) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  toggleCompare: (product: Product) => void;
  isCompared: (productId: string) => boolean;
  clearCompare: () => void;
  addRecent: (product: Product) => void;
  cartKey: (productId: string, options?: { color?: string; size?: string }) => string;
  totalGst: number;
}

const StoreContext = React.createContext<StoreContextValue | null>(null);

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [wishlist, setWishlist] = React.useState<WishlistItem[]>([]);
  const [compare, setCompare] = React.useState<CompareItem[]>([]);
  const [recent, setRecent] = React.useState<Product[]>([]);

  React.useEffect(() => {
    setCart(load(CART_KEY, []));
    setWishlist(load(WISHLIST_KEY, []));
    setCompare(load(COMPARE_KEY, []));
    setRecent(load(RECENT_KEY, []));
  }, []);

  const persist = (key: string, value: unknown) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  const cartKey = (productId: string, options?: { color?: string; size?: string }) =>
    `${productId}::${options?.color ?? ""}::${options?.size ?? ""}`;

  const addToCart = (product: Product, quantity = 1, options?: { color?: string; size?: string }) => {
    setCart((prev) => {
      const key = cartKey(product.id, options);
      const existing = prev.find((item) => cartKey(item.productId, { color: item.color, size: item.size }) === key);
      let next: CartItem[];
      if (existing) {
        next = prev.map((item) =>
          cartKey(item.productId, { color: item.color, size: item.size }) === key
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock_quantity || 999) }
            : item,
        );
      } else {
        next = [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            mrp: product.mrp,
            gst: product.gst,
            image: product.images[0] ?? "",
            quantity,
            color: options?.color,
            size: options?.size,
            unit: product.unit,
            stock: product.stock_quantity,
          },
        ];
      }
      persist(CART_KEY, next);
      return next;
    });
    toast.success("Added to cart", { description: product.name });
  };

  const removeFromCart = (productId: string, options?: { color?: string; size?: string }) => {
    setCart((prev) => {
      const key = cartKey(productId, options);
      const next = prev.filter((item) => cartKey(item.productId, { color: item.color, size: item.size }) !== key);
      persist(CART_KEY, next);
      return next;
    });
  };

  const updateCartQty = (productId: string, quantity: number, options?: { color?: string; size?: string }) => {
    if (quantity <= 0) return removeFromCart(productId, options);
    setCart((prev) => {
      const key = cartKey(productId, options);
      const next = prev.map((item) =>
        cartKey(item.productId, { color: item.color, size: item.size }) === key
          ? { ...item, quantity: Math.min(quantity, item.stock || 999) }
          : item,
      );
      persist(CART_KEY, next);
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
    persist(CART_KEY, []);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.productId === product.id);
      const next = exists
        ? prev.filter((w) => w.productId !== product.id)
        : [
            ...prev,
            {
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              mrp: product.mrp,
              image: product.images[0] ?? "",
              inStock: product.stock_quantity > 0,
            },
          ];
      persist(WISHLIST_KEY, next);
      toast.success(exists ? "Removed from wishlist" : "Added to wishlist", { description: product.name });
      return next;
    });
  };

  const isWishlisted = (productId: string) => wishlist.some((w) => w.productId === productId);

  const toggleCompare = (product: Product) => {
    setCompare((prev) => {
      const exists = prev.some((c) => c.productId === product.id);
      if (exists) {
        const next = prev.filter((c) => c.productId !== product.id);
        persist(COMPARE_KEY, next);
        return next;
      }
      if (prev.length >= 4) {
        toast.error("You can compare up to 4 products");
        return prev;
      }
      const next = [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0] ?? "",
          price: product.price,
          mrp: product.mrp,
          brand: product.brand_name,
          material: product.material,
          colors: product.colors ?? [],
          thickness: product.thickness ?? [],
          stock: product.stock_quantity,
        },
      ];
      persist(COMPARE_KEY, next);
      toast.success("Added to compare");
      return next;
    });
  };

  const isCompared = (productId: string) => compare.some((c) => c.productId === productId);

  const clearCompare = () => {
    setCompare([]);
    persist(COMPARE_KEY, []);
  };

  const addRecent = (product: Product) => {
    setRecent((prev) => {
      const next = [product, ...prev.filter((p) => p.id !== product.id)].slice(0, 12);
      persist(RECENT_KEY, next);
      return next;
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalGst = cart.reduce((sum, item) => sum + (item.gst || 0) * item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        compare,
        recent,
        cartCount,
        cartSubtotal,
        totalGst,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        toggleWishlist,
        isWishlisted,
        toggleCompare,
        isCompared,
        clearCompare,
        addRecent,
        cartKey,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = React.useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function useCart() {
  const { cart, cartCount, cartSubtotal, totalGst, addToCart, removeFromCart, updateCartQty, clearCart, cartKey } = useStore();
  return { cart, cartCount, cartSubtotal, totalGst, addToCart, removeFromCart, updateCartQty, clearCart, cartKey };
}

export function useWishlist() {
  const { wishlist, toggleWishlist, isWishlisted } = useStore();
  return { wishlist, toggleWishlist, isWishlisted };
}

export function useCompare() {
  const { compare, toggleCompare, isCompared, clearCompare } = useStore();
  return { compare, toggleCompare, isCompared, clearCompare };
}

export function useRecentlyViewed() {
  const { recent, addRecent } = useStore();
  return { recent, addRecent };
}

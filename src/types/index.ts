export type Role = "admin" | "manager" | "staff" | "customer";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string;
  parent_id: string | null;
  icon: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  featured: boolean;
  sort_order: number;
}

export interface ProductImage {
  id?: string;
  url: string;
  alt?: string;
  is_primary?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_description?: string | null;
  price: number;
  mrp: number;
  gst: number;
  discount?: number;
  category_id: string;
  category_name?: string;
  brand_id?: string | null;
  brand_name?: string;
  sku: string;
  stock_quantity: number;
  unit: string;
  images: string[];
  colors: string[];
  sizes: string[];
  thickness: string[];
  material: string | null;
  specifications: Record<string, string>;
  features: string[];
  tags: string[];
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_published: boolean;
  views: number;
  sold: number;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  gst: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
  unit: string;
  stock: number;
}

export interface Address {
  id?: string;
  type: "home" | "office" | "site";
  name: string;
  phone: string;
  email?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  is_default?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  gst: number;
  quantity: number;
  color?: string;
  size?: string;
  unit: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "dispatched"
  | "delivered"
  | "cancelled"
  | "returned"
  | "rejected";

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  coupon_code?: string | null;
  gst_amount: number;
  shipping: number;
  total: number;
  payment_method: "razorpay" | "cod" | "upi";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_id?: string | null;
  status: OrderStatus;
  address: Address;
  notes?: string | null;
  gstin?: string | null;
  invoice_number?: string | null;
  tracking_number?: string | null;
  courier?: string | null;
  return_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  user_name: string;
  rating: number;
  title?: string | null;
  comment: string;
  is_verified: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  tags: string[];
  author: string;
  author_image?: string | null;
  reading_time: number;
  is_published: boolean;
  views: number;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string | null;
  avatar?: string | null;
  rating: number;
  content: string;
  featured: boolean;
  created_at: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  min_cart: number;
  max_discount: number;
  usage_limit: number;
  used_count: number;
  valid_from: string;
  valid_to: string;
  is_active: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  featured: boolean;
  created_at: string;
}

export interface Settings {
  id?: string;
  key: string;
  value: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  type: "contact" | "quote" | "visit" | "callback";
  is_read: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar?: string | null;
  company?: string | null;
  gstin?: string | null;
  created_at: string;
}

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  mrp: number;
  image: string;
  inStock: boolean;
}

export interface ProductFilters {
  categories: string[];
  brands: string[];
  materials: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
  minPriceActive?: number;
  maxPriceActive?: number;
  inStock: boolean;
  sort: "popular" | "price-asc" | "price-desc" | "newest" | "discount";
}

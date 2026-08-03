-- ============================================================
-- DIA ENTERPRISES — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text,
  phone text,
  role text not null default 'customer' check (role in ('admin','manager','staff','customer')),
  avatar text,
  company text,
  gstin text,
  is_blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- CATEGORIES
-- ============================================================
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image text,
  icon text,
  parent_id uuid references public.categories(id) on delete set null,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- BRANDS
-- ============================================================
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  short_description text,
  price numeric(12,2) not null default 0,
  mrp numeric(12,2) not null default 0,
  gst numeric(5,2) not null default 18,
  category_id uuid references public.categories(id) on delete set null,
  brand_id uuid references public.brands(id) on delete set null,
  sku text unique,
  stock_quantity integer not null default 0,
  unit text not null default 'per sq. ft.',
  images text[] not null default '{}',
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  thickness text[] not null default '{}',
  material text,
  specifications jsonb not null default '{}'::jsonb,
  features text[] not null default '{}',
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  is_best_seller boolean not null default false,
  is_new_arrival boolean not null default false,
  is_published boolean not null default true,
  views integer not null default 0,
  sold integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_brand on public.products(brand_id);
create index if not exists idx_products_published on public.products(is_published);
create index if not exists idx_products_featured on public.products(is_featured);
create index if not exists idx_products_new on public.products(is_new_arrival);
create index if not exists idx_products_best on public.products(is_best_seller);

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  coupon_code text,
  gst_amount numeric(12,2) not null default 0,
  shipping numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  payment_method text not null default 'cod' check (payment_method in ('razorpay','cod','upi')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  payment_id text,
  status text not null default 'pending' check (status in ('pending','confirmed','processing','dispatched','delivered','cancelled','returned','rejected')),
  address jsonb not null default '{}'::jsonb,
  notes text,
  gstin text,
  invoice_number text,
  tracking_number text,
  courier text,
  return_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created on public.orders(created_at desc);

-- ============================================================
-- PAYMENTS
-- ============================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  amount numeric(12,2) not null default 0,
  currency text not null default 'INR',
  method text,
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- REVIEWS
-- ============================================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  user_name text not null,
  rating integer not null check (rating between 1 and 5),
  title text,
  comment text not null,
  is_verified boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- WISHLISTS
-- ============================================================
create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

-- ============================================================
-- ADDRESSES
-- ============================================================
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'home' check (type in ('home','office','site')),
  name text not null,
  phone text not null,
  email text,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  pincode text not null,
  landmark text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- COUPONS
-- ============================================================
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text not null default 'percent' check (type in ('percent','fixed')),
  value numeric(10,2) not null default 0,
  min_cart numeric(10,2) not null default 0,
  max_discount numeric(10,2),
  usage_limit integer not null default 100,
  used_count integer not null default 0,
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  is_active boolean not null default true
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  company text,
  avatar text,
  rating integer not null default 5 check (rating between 1 and 5),
  content text not null,
  featured boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- GALLERY
-- ============================================================
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image text not null,
  category text,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- BLOGS
-- ============================================================
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_image text,
  category text,
  tags text[] not null default '{}',
  author text not null default 'DIA Enterprises',
  author_image text,
  reading_time integer not null default 4,
  is_published boolean not null default true,
  views integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- FAQS
-- ============================================================
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  sort_order integer not null default 0
);

-- ============================================================
-- SETTINGS (CMS)
-- ============================================================
create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- NEWSLETTER / ENQUIRIES
-- ============================================================
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  type text not null default 'contact' check (type in ('contact','quote','visit','callback')),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- RETURN / CANCELLATION REQUESTS
-- ============================================================
create table if not exists public.return_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  reason text not null,
  status text not null default 'requested' check (status in ('requested','approved','rejected','completed')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- TRIGGERS
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email, ''), '@', 1)),
    new.phone
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at before update on public.products
  for each row execute function public.touch_updated_at();
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger orders_updated_at before update on public.orders
  for each row execute function public.touch_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.addresses enable row level security;
alter table public.coupons enable row level security;
alter table public.testimonials enable row level security;
alter table public.gallery enable row level security;
alter table public.blogs enable row level security;
alter table public.faqs enable row level security;
alter table public.settings enable row level security;
alter table public.subscribers enable row level security;
alter table public.enquiries enable row level security;
alter table public.return_requests enable row level security;

-- Public read
create policy "public read products" on public.products for select using (is_published = true or auth.role() = 'authenticated');
create policy "public read categories" on public.categories for select using (true);
create policy "public read brands" on public.brands for select using (true);
create policy "public read reviews" on public.reviews for select using (is_published = true);
create policy "public read testimonials" on public.testimonials for select using (true);
create policy "public read gallery" on public.gallery for select using (true);
create policy "public read blogs" on public.blogs for select using (is_published = true);
create policy "public read faqs" on public.faqs for select using (true);
create policy "public read coupons" on public.coupons for select using (is_active = true);

-- Staff write (admin / manager / staff)
create or replace function public.is_staff()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','manager','staff')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "staff write products" on public.products for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write categories" on public.categories for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write brands" on public.brands for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write testimonials" on public.testimonials for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write gallery" on public.gallery for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write faqs" on public.faqs for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write coupons" on public.coupons for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write settings" on public.settings for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write blogs" on public.blogs for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write subscribers" on public.subscribers for all using (public.is_staff()) with check (public.is_staff());
create policy "staff write enquiries" on public.enquiries for all using (public.is_staff()) with check (public.is_staff());

-- Orders: user reads own, staff reads all
create policy "users read own orders" on public.orders for select using (auth.uid() = user_id or public.is_staff());
create policy "users create orders" on public.orders for insert with check (auth.uid() = user_id or public.is_staff());
create policy "users update own orders" on public.orders for update using (auth.uid() = user_id or public.is_staff());
create policy "staff update orders" on public.orders for update using (public.is_staff());

-- Wishlists: user own
create policy "own wishlists" on public.wishlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Addresses: user own
create policy "own addresses" on public.addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Reviews: authenticated create, staff manage
create policy "auth create reviews" on public.reviews for insert with check (auth.uid() = user_id);
create policy "auth update own reviews" on public.reviews for update using (auth.uid() = user_id or public.is_staff());
create policy "staff delete reviews" on public.reviews for delete using (public.is_staff());

-- Profiles: own read/update, staff read
create policy "own profile" on public.profiles for select using (auth.uid() = id or public.is_staff());
create policy "own profile update" on public.profiles for update using (auth.uid() = id or public.is_admin());
create policy "staff update profiles" on public.profiles for update using (public.is_staff());

-- Payments: staff only
create policy "staff read payments" on public.payments for select using (public.is_staff());
create policy "staff insert payments" on public.payments for insert with check (public.is_staff());

-- Return requests: own, staff all
create policy "own returns" on public.return_requests for select using (auth.uid() = user_id or public.is_staff());
create policy "auth create returns" on public.return_requests for insert with check (auth.uid() = user_id or public.is_staff());
create policy "staff update returns" on public.return_requests for update using (public.is_staff());

-- Enquiries: anyone can insert
create policy "insert enquiries" on public.enquiries for insert with check (true);
create policy "staff read enquiries" on public.enquiries for select using (public.is_staff());

-- Subscribers: anyone insert
create policy "insert subscribers" on public.subscribers for insert with check (true);

-- ============================================================
-- STORAGE: product images bucket
-- ============================================================
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('cms', 'cms', true)
on conflict (id) do nothing;

create policy "public read product-images" on storage.objects for select using (bucket_id = 'product-images');
create policy "staff upload product-images" on storage.objects for insert with check (bucket_id = 'product-images' and public.is_staff());
create policy "staff update product-images" on storage.objects for update using (bucket_id = 'product-images' and public.is_staff());
create policy "staff delete product-images" on storage.objects for delete using (bucket_id = 'product-images' and public.is_staff());
create policy "public read cms" on storage.objects for select using (bucket_id = 'cms');
create policy "staff upload cms" on storage.objects for insert with check (bucket_id = 'cms' and public.is_staff());

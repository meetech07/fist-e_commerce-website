<p align="center">
  <img src="public/icon.png" alt="DIA Enterprises logo" width="90" />
</p>

<h1 align="center">🪜 DIA Enterprises</h1>

<p align="center">
  <b>False Ceiling & Interior Materials Store</b> — a full B2B + B2C e-commerce platform for PVC/WPC panels, gypsum boards, ceiling channels, louvers, wall mouldings and everything in between.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5-black?logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3fcf8e?logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Razorpay-0C2451?logo=razorpay&logoColor=white" />
  <img src="https://img.shields.io/badge/Three.js-000000?logo=threedotjs&logoColor=white" />
  <img src="https://img.shields.io/github/actions/workflow/status/meetech07/fist-e_commerce-website/ci.yml?branch=main&label=CI" />
  <img src="https://img.shields.io/badge/deployed%20on-Vercel-000000?logo=vercel&logoColor=white" />
</p>

---

## What is this?

DIA Enterprises is an online storefront I built for a false ceiling & interior materials business. It started as a pretty simple "just put the products on the web" idea and slowly grew into a full platform — product catalog, real payments, GST invoices, an admin panel, the whole deal.

It supports both retail customers (B2C) and contractors/dealers (B2B). Dealers can grab a GST invoice, apply coupons, get bulk pricing, request a custom quote and even book installation services.

> 💡 **No backend? No problem.** If you don't set the Supabase keys, the site runs in **demo mode** — products come from mock data and cart/orders/auth are stored in `localStorage`. You can literally clone it, run `npm run dev`, and play with everything offline.

---

## ✨ Features

**🛍️ Storefront**
- 3D WebGL hero animation (Three.js / React Three Fiber)
- Product catalog with filters — price, brand, material, color, stock
- Product detail pages with gallery, specs and related items
- Wishlist, product compare, recently-viewed, quick view
- Full search overlay with live results

**🛒 Cart & Checkout**
- Razorpay payments (cards / UPI / netbanking)
- Cash on Delivery
- Coupons & discount codes
- B2B GSTIN capture
- Auto GST invoice generation (₹ pricing)
- Free shipping above ₹5,000 (else ₹150)

**👤 Accounts**
- Login / Signup / OTP verification
- Order history with status timeline + cancel / return
- Printable GST invoices
- Saved addresses
- Profile with avatar upload

**🛠️ Admin panel** (`/admin`)
- Dashboard with sales stats
- Product CRUD with image upload
- Order management
- Customer list
- Coupon manager
- CMS — testimonials, gallery, FAQs, blog posts
- Site settings
- Roles: `admin`, `manager`, `staff`

**📄 Marketing pages**
- Blog (with full blog post pages)
- About, Contact, Quote request
- Installation services page
- Gallery, testimonials
- Legal: privacy policy, refund policy, terms

**🔍 SEO**
- Sitemap & robots.txt
- Open Graph tags
- JSON-LD structured data (Organization, Product, BlogPosting, Breadcrumb)

---

## 🧱 Tech Stack

| Layer | What I used |
| --- | --- |
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19, TypeScript 5, Tailwind CSS v4 |
| Animations | Framer Motion, GSAP, Three.js / React Three Fiber |
| Backend | Supabase (Auth + Postgres + Storage) |
| Payments | Razorpay |
| Forms | React Hook Form + Zod |
| Components | shadcn-style UI built on Radix primitives |
| Icons | lucide-react |
| Toasts | sonner |

---

## 🚀 Getting Started

### Requirements

- **Node.js 20+** (needs to support Next.js 15)
- npm (comes with Node)

### Run it locally

```bash
# 1. clone the repo
git clone https://github.com/meetech07/fist-e_commerce-website.git
cd fist-e_commerce-website

# 2. install dependencies
npm install

# 3. start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — that's it.

### 🔑 Demo credentials

Use these to try the admin panel and checkout in demo mode:

| Type | Value |
| --- | --- |
| Admin login | `admin@diaenterprises.in` / `Admin@123` |
| Coupons | `WELCOME10`, `SAVE500`, `CEILING15` |
| Free shipping | orders above ₹5,000 |

---

## ⚙️ Environment Variables

Copy `.env.example` → `.env.local` and fill in real values to enable Supabase and Razorpay. Without them, the app silently runs in demo mode.

| Variable | Purpose | Where to find it |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (safe for browser) | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key (orders, uploads, CMS) | Supabase → Project Settings → service_role |
| `RAZORPAY_KEY_ID` | Server key (create/verify orders) | Razorpay Dashboard → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Server secret | Razorpay Dashboard → Settings → API Keys |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client key for checkout popup | Razorpay Dashboard |

There's a ready-made `supabase/schema.sql` + `supabase/seed.sql` in the repo if you want to set up the database from scratch.

---

## 📁 Project Structure

```
.
├── .github/
│   └── workflows/
│       ├── ci.yml                 # lint + type-check + build
│       └── deploy.yml             # Vercel auto-deploy
├── public/
│   ├── icon.png                   # 512×512 app icon
│   ├── icon-192.png               # 192×192 PWA icon
│   ├── og-default.png             # social share image
│   ├── manifest.json              # PWA manifest
│   └── *.svg                      # default Next assets
├── src/
│   ├── middleware.ts              # auth + role protection
│   ├── app/                       # App Router routes
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx             # root layout + SEO metadata
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx               # homepage
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── about/                 # about page
│   │   ├── account/               # user dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── addresses/
│   │   │   ├── invoices/
│   │   │   │   └── [id]/          # invoice detail
│   │   │   ├── orders/
│   │   │   │   └── [id]/          # order detail
│   │   │   ├── profile/
│   │   │   ├── recently-viewed/
│   │   │   └── wishlist/
│   │   ├── admin/                 # admin panel
│   │   │   ├── layout.tsx
│   │   │   ├── cms/
│   │   │   ├── coupons/
│   │   │   ├── customers/
│   │   │   ├── enquiries/
│   │   │   ├── login/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   │   ├── new/
│   │   │   │   └── [id]/edit/
│   │   │   └── settings/
│   │   ├── api/                   # route handlers
│   │   │   ├── admin/
│   │   │   │   ├── enquiries/
│   │   │   │   └── products/
│   │   │   ├── contact/
│   │   │   ├── newsletter/
│   │   │   ├── orders/
│   │   │   ├── quote/
│   │   │   ├── razorpay/
│   │   │   │   ├── order/
│   │   │   │   └── verify/
│   │   │   ├── search/
│   │   │   └── upload/
│   │   ├── blog/
│   │   │   └── [slug]/            # blog post
│   │   ├── cart/
│   │   ├── categories/
│   │   ├── category/[slug]/       # category landing
│   │   ├── checkout/
│   │   ├── compare/
│   │   ├── contact/
│   │   ├── forgot-password/
│   │   ├── installation/
│   │   ├── login/
│   │   ├── order-confirmed/
│   │   ├── otp/
│   │   ├── privacy-policy/
│   │   ├── products/
│   │   │   └── [slug]/            # product detail
│   │   ├── quote/
│   │   ├── refund-policy/
│   │   ├── search/
│   │   ├── signup/
│   │   └── terms/
│   ├── components/
│   │   ├── account/               # AccountShell, StatusBadge
│   │   ├── admin/                 # AdminShell, ProductForm
│   │   ├── auth/                  # AuthFlow
│   │   ├── cart/                  # CartPageClient
│   │   ├── checkout/              # CheckoutFlow
│   │   ├── home/                  # homepage sections + 3D hero
│   │   │   └── three/             # HeroCanvas (WebGL)
│   │   ├── layout/                # Navbar, Footer, CartDrawer…
│   │   ├── products/              # ProductCard, ProductDetail…
│   │   ├── seo/                   # JsonLd
│   │   ├── shared/                # Reveal, Rating, SectionHeading…
│   │   └── ui/                    # shadcn-style primitives
│   │       └── accordion, avatar, badge, button, card, checkbox,
│   │           dialog, input, label, select, separator, sheet,
│   │           skeleton, slider, switch, tabs, textarea, tooltip
│   ├── hooks/                     # useHooks.ts
│   ├── lib/
│   │   ├── admin-api.ts
│   │   ├── admin-store.tsx
│   │   ├── auth-local.ts          # demo-mode auth
│   │   ├── business-config.ts
│   │   ├── business-store.tsx
│   │   ├── constants.ts           # SITE config, nav, testimonials…
│   │   ├── data.ts
│   │   ├── enquiries-local.ts
│   │   ├── orders-local.ts        # demo-mode orders
│   │   ├── prices.ts
│   │   ├── razorpay.ts
│   │   ├── seo.ts
│   │   ├── utils.ts
│   │   ├── data/
│   │   │   └── mock-data.ts       # offline demo products
│   │   ├── hooks/
│   │   │   └── useOrders.ts
│   │   ├── store/
│   │   │   └── store.tsx          # global cart/compare state
│   │   └── supabase/
│   │       ├── admin.ts           # service-role client
│   │       ├── client.ts          # browser client
│   │       ├── server.ts          # SSR client
│   │       └── staff.ts
│   └── types/
│       └── index.ts               # shared types
├── supabase/
│   ├── schema.sql
│   └── seed.sql
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── vercel.json
```

---

## 📜 Scripts

```bash
npm run dev        # development server (Turbopack)
npm run build      # production build (type-check + lint + build)
npm run start      # serve the production build
npm run lint       # eslint
npx tsc --noEmit   # type-check only
```

---

## ☁️ Deployment & CI/CD

**Manual deploy** — Vercel as a standard Next.js app, `vercel.json` is already included:

```bash
npm i -g vercel
vercel
```

Just add the environment variables from above in your project settings and you're live.

**GitHub Actions** — the repo ships with two workflows in `.github/workflows/`:

| Workflow | File | What it does |
| --- | --- | --- |
| CI | `ci.yml` | Runs ESLint, type-check and a full production build on every push / PR to `main` |
| Deploy | `deploy.yml` | Auto-deploys to Vercel production on every push to `main` |

To enable auto-deploy, add these repo secrets (Settings → Secrets and variables → Actions):

| Secret | Where to find it |
| --- | --- |
| `VERCEL_TOKEN` | Vercel → Settings → Tokens (create a new token) |
| `VERCEL_ORG_ID` | Run `vercel link` locally, then check `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Same `.vercel/project.json` file |

> Until those secrets are added, the deploy run will fail with a clear "Missing Vercel secrets" message instead of silently skipping — so you'll always know what's going on.

---

## 🗺️ Roadmap

Things on my list:

- [ ] Real-time stock updates via Supabase Realtime
- [ ] WhatsApp order notifications
- [ ] GST tax report export for admin
- [ ] Multi-currency / export pricing
- [ ] Mobile app wrapper (PWA)
- [ ] More payment gateways (UPI autopay, wallets)

---

## 🙌 Contributing

Found a bug or have an idea? Feel free to open an issue or send a PR. Please keep the code style consistent (Prettier + ESLint are set up). Note: any contribution you send is subject to the license below.

---

## © License & Copyright

**Copyright © 2026 DIA Enterprises. All rights reserved.**

This website and every part of it — the code, design, branding, images and content — belongs to **DIA Enterprises**. The repo is public so you can look around and learn from it, but it is **not** free to reuse.

If you want to use this project, adapt it for your own business, or build on top of it, **please ask for permission first** — drop a mail to `meetech07@gmail.com`. Reusing the "DIA Enterprises" name, logo or any of this code without permission is not allowed. Full terms are in the [`LICENSE`](./LICENSE) file.

---

## 📬 Contact

- Project repo: [github.com/meetech07/fist-e_commerce-website](https://github.com/meetech07/fist-e_commerce-website)
- Business: **DIA Enterprises** — false ceiling & interior materials
- Email: `meetech07@gmail.com`
- Instagram: [@manish.singh06](https://www.instagram.com/manish.singh06?igsh=MTY0anZjN2V2azV5Mg==)

---

<p align="center">
  Built with ☕ and Next.js · © 2026 DIA Enterprises · All rights reserved
</p>

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
├── public/              # static assets, icons, OG images
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── admin/       #   admin panel
│   │   ├── account/     #   user dashboard
│   │   ├── api/         #   route handlers (orders, razorpay, etc.)
│   │   └── ...          #   blog, cart, checkout, products, legal...
│   ├── components/
│   │   ├── ui/          #   reusable UI primitives
│   │   ├── home/        #   homepage sections + 3D hero
│   │   ├── admin/       #   admin panel components
│   │   ├── products/    #   product cards, filters, gallery
│   │   └── ...
│   ├── hooks/           # custom React hooks
│   ├── lib/             # supabase clients, store, mock data
│   ├── types/           # shared TypeScript types
│   └── middleware.ts    # auth + role protection
├── supabase/            # schema.sql + seed.sql
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

> The deploy job auto-skips (instead of failing) until those secrets exist, so you can push freely without setting them up.

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

It's a personal project, but if you spot a bug or have an idea, feel free to open an issue or send a PR. Please keep the code style consistent (Prettier + ESLint are set up).

---

## 📬 Contact

- Project repo: [github.com/meetech07/fist-e_commerce-website](https://github.com/meetech07/fist-e_commerce-website)
- Business: **DIA Enterprises** — false ceiling & interior materials

---

<p align="center">
  Built with ☕ and Next.js · © DIA Enterprises
</p>

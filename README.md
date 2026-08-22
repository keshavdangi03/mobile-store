# Expert Mobile Solution - E-Commerce & Full CMS Platform

A full-stack, enterprise-grade E-Commerce Storefront and Visual Content Management System (CMS) built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Prisma ORM**, and **PostgreSQL (Neon)**.

---

## 🌟 Key Features

### 🛒 E-Commerce Storefront
- **Responsive Modern UI**: Built with custom theme palettes, fluid glassmorphism accents, and mobile-first responsive layout.
- **Product Catalog & Dynamic Filtering**: Shop by category, search with real-time auto-suggestions, and filter by sub-category / brand.
- **Interactive Hero Carousel & Bundles**: Interactive variant and bundle selectors (with stylus, keyboard, etc.) calculating prices live.
- **Service Hub & Online Repair Requests**: Customers can submit diagnostic repair tickets and track repair statuses.
- **Mobile Training Academy**: Course catalog with syllabus downloads, certification masterclasses, and online enrollment.
- **Trader / Seller Platform**: Retailers and traders can register, list refurbished or new devices, and manage storefront inventory.
- **Cart & Instant Checkout**: Persistent drawer cart, voucher codes, and multi-step checkout.
- **Floating Live Support**: Instant WhatsApp assist integration.

### 🎨 Visual CMS & No-Code Page Builder
- **Universal Section Customizer**: Admins can customize any section (Hero Carousel, Services, EMI Promo Banner, Categories, New Arrivals, Limited Deals, Testimonials, and Custom Blocks) directly in the browser.
- **Content Block Canvas & Block Library**: 1-click layout presets, headings, rich text, CTA buttons, video embeds, countdown timers, and feature card grids.
- **Visual Drag & Drop / Section Ordering**: Move sections up/down, duplicate sections, copy/paste, or delete with live viewport preview.
- **Theme & Palette Customizer**: Switch site-wide and section-level color schemes in real time.
- **Global Header & Footer Visual Editor**: Real-time typography, navigation links, and layout controls.
- **Instant Persistence**: Section customizations, theme overrides, and custom pages persist across sessions and publish to the live site with one click.

### 🛡️ Admin Dashboard (`/admin`)
- **Dashboard Overview**: Sales metrics, revenue graphs, order statuses, and recent customer activity.
- **Product Management**: Create, edit, price, and categorize products with image upload support.
- **Repair Tickets Manager**: Update customer repair status (Received, Diagnosing, Repairing, Ready, Completed).
- **Orders & Traders**: Review orders, manage vendor listings, and calculate platform commissions.
- **Courses & Academy**: Manage training curriculum, instructor assignments, and enrollments.

---

## 🏗️ Project Architecture & Structure

```
mobile-store/
├── app/                        # Next.js 16 App Router
│   ├── [slug]/                 # Dynamic CMS custom pages
│   ├── account/                # User dashboard & profile
│   ├── admin/                  # Admin portal
│   │   ├── cms/                # Visual CMS editor & customizer tools
│   │   ├── courses/            # Course management
│   │   ├── orders/             # Order fulfillment
│   │   ├── products/           # Inventory management
│   │   ├── repairs/            # Repair desk workflow
│   │   └── traders/            # Trader applications & devices
│   ├── category/               # Category & catalog pages
│   ├── checkout/               # Checkout workflow
│   ├── product/                # Product details & specifications
│   ├── repair/                 # Online mobile repair desk
│   ├── training/               # Training academy courses
│   ├── actions.ts              # Next.js Server Actions (DB operations)
│   ├── globals.css             # Design tokens & Tailwind CSS v4 setup
│   ├── layout.tsx              # Root HTML shell & metadata
│   └── page.tsx                # Dynamic homepage with CMS section engine
├── components/                 # Modular React UI components
│   ├── block-editor-wrapper.tsx # Canvas block controls
│   ├── block-inserter-modal.tsx # Block library inserter
│   ├── cart-context.tsx        # Global shopping cart context
│   ├── cart-drawer.tsx         # Slide-out cart drawer
│   ├── custom-blank-section.tsx # Visual block canvas & presets
│   ├── editable-image.tsx      # In-place editable image component
│   ├── footer.tsx              # Dynamic footer with CMS controls
│   ├── header.tsx              # Dynamic header with mega-menus & search
│   ├── layout-shell.tsx        # Adaptive page container
│   ├── mega-menu.tsx           # Interactive category mega menu
│   ├── section-customizer-modal.tsx # Tailored multi-tab section editor
│   ├── section-editor-wrapper.tsx   # Visual section hover toolbar
│   └── theme-provider.tsx      # Real-time theme & style manager
├── lib/                        # Utilities, state, and database clients
│   ├── cms-store.ts            # Zustand CMS state store with persistence
│   ├── db-simulation.ts        # Default data models & fallback catalogs
│   ├── prisma.ts               # Prisma ORM client instance
│   └── seed-data.ts            # Database seed dataset
├── prisma/                     # Database schema & migrations
│   └── schema.prisma           # Prisma database schema definition
├── public/                     # Static media & assets
├── .env.example                # Environment variable configuration template
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies & scripts
├── postcss.config.mjs          # PostCSS configuration
└── tsconfig.json               # TypeScript compiler configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.18+ or v20+
- **npm** or **yarn** or **pnpm**
- **PostgreSQL Database** (e.g., [Neon](https://neon.tech), Supabase, or local Postgres)

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd mobile-store
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Update your `.env` with your PostgreSQL database connection string and API keys:

```env
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_google_client_id"
PEXELS_API_KEY="your_pexels_api_key"
```

### 4. Database Setup & Migrations
Push the Prisma schema to your database:

```bash
npx prisma db push
```

### 5. Running the Application
Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Storefront**: `http://localhost:3000/`
- **Visual CMS Customizer**: `http://localhost:3000/admin/cms`
- **Admin Dashboard**: `http://localhost:3000/admin` *(Default: admin / admin)*

---

## 🛠️ Build & Production Deployment

To create a production-ready optimized build:

```bash
npm run build
npm run start
```

### Deploying to Vercel
1. Push your repository to GitHub / GitLab.
2. Import the project into **Vercel**.
3. Add the environment variables from your `.env` file in Vercel Project Settings.
4. Deploy!

---

## 📄 License
Private commercial repository. All rights reserved.

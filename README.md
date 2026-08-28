# 🧭 Northwind Dashboard

A modern, full-stack business intelligence dashboard built with **Next.js 16**, **Supabase**, and **Chakra UI**. Inspired by the classic Northwind database, this application provides real-time insights into orders, products, customers, and regional sales analytics — all wrapped in a polished, responsive UI with dark mode support.

---

## 📸 Preview

### Dashboard
![Dashboard](screenshot/dashboard.png)

### Orders
![Orders](screenshot/orders.png)

### Order Detail Modal
![Order Detail](screenshot/orders_detail.png)

### Products
![Products](screenshot/products.png)

### Customers
![Customers](screenshot/customers.png)

### Region Analytics — Light Mode
![Analytics Light](screenshot/analytics.png)

### Region Analytics — Dark Mode
![Analytics Dark](screenshot/analytics_dark.png)

### Authentication
| Login | Register |
|-------|----------|
| ![Login](public/screenshot_login.png) | ![Register](public/screenshot_register.png) |

### Email Verification Flow
| Check Your Inbox | Verification Email | Account Confirmed |
|------------------|--------------------|-------------------|
| ![Email Check](screenshot/email1.png) | ![Email Content](screenshot/email2.png) | ![Confirmed](screenshot/email3.png) |

### Password Reset
| Forgot Password | Set New Password |
|-----------------|-----------------|
| ![Forgot Password](screenshot/sifre.png) | ![New Password](screenshot/sifre2.png) |

---

## ✨ Features

### 📊 Dashboard
- KPI summary cards: **Total Revenue**, **Order Count**, **Customer Count**, **Active Products**
- **Monthly Revenue** bar chart (Highcharts) with year filter (1996 / 1997 / 1998 / All)
- **Top Countries by Sales** interactive pie chart
- Fully theme-aware charts (dark / light mode tooltips, axis labels, backgrounds)

### 📦 Orders
- Paginated, searchable orders table powered by **TanStack Table**
- Filter by **country** and **search term** (URL-state persisted via `nuqs`)
- Click any row to open an **order detail modal** with line items, discounts, and totals
- Sortable columns with smooth transitions

### 🛍️ Products
- Full **CRUD** operations: Create, Read, Update, Delete
- Filter by **category** and sort by name (asc / desc)
- Confirmation dialog before deletion
- Form validation with **React Hook Form** + **Zod**
- Toast notifications on every mutation

### 👥 Customers
- Full **CRUD** operations for customer records
- Search by **company name**, filter by **city** and **country**
- URL-state pagination — links are shareable and back-button friendly

### 🗺️ Region Analytics
- **Interactive world map** (Highcharts Maps + Highmaps topology)
- Colour-coded order density by country
- Tooltips showing order count and average shipping duration per country
- Built-in zoom, pan, and tooltip interactions
- Glassmorphism card wrapper with full dark / light mode support

### 🔐 Authentication
- **Supabase Auth** (email + password)
- Register, Login, Forgot Password, Email Verification, Update Password flows
- Branded transactional emails sent via **Resend**
- **Route protection** via Next.js Middleware — unauthenticated users are redirected to `/login`
- Authenticated users are redirected away from `/login` and `/register`

### 🌗 Dark / Light Mode
- System preference detection on first load
- Manual toggle persisted across sessions via `next-themes`
- All Chakra UI components and custom charts respect the active theme

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | [Chakra UI v3](https://chakra-ui.com) |
| **Database / Auth** | [Supabase](https://supabase.com) (PostgreSQL + Auth + SSR helpers) |
| **Data Fetching** | [TanStack Query v5](https://tanstack.com/query) |
| **Tables** | [TanStack Table v8](https://tanstack.com/table) |
| **Charts** | [Highcharts 13](https://highcharts.com) + Highcharts Maps |
| **Forms** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| **URL State** | [nuqs](https://nuqs.47ng.com) |
| **Email** | [Resend](https://resend.com) |
| **Icons** | [Lucide React](https://lucide.dev) + [React Icons](https://react-icons.github.io/react-icons/) |
| **Styling** | Tailwind CSS v4 + Chakra UI tokens |
| **Theme** | [next-themes](https://github.com/pacocoursey/next-themes) |

---

## 🗂️ Project Structure

```
northwind/
├── app/
│   ├── (auth)/               # Auth pages (login, register, forgot-password, …)
│   ├── api/                  # API routes (user registration, email send)
│   ├── dashboard/            # KPI cards + revenue charts
│   ├── orders/               # Orders table + detail modal
│   ├── products/             # Products CRUD table
│   ├── customers/            # Customers CRUD table
│   ├── analytics/            # Interactive world map
│   ├── layout.tsx            # Root layout (providers, sidebar, navbar)
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx       # Responsive sidebar (desktop + mobile drawer)
│   │   └── navbar.tsx        # Top navbar with theme toggle
│   ├── RegionMap.tsx         # Highcharts Maps component
│   └── ui/                   # Chakra UI primitives & colour-mode helpers
├── hooks/                    # Data-fetching hooks (TanStack Query)
│   ├── useDashboardData.ts
│   ├── useOrdersData.ts
│   ├── useOrderDetail.ts
│   ├── useProductsData.ts
│   ├── useCustomersData.ts
│   ├── useRegionData.ts
│   └── useThemeColors.ts
├── helpers/                  # Pure helpers, column defs, Zod schemas
├── middleware.ts             # Route protection (Supabase SSR)
└── utils/                   # Supabase client helpers (server / client)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- A [Supabase](https://supabase.com) project with the Northwind schema loaded
- A [Resend](https://resend.com) account (for email flows)

### 1 — Clone the repository

```bash
git clone https://github.com/your-username/northwind-dashboard.git
cd northwind-dashboard
```

### 2 — Install dependencies

```bash
npm install
```

### 3 — Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
RESEND_API_KEY=<your-resend-api-key>
```

> **Warning:** Never commit `.env.local` to version control. It is already listed in `.gitignore`.

### 4 — Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You will be redirected to `/login` automatically.

---

## 🗄️ Database

This project uses the classic **Northwind** dataset loaded into a Supabase (PostgreSQL) project. The main tables are:

| Table | Description |
|-------|-------------|
| `orders` | Sales orders with customer, employee, and freight data |
| `order_details` | Line items (product, quantity, unit price, discount) |
| `products` | Product catalogue with categories and pricing |
| `customers` | Customer company records with address details |
| `categories` | Product categories |
| `shippers` | Freight / shipping companies |

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server (webpack) |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

---

## 🔒 Authentication Flow

```
User visits /dashboard
       |
       v
  middleware.ts
  +------------------------+
  | Is user authenticated? |
  +------------------------+
       | No                   Yes
       v                       v
  Redirect --> /login      Allow access
       |
       v
  Login / Register / Forgot Password
       |
       v
  Supabase Auth (email + password)
       |
       v
  Email verification (Resend)
       |
       v
  Redirect --> /dashboard
```

---

## 🌐 Deployment

The easiest way to deploy is via **[Vercel](https://vercel.com)**:

1. Push your repository to GitHub.
2. Import the project on [vercel.com/new](https://vercel.com/new).
3. Add all environment variables from `.env.local` in the Vercel dashboard.
4. Deploy — Vercel auto-detects Next.js and configures the build.

---

## 🤝 Contributing

Pull requests are welcome! For significant changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with Next.js, Supabase and Chakra UI

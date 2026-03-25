# Vyram Jewells React App

Single Vite + React project containing:

- Customer storefront (`/`)
- Admin dashboard (`/admin/*`)

## Features

- Storefront pages: Home, About, Collections, Bridal, Contact, Cart, Wishlist
- Admin pages: Dashboard, Products, Orders, Customers, Messages, Analytics, Settings
- Admin authentication with protected routes and persisted login state (`localStorage`)
- Admin product CRUD (Create, Read, Update, Delete) with validation
- Shared product catalog state across Admin + Storefront (admin changes reflect immediately on storefront pages)
- Cart/wishlist resilience when products are removed (invalid product refs are filtered out)
- Shared React Router setup in one app

## Admin Login (Demo)

- Email: `admin@vyramjewells.com`
- Password: `admin123`

## Routes

- Storefront:
  - `/`
  - `/about`
  - `/collections`
  - `/bridal`
  - `/bridal/:collectionSlug`
  - `/contact`
  - `/cart`
  - `/wishlist`
- Admin:
  - `/admin/login`
  - `/admin`
  - `/admin/products`
  - `/admin/orders`
  - `/admin/customers`
  - `/admin/messages`
  - `/admin/analytics`
  - `/admin/settings`

## Scripts

- `npm install` - install dependencies
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run eslint

## Local Persistence

The app uses browser `localStorage` for demo persistence:

- `vyram_admin_auth` - admin auth session
- `vyram_products` - product catalog used by admin + storefront
- `vyram_cart` - cart items
- `vyram_wishlist` - wishlist items

To reset demo data, clear these keys in browser devtools (Application/Storage tab).

## Tech Stack

- React 19
- React Router
- Vite
- React Context for shared catalog and shop state
- Global stylesheet imports (`src/styles/*.css`)

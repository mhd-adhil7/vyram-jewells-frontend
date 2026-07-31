# Vyram Jewells React App

Vite + React storefront project containing:

- Customer storefront (`/`)

## Features

- Storefront pages: Home, About, Collections, Bridal, Contact, Cart, Wishlist
- Product catalog state with local persistence (`localStorage`)
- Cart/wishlist resilience when products are removed (invalid product refs are filtered out)
- React Router setup for storefront pages

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

## Scripts

- `npm install` - install dependencies
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run eslint

## Local Persistence

The app uses browser `localStorage` for demo persistence:

- `vyram_products` - product catalog used by storefront
- `vyram_cart` - cart items
- `vyram_wishlist` - wishlist items

To reset demo data, clear these keys in browser devtools (Application/Storage tab).

## Tech Stack

- React 19
- React Router
- Vite
- React Context for shared catalog and shop state
- Global stylesheet imports (`src/styles/*.css`)


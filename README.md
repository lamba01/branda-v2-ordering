# Branda V2: Service Ordering Interface

A multi-market service ordering interface for a branding platform, built for the Branda Frontend Developer screening (Task 1).

Customers browse branding services across five categories (Digital, Gifts, Create, Studio, Prints) in four markets (Nigeria, USA, UK, Canada), configure options, add to cart and reach a mock order confirmation.

- **Live site:** `branda-v2-ordering.vercel.app`
- **Repository:** `https://github.com/lamba01/branda-v2-ordering`

## Tech stack

| Area         | Choice                                        |
| ------------ | --------------------------------------------- |
| Framework    | Next.js 16 (App Router), React, TypeScript    |
| Styling      | Tailwind CSS v4                               |
| Client state | Zustand (cart only)                           |
| Icons        | lucide-react                                  |
| Data         | Local mock data behind an async service layer |
| Deployment   | Vercel                                        |

## Getting started

Requires Node.js 20 or later.

```bash
git clone <https://github.com/lamba01/branda-v2-ordering>
cd branda-v2-ordering
npm install
npm run dev
```

Open http://localhost:3000. The root path redirects to a market (`/ng` by default).

Other scripts:

```bash
npm run build   # production build, lists the rendering mode of every route
npm start       # serve the production build
npx tsc --noEmit
npm run lint
```

### Environment variables

| Variable               | Purpose                                                                            | Default                 |
| ---------------------- | ---------------------------------------------------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_SITE_URL` | Absolute base URL used for Open Graph, canonical links, the sitemap and robots.txt | `http://localhost:3000` |

Set it to the deployed URL in Vercel (Project Settings, Environment Variables), otherwise share previews and the sitemap will point at localhost.

## What is implemented

### 1. Listing page (`/[market]/services`)

- Responsive grid of service cards: image, name, starting price, discount badge and a clear call to action.
- Smart search across name, description, category, use case and industry. Multiple words must all match. Input is debounced by 300ms.
- Category filter (Digital, Gifts, Create, Studio, Prints) plus three more filters: **use case**, **industry** and **turnaround (urgency)**.
- Sorting by popularity or price (low to high, high to low).
- Pagination (8 per page) using plain links, so it works without JavaScript and every page is crawlable.
- **Every filter, the search term, the sort and the page number live in the URL**, so results are shareable and indexable. The server reads `searchParams`, validates them and renders the result.
- Empty state, `loading.tsx` skeleton and `error.tsx` boundary.

### 2. Service detail page (`/[market]/services/[slug]`)

- Image gallery with keyboard-accessible thumbnails.
- Name, price (with discount), description, what is included and turnaround estimate.
- Option groups (package, size, quantity tier, material) that update the price live.
- Quantity selector, **Order Now** and **Add to Cart**.
- "Complete your brand": related services that prefer other categories, to encourage cross-category bundling.
- `generateMetadata` per service: title, description, canonical URL, Open Graph, Twitter card and hreflang alternates. Product JSON-LD with the market's currency.

### 3. Cart and checkout

- Add, remove, increase and decrease quantity. The same service with the same options merges into one line.
- Automatic subtotal, tax and total, with a per-market tax rate.
- Empty cart state.
- Checkout with an itemised summary, validated form (name, email) and a mock confirmation screen. No payment is taken.
- Cart persists in `localStorage`. Cart, checkout and confirmation pages are `noindex` and disallowed in robots.txt.

### 4. Multi-market support

- Subfolder routing: `/ng`, `/us`, `/uk`, `/ca` (not subdomains), so SEO authority stays on one domain.
- Currency adapts per market (NGN, USD, GBP, CAD) via `Intl.NumberFormat`.
- A visible country and currency selector in the header. Switching keeps the current page and filters.
- Hero copy and featured services change per market.
- `proxy.ts` redirects `/` to the visitor's market using Vercel's `x-vercel-ip-country` header, falling back to Nigeria.
- hreflang alternates and canonical URLs on the home and detail pages.

### 5. Responsive design and accessibility

- Fixed-size service cards: the grid changes the number of columns, the cards do not stretch.
- Header collapses to a menu button on small screens. Sticky on tablet and desktop.
- Semantic landmarks, a skip link, visible focus rings, labelled form controls, `aria-live` for result counts and cart feedback, `aria-current` for the active category and page, 44px touch targets, descriptive alt text, and decorative images marked `alt=""`.
- `prefers-reduced-motion` is respected.

### 6. Data fetching and states

- Server Components call an async service layer (`lib/services.ts`). It is async on purpose, so swapping the mock data for a real API only changes that one file.
- Loading (`loading.tsx` skeletons), empty and error (`error.tsx`) states on the listing and detail routes. Client-side skeletons while the cart hydrates.
- Extras: `sitemap.ts`, `robots.ts`, placeholder pages for How it works, About and Contact.

## Rendering strategy

| Route                                                | Mode                           | Why                                                                    |
| ---------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------- |
| `/[market]`                                          | Static (SSG)                   | Content depends only on the market, so it is pre-rendered for all four |
| `/[market]/services/[slug]`                          | Static (SSG)                   | `generateStaticParams` pre-renders 4 markets x 24 services = 96 pages  |
| `/[market]/services`                                 | Dynamic (SSR)                  | Output depends on search, filters, sort and page in the URL            |
| `/[market]/cart`, `/checkout`, `/checkout/confirmed` | Static shell, client-side data | Cart contents are per user and live in the browser                     |
| `/[market]/[page]` (info pages)                      | Static (SSG)                   | Fixed content                                                          |

With a real catalogue that changes often, the detail pages would move to ISR (`revalidate`) or on-demand revalidation, and the listing could cache results per filter combination.

## Key decisions

**Filters in the URL, not in client state.** The URL is the single source of truth for search, filters, sort and page. That gives shareable links, working back and forward buttons, server rendering and indexable results, with no client state to keep in sync. `parseFilters` validates every incoming parameter against an allow-list, so a junk query string can never break the page.

**Zustand for the cart only.** Server state (the catalogue) stays in Server Components. The only true client state is the cart, which needs to be shared between the header badge, the detail page, the cart and checkout. Zustand is small, needs no provider, and its `persist` middleware handles `localStorage`. It uses `skipHydration` and rehydrates after mount, to avoid server and client markup mismatches.

**Prices stored in base USD and converted at display time.** Cart lines hold a base USD amount. Switching market re-prices the whole cart with no extra code, and totals are computed from one source.

**Constants, pricing and data layer are separate files.** Client components import from `lib/constants.ts` and `lib/pricing.ts`, never from the data layer, so the catalogue is never bundled into browser JavaScript.

**Options in the cart key.** A cart line key is the slug plus the chosen options, so identical choices merge and different choices stay separate.

**Fixed-size cards.** The brief asks for a consistent grid. Cards have a fixed width and image height, and the grid uses `auto-fill`, so only the number of columns changes between screen sizes.

**Pagination over infinite scroll.** Pagination gives crawlable URLs, works without JavaScript and keeps page position on back navigation.

## Project structure

```
src/
├── app/
│   ├── layout.tsx                 root layout, fonts, base metadata
│   ├── page.tsx                   redirect fallback to /ng
│   ├── sitemap.ts, robots.ts
│   └── [market]/                  ng | us | uk | ca (validated, 404 otherwise)
│       ├── layout.tsx             header, footer, skip link, cart hydration
│       ├── page.tsx               market home
│       ├── [page]/page.tsx        how-it-works, about, contact
│       ├── services/
│       │   ├── page.tsx           listing (filters from the URL)
│       │   ├── loading.tsx, error.tsx
│       │   └── [slug]/            detail page (+ loading.tsx, error.tsx)
│       ├── cart/page.tsx
│       └── checkout/
│           ├── page.tsx
│           └── confirmed/page.tsx
├── components/                    UI (cards, filters, header, cart, checkout...)
├── data/                          mock catalogue (24 services)
├── hooks/                         use-cart-hydrated
├── lib/                           markets, constants, pricing, totals, format, url, services
├── store/                         cart (persisted) and last order (in memory)
├── types/                         shared TypeScript types
└── proxy.ts                       geo redirect from /
```

## Assumptions and limitations

- All catalogue data is mock data. Placeholder photos come from picsum.photos.
- **Exchange rates and tax rates are illustrative**, not real. Rates are fixed multipliers on a USD base price.
- No payment, authentication or backend. The placed order is kept in memory, so refreshing the confirmation page shows a "no recent order" message.
- The About, Contact and How it works pages are placeholder content added so every navigation link works.
- Geo redirect only works once deployed on Vercel, because it relies on a Vercel header. Locally everyone lands on `/ng`.
- No automated tests yet. With more time I would add unit tests for `parseFilters`, pricing and totals, and Playwright tests for the purchase flow.

## Performance notes

- `next/image` everywhere, with correct `sizes`. `priority` only on the hero image, the likely LCP element.
- Hero image is a local, compressed file imported statically, so it gets automatic dimensions and a blur placeholder.
- Server Components by default. Client Components are limited to the header, gallery, purchase panel, filter bar, cart and checkout views.
- 96 detail pages and the market homes are pre-rendered at build time.

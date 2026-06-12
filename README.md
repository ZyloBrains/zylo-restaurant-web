# Zylo Restaurant Web

Customer-facing multi-tenant restaurant website built with Next.js.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **Zustand** (state management)
- **Sonner** (toasts)

## Prerequisites

- Node.js 22+
- pnpm 10+ (`corepack enable` / `npm i -g pnpm`)
- Backend API running at `http://localhost:8082`

## Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8082/api/v1
NEXT_PUBLIC_PUBLIC_API_BASE_URL=http://localhost:8082/api/v1/public
NEXT_PUBLIC_IMAGE_BASE_URL=http://localhost:8082/api/v1/images
```

## Run Locally (Dev Mode)

```bash
pnpm install
pnpm dev
```

Opens at [http://localhost:3000](http://localhost:3000). Navigate to `http://localhost:3000/{tenant-slug}` to view a tenant site.

## Run via Docker

From the parent directory (where `docker-compose.yml` lives):

```bash
docker compose up -d
```

This starts Postgres, Redis, the API, and the web app together. The web app is at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build (standalone) |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run Vitest tests |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # UI components
│   ├── auth/         # Login, user dropdown
│   ├── cart/         # Cart drawer, checkout modal
│   ├── layout/       # Footer, navbar
│   ├── sections/     # Landing page sections
│   └── ui/           # Base UI primitives
├── features/         # State & logic per domain
│   ├── auth/         # Auth store
│   ├── cart/         # Cart context
│   ├── checkout/     # Checkout types & helpers
│   ├── payment/      # Payment types
│   └── tenant/       # Tenant store
├── lib/              # Utilities (api client, storage)
├── services/         # API service layer
├── seo/              # Metadata generation
└── types/            # Shared TypeScript types
```

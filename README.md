# ExpFit (FitPass)

A fitness class booking app. ClassPass style memberships where you browse studios, book sessions, and manage your schedule from one place.

Built with **Next.js**, **Sanity**, and **Clerk**. Includes an AI chat assistant that can search classes, venues, and bookings for you.

---

## Features

- **Class discovery** — search and filter sessions by category, venue, tier, or keyword
- **Map view** — find nearby studios with Leaflet (radius filter + address search via Mapbox)
- **Bookings** — book/cancel sessions, mark attendance, and view them on a calendar
- **Subscription tiers** — Basic / Performance / Champion with monthly limits and class access rules (Clerk Billing)
- **AI assistant** — chat UI backed by an OpenAI tool calling agent that queries Sanity for real data
- **Onboarding & profiles** — preference setup and profile editing after sign-up
- **Sanity Studio** — content admin at `/studio` for venues, activities, sessions, bookings, etc.

---

## Tech stack

| Area | Tools |
|------|--------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui, Radix |
| Auth & billing | Clerk |
| CMS / data | Sanity (schemas, GROQ, embedded Studio) |
| Maps | Leaflet, react-leaflet, Mapbox geocoding |
| AI | Vercel AI SDK + OpenAI |
| State / utils | Zustand, Zod, date-fns, Biome |

---

## Getting started

- Node.js 20+
- pnpm (preferred)
- Accounts for: Clerk, Sanity, OpenAI, and Mapbox (for address search)

---

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_API_VERSION=2026-01-22
SANITY_API_TOKEN=

# Mapbox (address autocomplete / geocoding)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=

# OpenAI (AI chat assistant)
OPENAI_API_KEY=

# Pyatok Gallery

Minimalist online gallery built with Next.js, Tailwind, and Supabase.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
3. Make sure your Supabase project has:
   - an `artworks` table
   - a public storage bucket named `artwork-images`
   - a `dimensions` column on `artworks` (see `supabase/migrations/20260713_add_dimensions_column.sql`)

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Project notes

- Public pages fetch artworks on the server.
- Admin writes happen through server-side route handlers.
- The admin session is stored in an httpOnly cookie.
- UI text is translated with a small dictionary in `lib/i18n.ts`.

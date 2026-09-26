# The Style Room — Next.js Migration

This project is a Next.js App Router migration of the supplied Bolt/Vite React project.

## Preserved from the original

- The Style Room visual design, typography, colors, sections and copy
- Home / New Arrivals / One Piece / Tops navigation
- Supabase product loading and search
- Product cards, quick view modal and size selection
- Shopping cart drawer and quantity controls
- Contact form interaction
- Admin route via `#admin`
- Supabase admin authentication
- Admin product CRUD, order status updates, customers and settings views
- Existing product images and public SEO files

## Local setup

1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local`.
3. Set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Install dependencies:

```bash
npm install
```

5. Run:

```bash
npm run dev
```

6. Production check:

```bash
npm run build
npm run start
```

## Vercel

Add the same two `NEXT_PUBLIC_*` environment variables to the Vercel project, then deploy the repository.

The Supabase database/schema remains the backend source of truth; this migration changes the frontend runtime from Vite to Next.js.

# Sholab Dex Tech

Marketing site and content-managed portfolio for **Sholab Dex Tech** — websites, AI
automation and business promotions.

This is a rebuild of the original PostgreSQL + Drizzle version on a **Supabase**
backend. The frontend is React 19 + Vite + Tailwind CSS 4; the data layer is
`@supabase/supabase-js` with Row Level Security. There is no server to deploy —
the browser talks to Supabase directly, so the whole site is a static bundle.

---

## What's in it

**Public site** (`/`)

| Section | What it does |
|---|---|
| Hero | Headline, tagline, two CTAs, animated stat counters |
| Services | 46 services across three categories, tabbed |
| Portfolio | Project grid with a category filter |
| Pricing | Packages per category, one flagged "Most popular" |
| About | Story, mission/vision, why-choose-us, CEO card |
| Process | Five-step timeline |
| Reviews | Client testimonials in a masonry layout |
| FAQ | Accordion |
| Contact | Form that writes to Supabase, plus WhatsApp |
| Footer | Navigation, popular services, contact details, socials |

Plus a **smart quote popup** that appears once per session after 45% scroll or 25
seconds, and builds a pre-filled WhatsApp message from the visitor's answers.

**Admin panel** (`/sholab`)

Nine tabs — Dashboard, Site settings, Services, Pricing, Portfolio, Reviews,
Stats, FAQs, Messages — covering every piece of content on the site, with image
uploads to Supabase Storage.

**Design system**

- Light / dark / **system** theme, applied before first paint (no flash)
- CSS custom properties for every colour, so both themes come from one token set
- Reveal-on-scroll, count-up stats, glass morphism, gradient text
- `prefers-reduced-motion` respected throughout
- WCAG 2.1 AA: skip link, focus rings, ARIA on every interactive control,
  labelled form fields, `aria-expanded` on the accordion

---

## Quick start

```bash
npm install
cp .env.example .env      # already filled in for the live Supabase project
npm run dev               # http://localhost:5173
```

The site is already pointed at a provisioned Supabase project, so it will show
real content on first run.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Typecheck + production bundle into `dist/` |
| `npm run check:html` | Guard: fails if `index.html` has a `<link href>` Vite cannot read |
| `npm run preview` | Serve the built bundle locally |
| `npm run typecheck` | TypeScript only, no emit |
| `npm test` | Vitest suite |
| `npm run seed` | Re-seed the database from `scripts/seed.py` |

---

## Architecture

```
client/src/
  components/
    site/          Public sections (Nav, Hero, Services, …)
    ui/            Shared primitives (Section, Reveal, Stars, ThemeToggle)
    icons/         Inline brand SVGs
    Screen.tsx     Full-page loading + error states
    ErrorBoundary.tsx
  hooks/
    useSiteContent.ts   React Query hooks + query keys
    useTheme.tsx        light / dark / system
    useScrollSpy.ts     Active nav link
    useReveal.ts        Reveal-on-scroll
    useCountUp.ts       Animated stat counters
  lib/
    supabase.ts    The single Supabase client + media URL helper
    api.ts         Every read and write the app performs
    mappers.ts     Row ⇄ domain translation (snake_case ⇄ camelCase)
    seo.ts         Runtime canonical / og:url injection
    utils.ts       cn, slugify, formatting
  pages/
    Home.tsx       The public site
    admin/         The /sholab control panel
shared/
  types.ts         Domain types
  constants.ts     Categories, nav sections, WhatsApp link builder
supabase/
  migrations/      Schema, RLS policies, storage bucket
  seed.sql         Default content
```

### Why it is shaped this way

**One client, one API module.** Components never import the Supabase client.
Every query lives in `lib/api.ts`, so the query shapes, ordering rules and error
handling are in one file — and swapping the backend again would touch one module
rather than forty components.

**Mappers as the boundary.** The database is `snake_case`, the app is
`camelCase`. `lib/mappers.ts` is the only place that translates, in both
directions, so a column rename is a one-line change. The mappers are also
defensive: a malformed `jsonb` value degrades to an empty array instead of
crashing the page. This is the most heavily tested part of the codebase.

**Content is data, not code.** Every string, price, service and review lives in
the database and is edited through `/sholab`. `shared/constants.ts` holds only
what is structural — the three categories the schema constrains to, and the
section anchors.

**Parallel reads.** `fetchSiteContent()` runs its seven queries with
`Promise.all`. They are independent, so serialising them would make the page wait
for seven round trips instead of one.

---

## Database

### Tables

| Table | Rows | Notes |
|---|---|---|
| `site_settings` | 1 | Singleton, `id = 'main'`. All brand, hero, about, footer and SEO copy. |
| `services` | 46 | `category` ∈ websites / automation / promotions |
| `pricing_packages` | 9 | `features` is a `jsonb` string array |
| `projects` | 6 | Portfolio entries |
| `testimonials` | 6 | `rating` constrained to 1–5 |
| `stats` | 4 | Hero counters |
| `faqs` | 8 | |
| `contact_messages` | — | Written by the public form, read by the admin panel |

A partial unique index enforces **at most one popular package per category**:

```sql
create unique index pricing_one_popular_per_category
  on public.pricing_packages (category)
  where is_popular;
```

That is why `setPopularPackage()` clears the old badge *before* setting the new
one — doing it the other way round would violate the index mid-transaction.

### Applying the migrations

The migrations are plain SQL and are already applied to the live project. To
apply them to a fresh project, either paste each file from
`supabase/migrations/` into the Supabase SQL editor in order, or use the CLI:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Then load the default content:

```bash
python3 scripts/seed.py
```

`scripts/seed.py` talks to the REST API with the publishable key, so it also
doubles as a check that the RLS policies are correct.

---

## Security

**Read this before going live.**

The publishable (anon) key is designed to be public — it ships in the browser
bundle, and Row Level Security is what actually protects the data. The policies
in `supabase/migrations/0002_rls.sql` are:

| Table | anon can |
|---|---|
| `site_settings`, `services`, `pricing_packages`, `projects`, `testimonials`, `stats`, `faqs` | `select`, `insert`, `update`, `delete` |
| `contact_messages` | `insert` only — **not** `select` |

`contact_messages` is deliberately write-only for anonymous visitors: anyone can
submit an enquiry, but nobody can read other people's. The admin panel reads them
through the same key, so **if you want the Messages tab to work in production you
must add an authenticated read policy** — see below.

### Locking the admin panel down

The panel has no login. The URL is the only thing keeping it private, which is
fine for a low-traffic brochure site but is not real security. To make it real:

1. **Create an owner user.** Supabase dashboard → Authentication → Users → Add
   user. Set an email and password.

2. **Replace the write policies** in `0002_rls.sql` so they require a session.
   For each content table, drop the `anon` write policies and add:

   ```sql
   create policy "authenticated write" on public.services
     for all to authenticated using (true) with check (true);
   ```

   Repeat for the other six content tables, and add a read policy on
   `contact_messages` for `authenticated`.

3. **Add a sign-in gate** to the panel. The client already has
   `supabase.auth` available; wrap the `<Admin />` route in a component that
   calls `supabase.auth.getSession()` and renders a login form when there is no
   session. Set `VITE_ADMIN_REQUIRE_AUTH=true` in `.env`.

4. **Move the admin path.** Change `VITE_ADMIN_PATH` to something only you know.
   This is defence in depth, not a substitute for step 3.

### Storage

The `site-media` bucket is public for reads (images are served straight to the
browser) and open for writes from the anon key, so the panel can upload. If you
lock down the database as above, tighten the storage write policies the same way.

---

## Deployment

The site is a static bundle, so any static host works. Vercel is the simplest,
and it needs **no dashboard configuration at all** — no Root Directory, no
build-command override, no output-directory override:

1. Push the repo to GitHub.
2. Import it in Vercel. The framework preset is detected as Vite.
3. Add the environment variables from `.env.example`.
4. Deploy.

Everything the build needs is committed:

- `vite.config.ts` pins `root` and the Rollup `input` to absolute paths derived
  from the config file's own location, so the build behaves identically whether
  it runs from the repo root, a subdirectory, or a CI checkout.
- `vercel.json` sets `installCommand`, `buildCommand` and `outputDirectory`
  explicitly, so Vercel's defaults cannot drift.
- `scripts/check-html.mjs` runs as `prebuild` and fails fast with a readable
  message if `index.html` ever regains a `<link href>` that resolves to a
  directory.

### Why the first deploy failed

The original `index.html` contained:

```html
<link rel="canonical" href="/" />
```

Vite's `build-html` plugin treats every `<link href>` as an asset reference. It
resolved `/` against the project root — a **directory** — and then tried to read
it as a file:

```
[vite:build-html] EISDIR: illegal operation on a directory, read
file: /vercel/path0/index.html
```

This was never a Root Directory problem: the app already lived at the repo root.
The canonical link is now created at runtime from `VITE_SITE_URL`
(`client/src/lib/seo.ts`), and `npm run check:html` prevents the pattern from
coming back.

`vercel.json` also handles the SPA rewrite so `/sholab` resolves to `index.html`
instead of 404-ing:

```json
{ "rewrites": [{ "source": "/((?!assets/).*)", "destination": "/index.html" }] }
```

Netlify, Cloudflare Pages and GitHub Pages work the same way — build command
`npm run build`, publish directory `dist`, plus the same SPA fallback.

---

## Testing

```bash
npm test
```

The suite covers the parts where a bug would be silent rather than loud:

- **`mappers.test.ts`** — every row → domain mapper, including the defensive
  paths (null rows, malformed `jsonb`, out-of-range ratings) and the write
  direction, so the two cannot drift apart.
- **`constants.test.ts`** — the WhatsApp link builder, which has to cope with
  numbers stored as `+234 816 978 1185`, and price formatting.
- **`utils.test.ts`** — `cn` merge order, `slugify` (which produces Storage
  object paths, so it must stay within `[a-z0-9-]`), and the textarea parser.
- **`seo.test.ts`** — the runtime canonical/`og:url` injection that replaced the
  `<link rel="canonical" href="/">` tag which broke the Vercel build.

---

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | yes | Project URL |
| `VITE_SUPABASE_ANON_KEY` | yes | Publishable key (safe to expose) |
| `VITE_SUPABASE_BUCKET` | no | Storage bucket, defaults to `site-media` |
| `VITE_ADMIN_PATH` | no | Admin route, defaults to `sholab` |
| `VITE_ADMIN_REQUIRE_AUTH` | no | Set `true` after adding a login gate |
| `VITE_SITE_URL` | no | Canonical URL for SEO (injected at runtime) |

---

## Credits

Built for Sholab Dex Tech. Frontend: React 19, Vite 6, Tailwind CSS 4,
React Query 5, React Router 7, lucide-react. Backend: Supabase (Postgres, RLS,
Storage).

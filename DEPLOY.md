# Deploying Sholab Dex Tech

A step-by-step guide from a fresh clone to a live site. Roughly 15 minutes.

---

## 1. Supabase

The project is already provisioned. If you are setting up a **new** one instead:

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run, in order:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_rls.sql`
3. Open **Storage** and confirm a public bucket named `site-media` exists.
   (The migration creates it; if your project blocks that, create it by hand and
   set it to public.)
4. Copy **Project URL** and the **publishable / anon key** from
   **Settings → API**.
5. Load the default content:

   ```bash
   SUPABASE_URL=https://<ref>.supabase.co \
   SUPABASE_ANON_KEY=<publishable-key> \
   python3 scripts/seed.py
   ```

   The script prints a row count per table. If it reports a policy error, the
   RLS migration did not apply cleanly — re-run `0002_rls.sql`.

---

## 2. Local check

```bash
npm install
cp .env.example .env     # paste your URL and key
npm run typecheck
npm test
npm run build
npm run preview          # http://localhost:4173
```

Open the preview and confirm:

- The hero shows the headline and the stat counters animate.
- Services tabs switch between the three categories.
- The theme toggle cycles light → dark → system, and the choice survives a reload.
- `/sholab` opens the control panel.
- Submitting the contact form shows the success state, and the message appears
  under **Messages** in the panel.

---

## 3. Vercel

1. Push the repo to GitHub.
2. In Vercel: **Add New → Project → Import** the repo.
3. **Leave every build setting at its default.** Do not set a Root Directory —
   the app lives at the repository root, and `vite.config.ts` pins the Vite root
   and HTML entry to absolute paths so the build does not depend on the working
   directory. `vercel.json` already sets the install command, build command and
   output directory.
4. Add the environment variables:

   | Key | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | `https://<ref>.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | your publishable key |
   | `VITE_SUPABASE_BUCKET` | `site-media` |
   | `VITE_ADMIN_PATH` | `sholab` (or your own secret path) |
   | `VITE_SITE_URL` | `https://yourdomain.com` |

5. **Deploy.**

> **Vite environment variables are baked in at build time.** Changing one in the
> Vercel dashboard does nothing until you redeploy. This catches people out with
> `VITE_ADMIN_PATH` in particular.

---

## 4. Custom domain

1. Vercel → **Settings → Domains → Add**.
2. Point your DNS at Vercel as instructed (an `A` record for the apex, a `CNAME`
   for `www`).
3. Wait for the certificate to issue — usually under a minute.
4. Update `VITE_SITE_URL` to the final domain and redeploy.

---

## 5. Before you call it done

- [ ] **Lock down the admin panel.** It has no login by default. Follow
      README › Security — create an owner user, switch the write policies to
      `authenticated`, and add the sign-in gate. This is the one item that
      genuinely matters.
- [ ] Change `VITE_ADMIN_PATH` from the default `sholab`.
- [ ] Upload a real logo and CEO photo in **Site settings**.
- [ ] Replace the placeholder portfolio images with real project screenshots.
- [ ] Check the WhatsApp number in **Site settings** — it must be digits only
      with the country code (`2348169781185`, not `+234 816 978 1185`).
- [ ] Submit a test enquiry and confirm it lands in **Messages**.
- [ ] Run Lighthouse. The bundle is small and there are no blocking fonts, so
      performance and accessibility should both score well above 90.

---

## Troubleshooting

**"Could not load the site" on first run**
The URL or key in `.env` is wrong, or the migrations have not been applied. The
error screen prints the underlying Supabase message — read it.

**Images upload but do not appear**
The `site-media` bucket is missing or is not public. Check **Storage** in the
Supabase dashboard.

**"new row violates row-level security policy"**
`0002_rls.sql` did not apply. Re-run it in the SQL editor.

**The Messages tab is empty but the form says it sent**
Expected on a locked-down project: `contact_messages` is insert-only for the
anon key. Add an authenticated read policy (README › Security, step 2).

**A save in the panel does not show on the site**
The site-content query is invalidated on every save, so this should not happen.
If it does, hard-reload — a CDN or the browser may be serving a cached response.

**`EISDIR: illegal operation on a directory, read` during the build**
`index.html` has a `<link href>` that resolves to a directory — historically
`<link rel="canonical" href="/" />`. Vite's `build-html` plugin reads every
`<link href>` as an asset file. `npm run check:html` (which runs automatically
as `prebuild`) names the offending tag. Use an absolute URL or a real file path;
for the canonical link, set `VITE_SITE_URL` instead — `client/src/lib/seo.ts`
injects it at runtime.

**`/sholab` 404s on the deployed site**
The SPA rewrite is missing. Confirm `vercel.json` is committed and that the host
is applying it.

**The deployed site is a blank white page**
The build shipped without its Supabase environment variables. Vite inlines
`VITE_*` at build time, so a host with no variables set produces a bundle where
`VITE_SUPABASE_URL` is `undefined`. The app now shows an explicit "The site is
not configured yet" screen instead of a blank page, and `scripts/ensure-env.mjs`
(run automatically as `prebuild`) writes the public defaults when no env file
exists. To fix it properly, add the variables in **Vercel → Settings →
Environment Variables** and **redeploy** — changing them without a new build has
no effect.

**"Site not found" on GitHub Pages**
A Pages *project* site is served from `https://<user>.github.io/<repo>/`, not
from the domain root. Build with `VITE_BASE_PATH=/<repo>/` so Vite rewrites the
asset URLs and the router basename. `.github/workflows/deploy-pages.yml` does
this automatically and also copies `index.html` to `404.html`, which is the
standard SPA fallback for Pages (it has no rewrite rules). Pages must be enabled
under **Settings → Pages → Source: GitHub Actions**.

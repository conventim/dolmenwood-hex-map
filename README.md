# Dolmenwood Hex Map

An unofficial interactive hex map for the [Dolmenwood](https://necroticgnome.com) tabletop RPG setting. Browse the wood hex by hex, see which published adventures and modules take place where, track exploration locally, and keep shared per-hex referee notes.

Live at **https://dolmenwood.youwillnevergotospace.com/**

> This is an unofficial fan project. It is not affiliated with, endorsed, or approved by Necrotic Gnome. Dolmenwood is © Necrotic Gnome.

## Features

- Interactive SVG hex map with hover/click, keyboard navigation (WASD/arrows), pinch-zoom, and touch support
- Adventure/module annotations by hex, with links to where each module lives (publisher, DriveThruRPG, itch.io)
- Points of interest and Dolmenwood Campaign Book page references per hex
- Full-text search across hexes, modules, and points of interest
- Exploration tracking (unvisited / partially explored / fully explored) stored in localStorage
- Per-hex referee notes with a small markdown renderer
- Public shared referee notes stored in Supabase, updated through Realtime
- Update feed so returning visitors can see what changed

## Quick start

Requires Node 22 (see `.tool-versions`).

```sh
npm install
cp .env.example .env   # all values optional; see Configuration
make dev               # http://localhost:4321/map/
```

`make check` runs the full build plus type checking, linting, and unit tests.

## Configuration

Site configuration is via `PUBLIC_*` env vars (see `.env.example`). Everything is optional: without configuration, progress stays in localStorage, referee notes are session-only, and analytics and contact links are disabled. Use only a Supabase publishable/anon key in the browser, never a service-role or secret key.

| Variable                  | Purpose                                                             | When unset                    |
| ------------------------- | ------------------------------------------------------------------- | ----------------------------- |
| `PUBLIC_SITE_URL`         | Absolute origin for building `og:image` URLs                        | og:image tags omitted         |
| `PUBLIC_CANONICAL_URL`    | Canonical URL for the map page                                      | no canonical tag              |
| `PUBLIC_ANALYTICS_DOMAIN` | Domain registered with [OneDollarStats](https://onedollarstats.com) | analytics disabled            |
| `PUBLIC_SUPABASE_URL`       | Supabase project URL for shared notes                              | shared notes are session-only |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable/anon key                                | shared notes are session-only |
| `PUBLIC_CONTACT_EMAIL`    | Contact email (plus-tags added automatically)                       | contact links not rendered    |

### Supabase setup

The site stays static and talks directly to Supabase using its browser SDK. No custom backend, Worker, OAuth, or private user table is required.

1. Create a Supabase project, or reuse the existing one.
2. Run `supabase/hex_notes.sql` in the Supabase SQL Editor. It creates only `hex_notes`, configures row-level security for shared notes, and enables Realtime for that table.
3. Set `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_PUBLISHABLE_KEY` in your local `.env`.
4. For GitHub Pages, configure repository Actions secrets with those same two names, then rebuild and deploy.

The app reads, upserts, and deletes only `hex_notes`. Existing notes in Supabase are used without migration. Exploration progress and preferences stay in localStorage; `map_user_data` and sign-in are not used.

**Shared notes are publicly readable and writable**, including deletion, matching the supplied RLS policies. Do not store personal or sensitive information in them. Add restricted policies and authentication before using this as a private campaign notebook.

## Architecture

- Astro static site; the entire map lives in `src/pages/map/index.astro` (styles, markup, and client script in one file), with pure logic extracted to `src/lib/map/` for unit testing.
- Map data lives in `src/data/`: module entries (`dolmenwood-map-modules.ts`, zod-validated), points of interest (`map-pois.ts`), the update feed (`map-updates.ts`), terrain colors (`hex-colors.json`), and book page references (`hex-pages.json`).
- Pages are deliberately built under `/map/` (not `/`): the production deployment serves the same build at `example.com/map/` and at a dedicated subdomain, where a CDN function rewrites extensionless request paths by prefixing `/map`. Keeping the physical paths under `/map/` makes one build work for both hosts.
- No runtime framework or authentication UI. The Supabase SDK is lazily loaded from a CDN only when shared notes are configured. Progress and preferences remain local, and the site stays static on its existing hosting.

## How the map was generated

The map artwork is not hand-drawn SVG. It was produced by a small image pipeline from a raster scan of the official Dolmenwood blank hex map:

1. **Cleanup** — the compass key and logo are blanked out with ImageMagick, and the printed 4-digit hex number labels are surgically erased using connected-component analysis: dark pixels connected to the label-region boundary are kept as terrain, isolated dark pixels are classified as digit glyphs and removed. This preserves terrain lines that pass through label areas.
2. **Vectorization** — the cleaned raster is traced to SVG paths with potrace.
3. **Grid and interactivity** — a flat-top hex grid aligned to the source image is computed programmatically and emitted as a single path, along with `<text>` labels for each hex number and transparent `<polygon>` overlays carrying `data-hex` attributes for hover/click handling.
4. **Optimization** — the composed SVG is run through SVGO (multipass, integer precision, path merging) to get from ~580 KB down to ~220 KB while preserving the interactive structure.

`hex-colors.json` (per-hex terrain colors) was sampled from the source map, and `hex-pages.json` (per-hex page references) was extracted from the Dolmenwood Campaign Book's hex index.

## Licensing and data provenance

- The **code** in this repository (TypeScript, Astro components, CSS, build tooling) is licensed under the [MIT License](LICENSE).
- The **map artwork and setting data are not MIT-licensed and are not mine to license.** The art layer of `public/map/map.svg` is a vector trace derived from the official Dolmenwood blank hex map; the terrain colors in `src/data/hex-colors.json` are sampled from the Campaign Book; the place names in `src/data/map-pois.ts`, the page references in `src/data/hex-pages.json`, and other setting details derive from Dolmenwood published materials. Dolmenwood is © Necrotic Gnome. This material is included in the spirit of a fan reference that points people at the official books.
- The module `description` fields in `src/data/dolmenwood-map-modules.ts` quote promotional/storefront copy from their respective publishers, alongside links to buy each module.
- **Contributors:** do not paste text from the Dolmenwood books (or any other copyrighted work) into data files. Module descriptions should stay limited to short promotional blurbs of the kind publishers use publicly to market the product, or original summaries.

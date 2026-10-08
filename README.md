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
- Public shared referee notes stored in Cloudflare D1, refreshed every 15 seconds while the page is visible
- Update feed so returning visitors can see what changed

## Quick start

Requires Node 22.13 or newer (see `.tool-versions`). Tests use Node's built-in SQLite support.

```sh
npm install
cp .env.example .env   # all values optional; see Configuration
make dev               # http://localhost:4321/map/
```

`make check` runs the full build plus type checking, linting, and unit tests.

## Configuration

Site configuration is via `PUBLIC_*` env vars (see `.env.example`). Everything is optional: without configuration, progress stays in localStorage, referee notes are session-only, and analytics and contact links are disabled. Backend secrets belong only in the Worker, never in `PUBLIC_*` variables.

| Variable                  | Purpose                                                             | When unset                    |
| ------------------------- | ------------------------------------------------------------------- | ----------------------------- |
| `PUBLIC_SITE_URL`         | Absolute origin for building `og:image` URLs                        | og:image tags omitted         |
| `PUBLIC_CANONICAL_URL`    | Canonical URL for the map page                                      | no canonical tag              |
| `PUBLIC_ANALYTICS_DOMAIN` | Domain registered with [OneDollarStats](https://onedollarstats.com) | analytics disabled            |
| `PUBLIC_D1_API_URL`       | Public URL of the separately deployed map API Worker                | shared notes are session-only |
| `PUBLIC_CONTACT_EMAIL`    | Contact email (plus-tags added automatically)                       | contact links not rendered    |

### Cloudflare D1 setup

The Astro site remains static. `cloudflare/worker.ts` is a separate backend that calls the [D1 REST query API](https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/) with parameterized SQL. The browser never receives the Cloudflare API token. No D1 binding is needed because this backend uses the REST API.

1. Create a Cloudflare API token with **Account / D1 / Edit** permission scoped to the target account. Keep it server-side.
2. Create a database using the [D1 create API](https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/create/), or `npx wrangler d1 create dolmenwood-map`. Record its UUID and your Cloudflare account ID.
3. Apply `cloudflare/schema.sql` via the query API below or `npx wrangler d1 execute dolmenwood-map --remote --file cloudflare/schema.sql`.
4. In `cloudflare/wrangler.jsonc`, set `ALLOWED_ORIGINS` to a comma-separated list of your actual site origins, including both hosts for a dual-host deployment. Keep localhost only for development.
5. Set Worker secrets using `npx wrangler secret put NAME --config cloudflare/wrangler.jsonc` for each of `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID`, and `CLOUDFLARE_API_TOKEN`. Wrangler prompts for the value.
6. Run `npm run api:deploy`. Set `PUBLIC_D1_API_URL` to the resulting Worker URL, then rebuild and deploy the Astro site.

To apply the schema directly with the documented REST API, provide the three Cloudflare variables in your terminal environment:

```sh
node --input-type=module -e 'import { readFileSync } from "node:fs"; process.stdout.write(JSON.stringify({ sql: readFileSync("cloudflare/schema.sql", "utf8") }));' |
	curl --fail-with-body "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/d1/database/$CLOUDFLARE_D1_DATABASE_ID/query" \
		-H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
		-H 'Content-Type: application/json' --data-binary @-
```

Check both the top-level `success` and each query result's `success` in the response. The API also reports SQL errors in JSON.

For local API development, copy `cloudflare/.dev.vars.example` to `cloudflare/.dev.vars`, fill in the values, and run `npm run api:dev`. Point `PUBLIC_D1_API_URL` at the local Worker URL before starting `make dev`. **The local Worker uses the real remote D1 database through REST**; use a separate development database. Secrets and Wrangler state are ignored by Git.

The API exposes only `GET /notes`, `PUT /notes/:hex`, and `DELETE /notes/:hex`. Note categories and length limits match the previous database. Exploration progress and preferences remain in browser localStorage; there is no sign-in or private cloud sync.

**Shared notes remain publicly readable and writable**, matching the legacy Supabase policies. CORS is not authentication and does not prevent direct HTTP clients from modifying notes. Add authentication and abuse protection before using this as a restricted campaign notebook.

### Migrate existing Supabase data

Pause writes during the cutover and retain a backup. Export only `hex_notes` as a JSON array, including all rows. For example, run this in the Supabase SQL editor and save the returned JSON value:

```sql
SELECT COALESCE(json_agg(row_to_json(notes)), '[]'::json) FROM public.hex_notes AS notes;
```

Store the export in the Git-ignored `migration-data/` directory; use an empty array if the table does not exist. Convert it to D1-compatible SQL:

```sh
node --experimental-strip-types scripts/export-d1.ts migration-data/hex_notes.json > migration-data/import.sql
npx wrangler d1 execute dolmenwood-map --remote --file migration-data/import.sql
```

The converter validates fields, escapes SQL literals, preserves hex IDs and timestamps, and includes the new schema. Existing D1 rows are left unchanged on conflicts, so rerunning does not overwrite newer data. For large imports, use the documented [D1 SQL import API](https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/import/).

Verify row counts and shared note editing before switching the frontend URL. Only after verification should you archive or remove the old Supabase notes table. `supabase/hex_notes.sql` is retained solely as a reference for the legacy schema.

### Retired private storage

`map_user_data`, its `/user-data` API, and Supabase OAuth are retired. Existing browser-local progress and preferences are retained, but private server data is no longer read, written, or imported into D1. Remove obsolete `PUBLIC_SUPABASE_*` build variables and any `SUPABASE_*` Worker secrets.

No remote data is deleted automatically. After backing up any existing private data and deploying the updated client and API, an operator can remove the old table:

```sql
DROP TABLE IF EXISTS public.map_user_data;
```

Run that statement in the Supabase SQL editor. If an earlier D1 deployment already created the table, remove it there with `npx wrangler d1 execute dolmenwood-map --remote --command "DROP TABLE IF EXISTS map_user_data;"`. Do not use `CASCADE`; investigate dependencies before deleting anything else. Supabase Auth is no longer required by this map, but other applications may still depend on the project.

## Architecture

- Astro static site; the entire map lives in `src/pages/map/index.astro` (styles, markup, and client script in one file), with pure logic extracted to `src/lib/map/` for unit testing.
- Map data lives in `src/data/`: module entries (`dolmenwood-map-modules.ts`, zod-validated), points of interest (`map-pois.ts`), the update feed (`map-updates.ts`), terrain colors (`hex-colors.json`), and book page references (`hex-pages.json`).
- Pages are deliberately built under `/map/` (not `/`): the production deployment serves the same build at `example.com/map/` and at a dedicated subdomain, where a CDN function rewrites extensionless request paths by prefixing `/map`. Keeping the physical paths under `/map/` makes one build work for both hosts.
- No runtime framework or authentication SDK. Only shared notes use the separate API backend and D1 REST API; the site remains static on its existing hosting.

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

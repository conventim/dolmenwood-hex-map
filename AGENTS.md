# Agent Notes

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Standalone Astro static site for the **Dolmenwood hex map** — an unofficial interactive fan map for the Dolmenwood RPG. It is consumed as a git submodule by the youwillnevergotospace.com site repo, which builds it and ships its `dist/` output with the main site's deploy. It also works fully standalone.

## Commands

| Command      | What it does                                        |
| ------------ | --------------------------------------------------- |
| `make dev`   | Astro dev server; the map is at localhost:4321/map/ |
| `make build` | Prettier format + Astro build to `dist/`            |
| `make check` | Build + `astro check` + eslint + vitest             |

Always run `make check` before commits.

## Architecture

- The whole map is one page: `src/pages/map/index.astro` (~3,700 lines: frontmatter data joins, a large `<style is:inline>` block, markup with sidebar/modals, and a bundled client `<script>`). Supporting pages: `privacy.astro`, `terms.astro`, `oauth/consent.astro`.
- **Pages intentionally live under `src/pages/map/`** so the build output sits at `dist/map/…`. Production serves the same build at both `<apex>/map/` and a dedicated subdomain where a CDN function prefixes `/map` to extensionless request paths. Do not restructure to `/` or switch to Astro `base` — it would break the dual-host deployment. The client script host-sniffs (`host.startsWith("dolmenwood.")`) to compute the OAuth consent path for the same reason.
- Pure logic is extracted to `src/lib/map/` (`search.ts`, `hex-nav.ts`, `markdown.ts`, `text-transforms.ts`) and unit-tested in `tests/unit/`.
- `src/lib/config.ts` centralizes all site-specific configuration, read from `PUBLIC_*` env vars (see `.env.example`). Everything degrades gracefully when unset: no analytics tag, auth UI hidden, no contact links. Never hardcode deployment-specific URLs, keys, or emails in pages — add a config value instead.
- `src/layouts/BaseMinimal.astro` is the only layout. It emits the OneDollarStats analytics tag only when `PUBLIC_ANALYTICS_DOMAIN` is set (`ANALYTICS_DEBUG=1` in dev shows the analytics overlay).

## Map data files (`src/data/`)

- `dolmenwood-map-modules.ts` — zod-validated RPG module entries keyed by hex ID
- `map-pois.ts` — points of interest by hex
- `map-updates.ts` — update feed for the map's bell notification
- `hex-colors.json` / `hex-pages.json` — terrain colors and book page references (generated files — do not hand-edit values; see README "How the map was generated")

`public/map/map.svg` is generated (potrace + SVGO pipeline, see README) — never hand-edit it.

**Copyright rule:** never paste text from the Dolmenwood books into data files. Module `description` fields hold short publisher promotional blurbs or original summaries only. See README "Licensing and data provenance".

## Event tracking

When adding new user-facing functionality, consider whether it should be tracked with `trackEvent()`. The map uses OneDollarStats via `window.stonks` (no-ops when analytics is disabled). Common patterns: modal opens use `trackEvent("X opened")`, user actions use `trackEvent("X", { hex, source, ... })`, and outbound clicks use the `Module clicked` event with `link` ("title"/"store") and `source` ("sidebar"/"adventure-list") attributes.

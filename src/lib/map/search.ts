export interface SearchEntry {
  hexId: string | null;
  label: string;
  type: "hex" | "poi" | "module" | "location-module";
  typeBadge: string;
  searchText: string;
  location?: string;
}

export interface ScoredEntry extends SearchEntry {
  score: number;
}

interface PoiInfo {
  name: string;
  category: string;
}

interface ModuleInfo {
  name: string;
  descriptionHtml?: string;
}

interface LocationModule {
  name: string;
  location: string;
  descriptionHtml?: string;
}

export function buildSearchIndex(
  hexColors: Record<string, string>,
  pois: Record<string, PoiInfo[]>,
  modules: Record<string, ModuleInfo[]>,
  locationModules: LocationModule[],
): SearchEntry[] {
  const entries: SearchEntry[] = [];
  // Hex entries
  for (const hexId of Object.keys(hexColors)) {
    entries.push({
      hexId,
      label: hexId,
      type: "hex",
      typeBadge: "Hex",
      searchText: hexId,
    });
  }
  // POI entries
  for (const [hexId, poiList] of Object.entries(pois)) {
    for (const poi of poiList) {
      entries.push({
        hexId,
        label: poi.name,
        type: "poi",
        typeBadge: poi.category || "POI",
        searchText: (poi.name + " " + hexId).toLowerCase(),
      });
    }
  }
  // Module entries
  for (const [hexId, modList] of Object.entries(modules)) {
    for (const mod of modList) {
      // Avoid duplicate module entries across hexes
      if (
        !entries.some(
          (e) =>
            e.type === "module" && e.label === mod.name && e.hexId === hexId,
        )
      ) {
        entries.push({
          hexId,
          label: mod.name,
          type: "module",
          typeBadge: "Module",
          searchText: (
            mod.name +
            " " +
            (mod.descriptionHtml || "").replace(/<[^>]+>/g, "") +
            " " +
            hexId
          ).toLowerCase(),
        });
      }
    }
  }
  // Location-only modules (no hex association)
  for (const mod of locationModules) {
    entries.push({
      hexId: null,
      label: mod.name,
      type: "location-module",
      typeBadge: "Module",
      location: mod.location,
      searchText: (
        mod.name +
        " " +
        mod.location +
        " " +
        (mod.descriptionHtml || "").replace(/<[^>]+>/g, "")
      ).toLowerCase(),
    });
  }
  return entries;
}

export function searchEntries(
  query: string,
  index: SearchEntry[],
): ScoredEntry[] {
  const q = query.trim();
  if (!q) return [];
  const isNumeric = /^\d+$/.test(q);
  const qLower = q.toLowerCase();
  const scored: ScoredEntry[] = [];

  for (const entry of index) {
    let score = 0;
    if (isNumeric) {
      // Numeric: prefix-match hex IDs, plus modules/POIs in matching hexes
      if (entry.type === "hex" && entry.hexId?.startsWith(q)) {
        score = 10;
      } else if (
        entry.type !== "hex" &&
        entry.hexId &&
        entry.hexId.startsWith(q)
      ) {
        score = 5;
      }
    } else {
      // Text: score by match quality
      const labelLower = entry.label.toLowerCase();
      if (labelLower === qLower) {
        score = 100; // exact
      } else if (labelLower.startsWith(qLower)) {
        score = 80; // prefix
      } else if (labelLower.includes(qLower)) {
        score = 60; // substring in label
      } else if (entry.searchText.includes(qLower)) {
        score = 30; // substring in description
      }
    }
    if (score > 0) {
      scored.push({ ...entry, score });
    }
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.label.localeCompare(b.label);
  });

  return scored.slice(0, 12);
}

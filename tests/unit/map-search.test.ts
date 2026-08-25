import { describe, it, expect } from "vitest";
import {
  buildSearchIndex,
  numericHexMatches,
  searchEntries,
} from "../../src/lib/map/search";

const sampleHexColors: Record<string, string> = {
  "0101": "#8B9D83",
  "0102": "#7A8C72",
  "0201": "#9DAF95",
};

const samplePois: Record<string, { name: string; category: string }[]> = {
  "0101": [{ name: "Castle Dreg", category: "Castle" }],
  "0102": [{ name: "Prigwort", category: "Settlement" }],
};

const sampleModules: Record<
  string,
  { name: string; descriptionHtml?: string }[]
> = {
  "0101": [
    { name: "The Ruined Tower", descriptionHtml: "<p>A crumbling tower</p>" },
  ],
};

const sampleLocationModules = [
  {
    name: "Wandering Encounters",
    location: "Various",
    descriptionHtml: "<p>Random encounters</p>",
  },
];

describe("buildSearchIndex", () => {
  const index = buildSearchIndex(
    sampleHexColors,
    samplePois,
    sampleModules,
    sampleLocationModules,
  );

  it("includes hex entries", () => {
    const hexEntries = index.filter((e) => e.type === "hex");
    expect(hexEntries).toHaveLength(3);
  });

  it("includes POI entries", () => {
    const poiEntries = index.filter((e) => e.type === "poi");
    expect(poiEntries).toHaveLength(2);
    expect(poiEntries[0].label).toBe("Castle Dreg");
  });

  it("includes module entries", () => {
    const modEntries = index.filter((e) => e.type === "module");
    expect(modEntries).toHaveLength(1);
    expect(modEntries[0].label).toBe("The Ruined Tower");
  });

  it("includes location-module entries", () => {
    const locEntries = index.filter((e) => e.type === "location-module");
    expect(locEntries).toHaveLength(1);
    expect(locEntries[0].hexId).toBeNull();
  });

  it("strips HTML from description in searchText", () => {
    const mod = index.find((e) => e.label === "The Ruined Tower");
    expect(mod?.searchText).toContain("a crumbling tower");
    expect(mod?.searchText).not.toContain("<p>");
  });
});

describe("searchEntries", () => {
  const index = buildSearchIndex(
    sampleHexColors,
    samplePois,
    sampleModules,
    sampleLocationModules,
  );

  it("returns empty array for empty query", () => {
    expect(searchEntries("", index)).toEqual([]);
    expect(searchEntries("   ", index)).toEqual([]);
  });

  it("matches hex IDs by numeric prefix", () => {
    const results = searchEntries("01", index);
    expect(results.length).toBeGreaterThan(0);
    const hexResults = results.filter((r) => r.type === "hex");
    expect(hexResults.every((r) => r.hexId?.startsWith("01"))).toBe(true);
  });

  it("matches short numeric queries as raw and zero-padded prefixes", () => {
    const index = buildSearchIndex(
      {
        "0101": "#000",
        "1010": "#000",
        "1011": "#000",
        "0809": "#000",
      },
      {},
      {},
      [],
    );

    expect(searchEntries("809", index).map((entry) => entry.hexId)).toContain(
      "0809",
    );
    expect(searchEntries("101", index).map((entry) => entry.hexId)).toEqual(
      expect.arrayContaining(["0101", "1010", "1011"]),
    );
  });

  it("checks numeric hex prefixes with and without zero padding", () => {
    expect(numericHexMatches("0809", "809")).toBe(true);
    expect(numericHexMatches("1010", "101")).toBe(true);
    expect(numericHexMatches("0101", "101")).toBe(true);
    expect(numericHexMatches("0201", "101")).toBe(false);
    expect(numericHexMatches("0901", "9")).toBe(true);
  });

  it("scores exact matches highest", () => {
    const results = searchEntries("Castle Dreg", index);
    expect(results[0].label).toBe("Castle Dreg");
    expect(results[0].score).toBe(100);
  });

  it("scores prefix matches higher than substring", () => {
    const results = searchEntries("Castle", index);
    const castle = results.find((r) => r.label === "Castle Dreg");
    expect(castle?.score).toBe(80);
  });

  it("matches description content with lower score", () => {
    const results = searchEntries("crumbling", index);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].score).toBe(30);
  });

  it("caps results at 10", () => {
    // Build an index with many entries
    const bigHexColors: Record<string, string> = {};
    for (let i = 0; i < 50; i++) {
      bigHexColors[`01${String(i).padStart(2, "0")}`] = "#000";
    }
    const bigIndex = buildSearchIndex(bigHexColors, {}, {}, []);
    const results = searchEntries("01", bigIndex);
    expect(results.length).toBeLessThanOrEqual(10);
  });
});

import { describe, it, expect } from "vitest";
import { modules } from "../../src/data/dolmenwood-map-modules";
import { pois } from "../../src/data/map-pois";
import { updates } from "../../src/data/map-updates";
import hexColors from "../../src/data/hex-colors.json";
import hexPages from "../../src/data/hex-pages.json";

const validHexIds = new Set(Object.keys(hexColors));

describe("dolmenwood-map-modules", () => {
  it("exports a non-empty array of modules", () => {
    expect(modules.length).toBeGreaterThan(0);
  });

  it("every module has at least one link with a valid URL", () => {
    for (const mod of modules) {
      expect(mod.links.length).toBeGreaterThan(0);
      for (const link of mod.links) {
        expect(() => new URL(link.url)).not.toThrow();
      }
    }
  });

  // Hexes outside the core map grid that don't appear in hex-colors.json
  const hexColorExceptions = new Set(["1609"]);

  it("all module hex IDs reference valid hexes in hex-colors.json", () => {
    for (const mod of modules) {
      if ("hexes" in mod) {
        for (const hex of mod.hexes) {
          if (hexColorExceptions.has(hex)) continue;
          expect(
            validHexIds.has(hex),
            `${mod.name}: hex ${hex} not in hex-colors.json`,
          ).toBe(true);
        }
      }
    }
  });

  it("hex IDs match 4-digit format", () => {
    for (const mod of modules) {
      if ("hexes" in mod) {
        for (const hex of mod.hexes) {
          expect(hex).toMatch(/^\d{4}$/);
        }
      }
    }
  });

  it("no duplicate module names within the same hex", () => {
    const hexModuleNames = new Map<string, string[]>();
    for (const mod of modules) {
      if ("hexes" in mod) {
        for (const hex of mod.hexes) {
          const names = hexModuleNames.get(hex) ?? [];
          expect(
            names.includes(mod.name),
            `duplicate "${mod.name}" in hex ${hex}`,
          ).toBe(false);
          names.push(mod.name);
          hexModuleNames.set(hex, names);
        }
      }
    }
  });
});

describe("map-pois", () => {
  it("exports a non-empty array of POIs", () => {
    expect(pois.length).toBeGreaterThan(0);
  });

  it("all POI hex IDs reference valid hexes in hex-colors.json", () => {
    for (const poi of pois) {
      expect(
        validHexIds.has(poi.hex),
        `${poi.name}: hex ${poi.hex} not in hex-colors.json`,
      ).toBe(true);
    }
  });

  it("every POI has a valid category", () => {
    const validCategories = new Set(["settlement", "castle", "poi"]);
    for (const poi of pois) {
      expect(
        validCategories.has(poi.category),
        `${poi.name}: invalid category "${poi.category}"`,
      ).toBe(true);
    }
  });
});

describe("map-updates", () => {
  it("exports a non-empty array of updates", () => {
    expect(updates.length).toBeGreaterThan(0);
  });

  it("all update IDs are unique", () => {
    const ids = updates.map((u) => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("IDs form a contiguous sequence from 1 to N", () => {
    const sorted = [...updates.map((u) => u.id)].sort((a, b) => a - b);
    for (let i = 0; i < sorted.length; i++) {
      expect(sorted[i]).toBe(i + 1);
    }
  });

  it("dates are valid YYYY-MM-DD format", () => {
    for (const update of updates) {
      expect(update.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("types are either module or technical", () => {
    for (const update of updates) {
      expect(["module", "technical"]).toContain(update.type);
    }
  });
});

describe("hex-colors.json", () => {
  it("has 200 hex entries (10×20 grid)", () => {
    expect(Object.keys(hexColors).length).toBe(200);
  });

  it("all keys are 4-digit hex IDs", () => {
    for (const key of Object.keys(hexColors)) {
      expect(key).toMatch(/^\d{4}$/);
    }
  });

  it("all values are valid hex color codes", () => {
    for (const [key, value] of Object.entries(hexColors)) {
      expect(value, `hex ${key}`).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });
});

describe("hex-pages.json", () => {
  it("all keys are valid hex IDs from hex-colors.json", () => {
    for (const key of Object.keys(hexPages)) {
      expect(
        validHexIds.has(key),
        `hex-pages key ${key} not in hex-colors.json`,
      ).toBe(true);
    }
  });

  it("all values are positive integers", () => {
    for (const [key, value] of Object.entries(hexPages)) {
      expect(
        Number.isInteger(value),
        `hex ${key}: page ${value} is not an integer`,
      ).toBe(true);
      expect(value as number, `hex ${key}`).toBeGreaterThan(0);
    }
  });
});

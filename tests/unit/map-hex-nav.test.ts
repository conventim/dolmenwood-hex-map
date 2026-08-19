import { describe, it, expect } from "vitest";
import {
  navigateHex,
  nextVisitedState,
  countProgress,
} from "../../src/lib/map/hex-nav";

const validHexIds = new Set(["0101", "0102", "0201", "0202", "0301", "1010"]);

describe("navigateHex", () => {
  it("moves right (dcol +1)", () => {
    expect(navigateHex("0101", 1, 0, validHexIds)).toBe("0201");
  });

  it("moves down (drow +1)", () => {
    expect(navigateHex("0101", 0, 1, validHexIds)).toBe("0102");
  });

  it("returns null for out-of-bounds target", () => {
    expect(navigateHex("0101", -1, 0, validHexIds)).toBeNull();
  });

  it("returns null when currentHex is null", () => {
    expect(navigateHex(null, 1, 0, validHexIds)).toBeNull();
  });

  it("pads single-digit col/row correctly", () => {
    expect(navigateHex("0201", -1, 0, validHexIds)).toBe("0101");
  });

  it("handles double-digit coordinates", () => {
    expect(navigateHex("1010", 0, 0, validHexIds)).toBe("1010");
  });
});

describe("nextVisitedState", () => {
  it("transitions null → partial", () => {
    expect(nextVisitedState(null)).toBe("partial");
  });

  it("transitions partial → visited", () => {
    expect(nextVisitedState("partial")).toBe("visited");
  });

  it("transitions visited → null", () => {
    expect(nextVisitedState("visited")).toBeNull();
  });
});

describe("countProgress", () => {
  const hexPages: Record<string, number> = {
    "0101": 10,
    "0102": 12,
    "0201": 14,
  };

  it("counts visited and partial hexes", () => {
    const visited = new Map([
      ["0101", "visited"],
      ["0102", "partial"],
    ]);
    expect(countProgress(visited, hexPages)).toEqual({
      visited: 1,
      partial: 1,
    });
  });

  it("ignores hexes not in hexPages", () => {
    const visited = new Map([
      ["0101", "visited"],
      ["9999", "visited"],
    ]);
    expect(countProgress(visited, hexPages)).toEqual({
      visited: 1,
      partial: 0,
    });
  });

  it("returns zeros for empty map", () => {
    expect(countProgress(new Map(), hexPages)).toEqual({
      visited: 0,
      partial: 0,
    });
  });
});

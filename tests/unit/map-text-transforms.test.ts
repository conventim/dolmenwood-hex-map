import { describe, it, expect } from "vitest";
import { addAbbrTags, linkifyHexRefs } from "../../src/lib/map/text-transforms";

describe("addAbbrTags", () => {
  it("wraps DCB in an abbr tag", () => {
    expect(addAbbrTags("See DCB p. 42")).toBe(
      'See <abbr data-tooltip="Dolmenwood Campaign Book">DCB</abbr> p. 42',
    );
  });

  it("wraps DPB in an abbr tag", () => {
    expect(addAbbrTags("DPB chapter 3")).toBe(
      '<abbr data-tooltip="Dolmenwood Player\'s Book">DPB</abbr> chapter 3',
    );
  });

  it("wraps DMB in an abbr tag", () => {
    expect(addAbbrTags("DMB entry")).toBe(
      '<abbr data-tooltip="Dolmenwood Monster Book">DMB</abbr> entry',
    );
  });

  it("handles multiple abbreviations in one string", () => {
    const result = addAbbrTags("DCB and DMB");
    expect(result).toContain("Dolmenwood Campaign Book");
    expect(result).toContain("Dolmenwood Monster Book");
  });

  it("returns unchanged text when no abbreviations present", () => {
    expect(addAbbrTags("No abbreviations here")).toBe("No abbreviations here");
  });
});

describe("linkifyHexRefs", () => {
  it("converts a 4-digit hex ref starting with 0", () => {
    expect(linkifyHexRefs("See hex 0305")).toBe(
      'See hex <a class="hex-link" href="#hex=0305">0305</a>',
    );
  });

  it("converts a 4-digit hex ref starting with 1", () => {
    expect(linkifyHexRefs("hex 1012")).toBe(
      'hex <a class="hex-link" href="#hex=1012">1012</a>',
    );
  });

  it("does not match 4-digit numbers starting with 2+", () => {
    expect(linkifyHexRefs("hex 2305")).toBe("hex 2305");
  });

  it("does not match 3-digit or 5-digit numbers", () => {
    expect(linkifyHexRefs("hex 030 and 03050")).toBe("hex 030 and 03050");
  });

  it("handles multiple hex refs in one string", () => {
    const result = linkifyHexRefs("between 0305 and 0406");
    expect(result).toContain('href="#hex=0305"');
    expect(result).toContain('href="#hex=0406"');
  });
});

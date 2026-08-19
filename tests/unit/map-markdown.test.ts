import { describe, it, expect } from "vitest";
import { renderMarkdown } from "../../src/lib/map/markdown";

describe("renderMarkdown", () => {
  it("renders a paragraph", () => {
    expect(renderMarkdown("Hello world")).toBe("<p>Hello world</p>");
  });

  it("escapes HTML entities", () => {
    expect(renderMarkdown('<script>alert("xss")</script>')).toBe(
      "<p>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</p>",
    );
  });

  it("renders headings h1-h4", () => {
    expect(renderMarkdown("# Title")).toBe("<h1>Title</h1>");
    expect(renderMarkdown("## Sub")).toBe("<h2>Sub</h2>");
    expect(renderMarkdown("### H3")).toBe("<h3>H3</h3>");
    expect(renderMarkdown("#### H4")).toBe("<h4>H4</h4>");
  });

  it("renders bold text", () => {
    expect(renderMarkdown("**bold**")).toBe("<p><strong>bold</strong></p>");
    expect(renderMarkdown("__bold__")).toBe("<p><strong>bold</strong></p>");
  });

  it("renders italic text", () => {
    expect(renderMarkdown("*italic*")).toBe("<p><em>italic</em></p>");
    expect(renderMarkdown("_italic_")).toBe("<p><em>italic</em></p>");
  });

  it("renders inline code", () => {
    expect(renderMarkdown("`code`")).toBe("<p><code>code</code></p>");
  });

  it("renders links", () => {
    expect(renderMarkdown("[text](http://example.com)")).toBe(
      '<p><a href="http://example.com" target="_blank">text</a></p>',
    );
  });

  it("renders unordered lists", () => {
    const input = "- item 1\n- item 2";
    expect(renderMarkdown(input)).toBe(
      "<ul><li>item 1</li><li>item 2</li></ul>",
    );
  });

  it("renders ordered lists", () => {
    const input = "1. first\n2. second";
    expect(renderMarkdown(input)).toBe(
      "<ol><li>first</li><li>second</li></ol>",
    );
  });

  it("renders code blocks", () => {
    const input = "```\nconst x = 1;\n```";
    expect(renderMarkdown(input)).toBe("<pre><code>const x = 1;</code></pre>");
  });

  it("renders horizontal rules", () => {
    expect(renderMarkdown("---")).toBe("<hr>");
    expect(renderMarkdown("***")).toBe("<hr>");
    expect(renderMarkdown("___")).toBe("<hr>");
  });

  it("skips blank lines", () => {
    expect(renderMarkdown("a\n\nb")).toBe("<p>a</p><p>b</p>");
  });

  it("renders mixed content", () => {
    const input = "# Title\n\nSome **bold** text\n\n- item";
    expect(renderMarkdown(input)).toBe(
      "<h1>Title</h1><p>Some <strong>bold</strong> text</p><ul><li>item</li></ul>",
    );
  });

  it("renders inline formatting in headings", () => {
    expect(renderMarkdown("## **Bold** heading")).toBe(
      "<h2><strong>Bold</strong> heading</h2>",
    );
  });
});

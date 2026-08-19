export function addAbbrTags(html: string): string {
  const abbrs: Record<string, string> = {
    DCB: "Dolmenwood Campaign Book",
    DPB: "Dolmenwood Player's Book",
    DMB: "Dolmenwood Monster Book",
  };
  for (const [abbr, title] of Object.entries(abbrs)) {
    html = html.replaceAll(
      abbr,
      `<abbr data-tooltip="${title}">${abbr}</abbr>`,
    );
  }
  return html;
}

export function linkifyHexRefs(html: string): string {
  return html.replace(
    /\b([01]\d{3})\b/g,
    '<a class="hex-link" href="#hex=$1">$1</a>',
  );
}

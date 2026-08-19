function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function applyInline(s: string): string {
  return s
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
}

export function renderMarkdown(text: string): string {
  const escaped = esc(text);
  const lines = escaped.split("\n");
  let html = "";
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // Code blocks
    if (line.startsWith("```")) {
      let code = "";
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code += (code ? "\n" : "") + lines[i];
        i++;
      }
      i++; // skip closing ```
      html += "<pre><code>" + code + "</code></pre>";
      continue;
    }
    // Headings
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      html += `<h${level}>${applyInline(headingMatch[2])}</h${level}>`;
      i++;
      continue;
    }
    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      html += "<hr>";
      i++;
      continue;
    }
    // Unordered list
    if (/^[-*+]\s/.test(line)) {
      html += "<ul>";
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        html +=
          "<li>" + applyInline(lines[i].replace(/^[-*+]\s/, "")) + "</li>";
        i++;
      }
      html += "</ul>";
      continue;
    }
    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      html += "<ol>";
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        html +=
          "<li>" + applyInline(lines[i].replace(/^\d+\.\s/, "")) + "</li>";
        i++;
      }
      html += "</ol>";
      continue;
    }
    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }
    // Paragraph
    html += "<p>" + applyInline(line) + "</p>";
    i++;
  }
  return html;
}

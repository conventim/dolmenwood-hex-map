import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { z } from "zod";

const text = z
  .string()
  .refine((value) => !value.includes("\0"), "NUL characters are not supported");
const timestamp = text
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid timestamp")
  .optional();
const notesSchema = z.array(
  z.object({
    hex_id: text.regex(/^\d{4}$/),
    title: text.max(200).default(""),
    content: text.max(10000),
    category: z.enum(["explored", "news", "useful_places"]).default("news"),
    updated_at: timestamp,
  }),
);

function literal(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

export function exportD1(notes: unknown): string {
  const statements: string[] = [];
  for (const note of notesSchema.parse(notes)) {
    const values = [
      note.hex_id,
      note.title,
      note.content,
      note.category,
      new Date(note.updated_at ?? Date.now()).toISOString(),
    ].map(literal);
    statements.push(
      `INSERT INTO hex_notes (hex_id, title, content, category, updated_at) VALUES (${values.join(", ")}) ON CONFLICT(hex_id) DO NOTHING;`,
    );
  }
  return statements.join("\n") + "\n";
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const [notesPath] = process.argv.slice(2);
  if (!notesPath || process.argv.length !== 3) {
    console.error(
      "Usage: node --experimental-strip-types scripts/export-d1.ts hex_notes.json",
    );
    process.exitCode = 1;
  } else {
    const notes: unknown = JSON.parse(readFileSync(notesPath, "utf8"));
    const sql = exportD1(notes);
    process.stdout.write(
      readFileSync(
        new URL("../cloudflare/schema.sql", import.meta.url),
        "utf8",
      ) +
        "\n" +
        sql,
    );
  }
}

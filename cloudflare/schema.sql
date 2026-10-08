CREATE TABLE IF NOT EXISTS hex_notes (
  hex_id TEXT PRIMARY KEY NOT NULL CHECK (length(hex_id) = 4 AND hex_id NOT GLOB '*[^0-9]*'),
  title TEXT NOT NULL DEFAULT '' CHECK (length(title) <= 200),
  content TEXT NOT NULL CHECK (length(content) <= 10000),
  category TEXT NOT NULL DEFAULT 'news' CHECK (category IN ('explored', 'news', 'useful_places')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

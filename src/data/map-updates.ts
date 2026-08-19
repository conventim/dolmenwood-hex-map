import { z } from "zod";

const mapUpdateSchema = z.object({
  id: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(["module", "technical"]),
  title: z.string(),
  description: z.string(),
});

export type MapUpdate = z.infer<typeof mapUpdateSchema>;

const raw = [
  // Newest first — prepend new entries. Always use the next highest id.
  {
    id: 23,
    date: "2026-07-07",
    type: "module" as const,
    title: "Added: Barrow of the Five Kings",
    description:
      "A level 3–4 adventure exploring an ancient burial mound haunted by five Antler Wraiths and their Wight servants, with history, hazards, and lingering fairy influence.",
  },
  {
    id: 22,
    date: "2026-05-04",
    type: "module" as const,
    title: "Added: The Seventh Star",
    description:
      "A level 4–6 adventure of investigation and cosmic horror, featuring the Star Eaters cult, Farwynd Keep, and a ritual tied to a stellar alignment.",
  },
  {
    id: 21,
    date: "2026-04-09",
    type: "module" as const,
    title: "Added: Troubled Troll Grotto",
    description:
      "A level 2+ adventure featuring a cave complex inhabited by a two-headed troll, thrown into chaos by intruders around a buried portal.",
  },
  {
    id: 20,
    date: "2026-03-19",
    type: "module" as const,
    title: "Added: Corpse Husbandry",
    description:
      "A level 4–6 dungeon featuring a strange troll farm near Mulchgrove, infested by voracious jelly pests.",
  },
  {
    id: 19,
    date: "2026-03-19",
    type: "module" as const,
    title: "Added: The Lonely Home of Thin-and-Bone",
    description:
      "A level 3–5 adventure featuring an ancient stone home in a glade near Prigwort, and the tragic story of a Frost Elf.",
  },
  {
    id: 18,
    date: "2026-03-04",
    type: "technical" as const,
    title: "Fixed cloud sync for unmarked hexes",
    description:
      "Unmarking a hex now correctly syncs across devices. Previously, removed hexes could reappear when loading on another browser.",
  },
  {
    id: 17,
    date: "2026-03-01",
    type: "module" as const,
    title: "Added: Parliament of Owls",
    description:
      "A level 2–3 monster lair set in ruins on a river meander, inhabited by warring Witch Owls and their Shadow servants.",
  },
  {
    id: 16,
    date: "2026-02-24",
    type: "technical" as const,
    title: "Text search",
    description:
      "You can now search for POIs and modules by name using the search bar.",
  },
  {
    id: 15,
    date: "2026-02-23",
    type: "technical" as const,
    title: "Cloud sync",
    description:
      "You can now optionally sign in with Discord or Google to sync your exploration progress, referee notes, and preferences across devices. Completely optional — everything still works without an account.",
  },
  {
    id: 14,
    date: "2026-02-22",
    type: "technical" as const,
    title: "Hex exploration progress",
    description:
      "Exploration state (partially/fully explored) now shows in hex tooltips and the sidebar. A progress meter tracks how many of the 200 hexes you've explored.",
  },
  {
    id: 13,
    date: "2026-02-22",
    type: "technical" as const,
    title: "Referee Notes",
    description:
      'You can now add personal notes to any hex. Click "Add Referee notes" in the sidebar or press N. Notes support markdown formatting, persist in your browser, and hexes with notes show a green badge on the map.',
  },
  {
    id: 12,
    date: "2026-02-21",
    type: "module" as const,
    title: "Added: The Weird That Befell Drigbolton",
    description:
      "An investigative, event-based module for Level 3–5 characters involving a fallen star and alien weirdness in the hamlet of Drigbolton.",
  },
  {
    id: 11,
    date: "2026-02-21",
    type: "module" as const,
    title: "Added: The Incandescent Grottoes",
    description:
      "An OSE dungeon crawl through underground watercourses and scintillating grottoes, linkable with The Hole in the Oak.",
  },
  {
    id: 10,
    date: "2026-02-21",
    type: "module" as const,
    title: "Added: The Hole in the Oak",
    description:
      "A classic dungeon crawl through root-riddled passageways, an ancient wizard-complex, and reptile cult temples.",
  },
  {
    id: 9,
    date: "2026-02-19",
    type: "module" as const,
    title: "Added: Eye of Urva",
    description: "A one-page dungeon featuring a dwarven queen's mausoleum.",
  },
  {
    id: 8,
    date: "2026-02-19",
    type: "module" as const,
    title: "Added: The Swallowed Saint",
    description:
      "A level 3–5 adventure set in the Hag's Addle, featuring a submerged temple to Cwrnus.",
  },
  {
    id: 7,
    date: "2026-02-19",
    type: "module" as const,
    title: "Added: The Tumulheights",
    description:
      "A free hex-as-setting for Hex 1609, south of Castle Brackenwold.",
  },
  {
    id: 6,
    date: "2026-02-19",
    type: "technical" as const,
    title: "Added updates feed",
    description:
      "You can now see recent changes to the map via the Updates Bell icon.",
  },
  {
    id: 5,
    date: "2026-02-18",
    type: "technical" as const,
    title: "Multiple store links per module",
    description:
      "Modules now show links for all available stores instead of just one.",
  },
  {
    id: 4,
    date: "2026-02-14",
    type: "module" as const,
    title: "Added 5 community modules",
    description:
      "What the Hart Desires, Red Gwen's Bandit Hideout, Smokehouse of Dreg, The Forgotten Shrine of Fredulus the Beheaded, and The Forever Impeccable Shrine of Saint-Aeynid.",
  },
  {
    id: 3,
    date: "2026-02-13",
    type: "module" as const,
    title: "Added: Pipes on Droomen Knoll",
    description: "A level 1\u20132 adventure set in Hex 0406.",
  },
  {
    id: 2,
    date: "2026-02-11",
    type: "module" as const,
    title: "Added official Necrotic Gnome modules",
    description:
      "The Fungus That Came to Blackeswell, The Ruined Abbey of St Clewyd, and Emelda's Song.",
  },
  {
    id: 1,
    date: "2026-02-11",
    type: "technical" as const,
    title: "Dolmenwood hex map launched",
    description:
      "Interactive hex map with module annotations, keyboard navigation, and hex search.",
  },
];

export const updates: MapUpdate[] = raw.map((u) => mapUpdateSchema.parse(u));

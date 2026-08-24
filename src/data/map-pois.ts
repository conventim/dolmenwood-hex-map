export type PoiCategory = "settlement" | "castle" | "poi";

export interface MapPoi {
  name: string;
  hex: string;
  category: PoiCategory;
}

export const pois: MapPoi[] = [
  // // Settlements
  // { name: "Castle Brackenwold", hex: "1508", category: "settlement" },
  // { name: "High-Hankle", hex: "0512", category: "settlement" },
  // { name: "Lankshorn", hex: "0710", category: "settlement" },
  // { name: "Prigwort", hex: "1106", category: "settlement" },
  // { name: "Blackeswell", hex: "1604", category: "settlement" },
  // { name: "Dreg", hex: "1110", category: "settlement" },
  // { name: "Meagre's Reach", hex: "1703", category: "settlement" },
  // { name: "Odd", hex: "1403", category: "settlement" },
  // { name: "Woodcutters' Encampment", hex: "1109", category: "settlement" },
  // { name: "Fort Vulgar", hex: "0604", category: "settlement" },

  // // Castles / Keeps / Manors
  // { name: "Bogwitt Manor", hex: "1210", category: "castle" },
  // { name: "Castle Everdusk", hex: "0410", category: "castle" },
  // { name: "Chateau Mauvesse", hex: "1802", category: "castle" },
  // { name: "Hall of Sleep", hex: "1304", category: "castle" },
  // { name: "Harrowmoor Keep", hex: "1105", category: "castle" },
  // { name: "Hoarblight Keep", hex: "0505", category: "castle" },
  // { name: "Kolstoke Keep", hex: "0208", category: "castle" },
  // { name: "Nodding Castle", hex: "0210", category: "castle" },
  // { name: "Redwraith Manor", hex: "0709", category: "castle" },

  // // Other Major POIs
  // { name: "Court of the Nag-Lord", hex: "0904", category: "poi" },
  // { name: "Falls of Naon", hex: "0504", category: "poi" },
  // { name: "Falls of Nyf", hex: "1112", category: "poi" },
  // { name: "Ruined Abbey of St Clewyd", hex: "0906", category: "poi" },
];

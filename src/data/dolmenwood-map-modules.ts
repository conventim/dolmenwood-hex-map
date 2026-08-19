import { z } from "zod";

const linkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
});

const baseFields = {
  name: z.string(),
  levels: z.string(),
  location: z.string(),
  official: z.boolean().default(false),
  ose: z.boolean().default(false),
  description: z.string(),
  links: z.array(linkSchema).nonempty(),
};

const hexModuleSchema = z.object({
  ...baseFields,
  hexes: z.array(z.string().regex(/^\d{4}$/)).nonempty(),
});

const locationModuleSchema = z.object(baseFields);

const mapModuleSchema = z.union([hexModuleSchema, locationModuleSchema]);

export type MapModule = z.infer<typeof mapModuleSchema>;

const raw = [
  {
    name: "Winter's Daughter",
    levels: "1–3",
    links: [
      {
        label: "Necrotic Gnome",
        url: "https://necroticgnome.com/products/winters-daughter",
      },
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/en/product/270795/winter-s-daughter",
      },
    ],
    location: "Hex 0609 or 1011 or 1306",
    official: true,
    hexes: ["0609", "1011", "1306"],
    description:
      "The tomb of an ancient hero, lost in the tangled depths of the woods. A ring of standing stones, warded by the sinister Drune cult. A fairy princess who watches with timeless patience from beyond the veil of the mortal. A forgotten treasure that holds the key to her heart.\n\nWinter's Daughter is a romantic fairy tale adventure designed for characters of Level 1–3. Presented in a quick-reference format, the adventure is easy to run with minimal prep.",
  },
  {
    name: "Barrowbogey's Lair",
    levels: "1",
    links: [
      {
        label: "itch.io",
        url: "https://malmuria.itch.io/barrowbogeys-lair",
      },
    ],
    location: "Hex 0710",
    hexes: ["0710"],
    description:
      "Guests at the Hornstoat's Rest in Lankshorn are falling ill with shaking, boils, and warts! Assist the inn's proprietor, Margerie Stallowmade, in uncovering the source of the affliction.\n\nA two-page introductory adventure.",
  },
  {
    name: "Abigail's Wedding",
    levels: "2-3",
    links: [
      {
        label: "itch.io",
        url: "https://doogface.itch.io/abigails-wedding",
      },
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/en/product/555160/abigail-s-wedding",
      },
    ],
    location: "On a ley line",
    hexes: ["0909"],
    description:
      "A six-page monster lair designed to be dropped into any Dolmenwood hex on a ley line.\n\nThe lair consists of a flooded seven room dungeon inhabited by wights and bog corpses, with story hooks, interactive elements, unique treasures, a table of bog corpse features, and some typical Dolmenwood fairytale strangeness.",
  },
  {
    name: "The Fungus That Came to Blackeswell",
    levels: "2–3",
    links: [
      {
        label: "Necrotic Gnome",
        url: "https://necroticgnome.com/products/the-fungus-that-came-to-blackeswell",
      },
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/en/product/527289/the-fungus-that-came-to-blackeswell",
      },
    ],
    location: "Hex 1604",
    official: true,
    hexes: ["1604"],
    description:
      "Fungal apocalypse has ravaged the isolated village of Blackeswell, blanketing the streets in blanched mycelia waving eerily to an unheard hymn. The village is to be razed to the ground, but the bold may be able to get in and out before the troops arrive. Can any living souls be saved and can the fungal infestation be reversed?\n\nThe Fungus That Came to Blackeswell is an adventure of fungal horror designed for characters of Level 2–3. Presented in a quick-reference format, the adventure is easy to run with minimal prep.",
  },
  {
    name: "The Ruined Abbey of St Clewyd",
    levels: "4–6",
    links: [
      {
        label: "Necrotic Gnome",
        url: "https://necroticgnome.com/products/the-ruined-abbey-of-st-clewyd",
      },
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/en/product/527291/the-ruined-abbey-of-st-clewyd",
      },
    ],
    location: "Hex 0906",
    official: true,
    hexes: ["0906"],
    description:
      "The once-proud Abbey of St Clewyd the Refulgent has stood in ruins for a century, wracked with weird energies and haunted by wicked spirits. Several missions have sought to reclaim the abbey and quell the tides of Chaos. All have failed. What treasures lie untouched within, ripe for the picking? Can the mystery of the abbey's ruination be unravelled and the forces of Chaos be vanquished?\n\nThe Ruined Abbey of St Clewyd is a weird crypt-crawl adventure designed for characters of Level 4–6. Presented in a quick-reference format, the adventure is easy to run with minimal prep.",
  },
  {
    name: "Emelda's Song",
    levels: "2–4",
    links: [
      {
        label: "Necrotic Gnome",
        url: "https://necroticgnome.com/products/emeldas-song",
      },
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/en/product/527293/emelda-s-song",
      },
    ],
    location: "Hex 0710",
    official: true,
    hexes: ["0710"],
    description:
      "The market town of Lankshorn is abuzz with excitement after the cruel Lord Malbleat announces a festival honouring his sorcerous ancestor. Only when the young singer Emelda—famed for her beautiful voice—is reported missing do things take a sinister turn.\n\nEmelda's Song is an adventure of infiltration and intrigue designed for characters of Level 2–4. Presented in a quick-reference format, the adventure is easy to run with minimal prep.",
  },
  {
    name: "What the Hart Desires",
    levels: "1–2",
    links: [
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/en/product/554136/what-the-hart-desires-2-page-dolmenwood-adventure",
      },
    ],
    location: "Hex 1406",
    hexes: ["1406"],
    description:
      "The Golden Wood has become afflicted with something foul. Its radiance has been displaced by shadow, and in its gloom a stag stands upon hind-quarters, watching… waiting.\n\nWhat the Hart Desires is a 2-page adventure intended for a party of level 1–2 PCs. It presents a mysterious forest location containing five keyed encounter areas, connected by winding hunting trails where the party may face numerous random encounters.\n\nAt the heart of the wood lies a dark secret guarded by the Prince-of-Tines, an agent of the chaotic Nag-Lord, who oversees a sinister plan to force open a passage into the Fairy realm of Whyforth.",
  },
  {
    name: "Pipes on Droomen Knoll",
    levels: "1–2",
    links: [
      {
        label: "Necrotic Gnome",
        url: "https://necroticgnome.com/products/dolmenwood-campaign-book",
      },
    ],
    location: "Hex 0809 or 1111 or 1206",
    official: true,
    hexes: ["0809", "1111", "1206"],
    description:
      "Part of the DCB. A short introductory adventure set in an ancient fairy ruin, now the base of a band of crookhorns spying on a nearby settlement. A great introduction to Dolmenwood for groups new to the setting. Approximately 5,000gp worth of monetary treasure is present.\n\nPipes on Droomen Knoll is designed for characters of Level 1–2. Presented in a quick-reference format, the adventure is easy to run with minimal prep.",
  },
  {
    name: "Red Gwen's Bandit Hideout",
    levels: "",
    links: [
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/en/product/553525/red-gwen-s-bandit-hideout",
      },
    ],
    location: "Hex 0311",
    hexes: ["0311"],
    description:
      "Banditry has been on the rise in the High Wold! Due to baron Hogwarsh's lax government, the roads in the southern reaches of Dolmenwood are no longer safe for merchants to travel on.\n\nOne particularly bold gang of ne'er-do-wells led by the infamous Red Gwen has been on a raiding spree along a stretch of Bove's road, making off with their ill-gained goods to their lair in the woods between Nodding and Everdusk Castle. High time someone put a stop to their activities!",
  },
  {
    name: "Smokehouse of Dreg",
    levels: "",
    links: [
      {
        label: "itch.io",
        url: "https://spandexandy.itch.io/dolmenwood-smokehouse-of-dreg",
      },
    ],
    location: "Hex 1110",
    hexes: ["1110"],
    description:
      "The riverside town of Dreg has problems that waft around and affect everybody. This keyed location in the town is a likely place for players who spend time in town to visit. This module attempts to flesh it out and provide maps.",
  },
  {
    name: "The Forgotten Shrine of Fredulus the Beheaded",
    levels: "",
    links: [
      {
        label: "itch.io",
        url: "https://krabcreate.itch.io/the-forgotten-shrine-of-fredulus-the-beheaded",
      },
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/en/product/426341/the-forgotten-shrine-of-fredulus-the-beheaded-for-dolmenwood",
      },
    ],
    location: "Caves along a creek",
    hexes: ["0403"],
    description:
      "The grimalkin elementalist Guliver Puss has stolen the head of Fredulus the Beheaded's statue. He has made his home in the caves behind the statue of the saint. He is protected by madtoms led by his old friend Merpus Ronan and plans to build a golem out of pieces of saints' statues.",
  },
  {
    name: "The Tumulheights",
    levels: "",
    links: [
      {
        label: "Goatman's Goblet",
        url: "https://www.goatmansgoblet.com/2019/03/dolmenwood-tumulheights-hex-1609.html",
      },
    ],
    location: "Hex 1609",
    hexes: ["1609"],
    description:
      "A hex-as-setting describing rough hills, scrubland, and sparse woods south of Castle Brackenwold — an ancient burial ground for Emeraude warriors. A low level area to learn about the setting and defeat some lesser villains.\n\nFeatures Culderhill Abbey (a fortified tower housing Lichwards), Pook's Way Taphouse (a ramshackle tavern run by goatman Tarridan Gresh), and the Dredgenmoot (an underground otherworldly maze of fungal origins). Large pig populations hunt truffles, and the legendary Black Pig appears during full moons.",
  },
  {
    name: "The Swallowed Saint",
    levels: "3–5",
    links: [
      {
        label: "itch.io",
        url: "https://manu-forti-games.itch.io/the-swallowed-saint",
      },
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/en/product/531004/the-swallowed-saint-an-adventure-for-dolmenwood",
      },
    ],
    location: "Hex 1008",
    hexes: ["1008"],
    description:
      "When a priest goes missing, the search leads deep into the swamp and into the drowned ruins of a forgotten temple to Cwrnus.\n\nFeatures an ancient, submerged temple with 10 keyed locations, the chance to aid in the miraculous rise of a new saint, a new Rank 2 holy spell, and 3 new magic items. Perfect for a one-shot or as part of an ongoing campaign.",
  },
  {
    name: "The Forever Impeccable Shrine of Saint-Aeynid",
    levels: "3",
    links: [
      {
        label: "itch.io",
        url: "https://krabcreate.itch.io/the-forever-impeccable-shrine-of-saint-aeynid",
      },
    ],
    location: "Near Lankshorn",
    hexes: ["0809"],
    description:
      "Lady Harrowmoor wants to give back to the abbey of Saint-Clewd its former prestige. She knows about a friar who has dedicated his life to maintaining the place and was sanctified for it. His shrine and last rest has unfortunately sunk into oblivion, somewhere in the Lankshorn. She needs you to find it and bring back the monk's secrets.\n\nA level 3 mini dungeon.",
  },
  {
    name: "Eye of Urva",
    levels: "",
    links: [
      {
        label: "itch.io",
        url: "https://lelefuchur.itch.io/eye-of-urva",
      },
    ],
    location: "Dwarven mausoleum",
    hexes: ["1501"],
    description:
      "A mausoleum for a dwarven queen who saw the future by looking into a fallen star.\n\nA one-page dungeon featuring monsters from the Dolmenwood Monster Book.",
  },
  {
    name: "The Weird That Befell Drigbolton",
    levels: "3–5",
    links: [
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/en/product/207631/the-weird-that-befell-drigbolton",
      },
    ],
    location: "Hex 0702",
    official: true,
    ose: true,
    hexes: ["0702"],
    description:
      "Something fell. A sickly gloaming lit up the night like mock daylight, just for a moment, and then the hills trembled. Now, an alien entity lies brooding in a crater gouged out of the moor. Local folk are enraptured with the toothsome jelly exuded by this being, but are blind to the true nature of the events unfolding in their rustic little backwater.\n\nAn investigative, event-based module for characters of Level 3–5 involving a fallen star, frothing masses of pink jelly, manna fever, religious fervour, a warped manor house, and psychedelic star-debris slowly twisting the nature of reality around it. Features an area map with 11 detailed locations, a 16-room manor house dungeon, charts delineating unfolding weirdness over seven days, and a mini bestiary with over 20 new monsters.",
  },
  {
    name: "The Hole in the Oak",
    levels: "1–2",
    links: [
      {
        label: "Necrotic Gnome",
        url: "https://necroticgnome.com/products/the-hole-in-the-oak",
      },
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/product/284852/The-Hole-in-the-Oak?affiliate_id=516538",
      },
    ],
    location: "1208",
    official: true,
    ose: true,
    hexes: ["1208"],
    description:
      "A hole in an old oak tree leads characters down to a maze of twisting, root-riddled passageways, the chambers of an ancient wizard-complex, and the banks of an underground river where once a reptile cult built their temples.\n\n60 keyed areas in a 40-page hardcover, presented in a quick-reference format. Can be linked with The Incandescent Grottoes to form a large, 3 level dungeon with over 115 keyed encounter areas.",
  },
  {
    name: "The Incandescent Grottoes",
    levels: "1–2",
    links: [
      {
        label: "Necrotic Gnome",
        url: "https://necroticgnome.com/products/the-incandescent-grottoes",
      },
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/product/348878/The-Incandescent-Grottoes?affiliate_id=516538",
      },
    ],
    location: "1207",
    official: true,
    ose: true,
    hexes: ["1207"],
    description:
      "A bubbling stream cascades into a hole in the earth, leading to a series of underground watercourses and scintillating grottoes. Adventurers who delve within may discover odd mosses and fungi, a ruined temple complex, and the lair of a crystal-eating dream dragon.\n\n57 keyed areas in a 48-page hardcover, presented in a quick-reference format. Can be linked with The Hole in the Oak to form a large, 3 level dungeon with over 115 keyed encounter areas.",
  },
  {
    name: "Parliament of Owls",
    levels: "2–3",
    links: [
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/en/product/558919/parliament-of-owls",
      },
      {
        label: "itch.io",
        url: "https://doogface.itch.io/parliament-of-owls",
      },
    ],
    location: "Ruins near a river",
    hexes: ["1402"],
    description:
      "A monster lair designed to be dropped into any hex situated near a river.\n\nThe lair consists of a set of ruins on a river meander inhabited by a fractious parliament of Witch Owls warring amongst themselves, their Shadow servants and some unfortunate prisoners. The ruins are a deorling temple housing idols dedicated to their gods Howawi and Yorghan, and is where the twice-blessed blades of deorling stags were forged.\n\nFeatures story hooks, interactive elements, faction play, detailed NPCs, detailed location keys, a table of hallucinations caused by magical mist, event tables, a keyed map, and some typical Dolmenwood fairytale strangeness.",
  },
  {
    name: "The Lonely Home of Thin-and-Bone",
    levels: "3–5",
    links: [
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/en/product/559585/the-lonely-home-of-thin-and-bone-an-adventure-in-dolmenwood",
      },
    ],
    location: "Hex 1107",
    hexes: ["1107"],
    description:
      "The hunters of Prigwort know a glade they do not enter. At its heart stands an ancient stone home — sharp-pitched roof, walls gone grey with age, and a cold that rolls off it even at the height of summer. Breath fogs. Game does not graze here.\n\nThe locals have their theories: an ice wyrm, ancient war-beast of the Cold Prince, sleeps in its basement; witches use the place for rites that turn pubescent boys into man-owls. No one goes close enough to be certain.\n\nA 4-page adventure with an original, hand-drawn map and art. Players will uncover the story of Frost Elf Thin-and-Bone, her daughter, and her tragic fate. Perfect for a one-session adventure that can be run on the fly.",
  },
  {
    name: "Corpse Husbandry",
    levels: "4–6",
    links: [
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/en/product/560343/corpse-husbandry-an-adventure-in-dolmenwood",
      },
    ],
    location: "Hex 1305",
    hexes: ["1305"],
    description:
      "In recent months, strange mushrooms have erupted across a corner just outside the Mulchgrove. Local foragers reported vivid, peculiar dreams after extracting them — visions of mosslings sharing tea with mammoths, a boulder tucked in for naptime, and other odd sights. Now the dreams are coming uninvited, in daylight, to people who never touched the mushrooms at all.\n\nThe mosslings of Mulchgrove are divided. Most believe the fungi are a divine offering — though no two can agree which god sent them, or why. But one thing is sure: someone, or something, is broadcasting.\n\nA 15-room dungeon with original, hand-drawn maps and art. Players will explore a strange troll farm, infested by voracious jelly pests. Best suited near or within Mulchgrove, but can be dropped anywhere.",
  },
  {
    name: "Troubled Troll Grotto",
    levels: "2+",
    links: [
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/en/product/563700/troubled-troll-grotto",
      },
    ],
    location: "Hex 1208",
    hexes: ["1208"],
    description:
      "A level 2+ adventure detailing a small cave complex inhabited by a two-headed troll who preys on passers-by and feasts on moss and fungi grown on the corpses of their victims. The grotto has been thrown into chaos by various intruders who have unearthed strange treasures around a buried portal.",
  },
  {
    name: "The Seventh Star",
    levels: "4–6",
    links: [
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/en/product/566246/the-seventh-star",
      },
    ],
    location: "Hex 0202 or 0701",
    hexes: ["0202", "0701"],
    description:
      "In the frozen depths of winter, a chance encounter on a desolate road entangles the characters in a web of secrets, blood, and forbidden knowledge. A hidden cult, the Star Eaters, is preparing a ritual at the remote outpost of Farwynd Keep that could tear open the boundary between dream and waking world.\n\nA level 4–6 adventure of investigation and cosmic horror, beginning with a simple roadside encounter and spiraling into snowbound wilderness, haunted crypts, and a buried astral gateway. Features multiple paths, player-driven choices, and a horror thread running throughout.",
  },
  {
    name: "Barrow of the Five Kings",
    levels: "3–4",
    links: [
      {
        label: "DriveThruRPG",
        url: "https://www.drivethrurpg.com/product/574438/barrow-of-the-five-kings",
      },
    ],
    location: "Ancient barrow in a forested hex",
    hexes: ["0810", "1206"],
    description:
      "Barrow of the Five Kings is set in an ancient burial mound haunted by five spectral chieftains and their undead servants. Recent events have awakened the antler-crowned wraiths and the ancient mound now yawns open. The Antler Wraiths have begun kidnapping victims to bolster the ranks of the Wights that guard an ancient secret within the barrow.\n\nThe adventure centres around exploration of the barrow with opportunities to learn history and customs of ancient tribes whilst navigating the hazards presented by their burial ground. The barrow contains five Antler Wraiths, numerous Wights, hidden passages, traps, magical hazards, and remnants of a forgotten conflict between men and fairy whose influence still lingers within the mound.\n\nAn adventure for characters of Level 3–4. Approximately 11,000gp worth of monetary treasure is present, along with new magic items, rare comestibles, and herbs.",
  },
];

export const modules: MapModule[] = raw.map((m) => mapModuleSchema.parse(m));

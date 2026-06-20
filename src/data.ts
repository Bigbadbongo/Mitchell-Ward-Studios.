import { Artwork } from "./types";

export const GALLERY_ARTWORKS: Artwork[] = [
  // --- PAINTINGS: MINI ---
  {
    id: "p-mini-1",
    title: "Lilac Bloom",
    artist: "Clara Vance",
    description: "A delicate, miniature study of wild cyclamen and early spring petals. Rich violet hues are accented by heavy plaster impasto ridges that catch side-lighting gracefully.",
    medium: "Heavy Plaster Strata and Pigmented Acrylic on Wood Panel",
    size: "6 x 6 in",
    price: 180,
    category: "Paintings",
    style: "Mini",
    primaryColor: "#8B5CF6", // purple
    secondaryColor: "#DDD6FE", // light lilac
    tertiaryColor: "#10B981", // emerald stem highlight
    visualType: "botanical",
    imageSeed: "lilac-bloom"
  },
  {
    id: "p-mini-2",
    title: "Sienna Ridge",
    artist: "Marcus Thorn",
    description: "Inspired by the dry, baking soils of Southern Tuscany. A horizontal layout pairing dense brick sienna with coarse limestone paste and charcoal lines.",
    medium: "Raw Iron Oxide, Coarse Travertine Powder and Oil Crayon",
    size: "5 x 5 in",
    price: 220,
    category: "Paintings",
    style: "Mini",
    primaryColor: "#B45309", // burnt orange
    secondaryColor: "#FDE68A", // limestone gold
    tertiaryColor: "#1C1917", // slate black
    visualType: "minimalist",
    imageSeed: "sienna-ridge"
  },
  {
    id: "p-mini-3",
    title: "Cobalt Wave",
    artist: "Evelyn Gray",
    description: "A rapid palette knife capture of storm tides foaming against dark volcanic cliffs. Thick peaks of pure zinc white crash over deep phthalo blue.",
    medium: "Textured Gel Medium and Artist Oils on Box Canvas",
    size: "6 x 6 in",
    price: 195,
    category: "Paintings",
    style: "Mini",
    primaryColor: "#1D4ED8", // cobalt blue
    secondaryColor: "#E0F2FE", // ocean seafoam
    tertiaryColor: "#0F172A", // midnight abyss
    visualType: "fluid",
    imageSeed: "cobalt-wave"
  },

  // --- PAINTINGS: STUDIO ---
  {
    id: "p-stud-1",
    title: "Anatomy of Sun",
    artist: "Alistair Hume",
    description: "A refined studio study exploring celestial geometry. Generous circles of natural ochre washes are partitioned by sharp graphite lines on raw unprimed cotton duck canvas.",
    medium: "Ochre Pigment Paste, Gesso and Hard Lead Graphite on Cotton Duck",
    size: "12 x 12 in",
    price: 620,
    category: "Paintings",
    style: "Studio",
    primaryColor: "#D97706", // ochre sun
    secondaryColor: "#F3F4F6", // raw cotton linen white
    tertiaryColor: "#4B5563", // graphite slate
    visualType: "geometric",
    imageSeed: "anatomy-sun"
  },
  {
    id: "p-stud-2",
    title: "Whispering Sage",
    artist: "Clara Vance",
    description: "Ethereal, plant-like forms emerging from fog. Delicate charcoal wash branches sit atop layers of pale, earthy sage green and soft chalk markings.",
    medium: "Vine Charcoal, Chalk wash and Soft Dry Pigments on Board",
    size: "10 x 10 in",
    price: 450,
    category: "Paintings",
    style: "Studio",
    primaryColor: "#15803D", // sage green
    secondaryColor: "#F0FDF4", // pale mint fog
    tertiaryColor: "#451A03", // charcoal brown
    visualType: "botanical",
    imageSeed: "whispering-sage"
  },
  {
    id: "p-stud-3",
    title: "Verdant Echoes",
    artist: "Evelyn Gray",
    description: "A rich exploration of forest interiors, blending deep emerald pools with layers of translucent turquoise glazes and floating golden birch dust.",
    medium: "Acrylic Fluid Glazes, Mica Flakes and Gloss Resin Varnish",
    size: "12 x 12 in",
    price: 580,
    category: "Paintings",
    style: "Studio",
    primaryColor: "#047857", // forest emerald
    secondaryColor: "#CCFBF1", // pale teal sunbeams
    tertiaryColor: "#F59E0B", // golden birch highlight
    visualType: "fluid",
    imageSeed: "verdant-echoes"
  },

  // --- PAINTINGS: STATEMENT ---
  {
    id: "p-stat-1",
    title: "Sands of Solitude",
    artist: "Marcus Thorn",
    description: "A massive, commanding statement piece. Flowing, raked desert ridges are modeled in concrete relief, reflecting a peaceful state of solitude, highlighted with floating genuine 24k gold leaf flakes.",
    medium: "Structured Sand Gesso Concrete, Acrylic, and 24k Gold Leaf",
    size: "36 x 36 in",
    price: 1800,
    category: "Paintings",
    style: "Statement",
    primaryColor: "#D97706", // warm desert gold
    secondaryColor: "#FEF3C7", // cream desert sand
    tertiaryColor: "#B45309", // rust shadows
    visualType: "minimalist",
    imageSeed: "sands-solitude"
  },
  {
    id: "p-stat-2",
    title: "Midnight Monolith",
    artist: "Alistair Hume",
    description: "A powerful brutalist monument rendered in thick oil paint layers. Dark iron-rich greys collide with carbon black blocks, leaving raw industrial canvas edges peek through.",
    medium: "Cold Wax Medium, Crushed Slate Powder and Heavy Bodied Oils",
    size: "30 x 40 in",
    price: 1450,
    category: "Paintings",
    style: "Statement",
    primaryColor: "#111827", // iron grey
    secondaryColor: "#374151", // light slate
    tertiaryColor: "#EF4444", // a tiny rust red strike line
    visualType: "geometric",
    imageSeed: "midnight-monolith"
  },
  {
    id: "p-stat-3",
    title: "Ethereal Continuum",
    artist: "Evelyn Gray",
    description: "An infinite atmospheric void. Softly blended misty violet and deep navy washes merge into a bright center of warm candlelit gesso, inviting silent contemplation.",
    medium: "Dilute Ink washes, Dry Pastel Dust and Pure Pigment Glaze on Linen",
    size: "40 x 40 in",
    price: 2400,
    category: "Paintings",
    style: "Statement",
    primaryColor: "#1E1B4B", // deep indigo void
    secondaryColor: "#C084FC", // soft violet nebula
    tertiaryColor: "#FFFBEB", // morning star candle glow
    visualType: "cosmic",
    imageSeed: "ethereal-continuum"
  },

  // --- PHOTOGRAPHY: NATURE/LANDSCAPES ---
  {
    id: "ph-nat-1",
    title: "Echoes of Yosemite",
    artist: "Julian Thorne",
    description: "Ethereal morning pine trees shrouded in deep, heavy alpine fog at the floor of Yosemite Valley. The stark trunks form dramatic dark pillars against a monochrome mist.",
    medium: "Archival Pigment Giclée Print on 310gsm Baryta Paper",
    size: "12 x 18 in",
    price: 280,
    category: "Photography",
    style: "Nature/Landscapes",
    primaryColor: "#374151", // dark slate pine
    secondaryColor: "#F3F4F6", // morning mist white
    tertiaryColor: "#1F2937", // granite shadow charcoal
    visualType: "minimalist",
    imageSeed: "yosemite-mists"
  },
  {
    id: "ph-nat-2",
    title: "Obsidian Plains",
    artist: "Inga Sól",
    description: "A dramatic Iceland high-altitude desert study. Wavy, pure basalt sand dunes ripple under extreme arctic winter light, casting high contrast geometric shadows.",
    medium: "Monochrome Silver Gelatin Print on Double-Weight Fiber Paper",
    size: "16 x 20 in",
    price: 340,
    category: "Photography",
    style: "Nature/Landscapes",
    primaryColor: "#030712", // obsidian volcanic black
    secondaryColor: "#E5E7EB", // glacial clouds white
    tertiaryColor: "#6B7280", // dynamic silver granite
    visualType: "geometric",
    imageSeed: "iceland-obsidian"
  },
  {
    id: "ph-nat-3",
    title: "Dune NO. 8",
    artist: "Julian Thorne",
    description: "Minimalist sand ridges stretching into infinite horizons, captured in Death Valley at twilight. The cooling winds have left smooth, perfect desert ripples.",
    medium: "ChromaLuxe Sublimation Print on Floating Matte Aluminum Panel",
    size: "12 x 18 in",
    price: 290,
    category: "Photography",
    style: "Nature/Landscapes",
    primaryColor: "#D97706", // warm sand dune
    secondaryColor: "#78350F", // deep red dune shadow
    tertiaryColor: "#FEF3C7", // soft sky horizon glow
    visualType: "fluid",
    imageSeed: "death-valley-dune"
  },

  // --- PHOTOGRAPHY: URBAN/CULTURE ---
  {
    id: "ph-urb-1",
    title: "Shibuya Velocity",
    artist: "Satoshi Ken",
    description: "The dizzying pulse of Tokyo. Rain-soaked streets capture the streak lights of cruising taxis and towering neon billboards during late rush hour peak.",
    medium: "Archive Tinted Giclée Print on Fine Art Luster paper",
    size: "12 x 18 in",
    price: 310,
    category: "Photography",
    style: "Urban/Culture",
    primaryColor: "#EC4899", // hot pink neon
    secondaryColor: "#06B6D4", // cool cyan lights
    tertiaryColor: "#030712", // asphalt rain puddle deep
    visualType: "cosmic",
    imageSeed: "shibuya-lights"
  },
  {
    id: "ph-urb-2",
    title: "Portuguese Azulejos",
    artist: "Inês Silva",
    description: "A tight, sunny architectural detail of Lisbon. Traditional hand-painted ceramic tiles reflect bright Southern European morning sun, cracked by vintage beauty.",
    medium: "C-Type Archival Gloss Print on Semi-Matte Cotton Rag",
    size: "12 x 12 in",
    price: 260,
    category: "Photography",
    style: "Urban/Culture",
    primaryColor: "#2563EB", // traditional cobalt blue glaze
    secondaryColor: "#FDE047", // yellow morning warmth
    tertiaryColor: "#FAFAF9", // warm hand-made white plaster
    visualType: "geometric",
    imageSeed: "lisbon-tiles"
  },
  {
    id: "ph-urb-3",
    title: "Montmartre Rain",
    artist: "Luc Dubois",
    description: "Warm, amber-lit cobblestones outside an authentic Parisian bistro during a soft midnight drizzle. Deep glass water reflections paint a nostalgic scene.",
    medium: "Traditional Graumé Photographic Print under UV-Plexiglas Pane",
    size: "16 x 20 in",
    price: 350,
    category: "Photography",
    style: "Urban/Culture",
    primaryColor: "#CA8A04", // tungsten amber light
    secondaryColor: "#172554", // rainy blue shadow
    tertiaryColor: "#451A03", // bistro mahogany
    visualType: "fluid",
    imageSeed: "montmartre-bistro"
  }
];

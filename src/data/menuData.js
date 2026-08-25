/* ===================================================
   Menu Data — 4-Tier Combo-Based System
=================================================== */

// Tier definitions with pricing
export const TIERS = [
  {
    id: 1,
    name: "Standard",
    tagline: "$20–$40 per person",
    pricePerPersonLow: 20,
    pricePerPersonHigh: 40,
    description: "Drop-off catering. No guest minimum.",
    key: "standard"
  },
  {
    id: 2,
    name: "Splurge a Little",
    tagline: "$40–$100 per person",
    pricePerPersonLow: 40,
    pricePerPersonHigh: 100,
    description: "Everything in Standard plus premium options and elevated items. No guest minimum.",
    key: "splurge"
  },
  {
    id: 3,
    name: "Opulence",
    tagline: "Custom pricing",
    pricePerPersonLow: null,
    pricePerPersonHigh: null,
    description: "Fully customized menu with dedicated chef, full staff, and white-glove service.",
    key: "opulence"
  },
  {
    id: 4,
    name: "Custom",
    tagline: "Custom pricing",
    pricePerPersonLow: null,
    pricePerPersonHigh: null,
    description: "Work with our chef to design exactly what you want.",
    key: "custom"
  }
];

// Combos - curated meal concepts with paired components
export const COMBOS = [
  // ========== STANDARD COMBOS ==========
  {
    id: "teriyaki_bowl",
    name: "Teriyaki Rice Bowl",
    description: "A crowd-pleasing Asian-inspired bowl — complete as-is",
    tier: "standard",
    components: [
      { type: "entree", name: "Teriyaki Chicken Rice Bowl" },
      { type: "note", name: "Served with steamed rice and teriyaki glaze — no additional sides needed" }
    ]
  },
  {
    id: "baked_potato_bar",
    name: "Baked Potato Bar",
    description: "Interactive and filling — guests build their own",
    tier: "standard",
    components: [
      { type: "entree", name: "Baked Potato Bar" },
      { type: "included", name: "Butter, sour cream, cheddar, chives, bacon bits" },
      { type: "note", name: "Self-contained station — no additional sides needed" }
    ]
  },
  {
    id: "pasta_bar",
    name: "Pasta Bar",
    description: "Classic Italian comfort — simple and satisfying",
    tier: "standard",
    components: [
      { type: "entree", name: "Pasta Bar" },
      { type: "side", name: "Garlic Bread" },
      { type: "side", name: "Caesar Salad" }
    ]
  },
  {
    id: "sliders",
    name: "Sliders Spread",
    description: "Southern-style sliders with all the fixings",
    tier: "standard",
    components: [
      { type: "entree", name: "Beef or Pulled Pork Sliders" },
      { type: "side", name: "Coleslaw" },
      { type: "side", name: "Baked Beans" }
    ]
  },
  {
    id: "street_tacos",
    name: "Street Taco Station",
    description: "Authentic street-style tacos — a fiesta on a plate",
    tier: "standard",
    components: [
      { type: "entree", name: "Street Tacos (beef, chicken, or pork)" },
      { type: "side", name: "Mexican Rice" },
      { type: "side", name: "Black or Refried Beans" },
      { type: "included", name: "Chips & Salsa" }
    ]
  },
  {
    id: "sandwich_board",
    name: "Deli Sandwich Board",
    description: "Fresh, casual, and great for mixed crowds",
    tier: "standard",
    components: [
      { type: "entree", name: "BYO Deli Sandwich Board" },
      { type: "side", name: "Pasta Salad or Potato Salad" },
      { type: "included", name: "Assorted condiments and toppings" }
    ]
  },
  {
    id: "lemon_herb_chicken",
    name: "Lemon Herb Chicken Dinner",
    description: "Clean, classic, and universally loved",
    tier: "standard",
    components: [
      { type: "entree", name: "Lemon Herb Chicken" },
      { type: "side", name: "Roasted Garlic Yukon Mashed Potatoes" },
      { type: "side", name: "Steamed or Roasted Broccoli, Cauliflower & Carrots" }
    ]
  },
  {
    id: "classic_american_breakfast",
    name: "Classic American Breakfast",
    description: "The full spread — great for morning events",
    tier: "standard",
    components: [
      { type: "entree", name: "Scrambled Eggs, Bacon & Sausage" },
      { type: "side", name: "Breakfast Potatoes" },
      { type: "side", name: "Yogurt & Granola" }
    ]
  },
  {
    id: "burrito_bar",
    name: "Breakfast Burrito Bar",
    description: "Handheld, hearty, and hard to resist",
    tier: "standard",
    components: [
      { type: "entree", name: "Breakfast Burrito Bar" },
      { type: "side", name: "Hash Browns" },
      { type: "included", name: "Salsa, sour cream, cheese" }
    ]
  },

  // ========== SPLURGE COMBOS ==========
  {
    id: "cajun_alfredo",
    name: "Cajun Chicken Fettuccini Alfredo",
    description: "Rich, bold, and impressive — a real showstopper",
    tier: "splurge",
    components: [
      { type: "entree", name: "Cajun Chicken Fettuccini Alfredo" },
      { type: "side", name: "Garlic Bread" },
      { type: "side", name: "House Salad with choice of dressing" }
    ]
  },
  {
    id: "fajita_station",
    name: "Fajita Station",
    description: "Sizzling and interactive — guests love building their own",
    tier: "splurge",
    components: [
      { type: "entree", name: "Fajitas (beef, chicken, or shrimp)" },
      { type: "included", name: "Flour tortillas, peppers & onions, guacamole, sour cream, pico de gallo, cheese" },
      { type: "note", name: "Self-contained station — no additional sides needed" }
    ]
  },
  {
    id: "grazing_table_texas",
    name: "Texas Themed Grazing Table",
    description: "A stunning spread with big Texas flavors",
    tier: "splurge",
    components: [
      { type: "entree", name: "Texas Themed Grazing Table" },
      { type: "included", name: "Smoked meats, jalapeño cornbread, pickles, mustard, BBQ sauce" },
      { type: "side", name: "Baked Russet or Sweet Potato" }
    ]
  },
  {
    id: "grazing_table_italian",
    name: "Italian Themed Grazing Table",
    description: "An elevated Italian spread perfect for upscale gatherings",
    tier: "splurge",
    components: [
      { type: "entree", name: "Italian Themed Grazing Table" },
      { type: "included", name: "Cured meats, artisan cheeses, olives, focaccia, bruschetta" },
      { type: "side", name: "B.A.M.!!! Risotto" }
    ]
  },
  {
    id: "grazing_table_mexican",
    name: "Mexican Themed Grazing Table",
    description: "Vibrant, colorful, and packed with flavor",
    tier: "splurge",
    components: [
      { type: "entree", name: "Mexican Themed Grazing Table" },
      { type: "included", name: "Chips, salsas, guacamole, queso, elotes, tamales" },
      { type: "side", name: "Mexican Rice" }
    ]
  },
  {
    id: "charcuterie_and_sides",
    name: "Charcuterie & Sides Spread",
    description: "Sophisticated appetizer-style dining for relaxed mingling events",
    tier: "splurge",
    components: [
      { type: "appetizer", name: "Charcuterie Board" },
      { type: "appetizer", name: "Smoked Salmon Crudites" },
      { type: "side", name: "Shrimp Bruschetta" },
      { type: "included", name: "Artisan crackers, seasonal accompaniments" }
    ]
  },
  {
    id: "french_toast_breakfast",
    name: "Elevated Breakfast — Italian French Toast",
    description: "Indulgent, upscale breakfast for a memorable morning",
    tier: "splurge",
    components: [
      { type: "entree", name: "Italian French Toast" },
      { type: "included", name: "Mascarpone sauce, fresh berries" },
      { type: "side", name: "Bacon & Breakfast Sausage" }
    ]
  }
];

// Helper function to get combos for a tier
export function getCombosByTier(tierId) {
  const tier = TIERS.find(t => t.id === tierId);
  if (!tier) return [];

  if (tier.key === "standard") {
    return COMBOS.filter(c => c.tier === "standard");
  } else if (tier.key === "splurge") {
    return COMBOS;
  }
  return [];
}

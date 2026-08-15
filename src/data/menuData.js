export const TIERS = [
  {
    id: 7,
    name: "Opulence",
    tagline: "The pinnacle of culinary excellence",
    pricePerPersonLow: 100,
    pricePerPersonHigh: 250,
    serviceStyle: "Full-service multi-course plated on China with real silverware and glassware. Dedicated chef on-site, full waitstaff, bartender, and event coordinator.",
    guestMinimum: 40,
    highlights: ["Dedicated on-site chef", "Event coordinator included", "Custom menu development", "1 server per 10 guests", "Premium presentation & table styling"],
    courses: {
      appetizers: {
        label: "Appetizers",
        chooseCount: "3–4 (or signature grazing table)",
        items: ["Chips, Salsa & Queso", "Shrimp Bruschetta", "Smoked Salmon Crudites", "Charcuterie Board", "Texas Themed Grazing Table", "Italian Themed Grazing Table", "Mexican Themed Grazing Table"]
      },
      amuseBouche: {
        label: "Amuse-Bouche",
        chooseCount: "included",
        items: ["Chef's curated bite — created fresh for your event"]
      },
      salads: {
        label: "Salads",
        chooseCount: "1 (plated)",
        items: ["House Salad", "Classic Cobb", "Wedge", "Custom salad by chef's selection"]
      },
      entrees: {
        label: "Entrées",
        chooseCount: "1–2 (plated, premium proteins standard)",
        items: ["Lemon Herb Chicken", "Fajitas", "Cajun Chicken Fettuccini Alfredo", "Street Tacos", "Beef or Pulled Pork Sliders", "Teriyaki Chicken Rice Bowl", "Themed Grazing Table as Entrée Station", "Custom Entrée Development (chef consultation)"]
      },
      sides: {
        label: "Sides",
        chooseCount: "3–4 (plated)",
        items: ["Bacon & Balsamic Brussels Sprouts", "Baked Russet or Sweet Potato", "Steamed or Roasted Broccoli, Cauliflower & Carrots", "Roasted Garlic Yukon Mashed Potatoes", "B.A.M.!!! Risotto"]
      },
      desserts: {
        label: "Desserts",
        chooseCount: "2–3 (plated)",
        items: ["Panna Cotta", "Chocolate Mousse (with fresh berries)", "Southern Banana Pudding", "Triple Chocolate Brownies", "Sopapilla Cheesecake", "Custom dessert by chef's selection"]
      },
      beverages: {
        label: "Beverages",
        chooseCount: "all included",
        items: ["Sweet or Un-Sweet Tea", "Lemonade", "Seasonal Fruited Water", "Signature Mocktails (custom-paired with your menu)"]
      }
    },
    availableUpgrades: []
  },
  {
    id: 6,
    name: "Elegance",
    tagline: "Full-service sophistication",
    pricePerPersonLow: 60,
    pricePerPersonHigh: 99,
    serviceStyle: "Full-service plated on China with real silverware and glassware. Full waitstaff (1 server per 15 guests) + bartender included.",
    guestMinimum: 30,
    highlights: ["Full waitstaff included", "Bartender included", "Premium proteins standard", "Plated on China with real silverware"],
    courses: {
      appetizers: {
        label: "Appetizers",
        chooseCount: "2–3",
        items: ["Chips, Salsa & Queso", "Shrimp Bruschetta", "Smoked Salmon Crudites", "Charcuterie Board"]
      },
      salads: {
        label: "Salads",
        chooseCount: "1 (plated)",
        items: ["House Salad", "Classic Cobb", "Wedge"]
      },
      entrees: {
        label: "Entrées",
        chooseCount: "1 (plated, premium proteins included)",
        items: ["Lemon Herb Chicken", "Fajitas", "Cajun Chicken Fettuccini Alfredo", "Street Tacos", "Beef or Pulled Pork Sliders", "Teriyaki Chicken Rice Bowl", "Additional entrées from full menu (by request)", "Wagyu Beef featured items (by menu selection)"]
      },
      sides: {
        label: "Sides",
        chooseCount: "2–3 (plated)",
        items: ["Bacon & Balsamic Brussels Sprouts", "Baked Russet or Sweet Potato", "Steamed or Roasted Broccoli, Cauliflower & Carrots", "Roasted Garlic Yukon Mashed Potatoes", "B.A.M.!!! Risotto"]
      },
      desserts: {
        label: "Desserts",
        chooseCount: "2 (plated)",
        items: ["Panna Cotta", "Chocolate Mousse (with fresh berries)", "Southern Banana Pudding", "Triple Chocolate Brownies", "Sopapilla Cheesecake"]
      },
      beverages: {
        label: "Beverages",
        chooseCount: "all included",
        items: ["Sweet or Un-Sweet Tea", "Lemonade", "Seasonal Fruited Water", "Signature Mocktails (paired with your menu)"]
      }
    },
    availableUpgrades: [
      { id: "wagyu", name: "Wagyu Beef Upgrade", type: "protein", priceAddLow: 10, priceAddHigh: 25 }
    ]
  },
  {
    id: 5,
    name: "Spoil Your Guests",
    tagline: "Staffed buffet with elevated service",
    pricePerPersonLow: 30,
    pricePerPersonHigh: 60,
    serviceStyle: "Staffed buffet with 1–2 on-site servers. Plated service on China with real silverware/glassware, additional waiters, and bartender available as upgrades.",
    guestMinimum: 25,
    highlights: ["1–2 servers included", "Full non-alcoholic bar", "1 dessert included", "Upgrade to full plated service available"],
    courses: {
      appetizers: {
        label: "Appetizers",
        chooseCount: "2",
        items: ["Chips, Salsa & Queso", "Shrimp Bruschetta", "Smoked Salmon Crudites", "Charcuterie Board"]
      },
      salads: {
        label: "Salads",
        chooseCount: "1",
        items: ["House Salad", "Classic Cobb", "Wedge"]
      },
      entrees: {
        label: "Entrées",
        chooseCount: "1 (all entrées available)",
        items: ["Teriyaki Chicken Rice Bowl", "BYO Deli Sandwich Board", "Baked Potato Bar", "Pasta Bar", "Beef or Pulled Pork Sliders", "Street Tacos", "Lemon Herb Chicken", "Fajitas", "Cajun Chicken Fettuccini Alfredo", "Texas Themed Grazing Table", "Italian Themed Grazing Table", "Mexican Themed Grazing Table"]
      },
      sides: {
        label: "Sides",
        chooseCount: "2–3 (all sides available)",
        items: ["Steamed or Roasted Broccoli, Cauliflower & Carrots", "Baked Russet or Sweet Potato", "Roasted Garlic Yukon Mashed Potatoes", "Bacon & Balsamic Brussels Sprouts", "B.A.M.!!! Risotto"]
      },
      desserts: {
        label: "Desserts",
        chooseCount: "1",
        items: ["Panna Cotta", "Chocolate Mousse (with fresh berries)", "Southern Banana Pudding", "Triple Chocolate Brownies", "Sopapilla Cheesecake"]
      },
      beverages: {
        label: "Beverages",
        chooseCount: "all included",
        items: ["Sweet or Un-Sweet Tea", "Lemonade", "Seasonal Fruited Water", "Signature Mocktails"]
      }
    },
    availableUpgrades: [
      { id: "extra_waiter", name: "Additional Waiter", type: "service", priceAddLow: 25, priceAddHigh: 35, unit: "per waiter/hr", note: "Upgrade only" },
      { id: "bartender", name: "Bartender", type: "service", priceAddLow: 35, priceAddHigh: 50, unit: "per hour", note: "Upgrade only" },
      { id: "plated_china", name: "Plated Service on China w/ Real Silverware", type: "service", priceAddLow: 8, priceAddHigh: 15, unit: "per person" },
      { id: "free_range_chicken", name: "Free-Range Chicken Upgrade", type: "protein", priceAddLow: 3, priceAddHigh: 5, unit: "per person" },
      { id: "pastured_pork", name: "Pastured Pork Upgrade", type: "protein", priceAddLow: 3, priceAddHigh: 5, unit: "per person" },
      { id: "grass_fed_beef", name: "Grass-Fed Beef Upgrade", type: "protein", priceAddLow: 5, priceAddHigh: 8, unit: "per person" },
      { id: "wagyu", name: "Wagyu Beef Upgrade", type: "protein", priceAddLow: 10, priceAddHigh: 25, unit: "per person" }
    ]
  },
  {
    id: 4,
    name: "Splurge a Little",
    tagline: "Drop-off buffet with a touch of class",
    pricePerPersonLow: 20,
    pricePerPersonHigh: 30,
    serviceStyle: "Drop-off buffet with chafing dish setup. No on-site staff.",
    guestMinimum: null,
    highlights: ["1 dessert included", "1 appetizer included", "Non-alcoholic beverages included", "Chafing dish setup"],
    courses: {
      appetizers: {
        label: "Appetizers",
        chooseCount: "1",
        items: ["Chips, Salsa & Queso", "Shrimp Bruschetta", "Smoked Salmon Crudites"]
      },
      entrees: {
        label: "Entrées",
        chooseCount: "1",
        items: ["Teriyaki Chicken Rice Bowl", "BYO Deli Sandwich Board", "Baked Potato Bar", "Pasta Bar", "Beef or Pulled Pork Sliders", "Street Tacos", "Lemon Herb Chicken", "Fajitas", "Cajun Chicken Fettuccini Alfredo", "Texas Themed Grazing Table", "Italian Themed Grazing Table", "Mexican Themed Grazing Table"]
      },
      sides: {
        label: "Sides",
        chooseCount: "2 (all sides available)",
        items: ["Steamed or Roasted Broccoli, Cauliflower & Carrots", "Baked Russet or Sweet Potato", "Roasted Garlic Yukon Mashed Potatoes", "Bacon & Balsamic Brussels Sprouts", "B.A.M.!!! Risotto"]
      },
      desserts: {
        label: "Desserts",
        chooseCount: "1",
        items: ["Southern Banana Pudding", "Triple Chocolate Brownies", "Sopapilla Cheesecake"]
      },
      beverages: {
        label: "Beverages",
        chooseCount: "all included",
        items: ["Sweet or Un-Sweet Tea", "Lemonade", "Seasonal Fruited Water"]
      }
    },
    availableUpgrades: [
      { id: "free_range_chicken", name: "Free-Range Chicken Upgrade", type: "protein", priceAddLow: 3, priceAddHigh: 5, unit: "per person" },
      { id: "pastured_pork", name: "Pastured Pork Upgrade", type: "protein", priceAddLow: 3, priceAddHigh: 5, unit: "per person" },
      { id: "grass_fed_beef", name: "Grass-Fed Beef Upgrade", type: "protein", priceAddLow: 5, priceAddHigh: 8, unit: "per person" },
      { id: "wagyu", name: "Wagyu Beef Upgrade", type: "protein", priceAddLow: 10, priceAddHigh: 25, unit: "per person" }
    ]
  },
  {
    id: 3,
    name: "The Standard",
    tagline: "A solid, well-rounded spread",
    pricePerPersonLow: 16,
    pricePerPersonHigh: 19,
    serviceStyle: "Drop-off buffet. No on-site staff.",
    guestMinimum: null,
    highlights: ["1 appetizer included", "Non-alcoholic beverages included", "Premium protein upgrades available"],
    courses: {
      appetizers: {
        label: "Appetizers",
        chooseCount: "1",
        items: ["Chips, Salsa & Queso", "Shrimp Bruschetta"]
      },
      entrees: {
        label: "Entrées",
        chooseCount: "1",
        items: ["Teriyaki Chicken Rice Bowl", "BYO Deli Sandwich Board", "Baked Potato Bar", "Pasta Bar", "Beef or Pulled Pork Sliders", "Street Tacos", "Lemon Herb Chicken", "Fajitas", "Cajun Chicken Fettuccini Alfredo"]
      },
      sides: {
        label: "Sides",
        chooseCount: "2 (all sides available)",
        items: ["Steamed or Roasted Broccoli, Cauliflower & Carrots", "Baked Russet or Sweet Potato", "Roasted Garlic Yukon Mashed Potatoes", "Bacon & Balsamic Brussels Sprouts", "B.A.M.!!! Risotto"]
      },
      beverages: {
        label: "Beverages",
        chooseCount: "all included",
        items: ["Sweet or Un-Sweet Tea", "Lemonade", "Seasonal Fruited Water"]
      }
    },
    availableUpgrades: [
      { id: "free_range_chicken", name: "Free-Range Chicken Upgrade", type: "protein", priceAddLow: 3, priceAddHigh: 5, unit: "per person" },
      { id: "pastured_pork", name: "Pastured Pork Upgrade", type: "protein", priceAddLow: 3, priceAddHigh: 5, unit: "per person" },
      { id: "grass_fed_beef", name: "Grass-Fed Beef Upgrade", type: "protein", priceAddLow: 3, priceAddHigh: 5, unit: "per person" }
    ]
  },
  {
    id: 2,
    name: "Budget Friendly",
    tagline: "Great food, easy on the budget",
    pricePerPersonLow: 12,
    pricePerPersonHigh: 15,
    serviceStyle: "Drop-off buffet. No on-site staff.",
    guestMinimum: null,
    highlights: ["Non-alcoholic beverages included", "2 sides included"],
    courses: {
      entrees: {
        label: "Entrées",
        chooseCount: "1",
        items: ["Teriyaki Chicken Rice Bowl", "BYO Deli Sandwich Board", "Baked Potato Bar", "Pasta Bar", "Beef or Pulled Pork Sliders", "Street Tacos"]
      },
      sides: {
        label: "Sides",
        chooseCount: "2",
        items: ["Bacon & Balsamic Brussels Sprouts", "Baked Russet or Sweet Potato", "Steamed or Roasted Broccoli, Cauliflower & Carrots", "Roasted Garlic Yukon Mashed Potatoes", "B.A.M.!!! Risotto"]
      },
      beverages: {
        label: "Beverages",
        chooseCount: "all included",
        items: ["Sweet or Un-Sweet Tea", "Lemonade", "Seasonal Fruited Water"]
      }
    },
    availableUpgrades: []
  },
  {
    id: 1,
    name: "Humble",
    tagline: "Simple, satisfying, and affordable",
    pricePerPersonLow: 10,
    pricePerPersonHigh: 12,
    serviceStyle: "Drop-off buffet. No on-site staff.",
    guestMinimum: null,
    highlights: ["No guest minimum", "Drop-off convenience"],
    courses: {
      entrees: {
        label: "Entrées",
        chooseCount: "1",
        items: ["Teriyaki Chicken Rice Bowl", "BYO Deli Sandwich Board", "Baked Potato Bar", "Pasta Bar", "Beef or Pulled Pork Sliders"]
      },
      sides: {
        label: "Sides",
        chooseCount: "1",
        items: ["Steamed or Roasted Broccoli, Cauliflower & Carrots", "Baked Russet or Sweet Potato", "Roasted Garlic Yukon Mashed Potatoes"]
      }
    },
    availableUpgrades: []
  }
];

export const BREAKFAST_OPTIONS = [
  {
    id: "classic_american",
    name: "Classic American Breakfast",
    description: "Scrambled eggs, bacon, sausage, breakfast potatoes, yogurt & granola",
    availableTiers: [1, 2, 3, 4, 5, 6, 7],
    serviceNote: "Tiers 1–4: buffet style. Tier 5+: staffed/plated."
  },
  {
    id: "burrito_bar",
    name: "Breakfast Burrito Bar",
    description: "Served with hash browns",
    availableTiers: [2, 3, 4, 5, 6, 7],
    serviceNote: "Tiers 2–5: buffet style. Tier 6+: plated station."
  },
  {
    id: "french_toast",
    name: "Italian French Toast",
    description: "Mascarpone sauce & fresh berries — elevated presentation",
    availableTiers: [4, 5, 6, 7],
    serviceNote: "Tiers 4–5: buffet style. Tiers 6–7: plated, elevated presentation."
  }
];

export const CROSS_TIER_UPGRADES = {
  appetizers: [
    { id: "smoked_salmon", name: "Smoked Salmon Crudites", availableFrom: 4, note: "Premium appetizer" },
    { id: "charcuterie", name: "Charcuterie Board", availableFrom: 5, note: "Premium appetizer" },
    { id: "shrimp_bruschetta", name: "Shrimp Bruschetta", availableFrom: 3, note: "Upgraded appetizer" }
  ],
  desserts: [
    { id: "panna_cotta", name: "Panna Cotta", availableFrom: 5, note: "Premium dessert" },
    { id: "chocolate_mousse", name: "Chocolate Mousse (with fresh berries)", availableFrom: 5, note: "Premium dessert" }
  ],
  sides: [
    { id: "bam_risotto", name: "B.A.M.!!! Risotto", availableFrom: 2, note: "Signature side" },
    { id: "brussels", name: "Bacon & Balsamic Brussels Sprouts", availableFrom: 2, note: "Elevated side" }
  ]
};

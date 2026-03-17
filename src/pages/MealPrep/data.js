/* ===================================================
   Meal Prep — Static Data
=================================================== */

/* ── Available Meals ──
   tier: 'Essentials' | 'Classics' | 'Deluxe'
   Essentials = simple, nourishing, budget-friendly
   Classics   = fan-favourite complete meals
   Deluxe     = premium, chef's finest
=================================================== */
export const MEALS = [
  /* ── Essentials ─────────────────────────────── */
  { id: 'm01', tier: 'Essentials', name: 'Avocado Toast & Eggs',      category: 'Breakfast', price: 10.99, calories: 420, protein: 22, carbs: 38, fat: 18, tags: ['Vegetarian', 'Dairy-Free'],                img: 'https://placehold.co/360x240/EEF2FF/1E1B4B?text=Avocado+Toast',   desc: 'Multigrain toast with smashed avocado, two poached eggs, and everything bagel seasoning.' },
  { id: 'm02', tier: 'Essentials', name: 'Greek Yogurt Parfait',       category: 'Breakfast', price: 8.99,  calories: 310, protein: 18, carbs: 42, fat: 6,  tags: ['Vegetarian', 'Gluten-Free', 'Nut-Free'],   img: 'https://placehold.co/360x240/EEF2FF/1E1B4B?text=Yogurt+Parfait',  desc: 'Creamy Greek yogurt layered with house granola, mixed berries, and local honey.' },
  { id: 'm03', tier: 'Essentials', name: 'Keto Egg Muffins',           category: 'Breakfast', price: 9.99,  calories: 290, protein: 24, carbs: 4,  fat: 20, tags: ['Keto', 'Gluten-Free', 'Dairy-Free'],       img: 'https://placehold.co/360x240/EEF2FF/1E1B4B?text=Egg+Muffins',     desc: 'Fluffy egg muffins loaded with spinach, sun-dried tomatoes, and turkey bacon.' },
  { id: 'm06', tier: 'Essentials', name: 'Vegan Buddha Bowl',          category: 'Lunch',     price: 12.99, calories: 440, protein: 18, carbs: 62, fat: 14, tags: ['Vegan', 'Gluten-Free'],                    img: 'https://placehold.co/360x240/312E81/EEF2FF?text=Buddha+Bowl',     desc: 'Roasted chickpeas, sweet potato, kale, and house tahini dressing over farro.' },
  { id: 'm07', tier: 'Essentials', name: 'Turkey & Veggie Wrap',       category: 'Lunch',     price: 11.99, calories: 420, protein: 34, carbs: 40, fat: 12, tags: ['Dairy-Free'],                              img: 'https://placehold.co/360x240/312E81/EEF2FF?text=Turkey+Wrap',     desc: 'Whole-wheat wrap with turkey breast, hummus, spinach, and roasted red pepper.' },

  /* ── Classics ────────────────────────────────── */
  { id: 'm04', tier: 'Classics',   name: 'Grilled Chicken Power Bowl', category: 'Lunch',     price: 13.99, calories: 510, protein: 42, carbs: 48, fat: 14, tags: ['Gluten-Free', 'Dairy-Free'],               img: 'https://placehold.co/360x240/312E81/EEF2FF?text=Power+Bowl',      desc: 'Brown rice, grilled chicken breast, roasted veggies, and tahini dressing.' },
  { id: 'm05', tier: 'Classics',   name: 'Salmon & Quinoa Bowl',       category: 'Lunch',     price: 15.99, calories: 490, protein: 36, carbs: 42, fat: 16, tags: ['Gluten-Free', 'Dairy-Free'],               img: 'https://placehold.co/360x240/312E81/EEF2FF?text=Salmon+Bowl',     desc: 'Herb-crusted salmon over quinoa with cucumber, avocado, and citrus vinaigrette.' },
  { id: 'm08', tier: 'Classics',   name: 'Keto Beef Taco Bowl',        category: 'Lunch',     price: 14.99, calories: 480, protein: 38, carbs: 8,  fat: 32, tags: ['Keto', 'Gluten-Free'],                     img: 'https://placehold.co/360x240/EA580C/FFF?text=Taco+Bowl',          desc: 'Seasoned ground beef, cauliflower rice, pico, shredded cheese, and sour cream.' },
  { id: 'm11', tier: 'Classics',   name: 'Spaghetti Bolognese',        category: 'Dinner',    price: 15.99, calories: 580, protein: 32, carbs: 68, fat: 16, tags: ['Dairy-Free'],                              img: 'https://placehold.co/360x240/1E1B4B/EEF2FF?text=Bolognese',       desc: 'Slow-cooked beef ragù over al dente spaghetti with fresh basil and olive oil.' },
  { id: 'm12', tier: 'Classics',   name: 'Vegan Thai Green Curry',     category: 'Dinner',    price: 14.99, calories: 440, protein: 14, carbs: 58, fat: 18, tags: ['Vegan', 'Gluten-Free', 'Dairy-Free'],      img: 'https://placehold.co/360x240/312E81/EEF2FF?text=Green+Curry',     desc: 'Coconut green curry with tofu, zucchini, and jasmine rice.' },
  { id: 'm14', tier: 'Classics',   name: 'Stuffed Bell Peppers',       category: 'Dinner',    price: 15.99, calories: 430, protein: 26, carbs: 46, fat: 14, tags: ['Gluten-Free'],                             img: 'https://placehold.co/360x240/EA580C/FFF?text=Stuffed+Peppers',    desc: 'Roasted peppers filled with herbed turkey, quinoa, and roasted tomato sauce.' },

  /* ── Deluxe ──────────────────────────────────── */
  { id: 'm10', tier: 'Deluxe',     name: 'Chicken Tikka Masala',       category: 'Dinner',    price: 16.99, calories: 550, protein: 40, carbs: 45, fat: 18, tags: ['Gluten-Free'],                             img: 'https://placehold.co/360x240/1E1B4B/EEF2FF?text=Tikka+Masala',    desc: 'Tender chicken in a rich, aromatic tomato-cream sauce with basmati rice.' },
  { id: 'm15', tier: 'Deluxe',     name: 'Keto Lemon Garlic Shrimp',   category: 'Dinner',    price: 16.99, calories: 380, protein: 36, carbs: 6,  fat: 24, tags: ['Keto', 'Gluten-Free', 'Dairy-Free'],      img: 'https://placehold.co/360x240/EA580C/FFF?text=Lemon+Shrimp',       desc: 'Sautéed jumbo shrimp with zucchini noodles and garlic butter.' },
  { id: 'm13', tier: 'Deluxe',     name: 'Grass-Fed Beef Stir-Fry',    category: 'Dinner',    price: 17.99, calories: 510, protein: 38, carbs: 35, fat: 22, tags: ['Gluten-Free', 'Dairy-Free'],               img: 'https://placehold.co/360x240/312E81/EEF2FF?text=Beef+Stir+Fry',   desc: 'Sizzling grass-fed beef with bell peppers, snap peas, and sesame-ginger sauce.' },
  { id: 'm09', tier: 'Deluxe',     name: 'Herb-Crusted Salmon Fillet', category: 'Dinner',    price: 18.99, calories: 520, protein: 44, carbs: 22, fat: 22, tags: ['Gluten-Free', 'Dairy-Free'],               img: 'https://placehold.co/360x240/1E1B4B/EEF2FF?text=Salmon+Fillet',   desc: 'Pan-seared salmon fillet with roasted asparagus and lemon-caper butter sauce.' },
]

export const TIERS = ['Essentials', 'Classics', 'Deluxe']

export const TIER_DESC = {
  Essentials: 'Simple, nourishing favourites',
  Classics:   'Chef-crafted complete meals',
  Deluxe:     "The chef's premium selections",
}

/* ── Delivery Windows (exactly 3) ── */
export const DELIVERY_WINDOWS = [
  { id: 'morning',   label: 'Morning',   time: '8:00 AM – 11:00 AM', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', time: '12:00 PM – 2:00 PM', icon: '☀️' },
  { id: 'evening',   label: 'Evening',   time: '5:00 PM – 8:00 PM',  icon: '🌇' },
]

export const DIETARY_OPTIONS = [
  { id: 'Vegan',       label: 'Vegan',       tagClass: 'tag-vegan' },
  { id: 'Vegetarian',  label: 'Vegetarian',  tagClass: 'tag-vegetarian' },
  { id: 'Keto',        label: 'Keto',        tagClass: 'tag-keto' },
  { id: 'Gluten-Free', label: 'Gluten-Free', tagClass: 'tag-gf' },
  { id: 'Dairy-Free',  label: 'Dairy-Free',  tagClass: 'tag-dairy-free' },
  { id: 'Nut-Free',    label: 'Nut-Free',    tagClass: 'tag-nut-free' },
]

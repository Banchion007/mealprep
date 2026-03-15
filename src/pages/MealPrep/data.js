/* ===================================================
   Meal Prep — Static Data
=================================================== */

/* ── Available Meals ── */
export const MEALS = [
  /* Breakfast */
  { id: 'm01', name: 'Avocado Toast & Eggs',        category: 'Breakfast', price: 10.99, calories: 420, protein: 22, carbs: 38, fat: 18, tags: ['Vegetarian', 'Dairy-Free'],         img: 'https://placehold.co/360x240/EEF2FF/1E1B4B?text=Avocado+Toast',      desc: 'Multigrain toast with smashed avocado, two poached eggs, and everything bagel seasoning.' },
  { id: 'm02', name: 'Greek Yogurt Parfait',         category: 'Breakfast', price: 8.99,  calories: 310, protein: 18, carbs: 42, fat: 6,  tags: ['Vegetarian', 'Gluten-Free', 'Nut-Free'], img: 'https://placehold.co/360x240/EEF2FF/1E1B4B?text=Yogurt+Parfait', desc: 'Creamy Greek yogurt layered with house granola, mixed berries, and local honey.' },
  { id: 'm03', name: 'Keto Egg Muffins',             category: 'Breakfast', price: 9.99,  calories: 290, protein: 24, carbs: 4,  fat: 20, tags: ['Keto', 'Gluten-Free', 'Dairy-Free'],    img: 'https://placehold.co/360x240/EEF2FF/1E1B4B?text=Egg+Muffins',    desc: 'Fluffy egg muffins loaded with spinach, sun-dried tomatoes, and turkey bacon.' },
  /* Lunch */
  { id: 'm04', name: 'Grilled Chicken Power Bowl',   category: 'Lunch',     price: 13.99, calories: 510, protein: 42, carbs: 48, fat: 14, tags: ['Gluten-Free', 'Dairy-Free'],            img: 'https://placehold.co/360x240/312E81/EEF2FF?text=Power+Bowl',         desc: 'Brown rice, grilled chicken breast, roasted veggies, and tahini dressing.' },
  { id: 'm05', name: 'Salmon & Quinoa Bowl',         category: 'Lunch',     price: 15.99, calories: 490, protein: 36, carbs: 42, fat: 16, tags: ['Gluten-Free', 'Dairy-Free'],            img: 'https://placehold.co/360x240/312E81/EEF2FF?text=Salmon+Bowl',        desc: 'Herb-crusted salmon over quinoa with cucumber, avocado, and citrus vinaigrette.' },
  { id: 'm06', name: 'Vegan Buddha Bowl',            category: 'Lunch',     price: 12.99, calories: 440, protein: 18, carbs: 62, fat: 14, tags: ['Vegan', 'Gluten-Free'],                 img: 'https://placehold.co/360x240/312E81/EEF2FF?text=Buddha+Bowl',        desc: 'Roasted chickpeas, sweet potato, kale, and house tahini dressing over farro.' },
  { id: 'm07', name: 'Turkey & Veggie Wrap',         category: 'Lunch',     price: 11.99, calories: 420, protein: 34, carbs: 40, fat: 12, tags: ['Dairy-Free'],                           img: 'https://placehold.co/360x240/312E81/EEF2FF?text=Turkey+Wrap',        desc: 'Whole-wheat wrap with turkey breast, hummus, spinach, and roasted red pepper.' },
  { id: 'm08', name: 'Keto Beef Taco Bowl',          category: 'Lunch',     price: 14.99, calories: 480, protein: 38, carbs: 8,  fat: 32, tags: ['Keto', 'Gluten-Free'],                  img: 'https://placehold.co/360x240/EA580C/FFF?text=Taco+Bowl',          desc: 'Seasoned ground beef, cauliflower rice, pico, shredded cheese, and sour cream.' },
  /* Dinner */
  { id: 'm09', name: 'Herb-Crusted Salmon Fillet',   category: 'Dinner',    price: 18.99, calories: 520, protein: 44, carbs: 22, fat: 22, tags: ['Gluten-Free', 'Dairy-Free'],            img: 'https://placehold.co/360x240/1E1B4B/EEF2FF?text=Salmon+Fillet',      desc: 'Pan-seared salmon with roasted asparagus and lemon-caper butter sauce.' },
  { id: 'm10', name: 'Chicken Tikka Masala',         category: 'Dinner',    price: 16.99, calories: 550, protein: 40, carbs: 45, fat: 18, tags: ['Gluten-Free', 'Halal'],                 img: 'https://placehold.co/360x240/1E1B4B/EEF2FF?text=Tikka+Masala',       desc: 'Tender chicken in a rich, aromatic tomato-cream sauce with basmati rice.' },
  { id: 'm11', name: 'Spaghetti Bolognese',          category: 'Dinner',    price: 15.99, calories: 580, protein: 32, carbs: 68, fat: 16, tags: ['Dairy-Free'],                           img: 'https://placehold.co/360x240/1E1B4B/EEF2FF?text=Bolognese',          desc: 'Slow-cooked beef ragù over al dente spaghetti with fresh basil and olive oil.' },
  { id: 'm12', name: 'Vegan Thai Green Curry',       category: 'Dinner',    price: 14.99, calories: 440, protein: 14, carbs: 58, fat: 18, tags: ['Vegan', 'Gluten-Free', 'Dairy-Free'],   img: 'https://placehold.co/360x240/312E81/EEF2FF?text=Green+Curry',        desc: 'Coconut green curry with tofu, zucchini, and jasmine rice.' },
  { id: 'm13', name: 'Grass-Fed Beef Stir-Fry',      category: 'Dinner',    price: 17.99, calories: 510, protein: 38, carbs: 35, fat: 22, tags: ['Gluten-Free', 'Dairy-Free'],            img: 'https://placehold.co/360x240/312E81/EEF2FF?text=Beef+Stir+Fry',     desc: 'Sizzling beef with bell peppers, snap peas, and sesame-ginger sauce over rice.' },
  { id: 'm14', name: 'Stuffed Bell Peppers',         category: 'Dinner',    price: 15.99, calories: 430, protein: 26, carbs: 46, fat: 14, tags: ['Gluten-Free', 'Halal'],                 img: 'https://placehold.co/360x240/EA580C/FFF?text=Stuffed+Peppers',    desc: 'Roasted peppers filled with herbed turkey, quinoa, and roasted tomato sauce.' },
  { id: 'm15', name: 'Keto Lemon Garlic Shrimp',     category: 'Dinner',    price: 16.99, calories: 380, protein: 36, carbs: 6,  fat: 24, tags: ['Keto', 'Gluten-Free', 'Dairy-Free'],   img: 'https://placehold.co/360x240/EA580C/FFF?text=Lemon+Shrimp',      desc: 'Sautéed jumbo shrimp with zucchini noodles and garlic butter.' },
]

/* ── Delivery Windows ── */
export const DELIVERY_WINDOWS = [
  '7:00 AM – 9:00 AM',
  '9:00 AM – 11:00 AM',
  '11:00 AM – 1:00 PM',
  '5:00 PM – 7:00 PM',
  '7:00 PM – 9:00 PM',
]

export const DIETARY_OPTIONS = [
  { id: 'vegan',       label: 'Vegan',       desc: 'No animal products' },
  { id: 'vegetarian',  label: 'Vegetarian',  desc: 'No meat or fish' },
  { id: 'keto',        label: 'Keto',        desc: 'Low-carb, high-fat' },
  { id: 'gluten-free', label: 'Gluten-Free', desc: 'No gluten ingredients' },
  { id: 'dairy-free',  label: 'Dairy-Free',  desc: 'No dairy products' },
  { id: 'nut-free',    label: 'Nut-Free',    desc: 'No tree nuts or peanuts' },
  { id: 'halal',       label: 'Halal',       desc: 'Halal certified ingredients' },
]

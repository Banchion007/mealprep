/* ===================================================
   Mock Data — seeds localStorage for demo purposes
   Keys: hc_orders, hc_subscribers, hc_recipes
   Seeded once; clear hc_seeded to reset.
=================================================== */

const NAMES = [
  'Emma Thompson', 'James Wilson', 'Olivia Martinez', 'Noah Anderson',
  'Sophia Johnson', 'Liam Brown', 'Ava Davis', 'Mason Taylor',
  'Isabella Garcia', 'Ethan Rodriguez', 'Mia Lee', 'Alexander White',
  'Charlotte Harris', 'William Clark', 'Amelia Lewis', 'Benjamin Walker',
  'Harper Hall', 'Lucas Allen', 'Evelyn Young', 'Henry King',
]

const ORDER_TYPES = ['Meal Prep', 'Catering Event', 'À la carte']

const MEAL_NAMES = [
  'Herb-Crusted Salmon', 'Braised Short Rib', 'Chicken Marsala',
  'Cauliflower Steak', 'Spicy Thai Noodle Bowl', 'Beef Wellington Bites',
  'Avocado Toast & Eggs', 'Greek Chicken Bowl', 'Turkey Taco Bowl',
  'Overnight Oats', 'Quinoa Power Bowl', 'Lemon Garlic Shrimp',
  'Roasted Veggie Pasta', 'Banana Protein Pancakes',
]

const PLANS = ['Basic', 'Standard', 'Premium']
const DIET_OPTIONS = ['Vegan', 'Vegetarian', 'Keto', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal']

// Fixed status distribution for realistic demo data
const STATUS_POOL = [
  'Pending', 'Pending', 'Pending', 'Pending', 'Pending',
  'Confirmed', 'Confirmed', 'Confirmed', 'Confirmed',
  'In Prep', 'In Prep', 'In Prep', 'In Prep', 'In Prep',
  'Out for Delivery', 'Out for Delivery', 'Out for Delivery',
  'Delivered', 'Delivered', 'Delivered', 'Delivered', 'Delivered',
  'Delivered', 'Delivered', 'Delivered', 'Delivered', 'Delivered',
  'Cancelled', 'Cancelled', 'Cancelled',
]

function seededRandInt(seed, min, max) {
  // Simple seeded random for deterministic demo data
  const x = Math.sin(seed + 1) * 10000
  const r = x - Math.floor(x)
  return Math.floor(r * (max - min + 1)) + min
}

function seededRandItems(seed, arr, min, max) {
  const count = seededRandInt(seed, min, max)
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(arr[seededRandInt(seed * (i + 3), 0, arr.length - 1)])
  }
  return [...new Set(result)]
}

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

function daysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function genOrders() {
  return Array.from({ length: 30 }, (_, i) => {
    const seed = i * 7 + 13
    const typeIdx = seededRandInt(seed, 0, 2)
    const type = ORDER_TYPES[typeIdx]
    const mealCount = seededRandInt(seed + 1, 2, 12)
    const meals = seededRandItems(seed + 2, MEAL_NAMES, 2, Math.min(5, mealCount))
    const pricePerMeal = type === 'Meal Prep'
      ? seededRandInt(seed + 3, 10, 15)
      : seededRandInt(seed + 3, 22, 45)
    const total = parseFloat((pricePerMeal * mealCount).toFixed(2))
    // Skew dates toward recent for a nice chart
    const daysOffset = i < 15
      ? seededRandInt(seed + 4, 0, 14)
      : seededRandInt(seed + 4, 10, 29)

    return {
      id: `HC-${String(1001 + i).padStart(4, '0')}`,
      customer: NAMES[seededRandInt(seed + 5, 0, NAMES.length - 1)],
      type,
      meals: meals.length ? meals : [MEAL_NAMES[0]],
      mealCount,
      deliveryDate: daysFromNow(seededRandInt(seed + 6, -2, 7)),
      status: STATUS_POOL[i % STATUS_POOL.length],
      total,
      createdAt: daysAgo(daysOffset),
      notes: type === 'Catering Event'
        ? `Event for ${seededRandInt(seed + 7, 10, 80)} guests`
        : '',
    }
  })
}

function genSubscribers() {
  return Array.from({ length: 12 }, (_, i) => {
    const seed = i * 11 + 5
    const planIdx = seededRandInt(seed, 0, 2)
    const plan = PLANS[planIdx]
    const mealsPerWeek = plan === 'Basic' ? 5 : plan === 'Standard' ? 10 : 15
    const pricePerWeek = plan === 'Basic' ? 59.99 : plan === 'Standard' ? 109.99 : 149.99
    const selected = seededRandInt(seed + 1, Math.floor(mealsPerWeek * 0.6), mealsPerWeek)
    const dietary = seededRandItems(seed + 2, DIET_OPTIONS, 0, 3)
    const status = i < 8 ? 'Active' : i < 10 ? 'Paused' : 'Cancelled'

    return {
      id: `SUB-${String(101 + i).padStart(3, '0')}`,
      name: NAMES[i % NAMES.length],
      email: `${NAMES[i % NAMES.length].toLowerCase().replace(/\s/, '.')}@email.com`,
      plan,
      mealsPerWeek,
      pricePerWeek,
      dietary: dietary.length ? dietary : [],
      nextDelivery: daysFromNow(seededRandInt(seed + 3, 1, 7)),
      mealsSelected: selected,
      status,
      meals: seededRandItems(seed + 4, MEAL_NAMES, 3, Math.min(7, selected)),
      joinDate: daysAgo(seededRandInt(seed + 5, 30, 365)),
    }
  })
}

export const SAMPLE_RECIPES = [
  {
    id: 'r001',
    name: 'Herb-Crusted Salmon',
    serves: 4,
    prepTime: 15,
    cookTime: 20,
    categoryTags: ['Seafood', 'Dinner', 'Meal Prep'],
    allergenTags: ['Fish'],
    ingredients: [
      { name: 'Salmon fillets', qty: 4, unit: 'pieces', category: 'Proteins' },
      { name: 'Fresh dill', qty: 2, unit: 'tbsp', category: 'Produce' },
      { name: 'Dijon mustard', qty: 2, unit: 'tbsp', category: 'Pantry' },
      { name: 'Breadcrumbs', qty: 0.5, unit: 'cup', category: 'Pantry' },
      { name: 'Olive oil', qty: 2, unit: 'tbsp', category: 'Pantry' },
      { name: 'Lemon', qty: 1, unit: 'whole', category: 'Produce' },
      { name: 'Garlic cloves', qty: 3, unit: 'cloves', category: 'Produce' },
    ],
    instructions: 'Preheat oven to 400°F. Mix breadcrumbs with dill, garlic, and olive oil. Brush salmon with mustard, press herb crust on top. Bake 18–20 minutes until cooked through. Serve with lemon wedges.',
  },
  {
    id: 'r002',
    name: 'Chicken Marsala',
    serves: 4,
    prepTime: 10,
    cookTime: 25,
    categoryTags: ['Poultry', 'Dinner', 'Italian'],
    allergenTags: ['Gluten', 'Dairy'],
    ingredients: [
      { name: 'Chicken breasts', qty: 4, unit: 'pieces', category: 'Proteins' },
      { name: 'Marsala wine', qty: 0.75, unit: 'cup', category: 'Pantry' },
      { name: 'Cremini mushrooms', qty: 8, unit: 'oz', category: 'Produce' },
      { name: 'Chicken broth', qty: 0.5, unit: 'cup', category: 'Pantry' },
      { name: 'Heavy cream', qty: 0.25, unit: 'cup', category: 'Dairy' },
      { name: 'All-purpose flour', qty: 0.5, unit: 'cup', category: 'Pantry' },
      { name: 'Butter', qty: 3, unit: 'tbsp', category: 'Dairy' },
      { name: 'Olive oil', qty: 2, unit: 'tbsp', category: 'Pantry' },
      { name: 'Garlic cloves', qty: 2, unit: 'cloves', category: 'Produce' },
      { name: 'Fresh thyme', qty: 1, unit: 'tsp', category: 'Produce' },
    ],
    instructions: 'Pound chicken to even thickness, dredge in flour. Pan-fry in oil until golden; set aside. Sauté mushrooms and garlic in butter, deglaze with marsala. Add broth and cream; simmer 5 min. Return chicken and cook through.',
  },
  {
    id: 'r003',
    name: 'Vegan Buddha Bowl',
    serves: 2,
    prepTime: 20,
    cookTime: 30,
    categoryTags: ['Vegan', 'Lunch', 'Bowl', 'Meal Prep'],
    allergenTags: ['Soy', 'Sesame'],
    ingredients: [
      { name: 'Chickpeas (canned)', qty: 1, unit: 'can', category: 'Proteins' },
      { name: 'Brown rice', qty: 1, unit: 'cup', category: 'Pantry' },
      { name: 'Sweet potato', qty: 1, unit: 'large', category: 'Produce' },
      { name: 'Baby spinach', qty: 2, unit: 'cups', category: 'Produce' },
      { name: 'Avocado', qty: 1, unit: 'whole', category: 'Produce' },
      { name: 'Cucumber', qty: 0.5, unit: 'whole', category: 'Produce' },
      { name: 'Tahini', qty: 3, unit: 'tbsp', category: 'Pantry' },
      { name: 'Lemon juice', qty: 2, unit: 'tbsp', category: 'Produce' },
      { name: 'Soy sauce', qty: 1, unit: 'tbsp', category: 'Pantry' },
      { name: 'Sesame seeds', qty: 1, unit: 'tbsp', category: 'Pantry' },
    ],
    instructions: 'Cook rice. Roast chickpeas and cubed sweet potato at 400°F for 25 min. Make tahini dressing with lemon and soy sauce. Assemble bowls with rice, roasted items, fresh veggies, and dressing.',
  },
  {
    id: 'r004',
    name: 'Overnight Oats',
    serves: 1,
    prepTime: 5,
    cookTime: 0,
    categoryTags: ['Breakfast', 'Meal Prep', 'Bulk Cooking'],
    allergenTags: ['Gluten', 'Dairy', 'Tree Nuts'],
    ingredients: [
      { name: 'Rolled oats', qty: 0.5, unit: 'cup', category: 'Pantry' },
      { name: 'Greek yogurt', qty: 0.5, unit: 'cup', category: 'Dairy' },
      { name: 'Milk', qty: 0.5, unit: 'cup', category: 'Dairy' },
      { name: 'Chia seeds', qty: 1, unit: 'tbsp', category: 'Pantry' },
      { name: 'Honey', qty: 1, unit: 'tbsp', category: 'Pantry' },
      { name: 'Mixed berries', qty: 0.5, unit: 'cup', category: 'Produce' },
      { name: 'Almonds', qty: 1, unit: 'tbsp', category: 'Pantry' },
    ],
    instructions: 'Combine oats, yogurt, milk, chia seeds, and honey in a jar. Stir well. Refrigerate overnight. Top with berries and almonds before serving.',
  },
  {
    id: 'r005',
    name: 'Turkey Taco Bowls',
    serves: 6,
    prepTime: 15,
    cookTime: 20,
    categoryTags: ['Mexican', 'Lunch', 'Meal Prep', 'Bulk Cooking'],
    allergenTags: ['Dairy'],
    ingredients: [
      { name: 'Ground turkey', qty: 2, unit: 'lbs', category: 'Proteins' },
      { name: 'Brown rice', qty: 2, unit: 'cups', category: 'Pantry' },
      { name: 'Black beans (canned)', qty: 2, unit: 'cans', category: 'Proteins' },
      { name: 'Corn (frozen)', qty: 1, unit: 'cup', category: 'Produce' },
      { name: 'Taco seasoning', qty: 2, unit: 'tbsp', category: 'Pantry' },
      { name: 'Salsa', qty: 1, unit: 'cup', category: 'Pantry' },
      { name: 'Lime', qty: 2, unit: 'whole', category: 'Produce' },
      { name: 'Shredded cheese', qty: 1, unit: 'cup', category: 'Dairy' },
      { name: 'Sour cream', qty: 0.5, unit: 'cup', category: 'Dairy' },
      { name: 'Fresh cilantro', qty: 0.25, unit: 'cup', category: 'Produce' },
    ],
    instructions: 'Cook rice. Brown turkey with taco seasoning. Warm beans and corn. Assemble bowls with rice, turkey, beans, corn, salsa. Top with cheese, sour cream, and cilantro.',
  },
  {
    id: 'r006',
    name: 'Roasted Veggie Pasta',
    serves: 4,
    prepTime: 15,
    cookTime: 35,
    categoryTags: ['Vegetarian', 'Dinner', 'Italian'],
    allergenTags: ['Gluten', 'Dairy'],
    ingredients: [
      { name: 'Penne pasta', qty: 12, unit: 'oz', category: 'Pantry' },
      { name: 'Zucchini', qty: 2, unit: 'medium', category: 'Produce' },
      { name: 'Bell peppers', qty: 2, unit: 'whole', category: 'Produce' },
      { name: 'Cherry tomatoes', qty: 1, unit: 'pint', category: 'Produce' },
      { name: 'Red onion', qty: 1, unit: 'medium', category: 'Produce' },
      { name: 'Garlic cloves', qty: 4, unit: 'cloves', category: 'Produce' },
      { name: 'Olive oil', qty: 4, unit: 'tbsp', category: 'Pantry' },
      { name: 'Parmesan cheese', qty: 0.5, unit: 'cup', category: 'Dairy' },
      { name: 'Fresh basil', qty: 0.25, unit: 'cup', category: 'Produce' },
      { name: 'Italian seasoning', qty: 1, unit: 'tsp', category: 'Pantry' },
    ],
    instructions: 'Roast vegetables at 425°F for 25–30 min. Cook pasta al dente. Toss pasta with roasted vegetables, olive oil, garlic, and parmesan. Top with fresh basil.',
  },
  {
    id: 'r007',
    name: 'Greek Chicken Bowls',
    serves: 4,
    prepTime: 20,
    cookTime: 25,
    categoryTags: ['Mediterranean', 'Lunch', 'Meal Prep'],
    allergenTags: ['Dairy'],
    ingredients: [
      { name: 'Chicken thighs', qty: 2, unit: 'lbs', category: 'Proteins' },
      { name: 'Quinoa', qty: 1.5, unit: 'cups', category: 'Pantry' },
      { name: 'Cucumber', qty: 1, unit: 'large', category: 'Produce' },
      { name: 'Cherry tomatoes', qty: 1, unit: 'cup', category: 'Produce' },
      { name: 'Kalamata olives', qty: 0.5, unit: 'cup', category: 'Pantry' },
      { name: 'Feta cheese', qty: 4, unit: 'oz', category: 'Dairy' },
      { name: 'Red onion', qty: 0.5, unit: 'medium', category: 'Produce' },
      { name: 'Greek yogurt', qty: 0.5, unit: 'cup', category: 'Dairy' },
      { name: 'Lemon juice', qty: 3, unit: 'tbsp', category: 'Produce' },
      { name: 'Oregano', qty: 1, unit: 'tsp', category: 'Pantry' },
      { name: 'Olive oil', qty: 3, unit: 'tbsp', category: 'Pantry' },
    ],
    instructions: 'Marinate chicken in lemon, oregano, olive oil for 30 min. Grill or bake until cooked. Cook quinoa. Make tzatziki with yogurt and cucumber. Assemble bowls.',
  },
  {
    id: 'r008',
    name: 'Banana Protein Pancakes',
    serves: 2,
    prepTime: 5,
    cookTime: 15,
    categoryTags: ['Breakfast', 'Bulk Cooking', 'High Protein'],
    allergenTags: ['Gluten', 'Dairy', 'Eggs'],
    ingredients: [
      { name: 'Ripe bananas', qty: 2, unit: 'medium', category: 'Produce' },
      { name: 'Eggs', qty: 2, unit: 'large', category: 'Proteins' },
      { name: 'Oat flour', qty: 0.5, unit: 'cup', category: 'Pantry' },
      { name: 'Protein powder', qty: 1, unit: 'scoop', category: 'Pantry' },
      { name: 'Baking powder', qty: 0.5, unit: 'tsp', category: 'Pantry' },
      { name: 'Cinnamon', qty: 0.5, unit: 'tsp', category: 'Pantry' },
      { name: 'Greek yogurt', qty: 0.25, unit: 'cup', category: 'Dairy' },
      { name: 'Maple syrup', qty: 2, unit: 'tbsp', category: 'Pantry' },
    ],
    instructions: 'Mash bananas. Mix with eggs, flour, protein powder, baking powder, and cinnamon. Cook on non-stick pan over medium heat until bubbles form. Flip and cook until golden. Serve with yogurt and maple syrup.',
  },
]

export function seedMockData() {
  if (localStorage.getItem('hc_seeded') === '1') return
  localStorage.setItem('hc_orders', JSON.stringify(genOrders()))
  localStorage.setItem('hc_subscribers', JSON.stringify(genSubscribers()))
  localStorage.setItem('hc_recipes', JSON.stringify(SAMPLE_RECIPES))
  localStorage.setItem('hc_seeded', '1')
}

export function resetMockData() {
  localStorage.removeItem('hc_seeded')
  localStorage.removeItem('hc_orders')
  localStorage.removeItem('hc_subscribers')
  localStorage.removeItem('hc_recipes')
  localStorage.removeItem('hc_grocery_calendar')
  seedMockData()
}

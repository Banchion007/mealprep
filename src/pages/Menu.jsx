/* ===================================================
   Menu Page — grid of categorized menu items
   with filter buttons and dietary tags
=================================================== */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './Menu.css'

/* ── Menu Data ── */
const MENU_ITEMS = [
  /* Appetizers */
  { id: 1,  category: 'Appetizers', name: 'Bruschetta Trio',          price: 12.00, img: 'https://placehold.co/400x280/EEF2FF/1E1B4B?text=Bruschetta',       desc: 'Toasted ciabatta topped with roasted tomatoes, whipped ricotta, and balsamic glaze.', tags: ['Vegetarian'] },
  { id: 2,  category: 'Appetizers', name: 'Spiced Lamb Kofta',        price: 14.00, img: 'https://placehold.co/400x280/EEF2FF/1E1B4B?text=Lamb+Kofta',        desc: 'Grilled ground lamb skewers with harissa yogurt dipping sauce.', tags: ['Spicy', 'Gluten-Free'] },
  { id: 3,  category: 'Appetizers', name: 'Mushroom Crostini',        price: 11.00, img: 'https://placehold.co/400x280/EEF2FF/1E1B4B?text=Crostini',          desc: 'Wild mushroom medley on crispy sourdough with truffle oil and fresh herbs.', tags: ['Vegan'] },
  { id: 4,  category: 'Appetizers', name: 'Shrimp Cocktail',          price: 16.00, img: 'https://placehold.co/400x280/EEF2FF/1E1B4B?text=Shrimp+Cocktail',   desc: 'Chilled jumbo shrimp with house-made cocktail sauce and lemon wedges.', tags: ['Gluten-Free', 'Dairy-Free'] },
  /* Mains */
  { id: 5,  category: 'Mains',      name: 'Herb-Crusted Salmon',      price: 28.00, img: 'https://placehold.co/400x280/312E81/EEF2FF?text=Salmon',               desc: 'Pan-seared Atlantic salmon with dill cream sauce and seasonal vegetables.', tags: ['Gluten-Free', 'Dairy-Free'] },
  { id: 6,  category: 'Mains',      name: 'Braised Short Rib',        price: 34.00, img: 'https://placehold.co/400x280/312E81/EEF2FF?text=Short+Rib',            desc: 'Slow-braised beef short rib with red wine reduction, celery root puree.', tags: ['Gluten-Free'] },
  { id: 7,  category: 'Mains',      name: 'Cauliflower Steak',        price: 22.00, img: 'https://placehold.co/400x280/312E81/EEF2FF?text=Cauliflower',          desc: 'Roasted whole cauliflower steak with chimichurri and pickled raisins.', tags: ['Vegan', 'Gluten-Free', 'Nut-Free'] },
  { id: 8,  category: 'Mains',      name: 'Chicken Marsala',          price: 26.00, img: 'https://placehold.co/400x280/312E81/EEF2FF?text=Chicken',              desc: 'Pan-seared chicken breast in a rich marsala mushroom sauce.', tags: ['Gluten-Free', 'Dairy-Free'] },
  { id: 9,  category: 'Mains',      name: 'Spicy Thai Noodle Bowl',   price: 20.00, img: 'https://placehold.co/400x280/EA580C/FFF?text=Thai+Noodles',         desc: 'Rice noodles, tofu, bok choy, and fiery chili-lime broth topped with fresh herbs.', tags: ['Vegan', 'Gluten-Free', 'Spicy'] },
  { id: 10, category: 'Mains',      name: 'Beef Wellington Bites',    price: 32.00, img: 'https://placehold.co/400x280/1E1B4B/EEF2FF?text=Wellington',           desc: 'Individual beef tenderloin wrapped in mushroom duxelles and golden pastry.', tags: [] },
  /* Sides */
  { id: 11, category: 'Sides',      name: 'Roasted Root Vegetables',  price: 8.00,  img: 'https://placehold.co/400x280/EEF2FF/312E81?text=Roasted+Veggies',      desc: 'Seasonal root vegetables with rosemary, garlic, and a honey-balsamic glaze.', tags: ['Vegan', 'Gluten-Free'] },
  { id: 12, category: 'Sides',      name: 'Truffle Mac & Cheese',     price: 10.00, img: 'https://placehold.co/400x280/EEF2FF/312E81?text=Mac+%26+Cheese',       desc: 'Creamy four-cheese sauce with cavatappi pasta and black truffle oil.', tags: ['Vegetarian'] },
  { id: 13, category: 'Sides',      name: 'Cilantro-Lime Rice',       price: 6.00,  img: 'https://placehold.co/400x280/EEF2FF/312E81?text=Cilantro+Rice',        desc: 'Fluffy basmati rice tossed with fresh cilantro, lime juice, and toasted cumin.', tags: ['Vegan', 'Gluten-Free', 'Dairy-Free'] },
  { id: 14, category: 'Sides',      name: 'Grilled Asparagus',        price: 9.00,  img: 'https://placehold.co/400x280/EEF2FF/312E81?text=Asparagus',            desc: 'Tender asparagus spears with lemon zest, toasted almonds, and sea salt.', tags: ['Vegetarian', 'Gluten-Free'] },
  /* Desserts */
  { id: 15, category: 'Desserts',   name: 'Chocolate Lava Cake',      price: 9.00,  img: 'https://placehold.co/400x280/EA580C/FFF?text=Lava+Cake',            desc: 'Warm dark chocolate cake with a molten center served with vanilla bean ice cream.', tags: ['Vegetarian'] },
  { id: 16, category: 'Desserts',   name: 'Lemon Panna Cotta',        price: 8.00,  img: 'https://placehold.co/400x280/EA580C/FFF?text=Panna+Cotta',          desc: 'Silky vanilla panna cotta with lemon curd and candied citrus peel.', tags: ['Vegetarian', 'Gluten-Free'] },
  { id: 17, category: 'Desserts',   name: 'Vegan Coconut Tart',       price: 8.50,  img: 'https://placehold.co/400x280/EA580C/FFF?text=Coconut+Tart',         desc: 'Creamy coconut custard in a toasted almond crust with mango sorbet.', tags: ['Vegan', 'Dairy-Free', 'Gluten-Free'] },
  { id: 18, category: 'Desserts',   name: 'Tiramisu',                 price: 9.00,  img: 'https://placehold.co/400x280/EA580C/FFF?text=Tiramisu',             desc: 'Classic Italian tiramisu with espresso-soaked savoiardi and mascarpone cream.', tags: ['Vegetarian'] },
]

const CATEGORIES = ['All', 'Appetizers', 'Mains', 'Sides', 'Desserts']

const DIETARY_FILTERS = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Dairy-Free', 'Spicy', 'Nut-Free']

const TAG_CLASS = {
  'Vegan':       'tag-vegan',
  'Vegetarian':  'tag-vegetarian',
  'Gluten-Free': 'tag-gf',
  'Dairy-Free':  'tag-dairy-free',
  'Spicy':       'tag-spicy',
  'Nut-Free':    'tag-nut-free',
  'Keto':        'tag-keto',
}

export default function Menu() {
  useScrollAnimation()

  const [activeCategory, setActiveCategory] = useState('All')
  const [activeDiet,     setActiveDiet]     = useState([])

  // Toggle dietary filter
  const toggleDiet = (d) =>
    setActiveDiet(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    )

  const filtered = MENU_ITEMS.filter(item => {
    const catOk = activeCategory === 'All' || item.category === activeCategory
    const dietOk = activeDiet.length === 0 || activeDiet.every(d => item.tags.includes(d))
    return catOk && dietOk
  })

  return (
    <div className="menu-page">
      {/* Hero */}
      <section className="page-hero menu-hero">
        <div className="page-hero__overlay" />
        <img
          src="https://placehold.co/1600x500/1E1B4B/EEF2FF?text=Our+Menu"
          alt="Menu banner"
          className="page-hero__bg"
        />
        <div className="container page-hero__content fade-up">
          <p className="section-label" style={{ color: 'var(--color-accent-light)' }}>Crafted with Care</p>
          <h1 style={{ color: '#fff', marginBottom: '0.75rem' }}>Our Menu</h1>
          <p style={{ color: 'rgba(255,251,245,0.8)', maxWidth: '520px', fontSize: '1.05rem' }}>
            Seasonal, locally-sourced ingredients elevated by culinary expertise. Explore our full selection below.
          </p>
        </div>
      </section>

      <section className="section menu-section">
        <div className="container">
          {/* Filters */}
          <div className="menu-filters fade-up">
            <div className="menu-filters__cats">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  className={`filter-btn${activeCategory === c ? ' filter-btn--active' : ''}`}
                  onClick={() => setActiveCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="menu-filters__diet">
              {DIETARY_FILTERS.map(d => (
                <button
                  key={d}
                  className={`diet-btn tag ${TAG_CLASS[d] || ''}${activeDiet.includes(d) ? ' diet-btn--active' : ''}`}
                  onClick={() => toggleDiet(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Result count */}
          <p className="menu-count fade-up">
            Showing <strong>{filtered.length}</strong> item{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
            {activeDiet.length > 0 ? ` · ${activeDiet.join(', ')}` : ''}
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="menu-grid">
              {filtered.map(item => (
                <div key={item.id} className="menu-card fade-up">
                  <div className="menu-card__img-wrap">
                    <img src={item.img} alt={item.name} className="menu-card__img" />
                    <span className="menu-card__category">{item.category}</span>
                  </div>
                  <div className="menu-card__body">
                    <div className="menu-card__tags">
                      {item.tags.map(t => (
                        <span key={t} className={`tag ${TAG_CLASS[t] || ''}`}>{t}</span>
                      ))}
                    </div>
                    <h3 className="menu-card__name">{item.name}</h3>
                    <p className="menu-card__desc">{item.desc}</p>
                    <div className="menu-card__footer">
                      <span className="menu-card__price">${item.price.toFixed(2)}</span>
                      <span className="menu-card__hint">per serving</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="menu-empty fade-up">
              <svg width="48" height="48" fill="none" stroke="var(--color-text-light)" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <p>No items match your current filters.</p>
              <button className="btn btn-outline btn-sm" onClick={() => { setActiveCategory('All'); setActiveDiet([]) }}>
                Clear Filters
              </button>
            </div>
          )}

          {/* Meal Prep CTA */}
          <div className="menu-cta-block fade-up">
            <div>
              <h3>Want these meals delivered weekly?</h3>
              <p>Build a custom meal prep plan and get fresh meals every week.</p>
            </div>
            <Link to="/meal-prep" className="btn btn-primary">
              Start Meal Prep
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

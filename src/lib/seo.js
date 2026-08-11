export const SITE_NAME = 'Humble Chef'
export const SITE_URL = 'https://thehumblechef.com'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

export const pageMetadata = {
  home: {
    path: '/',
    title: 'Humble Chef | Catering & Meal Prep in Collin County, TX',
    description: 'Fresh, chef-prepared catering and weekly meal prep serving Collin County. Corporate lunches, events, and healthy meals made daily. Order online today.',
  },
  mealPrep: {
    path: '/meal-prep',
    title: 'Weekly Meal Prep Delivery | Humble Chef, Collin County',
    description: 'Chef-cooked weekly meal prep across Collin County, TX. Healthy, ready-to-eat meals with a rotating menu. Build your plan and order online in minutes.',
  },
  menu: {
    path: '/menu',
    title: 'Menu | Humble Chef',
    description: 'Browse our rotating menu of chef-prepared meals for catering, office lunch, and weekly meal prep in Collin County, TX.',
  },
  about: {
    path: '/about',
    title: 'About Humble Chef | Local Chef-Driven Catering',
    description: 'Meet the Humble Chef team, a commercial kitchen cooking fresh catering and meal prep for Collin County, Texas. Real food, made daily by our chefs.',
  },
  contact: {
    path: '/contact',
    title: 'Contact Humble Chef | Catering & Meal Prep Quotes',
    description: 'Get in touch with Humble Chef for catering, office lunch, or weekly meal prep in Collin County, TX. Request a quote or ask about our menus.',
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy Policy | Humble Chef',
    description: 'Privacy Policy for Humble Chef catering and meal prep services.',
  },
  terms: {
    path: '/terms',
    title: 'Terms of Service | Humble Chef',
    description: 'Terms of Service for Humble Chef catering and meal prep services.',
  },
}

export const getCanonicalUrl = (path) => `${SITE_URL}${path}`

export const getSchemaOrgData = () => ({
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: SITE_NAME,
  url: SITE_URL,
  image: DEFAULT_OG_IMAGE,
  description: 'Catering, daily office lunch, and weekly meal prep serving Collin County, Texas.',
  areaServed: [
    { '@type': 'AdministrativeArea', 'name': 'Collin County, Texas' }
  ],
})

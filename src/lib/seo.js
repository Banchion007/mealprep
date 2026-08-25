export const SITE_NAME = 'Humble Chef'
export const SITE_URL = 'https://thehumblechef.com'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`

export const pageMetadata = {
  home: {
    path: '/',
    title: 'Humble Chef | Catering & Meal Prep in Grayson/Collin County, TX',
    description: 'Fresh, chef-prepared catering and weekly meal prep serving Grayson/Collin County. Corporate lunches, events, and healthy meals made daily. Order online today.',
  },
  mealPrep: {
    path: '/meal-prep',
    title: 'Weekly Meal Prep Delivery | Humble Chef, Grayson/Collin County',
    description: 'Chef-cooked weekly meal prep across Grayson/Collin County, TX. Healthy, ready-to-eat meals with a rotating menu. Build your plan and order online in minutes.',
  },
  menu: {
    path: '/menu',
    title: 'Menu | Humble Chef',
    description: 'Browse our rotating menu of chef-prepared meals for catering, office lunch, and weekly meal prep in Grayson/Collin County, TX.',
  },
  about: {
    path: '/about',
    title: 'About Humble Chef | Local Chef-Driven Catering',
    description: 'Meet the Humble Chef team, a commercial kitchen cooking fresh catering and meal prep for Grayson/Collin County, Texas. Real food, made daily by our chefs.',
  },
  contact: {
    path: '/contact',
    title: 'Contact Humble Chef | Catering & Meal Prep Quotes',
    description: 'Get in touch with Humble Chef for catering, office lunch, or weekly meal prep in Grayson/Collin County, TX. Request a quote or ask about our menus.',
  },
  quote: {
    path: '/quote',
    title: 'Get a Catering Quote | Humble Chef',
    description: 'Get an instant quote for catering services in Grayson/Collin County, TX. Customize your menu and get pricing for your event.',
  },
  gallery: {
    path: '/gallery',
    title: 'Gallery | Humble Chef Catering',
    description: 'Browse photos from our catering events and meal prep — from intimate gatherings to large celebrations across North Texas.',
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
  logo: `${SITE_URL}/hc-logo.png`,
  description: 'Catering, daily office lunch, and weekly meal prep serving Grayson/Collin County, Texas.',
  telephone: '(903) 484-4470',
  email: 'humblechefbrian@gmail.com',
  areaServed: [
    { '@type': 'AdministrativeArea', 'name': 'Grayson/Collin County, Texas' }
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '17:00',
    }
  ],
})

export const getWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}?q={search_term_string}`
    }
  }
})

export const getBreadcrumbSchema = (breadcrumbs = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`
  }))
})

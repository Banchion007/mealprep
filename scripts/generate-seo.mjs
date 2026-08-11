import fs from 'fs'
import path from 'path'

const DIST_DIR = 'dist'
const SITE_URL = 'https://thehumblechef.com'

const PUBLIC_ROUTES = [
  { path: '/', lastmod: new Date().toISOString().split('T')[0] },
  { path: '/about', lastmod: new Date().toISOString().split('T')[0] },
  { path: '/contact', lastmod: new Date().toISOString().split('T')[0] },
  { path: '/menu', lastmod: new Date().toISOString().split('T')[0] },
  { path: '/meal-prep', lastmod: new Date().toISOString().split('T')[0] },
]

function generateRobotsTxt() {
  const content = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /checkout
Disallow: /account

Sitemap: ${SITE_URL}/sitemap.xml
`
  return content
}

function generateSitemap() {
  const urls = PUBLIC_ROUTES.map(route => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route.path === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
  return content
}

try {
  // Ensure dist exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`❌ ${DIST_DIR} folder not found. Run 'npm run build' first.`)
    process.exit(1)
  }

  // Generate and write robots.txt
  const robotsTxt = generateRobotsTxt()
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt)
  console.log('✅ Generated robots.txt')

  // Generate and write sitemap.xml
  const sitemap = generateSitemap()
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap)
  console.log('✅ Generated sitemap.xml')

  console.log('✅ SEO files generated successfully')
} catch (error) {
  console.error('❌ Error generating SEO files:', error)
  process.exit(1)
}

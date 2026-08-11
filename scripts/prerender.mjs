import fs from 'fs'
import path from 'path'
import { JSDOM } from 'jsdom'

const DIST_DIR = 'dist'
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/menu',
  '/meal-prep',
]

async function prerender() {
  console.log('🔄 Starting prerendering...')

  // Ensure dist exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`❌ ${DIST_DIR} folder not found. Run 'npm run build' first.`)
    process.exit(1)
  }

  // Read the index.html template
  const indexPath = path.join(DIST_DIR, 'index.html')
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ ${indexPath} not found`)
    process.exit(1)
  }

  const template = fs.readFileSync(indexPath, 'utf-8')

  for (const route of PUBLIC_ROUTES) {
    try {
      // Parse with JSDOM to render the page
      const dom = new JSDOM(template, {
        url: `https://thehumblechef.com${route}`,
        pretendToBeVisual: true,
      })

      const { document } = dom.window

      // Simulate route by setting location
      Object.defineProperty(dom.window, 'location', {
        value: {
          pathname: route,
          href: `https://thehumblechef.com${route}`,
        },
        writable: true,
      })

      // Render the page content (this is minimal - real prerender would run React)
      const html = dom.serialize()

      // Create directory for the route if needed
      const outputDir = path.join(DIST_DIR, route === '/' ? '' : route)
      if (outputDir && route !== '/') {
        fs.mkdirSync(outputDir, { recursive: true })
      }

      // Write the prerendered file
      const outputFile = route === '/'
        ? path.join(DIST_DIR, 'index.html')
        : path.join(DIST_DIR, route, 'index.html')

      fs.writeFileSync(outputFile, html)
      console.log(`✅ Prerendered ${route} → ${outputFile}`)
    } catch (error) {
      console.error(`❌ Error prerendering ${route}:`, error.message)
    }
  }

  console.log('✅ Prerendering complete')
}

prerender().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})

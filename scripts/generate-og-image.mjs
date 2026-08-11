import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

// Create OG image using Sharp (1200x630)
// Since sharp doesn't support rendering HTML directly, we'll create a simple SVG-based image

const svg = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E1B4B"/>
      <stop offset="50%" stop-color="#312E81"/>
      <stop offset="100%" stop-color="#4C1D95"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1100" cy="-50" r="200" fill="#EA580C" opacity="0.15"/>
  <circle cx="80" cy="550" r="150" fill="#FFA500" opacity="0.15"/>
  <text x="100" y="140" font-family="Montserrat, sans-serif" font-size="24" font-weight="500" fill="#FFA500">CHEF-PREPARED MEALS</text>
  <text x="100" y="240" font-family="Montserrat, sans-serif" font-size="72" font-weight="700" fill="white">Catering &amp; Meal Prep</text>
  <text x="100" y="330" font-family="Montserrat, sans-serif" font-size="72" font-weight="700" fill="white">for Collin County</text>
  <text x="100" y="430" font-family="Montserrat, sans-serif" font-size="24" fill="#E0E7FF">Fresh, chef-made meals delivered daily.</text>
  <text x="100" y="470" font-family="Montserrat, sans-serif" font-size="24" fill="#E0E7FF">From office lunches to events.</text>
  <rect x="850" y="115" width="250" height="250" rx="20" fill="rgba(255,255,255,0.1)" stroke="rgba(255,165,0,0.3)" stroke-width="2"/>
  <text x="1100" y="590" font-family="Montserrat, sans-serif" font-size="18" fill="#E0E7FF" text-anchor="end">thehumblechef.com</text>
</svg>`);

try {
  // Convert SVG to PNG/JPG
  await sharp(svg)
    .jpeg({ quality: 90 })
    .toFile('public/og-image.jpg')

  console.log('✅ Generated public/og-image.jpg (1200x630)')
} catch (error) {
  console.error('❌ Error generating OG image:', error.message)
  console.log('\n⚠️  Fallback: Use the HTML template at public/og-image-template.html')
  console.log('   1. Open in browser')
  console.log('   2. Take a 1200x630 screenshot')
  console.log('   3. Save as public/og-image.jpg')
}

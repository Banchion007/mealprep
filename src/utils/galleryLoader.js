/* Auto-load images from public/gallery folder using Vite's glob import */

async function getGalleryImages() {
  const galleries = {}
  const imageModules = import.meta.glob('/public/gallery/**/*.{jpg,jpeg,png,webp}')

  for (const [path, module] of Object.entries(imageModules)) {
    const match = path.match(/public\/gallery\/([^/]+)\//)
    if (!match) continue

    const galleryId = match[1]
    const imagePath = path.replace('/public', '')

    if (!galleries[galleryId]) {
      galleries[galleryId] = []
    }

    galleries[galleryId].push({
      src: imagePath,
      name: path.split('/').pop(),
    })
  }

  return galleries
}

export default getGalleryImages

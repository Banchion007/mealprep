export async function fetchGalleryGroups(supabase) {
  const years = ['2026', '2025', '2024']
  const quarters = ['Q4', 'Q3', 'Q2', 'Q1']
  const groups = []

  for (const year of years) {
    for (const quarter of quarters) {
      const path = `gallery/${year}/${quarter}`
      const { data, error } = await supabase.storage
        .from('gallery-uploads')
        .list(path, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })

      // Only include quarters with real files (filter out placeholders and empty folder markers)
      const realFiles = (data || []).filter(f =>
        f.name !== '.emptyFolderPlaceholder' &&
        f.name !== '.gitkeep' &&
        (!f.metadata || f.metadata.size > 0)
      )

      if (!error && realFiles.length > 0) {
        groups.push({
          label: `${quarter} ${year}`,
          year,
          quarter,
          files: realFiles,
          path
        })
      }
    }
  }

  return groups
}

export function getGalleryImageUrl(supabase, year, quarter, filename) {
  const { data } = supabase.storage
    .from('gallery-uploads')
    .getPublicUrl(`gallery/${year}/${quarter}/${filename}`)
  return data.publicUrl
}

export async function fetchQuarterPhotos(supabase, year, quarter) {
  const path = `gallery/${year}/${quarter}`
  const { data, error } = await supabase.storage
    .from('gallery-uploads')
    .list(path, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })

  if (error) {
    if (error.message.includes('not found')) {
      return []
    }
    throw error
  }

  return (data || []).filter(f =>
    f.name !== '.emptyFolderPlaceholder' &&
    f.name !== '.gitkeep' &&
    (!f.metadata || f.metadata.size > 0)
  )
}

export async function uploadGalleryPhoto(supabase, year, quarter, file) {
  const timestamp = Date.now()
  const ext = file.name.split('.').pop()
  const fileName = `${timestamp}-${Math.random().toString(36).substring(2, 9)}.${ext}`
  const path = `gallery/${year}/${quarter}/${fileName}`

  const { error } = await supabase.storage
    .from('gallery-uploads')
    .upload(path, file)

  if (error) throw error
  return fileName
}

export async function deleteGalleryPhoto(supabase, year, quarter, filename) {
  const path = `gallery/${year}/${quarter}/${filename}`
  const { error } = await supabase.storage
    .from('gallery-uploads')
    .remove([path])

  if (error) throw error
}

// ===== NEW: Metadata operations =====

export async function fetchGalleryWithMetadata(supabase, year, quarter) {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('year', year)
    .eq('quarter', quarter)
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createGalleryImageMetadata(supabase, year, quarter, storagePath, metadata = {}) {
  const { data, error } = await supabase
    .from('gallery_images')
    .insert([{
      year,
      quarter,
      storage_path: storagePath,
      title: metadata.title || null,
      caption: metadata.caption || null,
      crop_position: metadata.crop_position || { x: 0, y: 0, width: 100, height: 75 },
      is_featured: metadata.is_featured || false,
      display_order: metadata.display_order || 0,
    }])
    .select()

  if (error) throw error
  return data?.[0]
}

export async function updateGalleryImageMetadata(supabase, imageId, updates) {
  const { data, error } = await supabase
    .from('gallery_images')
    .update(updates)
    .eq('id', imageId)
    .select()

  if (error) throw error
  return data?.[0]
}

export async function deleteGalleryImageMetadata(supabase, imageId) {
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', imageId)

  if (error) throw error
}

export async function reorderGalleryImages(supabase, images) {
  const updates = images.map((img, index) => ({
    id: img.id,
    display_order: index
  }))

  const { error } = await supabase
    .from('gallery_images')
    .upsert(updates, { onConflict: 'id' })

  if (error) throw error
}

export async function getFeaturedGalleryImage(supabase, year, quarter) {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('year', year)
    .eq('quarter', quarter)
    .eq('is_featured', true)
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

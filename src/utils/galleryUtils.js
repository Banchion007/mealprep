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

// Image crop utilities for 4:3 aspect ratio with manual adjustment

export function calculateAutoCenter4x3Crop(imageWidth, imageHeight) {
  // Calculate 4:3 crop that fits within the image
  let cropWidth, cropHeight

  const targetRatio = 4 / 3
  const imageRatio = imageWidth / imageHeight

  if (imageRatio > targetRatio) {
    // Image is wider than 4:3, crop width based on height
    cropHeight = imageHeight
    cropWidth = cropHeight * targetRatio
  } else {
    // Image is taller than 4:3, crop height based on width
    cropWidth = imageWidth
    cropHeight = cropWidth / targetRatio
  }

  // Center the crop
  const x = (imageWidth - cropWidth) / 2
  const y = (imageHeight - cropHeight) / 2

  return {
    x: Math.max(0, Math.round(x)),
    y: Math.max(0, Math.round(y)),
    width: Math.round(cropWidth),
    height: Math.round(cropHeight)
  }
}

export function normalizeCropPosition(crop, imageWidth, imageHeight) {
  // Ensure crop stays within image bounds and maintains 4:3 aspect ratio
  const aspectRatio = 4 / 3

  let { x, y, width, height } = crop

  // Clamp dimensions
  width = Math.min(width, imageWidth - x)
  height = Math.min(height, imageHeight - y)

  // Maintain aspect ratio (prioritize width)
  const calculatedHeight = Math.round(width / aspectRatio)
  if (calculatedHeight <= imageHeight - y) {
    height = calculatedHeight
  } else {
    height = imageHeight - y
    width = Math.round(height * aspectRatio)
  }

  // Clamp position
  x = Math.max(0, Math.min(x, imageWidth - width))
  y = Math.max(0, Math.min(y, imageHeight - height))

  return { x, y, width, height }
}

export function cropImageCanvas(canvas, cropPosition) {
  // Create a new canvas with the cropped image
  const { x, y, width, height } = cropPosition

  const croppedCanvas = document.createElement('canvas')
  croppedCanvas.width = width
  croppedCanvas.height = height

  const ctx = croppedCanvas.getContext('2d')
  const sourceCanvas = canvas

  ctx.drawImage(
    sourceCanvas,
    x,
    y,
    width,
    height,
    0,
    0,
    width,
    height
  )

  return croppedCanvas
}

export function downloadCroppedImage(canvas, filename = 'image.jpg') {
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 'image/jpeg', 0.95)
}

export function cropPositionToPercentage(crop, imageWidth, imageHeight) {
  // Convert pixel positions to percentages for storage
  return {
    x: Math.round((crop.x / imageWidth) * 100),
    y: Math.round((crop.y / imageHeight) * 100),
    width: Math.round((crop.width / imageWidth) * 100),
    height: Math.round((crop.height / imageHeight) * 100)
  }
}

export function percentageToCropPosition(crop, imageWidth, imageHeight) {
  // Convert percentage positions back to pixels
  return {
    x: Math.round((crop.x / 100) * imageWidth),
    y: Math.round((crop.y / 100) * imageHeight),
    width: Math.round((crop.width / 100) * imageWidth),
    height: Math.round((crop.height / 100) * imageHeight)
  }
}

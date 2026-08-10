// Service Area Configuration
// Define your delivery zone as a polygon of coordinates [lat, lng]
// Get coordinates from: https://www.google.com/maps
// Click on map to see coordinates, or use tools like geojson.io

// Example: Austin, TX delivery zone (replace with your actual service area)
export const SERVICE_AREA_POLYGON = [
  // Define your delivery zone coordinates here
  // Format: [latitude, longitude]
  // Start from top-left, go clockwise, close the polygon by repeating first point
  // [30.45, -97.75],  // top-left
  // [30.45, -97.65],  // top-right
  // [30.20, -97.65],  // bottom-right
  // [30.20, -97.75],  // bottom-left
  // [30.45, -97.75],  // close polygon
]

export const SERVICE_AREA_CENTER = {
  lat: 30.2672,
  lng: -97.7431,
}

export const SERVICE_AREA_NAME = 'Austin, TX'

// Check if a point is inside the delivery polygon
export function isPointInPolygon(point, polygon) {
  // If polygon is empty, allow all addresses for now (placeholder)
  if (!polygon || polygon.length === 0) {
    return true
  }

  const { lat, lng } = point
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1]
    const xj = polygon[j][0], yj = polygon[j][1]

    const intersect =
      yi > lng !== yj > lng &&
      lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi

    if (intersect) inside = !inside
  }

  return inside
}

// Calculate distance in miles between two points
export function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959 // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Get delivery fee based on distance from service area center
export function getDeliveryFee(customerLat, customerLng) {
  const distance = calculateDistance(
    SERVICE_AREA_CENTER.lat,
    SERVICE_AREA_CENTER.lng,
    customerLat,
    customerLng
  )

  // Free delivery within 3 miles, $5.99 after
  if (distance <= 3) return 0
  return 5.99
}

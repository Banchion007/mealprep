// Service Area Configuration - Custom Delivery Zone
// Validates delivery addresses by ZIP code

// Humble Chef delivery zone ZIP codes
const SERVICE_ZIPS = new Set([
  '75020', '75021', '75058', '75076', '75090', '75092', '75414', '75459',
  '75489', '75491', '75495', '76233', '76245', '76258', '76264', '76268',
  '76271', '76273',
])

export const SERVICE_AREA_NAME = 'Humble Chef Delivery Zone'

// Check if ZIP code is in service area
export function isZipCodeInServiceArea(zip) {
  if (!zip) return false
  return SERVICE_ZIPS.has(zip.trim())
}

// Get delivery fee based on ZIP code (flat rate for Grayson County)
export function getDeliveryFee(zip) {
  if (!isZipCodeInServiceArea(zip)) {
    return null // Outside service area
  }
  // $5.99 flat rate within Grayson County
  return 5.99
}

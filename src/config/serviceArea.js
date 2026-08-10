// Service Area Configuration - Grayson County, Texas
// Validates delivery addresses by ZIP code

// Grayson County, TX ZIP codes (Sherman, Denison, Pottsboro, Whitesboro, etc.)
const GRAYSON_COUNTY_ZIPS = new Set([
  '75001', '75002', '75003', '75004', '75006', '75007', '75009', '75010',
  '75014', '75015', '75016', '75017', '75018', '75019', '75020', '75021',
  '75023', '75024', '75025', '75026', '75027', '75028', '75034', '75035',
  '75038', '75039', '75040', '75041', '75042', '75043', '75044', '75045',
  '75050', '75051', '75052', '75054', '75055', '75056', '75057', '75058',
  '75059', '75060', '75062', '75063', '75064', '75065', '75066', '75067',
  '75068', '75069', '75070', '75071', '75072', '75074', '75076', '75078',
  '75080', '75081', '75082', '75083', '75084', '75086', '75087', '75088',
  '75089', '75090', '75091', '75092', '75093', '75094', '75095', '75096',
  '75097', '75098', '75099', '76001', '76010', '76011', '76012', '76013',
  '76014', '76015', '76016', '76017', '76018', '76019', '76020', '76021',
  '76022', '76023', '76024', '76025', '76026', '76027', '76028', '76029',
  '76030', '76031', '76032', '76033', '76034', '76035', '76036', '76039',
  '76040', '76043', '76044', '76050', '76051', '76052', '76053', '76054',
  '76055', '76056', '76060', '76063', '76065', '76066', '76084', '76085',
  '76086', '76087', '76088', '76092', '76093', '76096', '76097',
])

export const SERVICE_AREA_NAME = 'Grayson County, Texas'

// Check if ZIP code is in Grayson County service area
export function isZipCodeInServiceArea(zip) {
  if (!zip) return false
  return GRAYSON_COUNTY_ZIPS.has(zip.trim())
}

// Get delivery fee based on ZIP code (flat rate for Grayson County)
export function getDeliveryFee(zip) {
  if (!isZipCodeInServiceArea(zip)) {
    return null // Outside service area
  }
  // $5.99 flat rate within Grayson County
  return 5.99
}

/* ===================================================
   Quote Calculations — Combo-based pricing with 50% multiplier
=================================================== */

const TIER_PRICES = {
  1: { low: 20, high: 40 },    // Standard
  2: { low: 40, high: 100 },   // Splurge
  3: { low: null, high: null }, // Opulence (custom)
  4: { low: null, high: null }  // Custom (custom)
};

export function calculateQuoteRange(tierId, selectedCombos, guestCountMin, guestCountMax) {
  const base = TIER_PRICES[tierId];

  // No price shown for Opulence and Custom
  if (!base.low) {
    return {
      showPrice: false,
      perPersonLow: null,
      perPersonHigh: null,
      totalLow: null,
      totalHigh: null,
      guestCountMin,
      guestCountMax,
      comboCount: selectedCombos.length,
      hadMultiplier: false
    };
  }

  // Calculate multiplier: 1st combo = base, each additional = +50%
  // So: 1 combo = 1x, 2 combos = 1.5x, 3 combos = 2x, etc.
  const comboCount = selectedCombos.length;
  const multiplier = 1 + (Math.max(0, comboCount - 1) * 0.5);

  const perPersonLow = Math.round(base.low * multiplier);
  const perPersonHigh = Math.round(base.high * multiplier);

  const totalLow = Math.round(perPersonLow * guestCountMin);
  const totalHigh = Math.round(perPersonHigh * guestCountMax);

  return {
    showPrice: true,
    perPersonLow,
    perPersonHigh,
    totalLow,
    totalHigh,
    guestCountMin,
    guestCountMax,
    comboCount,
    hadMultiplier: comboCount > 1
  };
}

export function formatCurrency(amount) {
  if (amount === null) return 'Custom pricing';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatRange(low, high) {
  if (low === null || high === null) {
    return 'Custom pricing — tailored to your event';
  }
  return `${formatCurrency(low)} – ${formatCurrency(high)}`;
}

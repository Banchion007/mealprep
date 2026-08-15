export function calculateQuoteRange(tier, upgrades, guestCountMin, guestCountMax) {
  let baseLow = tier.pricePerPersonLow;
  let baseHigh = tier.pricePerPersonHigh;

  const perPersonUpgrades = upgrades.filter(u => u.unit === 'per person' || !u.unit);

  for (const upgrade of perPersonUpgrades) {
    baseLow += upgrade.priceAddLow || 0;
    baseHigh += upgrade.priceAddHigh || 0;
  }

  const totalLow = Math.round(baseLow * guestCountMin);
  const totalHigh = Math.round(baseHigh * guestCountMax);

  return {
    perPersonLow: baseLow,
    perPersonHigh: baseHigh,
    totalLow,
    totalHigh,
    guestCountMin,
    guestCountMax
  };
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export function formatRange(low, high) {
  return `${formatCurrency(low)} – ${formatCurrency(high)}`;
}

const precisionBreakpoints = [
  { min: 100000, precision: 0 },
  { min: 1000, precision: 1 },
  { min: 1, precision: 2 },
  { min: 0.1, precision: 3 },
  { min: 0.01, precision: 4 },
];

export const getPricePrecision = (value: number): number => {
  const absolute = Math.abs(value);
  const match = precisionBreakpoints.find(rule => absolute >= rule.min);
  return match?.precision ?? 6;
};

export const roundPrice = (value: number, precision?: number) => {
  const decimals = precision ?? getPricePrecision(value);
  return Number(value.toFixed(decimals));
};

export const formatPrice = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '--';
  }

  const precision = getPricePrecision(value);

  return value.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: Math.max(precision, 2),
  });
};

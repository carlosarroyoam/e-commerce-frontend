const DEFAULT_LOCALE = 'es-MX';
const DEFAULT_CURRENCY = 'MXN';

export const formatNumber = (value: number, options: Intl.NumberFormatOptions = {}): string => {
  return new Intl.NumberFormat(DEFAULT_LOCALE, options).format(value);
};

export const formatCurrency = (value: number, currency: string = DEFAULT_CURRENCY): string => {
  return new Intl.NumberFormat(DEFAULT_LOCALE, { style: 'currency', currency }).format(value);
};

export const formatPercent = (
  value: number,
  options: Intl.NumberFormatOptions = { maximumFractionDigits: 2 },
): string => {
  return new Intl.NumberFormat(DEFAULT_LOCALE, { style: 'percent', ...options }).format(value);
};

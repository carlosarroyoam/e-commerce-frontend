export const truncateDecimals = (
  cleaned: string,
  separator: string,
  decimalPlaces: number,
): string => {
  const [integerPart, decimalPart] = cleaned.split(separator);
  if (decimalPart === undefined) return integerPart;
  return `${integerPart}${separator}${decimalPart.slice(0, decimalPlaces)}`;
};

export const toNumber = (
  cleaned: string,
  decimalSeparator: string,
): number | null => {
  if (!cleaned) return null;
  const normalized = cleaned.replace(decimalSeparator, '.');
  const number = parseFloat(normalized);
  return isNaN(number) ? null : number;
};

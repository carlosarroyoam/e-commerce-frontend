export const safeParseInt = (
  value: string | null | undefined,
  fallback: number,
  minimum: number,
): number => {
  if (!value || !/^\d+$/.test(value)) return fallback;

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed < minimum) {
    return fallback;
  }

  return parsed;
};

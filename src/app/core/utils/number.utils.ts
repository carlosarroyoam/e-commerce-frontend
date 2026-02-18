export const safeParsePositiveInt = (
  value: string | null | undefined,
  fallback: number,
): number => {
  if (!value) return fallback;

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

import { ParamMap } from '@angular/router';

export const parseStringParam = (params: ParamMap, key: string): string | undefined =>
  params.get(key) ?? undefined;

export const parseIntParam = <T extends number | undefined>(
  params: ParamMap,
  key: string,
  fallback: T,
  minimum: number,
): number | T => {
  const value = params.get(key);

  if (!value || !/^\d+$/.test(value)) return fallback;

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed < minimum) {
    return fallback;
  }

  return parsed;
};

export const parseBooleanParam = (params: ParamMap, key: string): boolean | undefined => {
  const value = params.get(key);

  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

export const parseEnumParam = <T extends string>(
  params: ParamMap,
  key: string,
  allowedValues: readonly T[],
): T | undefined => {
  const value = params.get(key);

  if (value !== null && (allowedValues as readonly string[]).includes(value)) {
    return value as T;
  }

  return undefined;
};

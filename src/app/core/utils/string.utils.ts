export const toCamelCase = (value: string): string => {
  return value.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
};

export const toSnakeCase = (value: string): string => {
  return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

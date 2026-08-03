export const extractErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;

  const message = (error as { error?: { message?: unknown } } | null)?.error?.message;
  return typeof message === 'string' ? message : 'Unexpected error occurred';
};

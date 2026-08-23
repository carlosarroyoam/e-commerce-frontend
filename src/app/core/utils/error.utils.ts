/**
 * Extrae un mensaje legible de un error HTTP o de cualquier valor capturado en un `catch`.
 *
 * @param error Error capturado, de tipo desconocido.
 * @returns El mensaje de error si puede extraerse, o un mensaje genérico en caso contrario.
 */
export const extractErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;

  const message = (error as { error?: { message?: unknown } } | null)?.error?.message;
  return typeof message === 'string' ? message : 'Unexpected error occurred';
};

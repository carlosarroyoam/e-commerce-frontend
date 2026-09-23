const DEFAULT_ERROR_MESSAGE = 'Unexpected error occurred';

/**
 * Extrae un mensaje legible de un error HTTP o de cualquier valor capturado en un `catch`.
 * Para errores de la API (RFC 9457 Problem Details) prioriza `detail`, luego `title` y
 * finalmente `message`.
 *
 * @param error Error capturado, de tipo desconocido.
 * @returns El mensaje de error si puede extraerse, o un mensaje genérico en caso contrario.
 */
export const extractErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;

  const body = (error as { error?: Record<string, unknown> | null } | null)?.error;
  const message = [body?.['detail'], body?.['title'], body?.['message']].find(
    (value): value is string => typeof value === 'string' && value.trim() !== '',
  );

  return message ?? DEFAULT_ERROR_MESSAGE;
};

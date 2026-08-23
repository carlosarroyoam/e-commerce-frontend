import { HttpContext, HttpContextToken } from '@angular/common/http';

export const SKIP_ACCESS_TOKEN = new HttpContextToken<boolean>(() => false);
export const RETRY_ON_UNAUTHORIZED = new HttpContextToken<boolean>(() => true);
export const SKIP_ERROR_DIALOG = new HttpContextToken<boolean>(() => false);

/**
 * Construye el contexto HTTP para la petición de login: omite el access token y no reintenta ante un 401.
 *
 * @returns Contexto HTTP configurado para la petición de login.
 */
export function createLoginRequestContext(): HttpContext {
  return new HttpContext().set(SKIP_ACCESS_TOKEN, true).set(RETRY_ON_UNAUTHORIZED, false);
}

/**
 * Construye el contexto HTTP para peticiones de autenticación (refresh, logout): omite el access
 * token, no reintenta ante un 401 y suprime el diálogo de error automático.
 *
 * @returns Contexto HTTP configurado para peticiones de autenticación.
 */
export function createAuthRequestContext(): HttpContext {
  return new HttpContext()
    .set(SKIP_ACCESS_TOKEN, true)
    .set(RETRY_ON_UNAUTHORIZED, false)
    .set(SKIP_ERROR_DIALOG, true);
}

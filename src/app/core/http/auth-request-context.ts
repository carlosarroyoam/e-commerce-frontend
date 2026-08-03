import { HttpContext, HttpContextToken } from '@angular/common/http';

export const SKIP_ACCESS_TOKEN = new HttpContextToken<boolean>(() => false);
export const RETRY_ON_UNAUTHORIZED = new HttpContextToken<boolean>(() => true);
export const SKIP_ERROR_DIALOG = new HttpContextToken<boolean>(() => false);

export function createLoginRequestContext(): HttpContext {
  return new HttpContext().set(SKIP_ACCESS_TOKEN, true).set(RETRY_ON_UNAUTHORIZED, false);
}

export function createAuthRequestContext(): HttpContext {
  return new HttpContext()
    .set(SKIP_ACCESS_TOKEN, true)
    .set(RETRY_ON_UNAUTHORIZED, false)
    .set(SKIP_ERROR_DIALOG, true);
}

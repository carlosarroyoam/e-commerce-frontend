import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Modo en el que se abre una página de formulario:
 * - `new`: creación de un recurso nuevo.
 * - `edit`: edición de un recurso existente.
 * - `view`: consulta de un recurso existente en solo lectura.
 */
export type FormMode = 'new' | 'edit' | 'view';

/**
 * Clave de `Route.data` donde se declara el {@link FormMode} de la ruta.
 */
export const FORM_MODE_KEY = 'mode';

/**
 * Obtiene el {@link FormMode} declarado en `data` de la ruta activa.
 * Debe llamarse en un contexto de inyección.
 *
 * @returns Modo de la ruta, o `view` si la ruta no lo declara.
 */
export const injectFormMode = (): FormMode => {
  const mode = inject(ActivatedRoute).snapshot.data[FORM_MODE_KEY] as FormMode | undefined;

  return mode ?? 'view';
};

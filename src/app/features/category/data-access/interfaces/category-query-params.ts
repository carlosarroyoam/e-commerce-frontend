/**
 * Ordenamiento y paginación aceptados al consultar el listado de categorías.
 */
export interface CategoryQueryParams {
  page?: number;
  size?: number;
  sort?: string;
}

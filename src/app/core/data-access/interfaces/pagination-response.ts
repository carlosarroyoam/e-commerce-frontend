/**
 * Metadatos de paginación devueltos por los endpoints que exponen listados paginados.
 */
export interface PaginationResponse {
  page: number;
  size: number;
  total_items: number;
  total_pages: number;
}

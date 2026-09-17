/**
 * Representa a una categoría tal como es devuelta por la API.
 */
export interface CategoryResponse {
  id: number;
  title: string;
  deleted_at: string | null;
}

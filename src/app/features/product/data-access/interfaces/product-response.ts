/**
 * Categoría asociada a un producto.
 */
export interface ProductCategoryResponse {
  id: number;
  title: string;
}

/**
 * Representa a un producto tal como es devuelto por la API.
 */
export interface ProductResponse {
  id: number;
  title: string;
  slug: string;
  description: string;
  is_featured: boolean;
  is_active: boolean;
  category: ProductCategoryResponse;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

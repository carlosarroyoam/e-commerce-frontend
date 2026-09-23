import { ProductCategoryResponse } from '@/features/product/data-access/interfaces/product-response';

/**
 * Propiedad asociada a un producto (p. ej. Marca, Modelo).
 */
export interface ProductPropertyResponse {
  id: number;
  title: string;
}

/**
 * Valor de una propiedad asignado a un producto.
 */
export interface ProductPropertyValueResponse {
  id: number;
  value: string;
  property: ProductPropertyResponse;
}

/**
 * Atributo asociado a una variante (p. ej. Color, Talla).
 */
export interface ProductAttributeResponse {
  id: number;
  title: string;
  deleted_at: string | null;
}

/**
 * Valor de un atributo asignado a una variante.
 */
export interface VariantAttributeValueResponse {
  id: number;
  value: string;
  attribute: ProductAttributeResponse;
}

/**
 * Imagen asociada a una variante.
 */
export interface VariantImageResponse {
  id: number;
  url: string;
}

/**
 * Variante de un producto.
 */
export interface VariantResponse {
  id: number;
  sku: string;
  price: number;
  compared_at_price: number;
  attributes: VariantAttributeValueResponse[];
  images: VariantImageResponse[];
}

/**
 * Representa el detalle completo de un producto tal como es devuelto por la API.
 */
export interface ProductDetailResponse {
  id: number;
  title: string;
  slug: string;
  description: string;
  is_featured: boolean;
  is_active: boolean;
  category: ProductCategoryResponse;
  properties: ProductPropertyValueResponse[];
  variants: VariantResponse[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

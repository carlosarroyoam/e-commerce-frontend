/**
 * Ordenamiento y paginación aceptados al consultar el listado de pedidos.
 */
export interface OrderQueryParams {
  page?: number;
  size?: number;
  sort?: string;
}

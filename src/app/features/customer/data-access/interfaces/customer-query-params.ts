import { CustomerStatus } from '@/features/customer/data-access/interfaces/customer-response';

/**
 * Filtros, ordenamiento y paginación aceptados al consultar el listado de clientes.
 */
export interface CustomerQueryParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: CustomerStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
  sort?: string;
}

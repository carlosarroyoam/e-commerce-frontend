/**
 * Estados posibles de un cliente a lo largo de su ciclo de vida.
 */
export const CUSTOMER_STATUSES = ['PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED'] as const;

/**
 * Estado de un cliente, derivado de `CUSTOMER_STATUSES`.
 */
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

/**
 * Dirección asociada a un cliente.
 */
export interface CustomerAddressResponse {
  id: number;
  street_name: string;
  street_number: string;
  apartment_number: string | null;
  sublocality: string;
  locality: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number: string;
  is_default: boolean;
}

/**
 * Representa a un cliente tal como es devuelto por la API.
 */
export interface CustomerResponse {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  status: CustomerStatus;
  addresses: CustomerAddressResponse[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

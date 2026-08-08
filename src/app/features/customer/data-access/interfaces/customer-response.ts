export const CUSTOMER_STATUSES = ['PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED'] as const;

export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

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

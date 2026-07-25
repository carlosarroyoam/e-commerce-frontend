import { CustomerStatus } from '@/features/customer/data-access/interfaces/customer-response';

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

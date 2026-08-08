export interface ProductQueryParams {
  title?: string;
  slug?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  page?: number;
  size?: number;
  sort?: string;
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment';
import { PagedProductsResponse } from '@/features/product/data-access/interfaces/paged-products-response';
import { ProductQueryParams } from '@/features/product/data-access/interfaces/product-query-params';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly httpClient = inject(HttpClient);

  public findAll({
    title,
    slug,
    isFeatured,
    isActive,
    startDate,
    endDate,
    categoryId,
    page,
    size,
    sort,
  }: ProductQueryParams): Observable<PagedProductsResponse> {
    let params = new HttpParams();
    if (title) params = params.append('title', title);
    if (slug) params = params.append('slug', slug);
    if (isFeatured !== undefined) params = params.append('isFeatured', isFeatured);
    if (isActive !== undefined) params = params.append('isActive', isActive);
    if (startDate) params = params.append('startDate', startDate);
    if (endDate) params = params.append('endDate', endDate);
    if (categoryId) params = params.append('categoryId', categoryId);
    if (page) params = params.append('page', page);
    if (size) params = params.append('size', size);
    if (sort) params = params.append('sort', sort);

    return this.httpClient.get<PagedProductsResponse>(`${environment.apiUrl}/products`, {
      params,
    });
  }

  public deleteById(productId: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/products/${productId}`);
  }
}

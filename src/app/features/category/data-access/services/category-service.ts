import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment';
import { CategoryQueryParams } from '@/features/category/data-access/interfaces/category-query-params';
import { PagedCategoriesResponse } from '@/features/category/data-access/interfaces/paged-categories-response';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly httpClient = inject(HttpClient);

  public findAll({
    page,
    size,
    sort,
  }: CategoryQueryParams = {}): Observable<PagedCategoriesResponse> {
    let params = new HttpParams();
    if (page) params = params.append('page', page);
    if (size) params = params.append('size', size);
    if (sort) params = params.append('sort', sort);

    return this.httpClient.get<PagedCategoriesResponse>(`${environment.apiUrl}/categories`, {
      params,
    });
  }

  public deleteById(categoryId: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/categories/${categoryId}`);
  }
}

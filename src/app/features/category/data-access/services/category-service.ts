import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment';
import { CategoryQueryParams } from '@/features/category/data-access/interfaces/category-query-params';
import { PagedCategoriesResponse } from '@/features/category/data-access/interfaces/paged-categories-response';

/**
 * Encapsula las llamadas HTTP al recurso de categorías.
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly httpClient = inject(HttpClient);

  /**
   * Obtiene el listado paginado de categorías según los parámetros indicados.
   *
   * @param queryParams Ordenamiento y paginación a aplicar.
   * @returns Observable con la página de categorías.
   */
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

  /**
   * Elimina una categoría por su identificador.
   *
   * @param categoryId Identificador de la categoría a eliminar.
   * @returns Observable que se completa al finalizar la eliminación.
   */
  public deleteById(categoryId: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/categories/${categoryId}`);
  }
}

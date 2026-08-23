import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment';
import { OrderQueryParams } from '@/features/order/data-access/interfaces/order-query-params';
import { PagedOrdersResponse } from '@/features/order/data-access/interfaces/paged-orders-response';

/**
 * Encapsula las llamadas HTTP al recurso de órdenes.
 */
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly httpClient = inject(HttpClient);

  /**
   * Obtiene el listado paginado de órdenes según los parámetros indicados.
   *
   * @param queryParams Ordenamiento y paginación a aplicar.
   * @returns Observable con la página de órdenes.
   */
  public findAll({ page, size, sort }: OrderQueryParams = {}): Observable<PagedOrdersResponse> {
    let params = new HttpParams();
    if (page) params = params.append('page', page);
    if (size) params = params.append('size', size);
    if (sort) params = params.append('sort', sort);

    return this.httpClient.get<PagedOrdersResponse>(`${environment.apiUrl}/orders`, { params });
  }

  /**
   * Cancela una orden por su identificador.
   *
   * @param orderId Identificador de la orden a cancelar.
   * @returns Observable que se completa al finalizar la cancelación.
   */
  public cancelById(orderId: number): Observable<void> {
    return this.httpClient.patch<void>(`${environment.apiUrl}/orders/${orderId}/cancel`, null);
  }
}

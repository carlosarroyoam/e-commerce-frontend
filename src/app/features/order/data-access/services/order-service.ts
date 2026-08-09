import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment';
import { OrderQueryParams } from '@/features/order/data-access/interfaces/order-query-params';
import { PagedOrdersResponse } from '@/features/order/data-access/interfaces/paged-orders-response';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly httpClient = inject(HttpClient);

  public findAll({ page, size, sort }: OrderQueryParams = {}): Observable<PagedOrdersResponse> {
    let params = new HttpParams();
    if (page) params = params.append('page', page);
    if (size) params = params.append('size', size);
    if (sort) params = params.append('sort', sort);

    return this.httpClient.get<PagedOrdersResponse>(`${environment.apiUrl}/orders`, { params });
  }

  public cancelById(orderId: number): Observable<void> {
    return this.httpClient.patch<void>(`${environment.apiUrl}/orders/${orderId}/cancel`, null);
  }
}

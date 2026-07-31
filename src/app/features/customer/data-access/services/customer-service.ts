import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment';
import { CustomerQueryParams } from '@/features/customer/data-access/interfaces/customer-query-params';
import { PagedCustomersResponse } from '@/features/customer/data-access/interfaces/paged-customers-response';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly httpClient = inject(HttpClient);

  public findAll({
    firstName,
    lastName,
    email,
    status,
    startDate,
    endDate,
    page,
    size,
    sort,
  }: CustomerQueryParams): Observable<PagedCustomersResponse> {
    let params = new HttpParams();
    if (firstName) params = params.append('firstName', firstName);
    if (lastName) params = params.append('lastName', lastName);
    if (email) params = params.append('email', email);
    if (status) params = params.append('status', status);
    if (startDate) params = params.append('startDate', startDate);
    if (endDate) params = params.append('endDate', endDate);
    if (page) params = params.append('page', page);
    if (size) params = params.append('size', size);
    if (sort) params = params.append('sort', sort);

    return this.httpClient.get<PagedCustomersResponse>(`${environment.apiUrl}/customers`, {
      params,
    });
  }
}

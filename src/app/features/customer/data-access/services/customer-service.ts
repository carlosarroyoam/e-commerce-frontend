import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/core/constants/pagination.constants';
import { environment } from '@/environments/environment';
import { PagedCustomersResponse } from '@/features/customer/data-access/interfaces/paged-customers-response';
import { CustomerQueryParams } from '@/features/customer/data-access/interfaces/customer-query-params';

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
    page = DEFAULT_FIRST_PAGE,
    size = DEFAULT_PAGE_SIZE,
    sort,
  }: CustomerQueryParams): Observable<PagedCustomersResponse> {
    let params = new HttpParams().append('page', page).append('size', size);

    if (sort) params = params.append('sort', sort);
    if (firstName) params = params.append('firstName', firstName);
    if (lastName) params = params.append('lastName', lastName);
    if (email) params = params.append('email', email);
    if (status) params = params.append('status', status);
    if (startDate) params = params.append('startDate', startDate);
    if (endDate) params = params.append('endDate', endDate);

    return this.httpClient.get<PagedCustomersResponse>(
      `${environment.apiUrl}/customers`,
      { params },
    );
  }
}

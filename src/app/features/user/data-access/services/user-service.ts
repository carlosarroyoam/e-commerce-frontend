import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/core/constants/pagination.constants';
import { environment } from '@/environments/environment';
import { ChangePasswordRequest } from '@/features/user/data-access/interfaces/change-password.request';
import { User } from '@/features/user/data-access/interfaces/user';
import { UsersRequestParams } from '@/features/user/data-access/interfaces/users-request-params';
import { UsersResponse } from '@/features/user/data-access/interfaces/users-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);

  public getAll({
    search,
    status,
    page = DEFAULT_FIRST_PAGE,
    size = DEFAULT_PAGE_SIZE,
    sort,
  }: UsersRequestParams): Observable<UsersResponse> {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', size);
    if (sort) params = params.append('sort', sort);
    if (search) params = params.append('search', search);
    if (status) params = params.append('status', status);

    return this.httpClient.get<UsersResponse>(`${environment.apiUrl}/users`, {
      params,
    });
  }

  public getById(userId: number): Observable<User | null> {
    return this.httpClient.get<User>(`${environment.apiUrl}/users/${userId}`);
  }

  public changePassword(
    userId: number,
    payload: ChangePasswordRequest,
  ): Observable<void> {
    return this.httpClient.put<void>(
      `${environment.apiUrl}/users/${userId}/change-password`,
      payload,
    );
  }

  public deleteById(userId: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${environment.apiUrl}/users/${userId}`,
    );
  }

  public restoreById(userId: number): Observable<void> {
    return this.httpClient.put<void>(
      `${environment.apiUrl}/users/${userId}/restore`,
      null,
    );
  }
}

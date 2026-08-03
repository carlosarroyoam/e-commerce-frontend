import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment';
import { ChangePasswordRequest } from '@/features/user/data-access/interfaces/change-password-request';
import { PagedUsersResponse } from '@/features/user/data-access/interfaces/paged-users-response';
import { UserQueryParams } from '@/features/user/data-access/interfaces/user-query-params';
import { UserResponse } from '@/features/user/data-access/interfaces/user-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);

  public findAll({
    firstName,
    lastName,
    email,
    status,
    startDate,
    endDate,
    roleIds,
    page,
    size,
    sort,
  }: UserQueryParams): Observable<PagedUsersResponse> {
    let params = new HttpParams();
    if (firstName) params = params.append('firstName', firstName);
    if (lastName) params = params.append('lastName', lastName);
    if (email) params = params.append('email', email);
    if (status) params = params.append('status', status);
    if (startDate) params = params.append('startDate', startDate);
    if (endDate) params = params.append('endDate', endDate);
    if (roleIds) params = params.append('roleIds', roleIds);
    if (page) params = params.append('page', page);
    if (size) params = params.append('size', size);
    if (sort) params = params.append('sort', sort);

    return this.httpClient.get<PagedUsersResponse>(`${environment.apiUrl}/users`, { params });
  }

  public findById(userId: number): Observable<UserResponse | null> {
    return this.httpClient.get<UserResponse>(`${environment.apiUrl}/users/${userId}`);
  }

  public changePassword(userId: number, payload: ChangePasswordRequest): Observable<void> {
    return this.httpClient.put<void>(
      `${environment.apiUrl}/users/${userId}/change-password`,
      payload,
    );
  }

  public deleteById(userId: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiUrl}/users/${userId}`);
  }

  public restoreById(userId: number): Observable<void> {
    return this.httpClient.put<void>(`${environment.apiUrl}/users/${userId}/restore`, null);
  }
}

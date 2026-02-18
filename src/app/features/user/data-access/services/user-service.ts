import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_PAGE_SIZE,
} from '@/core/constants/pagination.constants';
import { environment } from '@/environments/environment';
import { UserResponse } from '@/features/user/data-access/interfaces/user.response';
import { UsersRequestParams } from '@/features/user/data-access/interfaces/users-request';
import { UsersResponse } from '@/features/user/data-access/interfaces/users-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);

  public getAll({
    page,
    size,
    sort,
    search,
    status,
  }: UsersRequestParams): Observable<UsersResponse | null> {
    let params = new HttpParams();
    params = params.append('page', page ?? DEFAULT_FIRST_PAGE);
    params = params.append('size', size ?? DEFAULT_PAGE_SIZE);
    if (sort) params = params.append('sort', sort);
    if (search) params = params.append('search', search);
    if (status) params = params.append('status', status);

    return this.httpClient.get<UsersResponse>(`${environment.apiUrl}/users`, {
      params,
    });
  }

  public getById(userId: number): Observable<UserResponse | null> {
    return this.httpClient
      .get<UserResponse>(`${environment.apiUrl}/users/${userId}`)
      .pipe(catchError(() => of(null)));
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

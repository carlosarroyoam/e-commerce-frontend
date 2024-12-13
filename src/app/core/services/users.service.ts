import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { User } from '@/app/core/models/user.model';
import { UsersResponse } from '@/app/core/models/users-response.model';
import { environment } from '@/environments/environment';
import { UserResponse } from '../models/user.response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly httpClient: HttpClient) {}

  getAll({
    page,
    size,
    sort,
    search,
    status,
  }: {
    page?: number;
    size?: number;
    sort?:
      | 'id'
      | '-id'
      | 'first_name'
      | '-first_name'
      | 'last_name'
      | '-last_name'
      | 'email'
      | '-email';
    search?: string;
    status?: 'active' | 'inactive';
  } = {}): Observable<UsersResponse> {
    let params = new HttpParams();
    params = params.append('page', page ?? 1);
    params = params.append('size', size ?? 20);
    if (sort) params = params.append('sort', sort);
    if (search) params = params.append('search', search);
    if (status) params = params.append('status', status);

    return this.httpClient.get<UsersResponse>(`${environment.apiUrl}/users`, {
      params,
    });
  }

  getById(userId: number): Observable<User | null> {
    return this.httpClient
      .get<UserResponse>(`${environment.apiUrl}/users/${userId}`)
      .pipe(
        map((response) => response.user),
        catchError(() => of(null)),
      );
  }
}

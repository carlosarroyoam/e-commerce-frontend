import { HttpClient } from '@angular/common/http';
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

  getAll(): Observable<User[]> {
    return this.httpClient
      .get<UsersResponse>(`${environment.apiUrl}/users`)
      .pipe(
        map((response) => response.users),
        catchError(() => of([])),
      );
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

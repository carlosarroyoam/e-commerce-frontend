import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { User } from '@/app/core/models/user.model';
import { UsersResponse } from '@/app/core/models/users-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly httpClient: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.httpClient
      .get<UsersResponse>('http://localhost:3000/api/v1/users')
      .pipe(
        map((response) => response.users),
        catchError(() => of([])),
      );
  }
}

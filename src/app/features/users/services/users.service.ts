import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { User } from '../interfaces/user.interface';
import { UsersResponse } from '../interfaces/users-response.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly httpClient: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.httpClient
      .get<UsersResponse>('http://localhost:3000/api/v1/users', {
        withCredentials: true,
      })
      .pipe(
        map((response) => response.users),
        catchError((err) => of([]))
      );
  }
}

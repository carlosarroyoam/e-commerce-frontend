import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UsersResponse } from '../interfaces/users-response.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private readonly httpClient: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.httpClient
      .get<UsersResponse>('http://localhost:3000/api/v1/users', {
        withCredentials: true,
      })
      .pipe(map((response) => response.users));
  }
}

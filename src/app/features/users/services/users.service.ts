import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private readonly httpClient: HttpClient) {}

  getAll(): Observable<any> {
    return this.httpClient
      .get('http://localhost:3000/api/v1/users', {
        withCredentials: true,
      })
      .pipe(map((response: any) => response.users));
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private httpClient: HttpClient) {}

  getAll() {
    return this.httpClient.get(
      'http://localhost:3000/api/v1/users',
      { withCredentials: true }
    );
  }
}

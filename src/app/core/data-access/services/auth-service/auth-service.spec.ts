import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RefreshTokenResponse } from '@/core/data-access/interfaces/refresh-token-response';
import { environment } from '@/environments/environment';
import { AuthService } from './auth-service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retry refresh once when the first request initializes XSRF with a 403', () => {
    const response: RefreshTokenResponse = {
      id: 1,
      first_name: 'Alice',
      last_name: 'Doe',
      email: 'alice@example.com',
      roles: ['USER'],
      access_token: 'access-token',
    };
    let result: RefreshTokenResponse | undefined;

    service.refreshToken().subscribe((value) => (result = value));

    httpTestingController
      .expectOne(`${environment.apiUrl}/auth/refresh-token`)
      .flush(null, { status: 403, statusText: 'Forbidden' });
    httpTestingController
      .expectOne(`${environment.apiUrl}/auth/refresh-token`)
      .flush(response);

    expect(result).toEqual(response);
  });
});

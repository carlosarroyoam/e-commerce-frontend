import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { type Mock, vi } from 'vitest';

import {
  QUERY_PARAMS_CONFIG,
  QueryParamsConfig,
  QueryParamsService,
} from './query-params.service';

interface TestQueryParams {
  search?: string;
  page?: number;
  size?: number;
}

describe('QueryParamsService', () => {
  let service: QueryParamsService<TestQueryParams>;
  let routeQueryParams$: BehaviorSubject<Params>;
  let routerNavigate: Mock;
  let mapFromRoute: Mock;
  let load: Mock;
  let route: ActivatedRoute;

  beforeEach(() => {
    routeQueryParams$ = new BehaviorSubject<Params>({});
    routerNavigate = vi.fn(() => Promise.resolve(true));
    mapFromRoute = vi.fn((params: Params) => ({
      search:
        typeof params['search'] === 'string' ? params['search'] : undefined,
      page: typeof params['page'] === 'number' ? params['page'] : 1,
      size: typeof params['size'] === 'number' ? params['size'] : 20,
    }));
    load = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        QueryParamsService,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: routeQueryParams$.asObservable(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: routerNavigate,
          },
        },
        {
          provide: QUERY_PARAMS_CONFIG,
          useValue: {
            resetQueryParams: {
              page: 1,
              size: 20,
            },
            mapFromRoute,
            load,
          } satisfies QueryParamsConfig<TestQueryParams>,
        },
      ],
    });

    service = TestBed.inject(
      QueryParamsService,
    ) as QueryParamsService<TestQueryParams>;
    route = TestBed.inject(ActivatedRoute);
  });

  it('should map route params and load on query param changes', () => {
    expect(mapFromRoute).toHaveBeenCalledWith({});
    expect(load).toHaveBeenCalledWith({
      page: 1,
      search: undefined,
      size: 20,
    });

    routeQueryParams$.next({
      search: 'john',
      page: 3,
      size: 50,
    });

    expect(mapFromRoute).toHaveBeenLastCalledWith({
      search: 'john',
      page: 3,
      size: 50,
    });
    expect(load).toHaveBeenLastCalledWith({
      search: 'john',
      page: 3,
      size: 50,
    });
  });

  it('should clear empty values when updating query params', () => {
    service.updateQueryParams({
      search: '',
      page: 2,
      size: undefined,
    });

    expect(routerNavigate).toHaveBeenCalledWith([], {
      relativeTo: route,
      queryParams: {
        search: null,
        page: 2,
        size: null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });

  it('should reset query params without merge handling', () => {
    service.resetQueryParams();

    expect(routerNavigate).toHaveBeenCalledWith([], {
      relativeTo: route,
      queryParams: {
        page: 1,
        size: 20,
      },
      replaceUrl: true,
    });
  });
});

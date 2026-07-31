import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { type Mock, vi } from 'vitest';

import { createQueryParamsSync, QueryParamsSync } from './query-params.utils';

interface TestParams {
  search?: string;
  page: number;
  size?: number;
}

interface TestFormValue {
  search: string | null;
  page: number;
  size?: number;
}

describe('createQueryParamsSync', () => {
  let queryParamMap$: BehaviorSubject<ParamMap>;
  let routerNavigate: Mock;
  let form: FormGroup;
  let sync: QueryParamsSync<TestParams>;
  let route: ActivatedRoute;

  beforeEach(() => {
    vi.useFakeTimers();
    queryParamMap$ = new BehaviorSubject(convertToParamMap({ page: '0' }));
    routerNavigate = vi.fn(() => Promise.resolve(true));
    form = new FormGroup({
      search: new FormControl<string | null>(null),
      page: new FormControl(0, { nonNullable: true }),
    });

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: queryParamMap$.asObservable(),
            snapshot: { queryParamMap: queryParamMap$.value },
          },
        },
        {
          provide: Router,
          useValue: { navigate: routerNavigate },
        },
      ],
    });

    route = TestBed.inject(ActivatedRoute);
    sync = TestBed.runInInjectionContext(() =>
      createQueryParamsSync<TestParams, TestFormValue>(form, {
        deserialize: (params) => ({
          search: params.get('search') ?? undefined,
          page: Number(params.get('page') ?? 0),
        }),
        resetParams: { page: 0, size: 10 },
      }),
    );
  });

  afterEach(() => vi.useRealTimers());

  it('should initialize the form and expose deserialized route params', () => {
    expect(form.getRawValue()).toEqual({ search: undefined, page: 0 });
    expect(sync.params()).toEqual({ search: undefined, page: 0 });
  });

  it('should add reset params when the route has no query params', () => {
    TestBed.resetTestingModule();
    const emptyParams = convertToParamMap({});
    const emptyRoute = {
      queryParamMap: new BehaviorSubject(emptyParams).asObservable(),
      snapshot: { queryParamMap: emptyParams },
    };
    const emptyRouterNavigate = vi.fn(() => Promise.resolve(true));
    const emptyForm = new FormGroup({
      search: new FormControl<string | null>(null),
      page: new FormControl(0, { nonNullable: true }),
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: emptyRoute },
        { provide: Router, useValue: { navigate: emptyRouterNavigate } },
      ],
    });

    TestBed.runInInjectionContext(() =>
      createQueryParamsSync<TestParams, TestFormValue>(emptyForm, {
        resetParams: { page: 0, size: 10 },
      }),
    );

    expect(emptyRouterNavigate).toHaveBeenCalledWith([], {
      relativeTo: emptyRoute,
      queryParams: { page: 0, size: 10 },
      queryParamsHandling: '',
      replaceUrl: true,
    });
  });

  it('should update exposed params when route query params change', () => {
    queryParamMap$.next(convertToParamMap({ search: 'john', page: '3' }));

    expect(sync.params()).toEqual({ search: 'john', page: 3 });
  });

  it('should debounce form changes and normalize empty values', () => {
    form.patchValue({ search: 'john' });
    vi.advanceTimersByTime(249);
    expect(routerNavigate).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(routerNavigate).toHaveBeenCalledWith([], {
      relativeTo: route,
      queryParams: { search: 'john', page: 0 },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    form.patchValue({ search: '' });
    vi.advanceTimersByTime(250);
    expect(routerNavigate).toHaveBeenLastCalledWith([], {
      relativeTo: route,
      queryParams: { search: null, page: 0 },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });

  it('should update form values and query params', () => {
    sync.update({ search: 'jane', page: 2 });

    expect(form.getRawValue()).toEqual({ search: 'jane', page: 2 });
    expect(routerNavigate).toHaveBeenCalledWith([], {
      relativeTo: route,
      queryParams: { search: 'jane', page: 2 },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });

  it('should retain query params that are not form controls', () => {
    routerNavigate.mockClear();
    form.removeControl('page');

    sync.update({ page: 2 });

    expect(routerNavigate).toHaveBeenCalledWith([], {
      relativeTo: route,
      queryParams: { search: null, page: 2 },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  });
  it('should restore the initial form values and query params', () => {
    form.patchValue({ search: 'jane', page: 2 }, { emitEvent: false });
    sync.reset();

    expect(form.getRawValue()).toEqual({ search: null, page: 0 });
    expect(routerNavigate).toHaveBeenCalledWith([], {
      relativeTo: route,
      queryParams: { page: 0, size: 10 },
      queryParamsHandling: '',
      replaceUrl: true,
    });
  });
});

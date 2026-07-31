import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { type Mock, vi } from 'vitest';

import { createQueryParamsSync, QueryParamsSync } from './query-params.utils';

interface TestParams {
  search?: string;
  page: number;
}

interface TestFormValue {
  search: string | null;
}

describe('createQueryParamsSync', () => {
  let queryParamMap$: BehaviorSubject<ParamMap>;
  let formChanges$: Subject<TestFormValue>;
  let routerNavigate: Mock;
  let patchForm: Mock;
  let sync: QueryParamsSync<TestParams>;
  let formValid: boolean;
  let route: ActivatedRoute;

  beforeEach(() => {
    vi.useFakeTimers();
    queryParamMap$ = new BehaviorSubject(convertToParamMap({ page: '0' }));
    formChanges$ = new Subject();
    routerNavigate = vi.fn(() => Promise.resolve(true));
    patchForm = vi.fn();
    formValid = true;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: queryParamMap$.asObservable() },
        },
        {
          provide: Router,
          useValue: { navigate: routerNavigate },
        },
      ],
    });

    route = TestBed.inject(ActivatedRoute);
    sync = TestBed.runInInjectionContext(() =>
      createQueryParamsSync<TestParams, TestFormValue>({
        parse: (params) => ({
          search: params.get('search') ?? undefined,
          page: Number(params.get('page') ?? 0),
        }),
        formChanges: formChanges$,
        isFormValid: () => formValid,
        toQueryParams: (value) => ({ search: value.search ?? undefined, page: 0 }),
        patchForm,
        resetParams: { page: 0 },
      }),
    );
  });

  afterEach(() => vi.useRealTimers());

  it('should expose route params and patch the form on navigation changes', () => {
    TestBed.flushEffects();
    expect(sync.params()).toEqual({ search: undefined, page: 0 });
    expect(patchForm).toHaveBeenLastCalledWith({ search: undefined, page: 0 });

    queryParamMap$.next(convertToParamMap({ search: 'john', page: '3' }));
    TestBed.flushEffects();

    expect(sync.params()).toEqual({ search: 'john', page: 3 });
    expect(patchForm).toHaveBeenLastCalledWith({ search: 'john', page: 3 });
    expect(routerNavigate).not.toHaveBeenCalled();
  });

  it('should debounce valid form changes and normalize empty values', () => {
    formChanges$.next({ search: null });
    vi.advanceTimersByTime(249);
    expect(routerNavigate).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(routerNavigate).toHaveBeenCalledWith([], {
      relativeTo: route,
      queryParams: { search: null, page: 0 },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    formValid = false;
    formChanges$.next({ search: 'invalid' });
    vi.advanceTimersByTime(250);
    expect(routerNavigate).toHaveBeenCalledTimes(1);
  });

  it('should stop reacting to form changes after its injection context is destroyed', () => {
    TestBed.resetTestingModule();
    formChanges$.next({ search: 'john' });
    vi.advanceTimersByTime(250);

    expect(routerNavigate).not.toHaveBeenCalled();
  });
  it('should update with merge handling and reset by replacing query params', () => {
    sync.update({ search: '', page: 2 });
    sync.reset();

    expect(routerNavigate).toHaveBeenNthCalledWith(1, [], {
      relativeTo: route,
      queryParams: { search: null, page: 2 },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    expect(routerNavigate).toHaveBeenNthCalledWith(2, [], {
      relativeTo: route,
      queryParams: { page: 0 },
      replaceUrl: true,
    });
  });
});

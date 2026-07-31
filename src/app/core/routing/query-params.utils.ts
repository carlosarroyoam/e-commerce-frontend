import { DestroyRef, effect, inject, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { debounceTime, filter, map, Observable } from 'rxjs';

export interface QueryParamsSyncConfig<TParams extends object, TFormValue> {
  parse(params: ParamMap): TParams;
  formChanges: Observable<TFormValue>;
  isFormValid(): boolean;
  toQueryParams(value: TFormValue): Partial<TParams>;
  patchForm(params: TParams): void;
  resetParams: Partial<TParams>;
  debounceMs?: number;
}

export interface QueryParamsSync<TParams extends object> {
  params: Signal<TParams>;
  update(partial: Partial<TParams>): void;
  reset(): void;
}

export const createQueryParamsSync = <TParams extends object, TFormValue>({
  parse,
  formChanges,
  isFormValid,
  toQueryParams,
  patchForm,
  resetParams,
  debounceMs = 250,
}: QueryParamsSyncConfig<TParams, TFormValue>): QueryParamsSync<TParams> => {
  const route = inject(ActivatedRoute);
  const router = inject(Router);
  const destroyRef = inject(DestroyRef);
  const params = toSignal(route.queryParamMap.pipe(map(parse)), { requireSync: true });

  const update = (partial: Partial<TParams>): void => {
    void router.navigate([], {
      relativeTo: route,
      queryParams: normalizeQueryParams(partial),
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  };

  const reset = (): void => {
    void router.navigate([], {
      relativeTo: route,
      queryParams: resetParams,
      replaceUrl: true,
    });
  };

  effect(() => patchForm(params()));

  formChanges
    .pipe(
      debounceTime(debounceMs),
      filter(() => isFormValid()),
      takeUntilDestroyed(destroyRef),
    )
    .subscribe((value) => update(toQueryParams(value)));

  return { params, update, reset };
};

const normalizeQueryParams = (partial: object): Params => {
  const queryParams: Params = {};

  for (const [key, value] of Object.entries(partial)) {
    queryParams[key] = value === undefined || value === null || value === '' ? null : value;
  }

  return queryParams;
};

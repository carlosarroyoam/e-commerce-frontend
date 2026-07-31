import { DEFAULT_FIRST_PAGE } from '@/core/constants/pagination.constants';
import { DestroyRef, inject, Signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs';

const DEFAULT_DEBOUNCE_MS = 250;

export interface QueryParamsSyncOptions<
  TParams extends object,
  TFormValue extends object = TParams,
> {
  debounceMs?: number;
  serialize?: (value: TFormValue) => Params;
  deserialize?: (params: ParamMap) => TParams;
  resetParams?: Partial<TParams>;
}

export interface QueryParamsSync<TParams extends object> {
  reset: () => void;
  update: (value: Partial<TParams>) => void;
  params: Signal<TParams>;
}

export const createQueryParamsSync = <TParams extends object, TFormValue extends object = TParams>(
  form: FormGroup,
  options: QueryParamsSyncOptions<TParams, TFormValue> = {},
): QueryParamsSync<TParams> => {
  const router = inject(Router);
  const route = inject(ActivatedRoute);
  const destroyRef = inject(DestroyRef);

  const {
    debounceMs = DEFAULT_DEBOUNCE_MS,
    serialize = defaultSerialize,
    deserialize = defaultDeserialize,
    resetParams = {},
  } = options;

  const navigate = (queryParams: Params, merge = false): void => {
    void router.navigate([], {
      relativeTo: route,
      queryParams,
      queryParamsHandling: merge ? 'merge' : '',
      replaceUrl: true,
    });
  };

  const initialParams = route.snapshot.queryParamMap;

  if (initialParams.keys.length > 0) {
    form.patchValue(deserialize(initialParams), { emitEvent: false });
  } else {
    navigate(resetParams);
  }

  form.valueChanges
    .pipe(
      debounceTime(debounceMs),
      filter(() => form.valid),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      takeUntilDestroyed(destroyRef),
    )
    .subscribe((value) => navigate({ ...serialize(value), page: DEFAULT_FIRST_PAGE }, true));

  const params = toSignal(route.queryParamMap.pipe(map(deserialize)), {
    initialValue: deserialize(initialParams),
  });

  return {
    reset: () => {
      form.reset();
      navigate(resetParams);
    },
    update: (value: Partial<TParams>) => {
      form.patchValue(value, { emitEvent: false });
      navigate({ ...serialize(form.getRawValue()), ...value }, true);
    },
    params,
  };
};

const defaultSerialize = <TFormValue extends object>(value: TFormValue): Params => {
  const params: Params = {};
  for (const [key, val] of Object.entries(value)) {
    params[key] = val === undefined || val === null || val === '' ? null : val;
  }
  return params;
};

const defaultDeserialize = <TParams extends object>(params: ParamMap): TParams => {
  return Object.fromEntries(params.keys.map((key) => [key, params.get(key)])) as TParams;
};

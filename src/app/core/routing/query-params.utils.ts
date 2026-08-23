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

/**
 * Sincroniza un `FormGroup` con los query params de la ruta actual: al cargar aplica los params
 * existentes al formulario (o resetea la URL si no hay ninguno), y ante cada cambio de valor
 * navega actualizando los params.
 *
 * @param form Formulario reactivo a sincronizar con la URL.
 * @param options Opciones de serialización/deserialización, debounce y params de reseteo.
 * @returns Objeto con el signal de params actuales y los métodos `reset`/`update`.
 */
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

/**
 * Serialización por defecto: copia cada valor del formulario a los query params, convirtiendo
 * valores vacíos (`undefined`, `null`, `''`) a `null` para que se eliminen de la URL.
 *
 * @param value Valor del formulario a serializar.
 * @returns Query params equivalentes al valor del formulario.
 */
const defaultSerialize = <TFormValue extends object>(value: TFormValue): Params => {
  const params: Params = {};
  for (const [key, val] of Object.entries(value)) {
    params[key] = val === undefined || val === null || val === '' ? null : val;
  }
  return params;
};

/**
 * Deserialización por defecto: copia cada query param presente en la URL tal cual, sin parseo ni
 * conversión de tipos.
 *
 * @param params Query params de la URL actual.
 * @returns Objeto con las claves y valores de los query params.
 */
const defaultDeserialize = <TParams extends object>(params: ParamMap): TParams => {
  return Object.fromEntries(params.keys.map((key) => [key, params.get(key)])) as TParams;
};

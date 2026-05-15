import { inject, Injectable, InjectionToken } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';

export type QueryParamValue = boolean | number | string | null | undefined;

export type QueryParamsShape<TParams> = {
  [TKey in keyof TParams]: QueryParamValue;
};

export interface QueryParamsConfig<TParams extends QueryParamsShape<TParams>> {
  load(params: TParams): void;
  mapFromRoute(params: Params): TParams;
  resetQueryParams: Partial<TParams>;
}

export const QUERY_PARAMS_CONFIG = new InjectionToken<
  QueryParamsConfig<Record<string, QueryParamValue>>
>('QUERY_PARAMS_CONFIG');

@Injectable()
export class QueryParamsService<TParams extends QueryParamsShape<TParams>> {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly config = inject(
    QUERY_PARAMS_CONFIG,
  ) as QueryParamsConfig<TParams>;

  constructor() {
    this.route.queryParams
      .pipe(takeUntilDestroyed())
      .subscribe((queryParams) => {
        const mappedParams = this.config.mapFromRoute(queryParams);
        this.config.load(mappedParams);
      });
  }

  public updateQueryParams(partial: Partial<TParams>): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.normalizeQueryParams(partial),
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  public resetQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.config.resetQueryParams,
      replaceUrl: true,
    });
  }

  private normalizeQueryParams(partial: Partial<TParams>): Params {
    const queryParams: Params = {};

    for (const [key, value] of Object.entries(partial)) {
      queryParams[key] =
        value === undefined || value === null || value === '' ? null : value;
    }

    return queryParams;
  }
}

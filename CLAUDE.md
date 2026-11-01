# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Admin/dashboard frontend for an e-commerce system.

Node 24 is the target version (matches the Docker build's `node:24-alpine`). Note: `README.md` is out of date (still mentions Angular 21, Node 20 and `npx vitest run`); trust this file and `package.json`.

## Commands

```bash
npx ng test --watch=false --include=src/app/shared/components/alert-dialog/alert-dialog.spec.ts   # single file
npx ng test --watch=false --filter="should create"                                              # by test name (regex)
npx ng test --watch=false --include=src/app/features/auth/                                        # one feature folder
# Don't run `npx vitest run` directly: it bypasses the Angular builder and can't resolve the `@/` aliases.
```

## Imports

Path aliases (`tsconfig.json`): `@/*` -> `src/app/*`, `@/environments/*` -> `src/environments/*`. Imports use the `@/` alias except for a spec's own subject, which is imported relatively (`./category-list-page`).

## Feature shape

CRUD features (`category`, `customer`, `order`, `product`, `user`) share this structure; `features/category` is the reference implementation:

- Routes: `''` (list), `'new'` and `':id/edit'` (form), `':id'` (detail) — keep `':id'` last.
- DTO fields are snake_case because they mirror the API.
- `pages/<feature>-form/` pages are currently placeholders in every feature.
- `utils/` (enum -> `Chip { label, variant }` config maps) exists only in customer, order and user.

## Architecture

### State management

- Local/component state: signals and `computed()`.
- Feature stores: `signalStore({ providedIn: undefined }, withState(initialState), withMethods(...))`, provided at the page level (`providers: [CategoryStore]`), so each page gets its own instance.
- State shape: `items` + `pagination` (list, `findAll`), `selectedItem` (detail, `findById`), `isLoading`, `error`.
- Store methods use `rxMethod` + `switchMap` + `tapResponse` (from `@ngrx/operators`), patching `isLoading`/`error` and data; errors are mapped with `extractErrorMessage` (`core/utils/error.utils.ts`). `findAll` can receive a signal (`store.findAll(this.queryParams)`) so it re-runs on change.
- `AuthStore` (`core/data-access/stores/auth-store`) is the only `providedIn: 'root'` store; `restoreSession()` runs from `provideAppInitializer` in `app.config.ts`.
- Mutations not held in the store (e.g. delete) are called directly on the service from the page, followed by `store.findAll(...)` to refresh.

### HTTP layer

`app.config.ts` registers interceptors in this order — keep it when adding new ones:
`withCredentialsInterceptor` -> `xsrfInterceptor` -> `accessTokenInterceptor` -> `refreshTokenInterceptor` -> `httpErrorInterceptor`.

Feature services inject `HttpClient` with `inject()`, call `${environment.apiUrl}/<resource>`, build `HttpParams` only for defined values, and return typed Observables (`Paged<Feature>sResponse` = `{ items, pagination }`).

### Runtime API configuration

`environment.apiUrl` is `window.apiUrl`, set by `assets/env.js`. In the container, `envsubst` renders `assets/env.template.js` (`window['apiUrl'] = '${apiUrl}';`) into `env.js` at startup. The API URL is never baked in at build time; don't hardcode it.

### Formatting

Use the shared null-safe pipes (`appCurrency`, `appDateTime`, `appPercent`, `appPhoneNumber` in `shared/pipes`), not Angular's `currency`/`date`/`percent`. They delegate to `core/utils/*.utils.ts` with `DEFAULT_LOCALE` (`es-MX`) and `DEFAULT_CURRENCY` (`MXN`) and return `null` for `null`/`undefined`.

### Language

- `angular.json` sets `i18n.sourceLocale: "es"` and loads `@angular/localize/init`, but no `i18n`/`$localize` markers are used yet.
- User-facing UI copy (labels, headings, dialog/toast text, chip labels) is currently written in **English**.
- TSDoc on classes, public/protected methods, DTO interfaces and exported functions is written in **Spanish**.

## Code conventions

- Standalone components only, no NgModules; don't write `standalone: true`.
- Set `changeDetection: ChangeDetectionStrategy.OnPush` on new components (only `App`, `AuthLayout` and `MainLayout` currently omit it).
- `input()` / `output()` functions, not decorators; `inject()` for DI, not constructor parameters. Injected fields are `private readonly`; template-facing members are `protected readonly`.
- Native control flow (`@if`/`@for`/`@switch`); `class`/`style` bindings, not `ngClass`/`ngStyle`.
- No `@HostBinding`/`@HostListener`; use the `host` object (e.g. `host: { '[class]': 'hostClass()' }`).
- Signals: `set()`/`update()`, never `mutate()`.
- Forms: typed Reactive Forms with `NonNullableFormBuilder` for real forms (see `login-page.ts`); this overrides the angular-developer skill's Signal Forms default. List pages use `FormBuilder` only for their empty query-param form.
- External templates are referenced relative to the `.ts` file (`templateUrl: './category-list-page.html'`). Component styles are not used (`schematics` default `style: none`); style with Tailwind classes.
- File naming: `<name>.ts` for components/directives (no `.component` suffix), `<name>-page.ts` for pages, `<name>-service.ts`, `<name>.pipe.ts`, `<name>.store.ts` / `<name>.state.ts`, `<name>.validator.ts`. Selectors use the `app` prefix (kebab-case elements, camelCase attributes) — enforced by ESLint.
- Styling: Tailwind 4 + `class-variance-authority` for variants (`buttonVariants`, `ChipVariants`, …), combined with the `cn()` helper (`core/utils/class.utils.ts`, `twMerge(clsx(...))`). Prefer `cn()` over calling `twMerge` directly. Prettier sorts classes inside `cva(...)` / `twMerge(...)` (`tailwindFunctions` in `.prettierrc`) but not inside `cn(...)`.
- Icons: import individual `Lucide*` components from `@lucide/angular` (global `strokeWidth: 1.5`).
- Static images: `NgOptimizedImage`, no inline base64.
- Accessibility: must pass AXE and WCAG AA (focus management, contrast, ARIA); ESLint runs `templateAccessibility` on templates.

## Testing

- Specs live next to their source (`*.spec.ts`), using Vitest globals (`describe`/`it`/`expect`) and `vi` from `vitest` for mocks, with Angular `TestBed`.
- Typical setup mocks the feature service with `useValue` objects of `vi.fn(...)` returning `of(...)`, and stubs `ActivatedRoute` (e.g. a `BehaviorSubject` of `convertToParamMap(...)` for list pages, `snapshot.paramMap` for detail pages). Call `vi.clearAllMocks()` in `beforeEach`.
- Protected members are reached in tests with bracket access (`component['onViewCategory'](...)`).

## Agent tooling

The `angular-developer` skill is vendored in both `.claude/skills/` and `.agents/skills/` (tracked by `skills-lock.json`). Where it conflicts with this file (e.g. Signal Forms), this file wins.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Admin/dashboard frontend for an e-commerce system. Angular 22 (standalone components, zoneless change detection via `provideZonelessChangeDetection()`), NgRx Signals for shared state, TanStack Table v9 (Angular adapter) for data tables, TailwindCSS 4, Lucide icons (`@lucide/angular`), Angular CDK (overlays for modals/dialogs). TypeScript ~6.0, RxJS 7.

Node 24 is the target version (matches the Docker build's `node:24-alpine`). Note: `README.md` is out of date (still mentions Angular 21, Node 20 and `npx vitest run`); trust this file and `package.json`.

## Commands

```bash
npm start                          # ng serve, dev server at http://localhost:4200 (development config)
npm run build                      # production build -> dist/e-commerce-frontend/browser
npm run build -- --configuration development   # dev build: source maps, no optimization
npm run watch                      # build --watch with development config (no tests)

npm test                           # unit tests: Vitest through @angular/build:unit-test (jsdom)
npx ng test --watch=false --include=src/app/shared/components/alert-dialog/alert-dialog.spec.ts   # single file
npx ng test --watch=false --filter="should create"                                              # by test name (regex)
npx ng test --watch=false --include=src/app/features/auth/                                        # one feature folder
# Don't run `npx vitest run` directly: it bypasses the Angular builder and can't resolve the `@/` aliases.

npm run lint                       # ng lint (angular-eslint) over src/**/*.ts and src/**/*.html
npm run lint:fix
npm run format                     # prettier --write .
npm run format:check
```

Production build budgets (`angular.json`): initial bundle warns at 500 kB / errors at 1 MB; per-component style warns at 4 kB / errors at 8 kB.

## Directory layout

```
src/
  main.ts                  bootstrapApplication(App, appConfig); removes #bootstrap-loader when done
  styles.css               Tailwind 4 entry (@import 'tailwindcss', @tailwindcss/forms, CDK overlay CSS,
                           Inter font, @theme animations, `container` utility, `.heading` component class)
  assets/env.template.js   runtime API URL template (see Runtime API configuration)
  environments/            environment.ts (dev) / environment.prod.ts (swapped via fileReplacements)
  app/
    app.ts / app.html / app.config.ts / app.routes.ts
    core/
      constants/           locale (es-MX / MXN), pagination (first page 0, size 10), storage keys, toast
      data-access/         auth DTOs, pagination-response, auth-service, storage services, auth-store (global)
      guards/              authGuard, guestGuard
      http/                auth-request-context.ts (HttpContextTokens used by interceptors)
      interceptors/        with-credentials, xsrf, access-token, refresh-token, http-error
      routing/             createQueryParamsSync + query param parsers
      utils/               class (cn), date, error (extractErrorMessage), http (isApiRequest), number, phone, string
    features/              auth (login), dashboard, order, product, category, customer, user
    shared/
      components/          alert-dialog, footer, header, layout/{auth-layout,main-layout}, modal-container,
                           paginator, sidebar, stepper, table (+ tanstack/ helpers), toast, toast-stack,
                           ui/{avatar,button,chip,input,input-error,input-label,option-selectors/{autocomplete,select},spinner}
      directives/          click-outside, input-masks/{credit-card,currency,datetime,number,pattern,percent,phone,text}-mask
      pipes/               currency, date-time, percent, phone-number (null-safe)
      services/            alert-dialog, modal, sidebar, toast
      validators/          date-range.validator
```

Path aliases (`tsconfig.json`): `@/*` -> `src/app/*`, `@/environments/*` -> `src/environments/*`. Imports use the `@/` alias except for a spec's own subject, which is imported relatively (`./category-list-page`).

### Feature shape

CRUD features (`category`, `customer`, `order`, `product`, `user`) share this structure; `features/category` is the reference implementation:

```
<feature>/
  <feature>.routes.ts              '' (list), 'new' and ':id/edit' (form), ':id' (detail) — keep ':id' last
  pages/
    <feature>-list/                <feature>-list-page.{ts,html} + <feature>-table.ts (columns + TableMeta)
    <feature>-detail/              <feature>-detail-page.{ts,html}
    <feature>-form/                <feature>-form-page.{ts,html} — currently placeholders in every feature
  components/<feature>-table-buttons/   row action buttons rendered inside the table
  data-access/
    interfaces/                    request/response/query-param DTOs (snake_case fields mirror the API)
    services/<feature>-service.ts  HttpClient wrapper, providedIn: 'root'
    stores/                        <feature>.state.ts + <feature>.store.ts (NgRx SignalStore)
  routing/<feature>-query-params.deserializer.ts
  utils/                           enum -> Chip { label, variant } config maps (customer, order, user only)
```

`auth` only has `pages/login`; `dashboard` only has `pages/dashboard`.

## Architecture

### Routing

`app.routes.ts`: `/auth` lazy-loads `AuthLayout`, guarded with `canMatch: [guestGuard]`, children from `features/auth/auth.routes.ts` (`login`). `''` lazy-loads `MainLayout` with `canActivateChild: [authGuard]`; children `dashboard`, `orders`, `products`, `categories`, `customers`, `users` are wired with `loadChildren`, and `''` redirects to `dashboard`. `**` redirects to `''`. Every page is itself lazy-loaded with `loadComponent`. Follow this pattern for new features.

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

Interceptor behaviour is tuned per request with `HttpContextToken`s from `core/http/auth-request-context.ts`: `SKIP_ACCESS_TOKEN`, `RETRY_ON_UNAUTHORIZED`, `SKIP_ERROR_DIALOG`, plus the `createLoginRequestContext()` / `createAuthRequestContext()` helpers. `isApiRequest()` (`core/utils/http.utils.ts`) limits credential/token handling to the API origin.

Feature services inject `HttpClient` with `inject()`, call `${environment.apiUrl}/<resource>`, build `HttpParams` only for defined values, and return typed Observables (`Paged<Feature>sResponse` = `{ items, pagination }`).

### Runtime API configuration

`environment.apiUrl` is `window.apiUrl`, set by `assets/env.js`. In the container, `envsubst` renders `assets/env.template.js` (`window['apiUrl'] = '${apiUrl}';`) into `env.js` at startup. The API URL is never baked in at build time; don't hardcode it.

### List pages (query-param driven)

List pages build an empty reactive form (`this.fb.group({})`) and sync it with the URL through `createQueryParamsSync` (`core/routing/query-params.utils.ts`), using the feature deserializer (built from `parseIntParam`/`parseStringParam` in `core/routing/query-params-parsers.ts`) and `resetParams: { page: DEFAULT_FIRST_PAGE, size: DEFAULT_PAGE_SIZE }`. Sorting and pagination are `computed()` from `queryParams()` via `parseSortParam` / `parsePaginationParams` (`shared/components/table/tanstack/`). The table is created with `injectTable(() => ({ features: appTableFeatures, manualSorting: true, manualPagination: true, autoResetPageIndex: false, ... }))`; `onSortingChange`/`onPaginationChange` write back through `queryParamsSync.update(...)` (sorting resets to page 0; a page-size change resets to page 0). Rendered with the shared `TableComponent` + `Paginator`. Reuse this instead of separate pagination state.

Row actions: `<feature>-table.ts` exports `build<Feature>TableColumns()` and a `<Feature>TableMeta` interface (`onView`, `onDelete`, …). The actions column renders `<feature>-table-buttons` with `flexRenderComponent`; that component reads the callbacks from the table meta via `injectFlexRenderContext`. Status cells render the shared `Chip` with `flexRenderComponent`. `onView` navigates with `router.navigate([id], { relativeTo: route })`; deletes confirm through `AlertDialogService.open(...).closed`, then show a `ToastService.success(...)`.

### Detail pages

Provide the feature store at component level, read `id` from `route.snapshot.paramMap` in the constructor and call `store.findById(id)` only if it is a positive integer (otherwise the template shows the error state, `role="alert"`). Expose `store.selectedItem` to the template. "Back" uses `Location.back()` so list filters/sort/page survive. Status enums use `Chip` + the feature `utils/` config maps (`Record<Enum, { label, variant }>`).

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
- TypeScript strict, plus `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers`.
- Prettier: `printWidth: 100`, single quotes, Angular parser for HTML; `.editorconfig`: 2-space indent, LF. ESLint includes `eslint-plugin-prettier`, so formatting issues are lint errors.

## Testing

- Specs live next to their source (`*.spec.ts`), using Vitest globals (`describe`/`it`/`expect`) and `vi` from `vitest` for mocks, with Angular `TestBed`.
- Typical setup mocks the feature service with `useValue` objects of `vi.fn(...)` returning `of(...)`, and stubs `ActivatedRoute` (e.g. a `BehaviorSubject` of `convertToParamMap(...)` for list pages, `snapshot.paramMap` for detail pages). Call `vi.clearAllMocks()` in `beforeEach`.
- Protected members are reached in tests with bracket access (`component['onViewCategory'](...)`).

## Docker

Multi-stage `Dockerfile`: `node:24-alpine` runs `npm ci` + `npm run build`; `nginx:1.31-alpine` serves `dist/e-commerce-frontend/browser` with `nginx.conf` (SPA fallback `try_files $uri $uri/ /index.html`), has a `wget` healthcheck, and renders `env.js` with `envsubst` at startup.

```bash
docker build -t e-commerce-frontend .
docker run -p 8080:80 -e apiUrl=http://your-api-host e-commerce-frontend
```

## Agent tooling

The `angular-developer` skill is vendored in both `.claude/skills/` and `.agents/skills/` (tracked by `skills-lock.json`). Where it conflicts with this file (e.g. Signal Forms), this file wins.

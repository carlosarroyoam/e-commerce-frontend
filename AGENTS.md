# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Admin/dashboard frontend for an e-commerce system, built with Angular 22 (standalone components, zoneless change detection), NgRx Signals for shared state, TanStack Table (Angular adapter) for data tables, and TailwindCSS 4.

## Commands

```bash
npm start                          # dev server at http://localhost:4200
npm run build                      # production build -> dist/e-commerce-frontend
npm run build -- --configuration development   # dev build, source maps, no optimization
npm run watch                      # build --watch (development config), no tests

npm test                           # run unit tests (Vitest via @angular/build:unit-test)
npx ng test --watch=false --include=src/app/shared/components/alert-dialog/alert-dialog.spec.ts   # single file
npx ng test --watch=false --filter="should create"                                              # filter by test name (regex)
npx ng test --watch=false --include=src/app/features/auth/                                        # single feature
# Don't call `npx vitest run` directly: it bypasses the Angular builder and can't resolve the `@/` path aliases.

npm run lint                       # ESLint over src/**/*.ts and src/**/*.html
npm run lint:fix
npm run format                     # Prettier write
npm run format:check
```

Node 24 is the target version (matches the Docker build's `node:24-alpine`).

## Architecture

### Layout

```
src/app/
  core/        cross-cutting concerns: guards, HTTP interceptors, auth store, shared constants/utils
  features/    feature areas, each self-contained: auth, dashboard, product, order, category, customer, user
  shared/      reusable UI components, directives, pipes, services, validators used across features
src/environments/   environment.ts (dev) / environment.prod.ts (prod, via angular.json fileReplacements)
src/assets/env.template.js   runtime API URL template (see below)
```

Each feature follows the same internal shape (see `features/category` as the reference implementation):

```
<feature>/
  <feature>.routes.ts              lazy-loaded route definitions
  pages/
    <feature>-list/                list page (page.ts + page.html + <feature>-table.ts column defs)
    <feature>-detail/              read-only detail page
    <feature>-form/                create/edit page (shared by `new` and `:id/edit`)
  components/                      feature-local, reusable components (e.g. <feature>-table-buttons)
  data-access/
    interfaces/                    request/response/query-param DTOs (documented with TSDoc)
    services/                      HttpClient wrappers, providedIn: 'root'
    stores/                        NgRx SignalStore: <feature>.state.ts + <feature>.store.ts
  routing/                         query-param (de)serializers for that feature
  utils/                           feature-specific display config (e.g. status enum -> Chip label/variant)
```

Each feature's `<feature>.routes.ts` declares `''` (list), `new` and `:id/edit` (form), and `:id` (detail) — keep `:id` last so it doesn't shadow `new`.

Path aliases (`tsconfig.json`): `@/*` -> `src/app/*`, `@/environments/*` -> `src/environments/*`.

### Routing & lazy loading

`app.routes.ts` is the root route table. The `''` route lazy-loads `MainLayout` and gates all children with `authGuard` via `canActivateChild`; `/auth` is gated by `guestGuard`. Every feature is wired in with `loadChildren` pointing at its `<feature>.routes.ts`, and every route-level page is itself lazy-loaded with `loadComponent`. Follow this pattern for new features rather than eagerly importing feature modules into `app.routes.ts`.

### State management

- **Local/component state**: Angular signals, `computed()` for derived values.
- **Shared/feature state**: NgRx Signals (`signalStore`, `withState`, `withMethods`, `rxMethod`). Feature stores are typically declared with `{ providedIn: undefined }` and provided at the page component level (`providers: [CategoryStore]`) rather than as app-wide singletons — check the specific store before assuming root-level scope.
- Store methods that call HTTP services use `rxMethod` + `tapResponse` to patch `isLoading` / `error` / data fields on the state (see `category.store.ts` for the canonical shape). Feature state holds `items` + `pagination` for the list (`findAll`) and `selectedItem` for the detail page (`findById`); errors go through `extractErrorMessage` (`core/utils/error.utils.ts`).
- `core/data-access/stores/auth-store` is the one genuinely global store (session restore runs via `provideAppInitializer` in `app.config.ts`).

### HTTP layer

`app.config.ts` registers interceptors in this order: `withCredentialsInterceptor` -> `xsrfInterceptor` -> `accessTokenInterceptor` -> `refreshTokenInterceptor` -> `httpErrorInterceptor`. Order matters (credentials/XSRF setup before auth token attachment, refresh before generic error handling) — respect it when adding new interceptors.

Feature HTTP services are thin `HttpClient` wrappers under `data-access/services`, injected with `inject()`, calling `${environment.apiUrl}/<resource>`.

### Runtime API configuration

`environment.apiUrl` reads from `window.apiUrl` (see `src/environments/environment.ts`), which is populated at container startup: `src/assets/env.template.js` is rendered with the `apiUrl` env var into `src/assets/env.js` and served alongside the build. This means the API URL is not baked in at build time — don't hardcode it or assume a build-time env value.

### Query-param-driven list pages

List/table pages (e.g. `category-list-page.ts`) sync an (often empty) reactive `FormGroup` with the URL query params via `createQueryParamsSync` (`core/routing/query-params.utils.ts`), using a feature-specific deserializer (`routing/<feature>-query-params.deserializer.ts`). Sorting/pagination state is derived from `queryParams()` as a signal, and TanStack Table is driven in `manualSorting`/manual-pagination mode, calling `store.findAll(queryParams)` on changes. Reuse this pattern for new paginated/sortable list pages instead of introducing separate pagination state.

Row actions are rendered by a feature-local `<feature>-table-buttons` component (via `injectFlexRenderContext`) that calls callbacks passed through the table's `meta` (e.g. `onView`, `onDelete`); the list page implements them (`onView` navigates to `:id` relative to the current route).

### Detail pages

Detail pages (e.g. `category-detail-page.ts`) provide the feature store at the component level, read `id` from `route.snapshot.paramMap` in the constructor and call `store.findById(id)` only if it's a positive integer (otherwise the template shows the error state), and expose `store.selectedItem` to the template. The "back" button uses `Location.back()` so the list's query params (filters/sort/page) are preserved. Status enums are shown with the shared `Chip` using the config maps in the feature's `utils/`.

### Formatting

Use the shared null-safe pipes in `shared/pipes` (`appCurrency`, `appDateTime`, `appPercent`, `appPhoneNumber`) instead of Angular's built-in `currency`/`date`/`percent` pipes. They delegate to `core/utils/*.utils.ts` and use `DEFAULT_LOCALE` (`es-MX`) / `DEFAULT_CURRENCY` (`MXN`) from `core/constants/locale.constants.ts`; they return `null` for `null`/`undefined` input.

### i18n

`angular.json` sets `i18n.sourceLocale: "es"` — UI copy/strings default to Spanish source locale conventions.

## Code conventions

Full rules live in `AGENTS.md` — read it before structural changes. Key points:

- Standalone components only, no NgModules. Do **not** set `standalone: true` explicitly (it's the default). Every component in the codebase sets `changeDetection: ChangeDetectionStrategy.OnPush` explicitly (e.g. `category-list-page.ts`) — do the same in new components.
- Use `input()`/`output()` functions, not decorators; `inject()`, not constructor injection.
- Use native control flow (`@if`/`@for`/`@switch`) in templates, not `*ngIf`/`*ngFor`; `class`/`style` bindings, not `ngClass`/`ngStyle`.
- Prefer Reactive Forms; use Signal Forms (`@angular/forms/signals`) for new forms where applicable.
- Do not use `@HostBinding`/`@HostListener` — use the `host` object in the decorator instead.
- Signals: use `update()`/`set()`, never `mutate()`.
- `NgOptimizedImage` for static images (not inline base64).
- Must pass AXE checks and meet WCAG AA (focus management, color contrast, ARIA).
- TypeScript strict mode is on, including `noImplicitReturns`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`, `noFallthroughCasesInSwitch`.
- Styling uses TailwindCSS 4 plus `class-variance-authority` (`cva`) and `tailwind-merge` (`twMerge`) for variant-based component styles; Prettier is configured with `prettier-plugin-tailwindcss` to sort classes, including inside `cva`/`twMerge` calls.
- When a component uses external template/style files, reference them with paths relative to the component's `.ts` file.
- Classes, public/protected methods and DTO interfaces are documented with TSDoc written in Spanish (match the existing comments).
- Icons come from `@lucide/angular` (import the individual `Lucide*` components).

## Docker

Multi-stage build: `node:24-alpine` builder, `nginx:1.31-alpine` runtime. `docker run -p 8080:80 -e apiUrl=http://your-api-host e-commerce-frontend` — the `apiUrl` env var is injected into `env.js` at container startup (see Runtime API configuration above).

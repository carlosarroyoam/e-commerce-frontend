# e-commerce-frontend

Frontend for an e-commerce admin/dashboard built with Angular 21 standalone components, Signals, NgRx Signals, and TailwindCSS 4.

## Overview

This project uses a modern Angular setup focused on:

- standalone components instead of NgModules
- Angular Signals for local reactive state
- NgRx Signals for shared application state
- TailwindCSS 4 for styling
- Vitest for unit tests
- ESLint and Prettier for code quality

The app is configured for `es-MX`, targets `ES2022`, and uses strict TypeScript and strict Angular template checks.

## Tech Stack

- Angular 21
- TypeScript 5
- NgRx Signals
- TailwindCSS 4
- Vitest
- ESLint
- Prettier
- Nginx + Docker for containerized deployment

## Prerequisites

- Node.js 20 recommended
- npm 10 recommended

The repository includes a Docker build based on `node:20-alpine`, so using Node 20 locally will keep behavior aligned with CI/container builds.

## Getting Started

1. Install dependencies:

```bash
npm ci
```

2. Start the development server:

```bash
npm start
```

3. Open [http://localhost:4200](http://localhost:4200).

Angular serve runs in development mode by default and reloads on source changes.

## Available Scripts

### Development

```bash
npm start
```

Starts the Angular dev server at `http://localhost:4200`.

```bash
npm run watch
```

Runs a development build in watch mode. This is useful for incremental builds, but it does not run tests.

### Build

```bash
npm run build
```

Creates a production build in `dist/e-commerce-frontend`.

```bash
npm run build -- --configuration development
```

Creates a development build with source maps and reduced optimization.

### Tests

```bash
npm test
```

Runs the test suite through Angular's unit test builder.

```bash
ng test --watch
```

Runs tests in watch mode.

```bash
ng test --watch=false --browsers=ChromeHeadless
```

Runs tests once in headless mode.

#### Run specific tests

```bash
npx vitest run src/app/shared/components/alert-dialog/alert-dialog.spec.ts
```

```bash
npx vitest run -t "should create"
```

```bash
npx vitest run src/app/features/auth/
```

### Linting and Formatting

```bash
npm run lint
```

Runs ESLint on all `src/**/*.ts` and `src/**/*.html` files.

```bash
npm run lint:fix
```

Runs ESLint with automatic fixes where possible.

```bash
npm run format:check
```

Checks formatting with Prettier.

```bash
npm run format
```

Formats the repository with Prettier.

## Project Structure

```text
src/
  app/
    core/        cross-cutting application concerns
    features/    feature areas such as auth, dashboard, product, order, category, user
    shared/      reusable UI, utilities, directives, and shared components
  assets/        static assets and runtime environment template
  environments/  Angular environment files
```

Current feature areas include:

- `auth`
- `dashboard`
- `product`
- `order`
- `category`
- `user`

## Architecture Notes

- Standalone components only. No NgModules.
- `ChangeDetectionStrategy.OnPush` is the default component pattern in this codebase.
- Path aliases are available:
  - `@/*` -> `src/app/*`
  - `@/environments/*` -> `src/environments/*`
- State is split between Angular Signals for component-local concerns and NgRx Signals stores under `core/data-access` or feature data-access folders.
- TypeScript strict mode is enabled, including `noImplicitReturns` and `noPropertyAccessFromIndexSignature`.

## Runtime Environment Configuration

The app exposes a runtime-configured API URL through:

```text
src/assets/env.template.js
```

The template currently expects:

```js
window['apiUrl'] = '${apiUrl}';
```

For container deployment, the startup command replaces `${apiUrl}` with an environment variable value and writes the result to `src/assets/env.js` inside the served build.

## Docker

The repository includes a multi-stage Docker build:

- build stage with `node:20-alpine`
- runtime stage with `nginx:1.27.2-alpine`

Build the image:

```bash
docker build -t e-commerce-frontend .
```

Run the container with runtime API configuration:

```bash
docker run -p 8080:80 -e apiUrl=http://your-api-host e-commerce-frontend
```

Then open `http://localhost:8080`.

## Code Style

This repository follows the conventions documented in [AGENTS.md](./AGENTS.md), including:

- file naming such as `name.ts` for components
- standalone Angular component structure
- import ordering rules
- Tailwind + `class-variance-authority` usage patterns
- Vitest testing conventions

If you are contributing, read `AGENTS.md` before making structural changes.

## Useful References

- [AGENTS.md](./AGENTS.md) for repository-specific coding rules
- [angular.json](./angular.json) for build, serve, test, and localization configuration
- [Dockerfile](./Dockerfile) for deployment packaging details

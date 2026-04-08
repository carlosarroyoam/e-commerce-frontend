# AGENTS.md - Agentic Coding Guidelines

This file provides guidelines for agentic coding agents working in this repository.

## Project Overview

This is an Angular 21 standalone components application using:

- Angular Signals and NgRx Signals for state management
- TailwindCSS 4.x for styling
- Vitest for testing (not Karma/Jasmine)
- ESLint + Prettier for linting/formatting

## Build, Lint, and Test Commands

### Development

```bash
npm start            # Start dev server at http://localhost:4200
npm run watch        # Watch mode build for development
```

### Build

```bash
npm run build        # Production build (output: dist/e-commerce-frontend)
npm run build -- --configuration development  # Development build
```

### Linting & Formatting

```bash
npm run lint         # Run ESLint on all .ts and .html files
npm run lint:fix     # Run ESLint with auto-fix
npm run format:check # Check Prettier formatting
npm run format       # Fix Prettier formatting
```

### Testing

```bash
npm test             # Run all tests once
ng test --watch     # Watch mode (terminal stays open)
ng test --watch=false --browsers=ChromeHeadless  # Single run, headless
```

**Running a single test file:**

```bash
npx vitest run src/app/shared/components/alert-dialog/alert-dialog.spec.ts
```

**Running tests matching a pattern:**

```bash
npx vitest run -t "should create"
```

**Running tests in a specific directory:**

```bash
npx vitest run src/app/features/auth/
```

## Code Style Guidelines

### File Naming Conventions

- Components/Directives/Pipes: `name.ts` (NOT `name.component.ts`)
- Spec files: `name.spec.ts`
- Interfaces: `name.interfaces.ts` (in `interfaces/` subfolder)
- Services: `name.service.ts` (in `services/` subfolder)
- Stores: `name.store.ts` (in `stores/` subfolder)

### Component Structure

```typescript
@Component({
  selector: "app-example",
  imports: [
    /* standalone imports */
  ],
  templateUrl: "./example.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Example {
  /* class members */
}
```

### Import Organization (Order matters!)

1. Angular core imports (`@angular/*`)
2. Angular common imports (`CommonModule`, etc.)
3. Third-party library imports
4. Internal app imports (use path aliases)

```typescript
// Correct import order
import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { SomeLibrary } from "some-library";

import { AuthStore } from "@/core/data-access/stores/auth-store/auth.store";
import { Button } from "@/shared/components/ui/button/button";
import { MyService } from "@feature/user/services/my-service";
import { MyComponent } from "@feature/user/my-component";
```

### Path Aliases

Use these path aliases (defined in tsconfig.json):

- `@/*` maps to `src/app/*`
- `@/environments/*` maps to `src/environments/*`

Example: `import { AuthStore } from '@/core/data-access/stores/auth-store/auth.store';`

### Naming Conventions

- **Components/Directives**: `PascalCase` (e.g., `AlertDialog`, `AppButton`)
- **Selectors**: kebab-case with `app` prefix (e.g., `app-alert-dialog`, `button[appButton]`)
- **Variables/Methods**: `camelCase` (e.g., `isLoading`, `getUserById`)
- **Constants**: `PascalCase` with meaningful names (e.g., `API_AUTH_ROUTES`)
- **Interfaces**: `PascalCase` ending with `Interface` or descriptive (e.g., `AlertDialogData`)

### TypeScript Strict Mode

This project uses strict TypeScript mode. Follow these rules:

- Enable `strict: true` in tsconfig.json
- Use explicit types, avoid `any`
- Use `noPropertyAccessFromIndexSignature: true` - always use proper types
- Use `noImplicitReturns: true` - all code paths must return values

### State Management

- Use NgRx Signals for global state (in `core/data-access/stores/`)
- Use Angular Signals for local component state
- Use `computed()` for derived state
- Use `effect()` for side effects (navigation, etc.)

### Testing Patterns

- Use Vitest with `describe`, `it`, `beforeEach`
- Use `vi.fn()` for mocks (from 'vitest')
- Use TestBed for component testing
- Use `ComponentFixture` and `detectChanges()`

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { vi } from "vitest";

describe("ComponentName", () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentName],
      providers: [{ provide: SomeService, useValue: vi.fn() }],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
```

### CSS/Styling

- Use TailwindCSS 4.x (with `@theme` and `@utility` directives)
- Use `class-variance-authority` (cva) + `tailwind-merge` (twMerge) for component variants
- Avoid global styles; use component-scoped styles

```typescript
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export const buttonVariants = cva("base classes", {
  variants: {
    variant: { default: "...", secondary: "..." },
    size: { default: "...", sm: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});
```

### Editor Settings

- 2-space indentation
- Single quotes for TypeScript
- UTF-8 charset
- Trim trailing whitespace
- Insert final newline

Configured in `.editorconfig` - ensure your editor respects these settings.

## Additional Notes

- Angular version: 21.x (standalone components only, no NgModules)
- Target: ES2022
- Localization: es-MX (configured in angular.json)
- Use `ChangeDetectionStrategy.OnPush` for all components

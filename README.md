# e-commerce-frontend

Angular 21 e-commerce frontend application with standalone components, Signals, NgRx Signals, and TailwindCSS 4.x.

## Tech Stack

- **Angular 21** with standalone components
- **NgRx Signals** for state management
- **TailwindCSS 4.x** for styling
- **Vitest** for unit testing
- **ESLint + Prettier** for linting/formatting

## Prerequisites

- Node.js 18+
- npm 9+

## Development server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

## Build

```bash
npm run build              # Production build
npm run build -- --configuration development  # Development build
```

Build artifacts are stored in `dist/e-commerce-frontend`.

## Testing

```bash
npm test             # Run all tests
npm run watch        # Watch mode (terminal stays open)
```

### Running specific tests

```bash
# Single file
npx vitest run src/app/shared/components/alert-dialog/alert-dialog.spec.ts

# By pattern
npx vitest run -t "should create"

# Directory
npx vitest run src/app/features/auth/
```

## Linting & Formatting

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Fix Prettier formatting
npm run format:check # Check Prettier formatting
```

## Code Generation

```bash
ng generate component component-name
ng generate directive|pipe|service|class|guard|interface|enum
```

## Project Structure

```
src/app/
├── core/           # Core features (guards, interceptors, services)
├── features/       # Feature modules (auth, product, order, etc.)
└── shared/         # Shared components, directives, pipes, services
```

## Additional Documentation

- [AGENTS.md](./AGENTS.md) - Coding guidelines for AI agents

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern Vue 3.5 component library template built with Turborepo monorepo architecture. The project provides a complete development environment for building enterprise-level component libraries with TypeScript 5+, comprehensive linting configurations, and automated workflows.

**Key Technologies**: Turborepo, Vue 3.5+, TypeScript 5+, Vite 6, Rollup, Pnpm, VitePress

## Essential Commands

### Development

```bash
# Start all packages in development mode
pnpm dev

# Start documentation site (VitePress)
pnpm dev:docs

# Start playground for testing components
pnpm dev:play
```

### Building

```bash
# Build all packages (via Turbo)
pnpm build

# Build documentation site
pnpm build:docs

# Unified build via Gulp (alternative approach)
pnpm build:gulp
```

### Testing & Quality

```bash
# Run all linters
pnpm lint:all

# Run individual linters
pnpm lint:eslint    # Fix ESLint issues
pnpm lint:format    # Format with Prettier
pnpm lint:style     # Fix Stylelint issues
```

### Package Management

```bash
# Clean all build artifacts and dependencies
pnpm clean

# Update all dependencies to latest
pnpm deps:update

# Check for outdated dependencies
pnpm deps:check
```

### Publishing

```bash
# Create changeset and version bump
pnpm changeset:version

# Publish packages (runs build first)
pnpm publish
```

### Utility

```bash
# Rename package scope (e.g., @DLib to @myorg)
pnpm rename-pkg:mac
```

## Project Architecture

### Monorepo Structure

The project uses **pnpm workspaces** with **Turborepo** for task orchestration:

- **`packages/ui`**: Main UI component library (dlib-ui)
  - Built with Vite
  - Components prefixed with `Common*` (e.g., CommonButton, CommonTable)
  - Includes custom unplugin-vue-components resolver for auto-import
  - Outputs: ESM (`dist/esm/`), CJS (`dist/cjs/`), Types (`dist/types/`)

- **`packages/hooks`**: Vue 3 composables library (dlib-hooks)
  - Built with Rollup
  - Exports reusable Vue composition functions

- **`packages/directives`**: Vue 3 directives library (dlib-directives)
  - Built with Rollup
  - Custom Vue directives (e.g., v-focus)

- **`packages/utils`**: Utility functions library (dlib-utils)
  - Built with Rollup
  - Framework-agnostic utilities (string, array, cache, async, etc.)

- **`packages/lint-configs/*`**: Shared configuration packages
  - `commitlint-config`: Commit message conventions
  - `eslint-config`: ESLint rules for Vue 3 + TypeScript
  - `prettier-config`: Code formatting rules
  - `stylelint-config`: CSS/SCSS linting rules
  - `typescript-config`: TypeScript compiler configurations

- **`apps/docs`**: VitePress documentation site (@DLib/docs)
  - Internationalized (Chinese root, English /en)
  - Uses vitepress-demo-plugin for interactive component demos

- **`playground`**: Development playground (@DLib/playground)
  - Vite-based app for testing components during development

- **`build`**: Unified build scripts (Gulp + Rollup)
  - Alternative packaging approach to individual package builds
  - Orchestrates building all packages with shared configuration

### Build System Details

The project supports **two build approaches**:

1. **Individual Package Builds** (default via `pnpm build`)
   - Each package has its own build script
   - UI package uses Vite with `preserveModules: true`
   - Other packages use Rollup with dedicated configs
   - Orchestrated by Turbo with dependency graph resolution

2. **Unified Build** (via `pnpm build:gulp`)
   - Centralized Gulp tasks in `build/gulpfile.js`
   - Shared Rollup configurations in `build/rollup.*.config.js`
   - Useful for consistent cross-package builds

### Component Naming Convention

All UI components follow the `Common*` prefix pattern:

- `CommonButton`, `CommonTable`, `CommonForm`, etc.
- This enables the custom resolver to auto-import components
- See `packages/ui/src/resolver.ts` for resolver implementation

### Package Exports

All packages export both ESM and CJS formats:

```json
{
  "main": "dist/cjs/index.js", // CommonJS
  "module": "dist/esm/index.mjs", // ES Module
  "types": "dist/types/index.d.ts" // TypeScript definitions
}
```

## Development Workflow

### Adding a New Component

1. Create component directory in `packages/ui/src/components/YourComponent/`
2. Add component implementation and styles
3. Export from `packages/ui/src/components/index.ts`
4. Add to install array in `packages/ui/src/index.ts`
5. Document in `apps/docs/` (both `zh/` and `en/` directories)
6. Test in `playground/`

### Version Management

This project uses **Changesets** for version management:

1. After making changes, run `pnpm changeset` to create a changeset
2. Run `pnpm changeset version` to consume changesets and bump versions
3. Changesets config excludes `@DLib/build`, `@DLib/playground`, `@DLib/docs` from versioning

### Git Hooks

- **pre-commit**: Runs `lint-staged` (see `.lintstagedrc.mjs`)
  - Auto-formats and lints staged files
  - Fixes ESLint/Stylelint issues automatically

- **commit-msg**: Validates commit messages with Commitlint
  - Follows conventional commits format
  - Config in `packages/lint-configs/commitlint-config/`

### Important Notes

- **Package manager**: This project enforces **pnpm** via preinstall hook
- **Node version**: Requires Node.js >= 18
- **Pnpm version**: Requires pnpm >= 9.5
- **Catalog versions**: Dependencies use pnpm catalog for centralized version management (see `pnpm-workspace.yaml`)
- **Postinstall**: Automatically runs `turbo run build` after `pnpm install` to ensure all packages are built

### Working with Dependencies

When adding dependencies to a specific package:

```bash
# Install to specific workspace
pnpm -F dlib-ui add some-package

# Install dev dependency
pnpm -F dlib-ui add -D some-package

# Install to all packages
pnpm add -w some-package
```

### Turbo Task Dependencies

Turbo automatically handles build order based on the dependency graph defined in `turbo.json`:

- `build` tasks depend on dependent packages' builds (`dependsOn: ["^build"]`)
- `dev` tasks run persistently without caching
- Build outputs are cached in `.turbo/` directory

## Documentation Site

The VitePress docs site (`apps/docs/`) features:

- **Internationalization**: Root locale (中文) and `/en` for English
- **Interactive demos**: Uses `vitepress-demo-plugin` to embed live component examples
- **Auto-import**: Components auto-imported via `unplugin-vue-components` with custom resolver

To add documentation for a new component:

1. Create markdown file in `apps/docs/zh/packages/ui/YourComponent/index.md`
2. Create English version in `apps/docs/en/packages/ui/YourComponent/index.md`
3. Update sidebar configuration in `apps/docs/.vitepress/config/`

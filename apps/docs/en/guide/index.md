# Quick Start

## Introduction

DLib-template is a component library and toolkit template project based on Vue3, consisting of the following parts:

- UI Component Library: Provides commonly used UI components
- Utility Functions: Offers common utility functions
- Hooks: Provides reusable composable functions
- Directives: Offers commonly used directives

## Installation

Install using a package manager:

::: code-group

```bash [npm]
npm install @DLib/ui @DLib/utils @DLib/hooks @DLib/directives
```

```bash [yarn]
yarn add @DLib/ui @DLib/utils @DLib/hooks @DLib/directives
```

```bash [pnpm]
pnpm add @DLib/ui @DLib/utils @DLib/hooks @DLib/directives
```

```bash [bun]
bun add @DLib/ui @DLib/utils @DLib/hooks @DLib/directives
```

:::

## Usage

### UI Components

```ts
// Global import
import { createApp } from 'vue';
import UI from '@DLib/ui';
import '@DLib/ui/style.css';
const app = createApp(App);
app.use(UI);
// Additionally, add the following configuration to tsconfig.json for type hints:
// "types": ["@DLib/ui/global.d.ts"]

// Import on demand
import { Button } from '@DLib/ui';
import '@DLib/ui/style.css';
const app = createApp(App);
app.use(Button);
```

### Utility Functions

```ts
import { isString } from '@DLib/utils';
console.log(isString('hello')); // true
```

### Hooks

```ts
import { useCounter } from '@DLib/hooks';
const { count, increment, decrement } = useCounter();
```

### Directives

```ts
import { vFocus } from '@DLib/directives';
// Global import
app.directive('focus', vFocus);

// Import on demand
import { vFocus } from '@DLib/directives';
app.directive('focus', vFocus);
```

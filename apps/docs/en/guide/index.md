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
npm install dlib-ui dlib-utils dlib-hooks dlib-directives
```

```bash [yarn]
yarn add dlib-ui dlib-utils dlib-hooks dlib-directives
```

```bash [pnpm]
pnpm add dlib-ui dlib-utils dlib-hooks dlib-directives
```

```bash [bun]
bun add dlib-ui dlib-utils dlib-hooks dlib-directives
```

:::

## Usage

### UI Components

```ts
// Global import
import { createApp } from 'vue';
import UI from 'dlib-ui';
import 'dlib-ui/style.css';
const app = createApp(App);
app.use(UI);
// Additionally, add the following configuration to tsconfig.json for type hints:
// "types": ["dlib-ui/global.d.ts"]

// Import on demand
import { Button } from 'dlib-ui';
import 'dlib-ui/style.css';
const app = createApp(App);
app.use(Button);
```

### Utility Functions

```ts
import { isString } from 'dlib-utils';
console.log(isString('hello')); // true
```

### Hooks

```ts
import { useCounter } from 'dlib-hooks';
const { count, increment, decrement } = useCounter();
```

### Directives

```ts
import { vFocus } from 'dlib-directives';
// Global import
app.directive('focus', vFocus);

// Import on demand
import { vFocus } from 'dlib-directives';
app.directive('focus', vFocus);
```

# 快速开始

## 介绍

DLib 是一个基于 Vue3、elementPlus 的组件库和工具集项目，包含以下几个部分：

- UI 组件库：提供常用的 UI 组件，包含动态组件
- 工具函数：提供常用的工具函数
- Hooks：提供可复用的组合式函数
- Directives：提供常用的指令

## 安装

使用包管理器安装：

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

## 使用

### UI 组件

> 三种导入方式

```ts
// 全局引入
import { createApp } from 'vue';
import UI from 'dlib-ui';
import 'dlib-ui/style.css';
const app = createApp(App);
app.use(UI);

// 按需引入
import { Button } from 'dlib-ui';
import 'dlib-ui/style.css';
const app = createApp(App);
app.use(Button);

//unplugin-vue-components方式
import { dUIResolver } from 'dlib-ui';
//vite中配置使用ComponentResolver()
// Components({
//   resolvers: [dUIResolver()],
// })
//可能还需要在d.ts中添加下面引用
/// <reference types="dlib-ui/dist/types/index.d.ts" />
```

### 工具函数

```ts
import { isString } from 'dlib-utils';
console.log(isString('hello')); // true
```

### Hooks

```ts
import { useCounter } from 'dlib-hooks';
const { count, increment, decrement } = useCounter();
```

### 指令

```ts
import { vFocus } from 'dlib-directives';
// 全局引入
app.directive('focus', vFocus);

// 按需引入
import { vFocus } from 'dlib-directives';
app.directive('focus', vFocus);
```

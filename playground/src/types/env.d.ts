/// <reference types="vite/client" />
/// <reference types="dlib-ui/global.d.ts" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'DLib/ui' {
  export * from 'dlib-ui';
}

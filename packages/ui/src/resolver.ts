// src/resolver.ts
import type { ComponentResolver } from 'unplugin-vue-components';

export interface dUIResolverOptions {
  /**
   * 是否自动导入组件样式
   * @default true
   */
  importStyle?: boolean;
}

export function dUIResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith('Common')) {
        return {
          name: name,
          from: 'dlib-ui',
          sideEffects: undefined,
        };
      } else {
        return undefined;
      }
    },
  };
}

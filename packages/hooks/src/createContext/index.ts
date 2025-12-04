import type { InjectionKey } from 'vue';
import { inject, provide } from 'vue';

/**
 * 创建类型安全的 Vue provide/inject 上下文
 *
 * @example
 * ```ts
 * // 定义 context 类型
 * interface UserContext {
 *   name: string;
 *   age: number;
 * }
 *
 * const [injectUser, provideUser] = createContext<UserContext>('UserProvider');
 *
 * // 在父组件中提供 context
 * provideUser({ name: 'Alice', age: 30 });
 *
 * // 在子组件中注入 context
 * const user = injectUser(); // { name: 'Alice', age: 30 }
 *
 * // 带 fallback 默认值
 * const user = injectUser({ name: 'Guest', age: 0 });
 * ```
 *
 * @template ContextValue - Context 值的类型
 * @param providerComponentName - Provider 组件名称，用于错误提示（支持单个或多个组件名）
 * @param contextName - 可选的自定义 context 名称，用于 Symbol description
 * @returns 返回 [injectContext, provideContext] 元组
 */
export function createContext<ContextValue>(
  providerComponentName: string | string[],
  contextName?: string,
) {
  const symbolDescription =
    typeof providerComponentName === 'string' && !contextName
      ? `${providerComponentName}Context`
      : contextName;

  const injectionKey: InjectionKey<ContextValue | null> = Symbol(symbolDescription);

  /**
   * 注入 context 值
   *
   * @template T - Fallback 值的类型
   * @param fallback - 可选的默认值，当 context 不存在时使用
   * @returns Context 值
   * @throws 如果未提供 fallback 且 context 不存在，则抛出错误
   */
  const injectContext = <T extends ContextValue | null | undefined = ContextValue>(
    fallback?: T,
  ): T extends null ? ContextValue | null : ContextValue => {
    const context = inject(injectionKey, fallback);
    if (context) return context;

    if (context === null) return context as any;

    throw new Error(
      `Injection \`${injectionKey.toString()}\` not found. Component must be used within ${
        Array.isArray(providerComponentName)
          ? `one of the following components: ${providerComponentName.join(', ')}`
          : `\`${providerComponentName}\``
      }`,
    );
  };

  /**
   * 提供 context 值
   *
   * @param contextValue - 要提供的 context 值
   * @returns 返回提供的 context 值
   */
  const provideContext = (contextValue: ContextValue) => {
    provide(injectionKey, contextValue);
    return contextValue;
  };

  return [injectContext, provideContext] as const;
}

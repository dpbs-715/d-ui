import { describe, expect, it } from 'vitest';
import { createContext } from '../index';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';

describe('createContext', () => {
  interface TestContext {
    name: string;
    age: number;
  }

  it('should provide and inject context', () => {
    const [injectTest, provideTest] = createContext<TestContext>('TestProvider');

    const Provider = defineComponent({
      setup() {
        provideTest({ name: 'Alice', age: 30 });
        return () => h('div', [h(Consumer)]);
      },
    });

    const Consumer = defineComponent({
      setup() {
        const context = injectTest();
        expect(context).toEqual({ name: 'Alice', age: 30 });
        return () => h('div', context.name);
      },
    });

    mount(Provider);
  });

  it('should use fallback value when context not provided', () => {
    const [injectTest] = createContext<TestContext>('TestProvider');

    const Consumer = defineComponent({
      setup() {
        const context = injectTest({ name: 'Guest', age: 0 });
        expect(context).toEqual({ name: 'Guest', age: 0 });
        return () => h('div', context.name);
      },
    });

    mount(Consumer);
  });

  it('should throw error when context not provided and no fallback', () => {
    const [injectTest] = createContext<TestContext>('TestProvider');

    const Consumer = defineComponent({
      setup() {
        expect(() => injectTest()).toThrow(
          'Injection `Symbol(TestProviderContext)` not found. Component must be used within `TestProvider`',
        );
        return () => h('div', 'test');
      },
    });

    mount(Consumer);
  });

  it('should handle array of provider names in error message', () => {
    const [injectTest] = createContext<TestContext>(['Provider1', 'Provider2']);

    const Consumer = defineComponent({
      setup() {
        expect(() => injectTest()).toThrow(
          'not found. Component must be used within one of the following components: Provider1, Provider2',
        );
        return () => h('div', 'test');
      },
    });

    mount(Consumer);
  });

  it('should use custom context name', () => {
    const [injectTest] = createContext<TestContext>('TestProvider', 'CustomContext');

    const Consumer = defineComponent({
      setup() {
        expect(() => injectTest()).toThrow('Symbol(CustomContext)');
        return () => h('div', 'test');
      },
    });

    mount(Consumer);
  });

  it('should handle null fallback', () => {
    const [injectTest] = createContext<TestContext>('TestProvider');

    const Consumer = defineComponent({
      setup() {
        const context = injectTest(null);
        expect(context).toBeNull();
        return () => h('div', 'test');
      },
    });

    mount(Consumer);
  });

  it('should share context between nested components', () => {
    const [injectTest, provideTest] = createContext<TestContext>('TestProvider');

    let nestedContext: TestContext | null = null;

    const NestedConsumer = defineComponent({
      setup() {
        nestedContext = injectTest();
        return () => h('div', 'nested');
      },
    });

    const Consumer = defineComponent({
      setup() {
        const context = injectTest();
        return () => h('div', [h(NestedConsumer)]);
      },
    });

    const Provider = defineComponent({
      setup() {
        provideTest({ name: 'Shared', age: 25 });
        return () => h('div', [h(Consumer)]);
      },
    });

    mount(Provider);
    expect(nestedContext).toEqual({ name: 'Shared', age: 25 });
  });

  it('should return provided value from provideContext', () => {
    const [, provideTest] = createContext<TestContext>('TestProvider');

    const Provider = defineComponent({
      setup() {
        const provided = provideTest({ name: 'Bob', age: 35 });
        expect(provided).toEqual({ name: 'Bob', age: 35 });
        return () => h('div', 'provider');
      },
    });

    mount(Provider);
  });
});

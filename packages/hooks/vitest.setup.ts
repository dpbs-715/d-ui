import { beforeAll } from 'vitest';

beforeAll(() => {
  // 抑制 Vue 在测试环境中的预期警告
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const message = args[0];

    // 抑制 onUnmounted 警告（在测试中直接调用 hooks 时是预期的）
    if (
      typeof message === 'string' &&
      message.includes('onUnmounted is called when there is no active component instance')
    ) {
      return;
    }

    // 抑制 Component is missing template 警告（某些测试场景下是预期的）
    if (
      typeof message === 'string' &&
      message.includes('Component is missing template or render function')
    ) {
      return;
    }

    originalWarn.apply(console, args);
  };
});

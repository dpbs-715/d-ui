import { beforeAll, vi } from 'vitest';
import { config } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import defaultComponentProps from './src/components/CreateComponent/src/defaultComponentProps';

// Mock componentDefaultPropsMap globally to prevent initialization errors
vi.mock('./src/components/CreateComponent/src/defaultMap', () => ({
  componentDefaultEventsMap: {},
  componentDefaultPropsMap: defaultComponentProps,
  componentDefaultSlotsMap: {},
  commonKeysMap: {
    page: 'pageNo',
    size: 'pageSize',
    total: 'total',
    list: 'list',
    defaultSize: 10,
  },
}));

beforeAll(() => {
  // 全局注册 Element Plus
  config.global.plugins = [ElementPlus];

  // 抑制 Vue 在测试环境中的预期警告
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const message = args[0];

    // 抑制常见的测试环境警告
    if (typeof message === 'string') {
      if (
        message.includes('Component is missing template') ||
        message.includes('Failed to resolve component') ||
        message.includes('Invalid prop') ||
        message.includes('Vue received a Component that was made a reactive object')
      ) {
        return;
      }
    }

    originalWarn.apply(console, args);
  };
});

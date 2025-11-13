import { defineConfig } from 'vitepress';

export const en = defineConfig({
  lang: 'en-US',
  title: 'Library Doc',
  description: 'A Vue3-based Component Library and Utility Collection',
  themeConfig: {
    logo: '/logo.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      // { text: 'Others', link: '/markdown-examples' },
      {
        text: 'More',
        items: [
          {
            text: 'Changelog',
            link: 'https://github.com/dpbs-715/d-ui/blob/master/CHANGELOG.md',
          },
          // {
          //   text: 'Contribute',
          //   link: '',
          // },
        ],
      },
    ],
    sidebar: [
      {
        text: 'Quick Start',
        items: [{ text: 'Introduction', link: '/guide/index' }],
      },
      {
        text: 'Usage Examples',
        items: [{ text: 'Example', link: '/useDemo/index' }],
      },
      {
        text: 'Basic',
        items: [{ text: 'Color', link: '/basic/index' }],
      },
      {
        text: 'Components (dlib-ui)',
        items: [
          { text: 'Button', link: 'en/packages/ui/button/index' },
          { text: 'Dialog', link: 'en/packages/ui/dialog/index' },
          { text: 'CreateComponent', link: 'en/packages/ui/CreateComponent/index' },
          { text: 'Form', link: 'en/packages/ui/Form/index' },
          { text: 'Search', link: 'en/packages/ui/Search/index' },
          { text: 'Table', link: 'en/packages/ui/Table/index' },
          {
            text: 'TableFieldsConfig',
            link: 'en/packages/ui/TableFieldsConfig/index',
          },
          { text: 'Pagination', link: 'en/packages/ui/Pagination/index' },
          { text: 'TableLayout', link: 'en/packages/ui/TableLayout/index' },
          { text: 'Select', link: 'en/packages/ui/Select/index' },
          { text: 'SelectOrDialog', link: 'en/packages/ui/SelectOrDialog/index' },
          { text: 'Descriptions', link: 'en/packages/ui/Descriptions/index' },
        ],
      },
      {
        text: 'Hooks (dlib-hooks)',
        items: [
          { text: 'useCounter', link: 'en/packages/hooks/useCounter/index' },
          { text: 'useRefCollect', link: 'en/packages/hooks/useRefCollect/index' },
          { text: 'useConfigs', link: 'en/packages/hooks/useConfigs/index' },
          { text: 'useMixConfig', link: 'en/packages/hooks/useMixConfig/index' },
          { text: 'useRepeatConfig', link: 'en/packages/hooks/useRepeatConfig/index' },
        ],
      },
      {
        text: 'Directives (dlib-directives)',
        items: [{ text: 'vFocus', link: 'en/packages/directives/vFocus/index' }],
      },
      {
        text: 'Utilities (dlib-utils)',
        items: [
          { text: 'String Utilities', link: 'en/packages/utils/string/index' },
          { text: 'Array Utilities', link: 'en/packages/utils/array/index' },
          { text: 'Type Checking Utilities', link: 'en/packages/utils/is/index' },
          { text: 'Async Task Wrapper', link: 'en/packages/utils/async/index' },
          { text: 'Cache Utilities', link: 'en/packages/utils/cache/index' },
          { text: 'Clone Utilities', link: 'en/packages/utils/clone/index' },
        ],
      },
    ],
  },
});

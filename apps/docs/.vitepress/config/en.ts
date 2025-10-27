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
        items: [{ text: 'Introduction', link: '/en/guide/' }],
      },
      {
        text: 'Components (dlib-ui)',
        items: [
          { text: 'Button', link: '/en/packages/ui/button/' },
          { text: 'Dialog', link: '/en/packages/ui/dialog/' },
          { text: 'CreateComponent', link: '/en/packages/ui/CreateComponent/' },
          { text: 'Form', link: '/en/packages/ui/Form/' },
          { text: 'Search', link: '/en/packages/ui/Search/' },
          { text: 'Table', link: '/en/packages/ui/Table/' },
          {
            text: 'TableFieldsConfig',
            link: '/en/packages/ui/TableFieldsConfig/',
          },
          { text: 'Pagination', link: '/en/packages/ui/Pagination/' },
          { text: 'TableLayout', link: '/en/packages/ui/TableLayout/' },
          { text: 'Select', link: '/en/packages/ui/Select/' },
          { text: 'SelectOrDialog', link: '/en/packages/ui/SelectOrDialog/' },
          { text: 'Descriptions', link: '/en/packages/ui/Descriptions/' },
        ],
      },
      {
        text: 'Hooks (dlib-hooks)',
        items: [{ text: 'useCounter', link: '/en/packages/hooks/useCounter/' }],
      },
      {
        text: 'Directives (dlib-directives)',
        items: [{ text: 'vFocus', link: '/en/packages/directives/vFocus/' }],
      },
      {
        text: 'Utilities (dlib-utils)',
        items: [{ text: 'String Utilities', link: '/en/packages/utils/string/' }],
      },
    ],
  },
});

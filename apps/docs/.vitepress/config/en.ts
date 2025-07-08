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
        items: [{ text: 'Introduction', link: 'en/guide/index' }],
      },
      {
        text: 'Components (dlib-ui)',
        items: [{ text: 'Button', link: 'en/packages/ui/button' }],
      },
      {
        text: 'Hooks (dlib-hooks)',
        items: [{ text: 'useCounter', link: 'en/packages/hooks/useCounter' }],
      },
      {
        text: 'Directives (dlib-directives)',
        items: [{ text: 'vFocus', link: 'en/packages/directives/vFocus' }],
      },
      {
        text: 'Utilities (dlib-utils)',
        items: [{ text: 'String Utils', link: 'en/packages/utils/string' }],
      },
    ],
  },
});

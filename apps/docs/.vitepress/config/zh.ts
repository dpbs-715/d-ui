import { defineConfig } from 'vitepress';

export const zh = defineConfig({
  lang: 'zh-Hans',
  title: '组件库文档',
  description: '一个基于 Vue3 的组件库和工具集',
  themeConfig: {
    logo: '/logo.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      // { text: '其他', link: '/markdown-examples' },
      {
        text: '更多',
        items: [
          {
            text: '更新日志',
            link: 'https://github.com/dpbs-715/d-ui/-/blob/main/CHANGELOG.md',
          },
          // {
          //   text: '参与贡献',
          //   link: '',
          // },
        ],
      },
    ],
    sidebar: [
      {
        text: '快速开始',
        items: [{ text: '介绍', link: '/guide/index' }],
      },
      {
        text: '使用样例',
        items: [{ text: '样例', link: '/useDemo/index' }],
      },
      {
        text: '基础部分',
        items: [{ text: 'Color色彩', link: '/basic/index' }],
      },
      {
        text: '组件（@DLib/ui）',
        items: [
          { text: 'Button 按钮', link: '/packages/ui/button/index' },
          { text: 'Dialog 弹窗', link: '/packages/ui/dialog/index' },
          { text: 'CreateComponent 创建器', link: '/packages/ui/CreateComponent/index' },
          { text: 'Form 公共表单', link: '/packages/ui/Form/index' },
          { text: 'Search 公共查询', link: '/packages/ui/Search/index' },
          { text: 'Table 公共表格', link: '/packages/ui/Table/index' },
          {
            text: 'TableFieldsConfig 字段排序展示',
            link: '/packages/ui/TableFieldsConfig/index',
          },
          { text: 'Pagination 公共分页器', link: '/packages/ui/Pagination/index' },
          { text: 'TableLayout 表格页布局', link: '/packages/ui/TableLayout/index' },
          { text: 'Select 公共选择器', link: '/packages/ui/Select/index' },
        ],
      },
      {
        text: 'Hooks（@DLib/hooks）',
        items: [
          { text: 'useCounter 计数器', link: '/packages/hooks/useCounter/index' },
          { text: 'useRefCollect 收集器', link: '/packages/hooks/useRefCollect/index' },
          { text: 'useConfigs 配置器', link: '/packages/hooks/useConfigs/index' },
          { text: 'useMixConfig 收集器', link: '/packages/hooks/useMixConfig/index' },
        ],
      },
      {
        text: '指令（@DLib/directives）',
        items: [{ text: 'vFocus 聚焦', link: '/packages/directives/vFocus/index' }],
      },
      {
        text: '工具函数（@DLib/utils）',
        items: [
          { text: '字符串工具', link: '/packages/utils/string/index' },
          { text: '数组工具', link: '/packages/utils/array/index' },
          { text: '类型判断工具', link: '/packages/utils/is/index' },
          { text: '异步任务包装器', link: '/packages/utils/async/index' },
        ],
      },
    ],
  },
});

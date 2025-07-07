# CommonSearch公共查询

基于CommonForm的组件

## 全局注册属性

```js
registerComponentDefaultPropsMap({
  CommonSearch: {
    col: {
      sm: 24,
      md: 12,
      lg: 12,
      xl: 12,
    },
    actionCol: 12,
  },
});
```

<demo vue="ui/CommonSearch/registerProps.vue" />

## props传入事件

<demo vue="ui/CommonSearch/bindProps.vue" />

## provide传入事件

<demo vue="ui/CommonSearch/provide.vue" />

## Props

| 属性               | 说明                                       | 类型                                                 | 默认值                             |
| ------------------ | ------------------------------------------ | ---------------------------------------------------- | ---------------------------------- |
| config             | 表单配置项，用于定义搜索表单项的结构和行为 | `CommonFormConfig[]`                                 | -                                  |
| col                | 定义在不同屏幕尺寸下的列数，用于响应式布局 | `{ sm: number; md: number; lg: number; xl: number }` | `{ sm: 24, md: 12, lg: 8, xl: 6 }` |
| resetAll           | 是否重置所有表单字段，包括默认值           | `boolean`                                            | `false`                            |
| resetWithoutSearch | 重置时是否不触发搜索操作                   | `boolean`                                            | `false`                            |

# Descriptions 描述列表

描述列表用于展示只读的结构化信息。

## 基础用法

<demo ssg="true" vue="ui/CommonDescriptions/basic.vue" />

## 格式化

<demo ssg="true" vue="ui/CommonDescriptions/formatter.vue" />

## 渲染组件

<demo ssg="true" vue="ui/CommonDescriptions/component.vue" />

## 字段插槽

<demo ssg="true" vue="ui/CommonDescriptions/slots.vue" />

## Descriptions 属性

| 属性名    | 说明                 | 类型                            | 默认值       |
| --------- | -------------------- | ------------------------------- | ------------ |
| border    | 是否带有边框         | boolean                         | true         |
| column    | 每行显示的描述项数量 | number                          | 3            |
| direction | 描述列表的排列方向   | 'vertical' \| 'horizontal'      | 'horizontal' |
| size      | 列表的尺寸           | 'large' \| 'default' \| 'small' | 'default'    |
| title     | 描述列表的标题       | string                          | -            |
| extra     | 描述列表的操作区域   | string                          | -            |
| config    | 描述项的配置数组     | DescriptionsConfig[]            | -            |

## Descriptions 插槽

| 插槽名  | 说明                                   | 子组件           |
| ------- | -------------------------------------- | ---------------- |
| default | 默认插槽，用于放置 DescriptionsItem 项 | DescriptionsItem |
| title   | 标题内容                               | -                |
| extra   | 操作区域内容                           | -                |

## DescriptionsItem 属性

DescriptionsItem 通过 config 配置项进行定义，支持以下属性：

| 属性名         | 说明               | 类型                          | 默认值 |
| -------------- | ------------------ | ----------------------------- | ------ |
| component      | 组件类型           | any                           | -      |
| formatter      | 格式化函数         | Function                      | -      |
| label          | 标签文本           | string                        | -      |
| span           | 列数               | number                        | 1      |
| width          | 列宽               | string \| number              | -      |
| minWidth       | 最小列宽           | string \| number              | -      |
| align          | 列内容的对齐方式   | 'left' \| 'center' \| 'right' | 'left' |
| labelAlign     | 标签的文本对齐方式 | 'left' \| 'center' \| 'right' | -      |
| className      | 列的内容自定义类名 | string                        | -      |
| labelClassName | 标签的类名         | string                        | -      |

## DescriptionsItem 插槽

DescriptionsItem 的插槽通过字段名定义，插槽名称对应 config 中的 field 字段。

| 插槽名  | 说明             | 作用域参数                |
| ------- | ---------------- | ------------------------- |
| [field] | 自定义描述项内容 | \{ formData, configItem } |
| label   | 标签文本         | -                         |

# Button 按钮

基础的按钮组件。

## 尺寸

<demo vue="ui/button/size.vue" />

## 基础用法

 <demo vue="ui/button/basic.vue" />

## 定制化按钮

<demo vue="ui/button/more.vue" />

## Props

| 属性     | 说明         | 类型                                                                              | 默认值   |
| -------- | ------------ | --------------------------------------------------------------------------------- | -------- |
| type     | 按钮类型     | 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| ...其他定制化样式key | ''       |
| size     | 按钮大小     | 'small' \| 'medium' \| 'large'                                                    | 'medium' |
| disabled | 是否禁用     | boolean                                                                           | false    |
| round    | 是否圆角     | boolean                                                                           | false    |
| plain    | 是否朴素按钮 | boolean                                                                           | false    |
| icon     | 使用图标     | component                                                                         | 无       |

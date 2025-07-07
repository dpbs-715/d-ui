# CommonForm公共表单

公共表单。

## 基础使用

<demo vue="ui/CommonForm/basic.vue" />

## 表单默认参数

main.ts中使用

```js
registerComponentDefaultPropsMap({
  CommonForm: {
    size: 'large', //大小配置
    col: {
      //默认列配置
      sm: 24,
      md: 12,
      lg: 8,
      xl: 6,
    },
    //...其他elForm参数
  },
});
```

## span设置宽度

 <demo vue="ui/CommonForm/span.vue" />

## 隐藏字段

<demo vue="ui/CommonForm/hidden.vue" />

## 切换组件

<demo vue="ui/CommonForm/changeComponent.vue" />

## 禁用字段

<demo vue="ui/CommonForm/disabled.vue" />

## 函数式配置参数

例如elSelect的change事件 commonForm统一对函数式配置追加参数

<demo vue="ui/CommonForm/functionArgs.vue" />

## 字段插槽

<demo vue="ui/CommonForm/fieldSlot.vue" />

## 校验规则

<demo vue="ui/CommonForm/rules.vue" />

## API

| 方法         | 说明                 |
| ------------ | -------------------- |
| validateForm | 表单校验             |
| ...          | 其它elForm暴露的方法 |

## Props

| 属性   | 说明           | 类型               | 默认值 |
| ------ | -------------- | ------------------ | ------ |
| config | 组件生成配置   | CommonFormConfig[] | 无     |
| ...    | 其它elForm参数 | CommonFormProps    | 无     |

## CommonFormConfig对象参数

| 属性          | 说明                                                          | 类型                                                                                    | 必填 |
| ------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ---- |
| component     | 指定使用的表单组件名称，如 `'input'`, `'select'` 等,默认input | `string`                                                                                | 否   |
| span          | 表单项在布局中占的列数（基于 24 栅格系统）                    | `number`                                                                                | 否   |
| hidden        | 控制表单项是否隐藏，支持布尔值或函数                          | `boolean \| ({formData: any, configItem: any}) => boolean`                              | 否   |
| isDisabled    | 控制表单项是否禁用                                            | `boolean \| (formData: any, configItem: any) => boolean`                                | 否   |
| labelField    | 自定义标签显示字段名                                          | `string`                                                                                | 否   |
| formItemProps | 传递给 `el-form-item` 的额外属性                              | `{ labelWidth?: string; [key: string]: any }`                                           | 否   |
| rules         | 表单验证规则，可以是数组或返回规则的函数                      | `Array<FormItemRule> \| (formData: any, item: CommonFormConfig) => Array<FormItemRule>` | 否   |

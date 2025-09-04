# CommonSelectDialog弹窗选择器

## basic绑定数据 以绑定options为例

<demo vue="ui/CommonSelectOrDialog/basic.vue" />

## dict类型

> 一般getDictOptions通过全局注册的getDictOptions方法获取

<demo vue="ui/CommonSelectOrDialog/dict.vue" />

## api类型

```js
//可以使用全局注册,根据项目规范调整
registerCommonKeysMap({
  page: 'pageNo',
  size: 'pageSize',
  total: 'total',
  list: 'list',
  defaultSize: 10,
});
```

<demo vue="ui/CommonSelectOrDialog/api.vue" />

## 选择数据确认前操作

<demo vue="ui/CommonSelectOrDialog/beforeConfirm.vue" />

## 多选

<demo vue="ui/CommonSelectOrDialog/multiple.vue" />

## CommonSelectDialog 属性 (Props)

| 属性                   | 说明                                                  | 类型                                     | 默认值  |
| ---------------------- | ----------------------------------------------------- | ---------------------------------------- | ------- |
| `api`                  | 请求 API 接口方法                                     | `Function`                               | -       |
| `dict`                 | 字典名称，用于从字典中获取选项                        | `string \| string[]`                     | -       |
| `query`                | 请求参数配置方法                                      | `Function`                               | -       |
| `valueField`           | 值字段的对照字段名                                    | `string`                                 | -       |
| `labelField`           | 文本字段的对照字段名                                  | `string`                                 | -       |
| `parseData`            | 转化请求结果的方法                                    | `Function`                               | -       |
| `autoSelectFirst`      | 只有一条数据时是否自动选中                            | `boolean`                                | `false` |
| `multiple`             | 是否为多选                                            | `boolean`                                | `false` |
| `needAllQueryParams`   | 是否需要传递所有查询参数                              | `boolean`                                | `false` |
| `appendOptions`        | 追加的选项列表或方法                                  | `Record<any, any>[] \| Function`         | -       |
| `valueType`            | 值类型，支持 `'string'`, `'String'`, `'int'`, `'Int'` | `'string' \| 'String' \| 'int' \| 'Int'` | -       |
| `bindOptions`          | 绑定的选项列表                                        | `Record<any, any>[]`                     | -       |
| `ignoreByLabel`        | 忽略的标签列表                                        | `string[]`                               | -       |
| `joinSplit`            | 多选时结果合并的拼接符                                | `string`                                 | 无      |
| `orderBy`              | 排序字段名                                            | `string`                                 | -       |
| `orderType`            | 排序方式，支持 `'asc'` 或 `'desc'`                    | `'asc' \| 'desc'`                        | -       |
| `getDictOptions`       | 获取字典选项的方法                                    | `Function`                               | -       |
| `dialog-fields-config` | 列表配置                                              | `CommonTableLayoutConfig[]`              | -       |

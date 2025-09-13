# CommonSelectDialog

## Basic data binding with options as an example

<demo vue="ui/CommonSelectOrDialog/basic.vue" />

## Dict type

> Usually getDictOptions gets the globally registered getDictOptions method

<demo vue="ui/CommonSelectOrDialog/dict.vue" />

## API type

```js
// Can be globally registered, adjust according to project specifications
registerCommonKeysMap({
  page: 'pageNo',
  size: 'pageSize',
  total: 'total',
  list: 'list',
  defaultSize: 10,
});
```

<demo vue="ui/CommonSelectOrDialog/api.vue" />

## Operations Before Confirming Selected Data

<demo vue="ui/CommonSelectOrDialog/beforeConfirm.vue" />

## Multiple Selection

<demo vue="ui/CommonSelectOrDialog/multiple.vue" />

## CommonSelectDialog Attributes (Props)

| Attribute              | Description                                                        | Type                                     | Default |
| ---------------------- | ------------------------------------------------------------------ | ---------------------------------------- | ------- |
| `api`                  | Request API interface method                                       | `Function`                               | -       |
| `dict`                 | Dictionary name, used to get options from dictionary               | `string \| string[]`                     | -       |
| `query`                | Request parameter configuration method                             | `Function`                               | -       |
| `valueField`           | Value field mapping field name                                     | `string`                                 | -       |
| `labelField`           | Text field mapping field name                                      | `string`                                 | -       |
| `parseData`            | Method to transform request results                                | `Function`                               | -       |
| `autoSelectFirst`      | Whether to automatically select when there is only one data item   | `boolean`                                | `false` |
| `multiple`             | Whether it is multiple selection                                   | `boolean`                                | `false` |
| `needAllQueryParams`   | Whether to pass all query parameters                               | `boolean`                                | `false` |
| `appendOptions`        | Appended option list or method                                     | `Record<any, any>[] \| Function`         | -       |
| `valueType`            | Value type, supports 'string', 'String', 'int', 'Int'              | `'string' \| 'String' \| 'int' \| 'Int'` | -       |
| `options`              | Bound option list                                                  | `Record<any, any>[]`                     | -       |
| `ignoreByLabel`        | Ignored label list                                                 | `string[]`                               | -       |
| `joinSplit`            | Concatenation delimiter when merging results in multiple selection | `string`                                 | None    |
| `orderBy`              | Sort field name                                                    | `string`                                 | -       |
| `orderType`            | Sort order, supports 'asc' or 'desc'                               | `'asc' \| 'desc'`                        | -       |
| `getDictOptions`       | Method to get dictionary options                                   | `Function`                               | -       |
| `dialog-fields-config` | List configuration                                                 | `CommonTableLayoutConfig[]`              | -       |

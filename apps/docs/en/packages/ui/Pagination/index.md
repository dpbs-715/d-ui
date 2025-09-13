# CommonPagination

Public pagination component.

## Basic Usage

<demo vue="ui/CommonPagination/basic.vue" />

## Props

| Attribute  | Description                                                                           | Type     | Default                  |
| ---------- | ------------------------------------------------------------------------------------- | -------- | ------------------------ |
| total      | Total number of items                                                                 | `number` | `0` (required)           |
| page       | Current page number (supports two-way binding)                                        | `number` | `1`                      |
| limit      | Number of items displayed per page (supports two-way binding)                         | `number` | `10`                     |
| pagerCount | Sets the maximum number of page buttons, collapses when total pages exceed this value | `number` | `5` on mobile, `7` on PC |
| pageSizes  | Selector configuration for items per page                                             | `array`  | `[10, 20, 30, 50, 100]`  |

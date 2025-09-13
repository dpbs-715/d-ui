# Descriptions

The Descriptions list is used to display read-only structured information.

## Basic Usage

<demo vue="ui/CommonDescriptions/basic.vue" />

## Formatting

<demo vue="ui/CommonDescriptions/formatter.vue" />

## Render Components

<demo vue="ui/CommonDescriptions/component.vue" />

## Field Slots

<demo vue="ui/CommonDescriptions/slots.vue" />

## Descriptions Attributes

| Attribute Name | Description                                   | Type                            | Default      |
| -------------- | --------------------------------------------- | ------------------------------- | ------------ |
| border         | Whether to display border                     | boolean                         | true         |
| column         | Number of description items displayed per row | number                          | 3            |
| direction      | Arrangement direction of description list     | 'vertical' \| 'horizontal'      | 'horizontal' |
| size           | List size                                     | 'large' \| 'default' \| 'small' | 'default'    |
| title          | Title of description list                     | string                          | -            |
| extra          | Operation area of description list            | string                          | -            |
| config         | Configuration array of description items      | DescriptionsConfig[]            | -            |

## Descriptions Slots

| Slot Name | Description                                     | Subcomponent     |
| --------- | ----------------------------------------------- | ---------------- |
| default   | Default slot for placing DescriptionsItem items | DescriptionsItem |
| title     | Title content                                   | -                |
| extra     | Operation area content                          | -                |

## DescriptionsItem Attributes

DescriptionsItem is defined through the config configuration item and supports the following attributes:

| Attribute Name | Description                         | Type                          | Default |
| -------------- | ----------------------------------- | ----------------------------- | ------- |
| component      | Component type                      | any                           | -       |
| formatter      | Formatting function                 | Function                      | -       |
| label          | Label text                          | string                        | -       |
| span           | Number of columns                   | number                        | 1       |
| width          | Column width                        | string \| number              | -       |
| minWidth       | Minimum column width                | string \| number              | -       |
| align          | Content alignment of column         | 'left' \| 'center' \| 'right' | 'left'  |
| labelAlign     | Label text alignment                | 'left' \| 'center' \| 'right' | -       |
| className      | Custom class name of column content | string                        | -       |
| labelClassName | Label class name                    | string                        | -       |

## DescriptionsItem Slots

DescriptionsItem slots are defined by field names, with slot names corresponding to the field field in config.

| Slot Name | Description                     | Scope Parameters          |
| --------- | ------------------------------- | ------------------------- |
| [field]   | Custom description item content | \{ formData, configItem } |
| label     | Label text                      | -                         |

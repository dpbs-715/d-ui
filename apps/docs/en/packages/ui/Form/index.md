# CommonForm

Public form.

## Basic Usage

<demo vue="ui/CommonForm/basic.vue" />

## Form Default Parameters

Used in main.ts

```js
registerComponentDefaultPropsMap({
  CommonForm: {
    size: 'large', // Size configuration
    col: {
      // Default column configuration
      sm: 24,
      md: 12,
      lg: 8,
      xl: 6,
    },
    //... other elForm parameters
  },
});
```

## Span Set Width

<demo vue="ui/CommonForm/span.vue" />

## Hide Fields

<demo vue="ui/CommonForm/hidden.vue" />

## Switch Components

<demo vue="ui/CommonForm/changeComponent.vue" />

## Disable Fields

<demo vue="ui/CommonForm/disabled.vue" />

## Functional Configuration Parameters

For example, elSelect's change event. CommonForm uniformly appends parameters to functional configurations

<demo vue="ui/CommonForm/functionArgs.vue" />

## Field Slots

<demo vue="ui/CommonForm/fieldSlot.vue" />

## Validation Rules

<demo vue="ui/CommonForm/rules.vue" />

## API

| Method       | Description                  |
| ------------ | ---------------------------- |
| validateForm | Form validation              |
| ...          | Other elForm exposed methods |

## Props

| Attribute | Description                        | Type               | Default |
| --------- | ---------------------------------- | ------------------ | ------- |
| config    | Component generation configuration | CommonFormConfig[] | None    |
| ...       | Other elForm parameters            | CommonFormProps    | None    |

## CommonFormConfig Object Parameters

| Attribute     | Description                                                                                    | Type                                                                                    | Required |
| ------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------- |
| component     | Specifies the form component name to be used, such as 'input', 'select', etc. Default is input | `string`                                                                                | No       |
| span          | Number of columns occupied by the form item in the layout (based on 24 grid system)            | `number`                                                                                | No       |
| hidden        | Controls whether the form item is hidden, supports boolean or function                         | `boolean \| ({formData: any, configItem: any}) => boolean`                              | No       |
| isDisabled    | Controls whether the form item is disabled                                                     | `boolean \| (formData: any, configItem: any) => boolean`                                | No       |
| labelField    | Custom label display field name                                                                | `string`                                                                                | No       |
| formItemProps | Additional attributes passed to `el-form-item`                                                 | `{ labelWidth?: string; [key: string]: any }`                                           | No       |
| rules         | Form validation rules, can be an array or a function returning rules                           | `Array<FormItemRule> \| (formData: any, item: CommonFormConfig) => Array<FormItemRule>` | No       |

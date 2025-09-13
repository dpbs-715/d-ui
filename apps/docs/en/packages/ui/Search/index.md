# CommonSearch

Component based on CommonForm

## Globally Registered Properties

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

## Events Passed via Props

<demo vue="ui/CommonSearch/bindProps.vue" />

## Events Passed via Provide

<demo vue="ui/CommonSearch/provide.vue" />

## Props

| Attribute          | Description                                                                              | Type                                                 | Default                            |
| ------------------ | ---------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------- |
| config             | Form configuration items, used to define the structure and behavior of search form items | `CommonFormConfig[]`                                 | -                                  |
| col                | Defines the number of columns for different screen sizes, used for responsive layout     | `{ sm: number; md: number; lg: number; xl: number }` | `{ sm: 24, md: 12, lg: 8, xl: 6 }` |
| resetAll           | Whether to reset all form fields, including default values                               | `boolean`                                            | `false`                            |
| resetWithoutSearch | Whether not to trigger search operation when resetting                                   | `boolean`                                            | `false`                            |

# CreateComponent

Component utility.

## Basic Usage

<demo vue="ui/CreateComponent/basic.vue" />

## Component Not Found Display

<demo vue="ui/CreateComponent/emptyText.vue" />

## Set Properties

<demo vue="ui/CreateComponent/props.vue" />

## Set Slots

<demo vue="ui/CreateComponent/slots.vue" />

## Nesting

<demo vue="ui/CreateComponent/children.vue" />

## Options

<demo vue="ui/CreateComponent/options.vue" />

## Register Components On Demand

```js
// Global registration
registerComponent({
  demo: ElInput,
});

// If only temporary use
const config = {
  component: ElInput,
};

// Function component switching mainly targets list usage. For normal use, just modify the component value directly
```

<demo vue="ui/CreateComponent/registerComponent.vue" />

## Uniformly Set Properties

```js
Registration priority: default registration in UI library < project registration < component config registration < component property registration;

registerComponentDefaultPropsMap({
  demo: {
    placeholder: 'placeholder test',
  },
});
```

<demo vue="ui/CreateComponent/registerProps.vue" />

## Uniformly Set Slots

```js
registerComponentDefaultSlotsMap({
  demo: {
    append: 'append',
  },
});
```

<demo vue="ui/CreateComponent/registerSlots.vue" />

## Uniformly Set Events

```js
registerComponentDefaultEventsMap({
  input: {
    onClick: () => {
      console.log('click');
    },
  },
});
```

<demo vue="ui/CreateComponent/registerEvents.vue" />

## Props

| Prop      | Description                               | Type   | Default |
| --------- | ----------------------------------------- | ------ | ------- |
| config    | Component generation configuration        | Config | None    |
| emptyText | String displayed when component not found | String | None    |

## Config

| Prop      | Description                    | Type                                                                                  | Required |
| --------- | ------------------------------ | ------------------------------------------------------------------------------------- | -------- |
| component | Registered component key       | string \| ComponentFunctionType                                                       | Yes      |
| props     | Component properties or events | Record<string, any>                                                                   | No       |
| children  | Nested Config                  | string \| string[] \| Config[]                                                        | No       |
| slots     | Component slots                | Record<string, <br/>string \| number \| VNode \| <br/> (string \| number \| VNode)[]> | No       |

# CreateComponent创建器

组件工具。

## 基础用法

<demo vue="ui/CreateComponent/basic.vue" />

## 未找到组件展示

<demo vue="ui/CreateComponent/emptyText.vue" />

## 设置属性

<demo vue="ui/CreateComponent/props.vue" />

## 设置插槽

<demo vue="ui/CreateComponent/slots.vue" />

## 嵌套

<demo vue="ui/CreateComponent/children.vue" />

## options

<demo vue="ui/CreateComponent/options.vue" />

## 按需注册组件

```js
// 公共注册
registerComponent({
  demo: ElInput,
});

//如果只是临时使用
const config = {
  component: ElInput,
};

//函数式组件切换主要针对列表使用 正常直接修改component值即可
```

<demo vue="ui/CreateComponent/registerComponent.vue" />

## 统一设置属性

```js
注册的优先级: ui库中的默认注册 < 项目注册 < 组件config注册 < 组件属性注册;

registerComponentDefaultPropsMap({
  demo: {
    placeholder: 'placeholder测试',
  },
});
```

<demo vue="ui/CreateComponent/registerProps.vue" />

## 统一设置插槽

```js
registerComponentDefaultSlotsMap({
  demo: {
    append: 'append',
  },
});
```

<demo vue="ui/CreateComponent/registerSlots.vue" />

## 统一设置事件

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

| 属性      | 说明                   | 类型   | 默认值 |
| --------- | ---------------------- | ------ | ------ |
| config    | 组件生成配置           | Config | 无     |
| emptyText | 未找到组件展示的字符串 | String | 无     |

## Config

| 属性      | 说明             | 类型                                                                                  | 必填 |
| --------- | ---------------- | ------------------------------------------------------------------------------------- | ---- |
| component | 注册的组件键值   | string \| ComponentFunctionType                                                       | 是   |
| props     | 组件的属性或事件 | Record<string, any>                                                                   | 否   |
| children  | 嵌套Config       | string \| string[] \| Config[]                                                        | 否   |
| slots     | 组件插槽         | Record<string, <br/>string \| number \| VNode \| <br/> (string \| number \| VNode)[]> | 否   |

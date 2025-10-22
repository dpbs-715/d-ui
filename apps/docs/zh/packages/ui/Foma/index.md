# CommonFoma 公共编辑器

目前编辑器只支持公式编辑校验,后期待完善

### 功能特性

1. **变量/函数自动补全**：在编辑器中输入时会自动提示允许的变量和函数
2. **AST语法校验**：实时校验表达式语法，确保只使用允许的变量和函数
3. **可视化变量块**：变量和函数在编辑器中以特殊样式显示
4. **只读模式**：可通过readonly属性控制编辑器是否可编辑
5. **自定义尺寸**：支持设置编辑器的最小和最大高度

## 基础使用

<demo vue="ui/CommonFoma/basic.vue" />

## 只读

<demo vue="ui/CommonFoma/readonly.vue" />

## 关闭校验

<demo vue="ui/CommonFoma/checkRules.vue" />

### Props

| 属性名      | 说明               | 类型             | 默认值  |
| ----------- | ------------------ | ---------------- | ------- |
| readonly    | 是否只读           | `boolean`        | `false` |
| checkRules  | 是否启用规则校验   | `boolean`        | `true`  |
| maxHeight   | 编辑器最大高度     | `number`         | `400`   |
| minHeight   | 编辑器最小高度     | `number`         | `200`   |
| allowedVars | 允许使用的变量列表 | `Array<VarType>` | `[]`    |
| allowedFuns | 允许使用的函数列表 | `Array<VarType>` | `[]`    |

### Methods

通过 `ref` 获取组件实例可以调用以下方法：

| 方法名                | 说明               | 参数                                                                                           |
| --------------------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| insertAtMousePosition | 在鼠标位置插入内容 | `content: string \| VarType\| FunctionType, mouseEvent: MouseEvent, type: 'var' \| 'function'` |
| insertVariable        | 插入变量           | `variable: VarType, position?: number`                                                         |
| insertText            | 插入文本           | `text: string`                                                                                 |
| insertFunction        | 插入函数           | `variable: FunctionType, args: string[] = [], position?: number`                               |

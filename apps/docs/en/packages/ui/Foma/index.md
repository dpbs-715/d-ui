# CommonFoma Editor

Currently, the editor only supports formula editing and validation, to be improved in the future.

### Features

1. **Variable/Function Auto-completion**: Automatically prompts allowed variables and functions when typing in the editor
2. **AST Syntax Validation**: Real-time expression syntax validation to ensure only allowed variables and functions are used
3. **Visual Variable Blocks**: Variables and functions are displayed with special styles in the editor
4. **Read-only Mode**: Editability can be controlled via the readonly property
5. **Custom Dimensions**: Supports setting minimum and maximum height of the editor

## Basic Usage

<demo ssg="true" vue="ui/CommonFoma/basic.vue" />

## Read-only Mode

<demo ssg="true" vue="ui/CommonFoma/readonly.vue" />

## Disable Validation

<demo ssg="true" vue="ui/CommonFoma/checkRules.vue" />

### Props

| Prop Name   | Description                     | Type             | Default |
| ----------- | ------------------------------- | ---------------- | ------- |
| readonly    | Whether it is read-only         | `boolean`        | `false` |
| checkRules  | Whether to enable rule checking | `boolean`        | `true`  |
| maxHeight   | Maximum height of the editor    | `number`         | `400`   |
| minHeight   | Minimum height of the editor    | `number`         | `200`   |
| allowedVars | List of allowed variables       | `Array<VarType>` | `[]`    |
| allowedFuns | List of allowed functions       | `Array<VarType>` | `[]`    |

### Methods

The following methods can be called by getting the component instance via `ref`:

| Method Name           | Description                      | Parameters                                                                                     |
| --------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------- |
| insertAtMousePosition | Insert content at mouse position | `content: string \| VarType\| FunctionType, mouseEvent: MouseEvent, type: 'var' \| 'function'` |
| insertVariable        | Insert variable                  | `variable: VarType, position?: number`                                                         |
| insertText            | Insert text                      | `text: string`                                                                                 |
| insertFunction        | Insert function                  | `variable: FunctionType, args: string[] = [], position?: number`                               |

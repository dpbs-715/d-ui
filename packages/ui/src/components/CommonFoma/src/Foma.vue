<template>
  <div ref="editor" class="editor" />
</template>

<script setup lang="ts">
import { translateJsError } from 'dlib-utils';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { EditorView, Decoration, WidgetType, keymap } from '@codemirror/view';
import { EditorState, StateField, StateEffect, RangeSet } from '@codemirror/state';
import {
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
} from '@codemirror/view';
import {
  foldGutter,
  indentOnInput,
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
  foldKeymap,
} from '@codemirror/language';
import { history, defaultKeymap, historyKeymap } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import {
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
  autocompletion,
  type CompletionContext,
  type Completion,
} from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import jsep from 'jsep';
import { FomaProps, type VarType } from './Foma.types';

const model = defineModel<string>();
const error = defineModel<string>('error');

const props = defineProps(FomaProps);

const editor = ref<HTMLDivElement | null>(null);
let view: EditorView | null = null;

/* ---------------------- AST 校验 ---------------------- */
function checkAST(node: any) {
  if (!node) return;
  console.log(node);
  switch (node.type) {
    case 'Identifier':
      if (!props.allowedVars.map((o: VarType) => o.value).includes(node.name)) {
        throw new Error(`未定义变量: ${node.name}`);
      }
      break;
    case 'Literal':
      // 数字、字符串等字面量直接跳过
      break;
    case 'BinaryExpression':
    case 'LogicalExpression':
      checkAST(node.left);
      checkAST(node.right);
      break;
    case 'UnaryExpression':
      checkAST(node.argument);
      break;
    case 'CallExpression':
      if (!props.allowedFuns.includes(node.callee.name)) {
        throw new Error(`未定义函数: ${node.callee.name}`);
      }
      node.arguments.forEach((arg: any) => checkAST(arg));
      break;
    case 'ConditionalExpression':
      checkAST(node.test);
      checkAST(node.consequent);
      checkAST(node.alternate);
      break;
    case 'MemberExpression':
      // 可以允许 obj.prop 或 obj['prop'] 形式
      if (node.object.type === 'Identifier' && !props.allowedFuns.includes(node.object.name)) {
        throw new Error(`未定义对象: ${node.object.name}`);
      }
      // 可选择性检查属性
      break;
    case 'ArrayExpression':
      throw new Error(`非法的格式`);
    case 'ObjectExpression':
      node.properties.forEach((prop: any) => checkAST(prop.value));
      break;
    case 'Compound':
      if (node.body.length !== 0) throw new Error(`非法的格式`);
      break;
    default:
      console.warn('未处理的 AST 类型:', node.type);
  }
}

/* ---------------------- 自定义变量块 ---------------------- */

class VariableWidget extends WidgetType {
  constructor(
    readonly _label: string,
    readonly _value: string,
  ) {
    super();
  }

  eq(other: VariableWidget) {
    return this._label === other._label && this._value === other._value;
  }

  toDOM() {
    const span = document.createElement('span');
    span.textContent = this._label; // 显示 label
    span.className = 'cm-var-block';
    return span;
  }

  ignoreEvent() {
    return false;
  }
}

// 插入变量的 Effect
const addVarEffect = StateEffect.define<{
  from: number;
  to: number;
  label: string;
  value: string;
}>();

// 变量装饰字段
const variableField = StateField.define<RangeSet<Decoration>>({
  create() {
    return RangeSet.empty;
  },
  update(decos, tr) {
    decos = decos.map(tr.changes);
    for (const e of tr.effects) {
      if (e.is(addVarEffect)) {
        const deco = Decoration.replace({
          widget: new VariableWidget(e.value.label, e.value.value),
          inclusive: false,
        }).range(e.value.from, e.value.to);
        decos = decos.update({ add: [deco] });
      }
    }
    return decos;
  },
  provide: (f) => EditorView.decorations.from(f),
});

// 原子化范围：光标不可进入块内部
const atomicRanges = EditorView.atomicRanges.of((view) => {
  const field = view.state.field(variableField, false);
  return field ?? RangeSet.empty;
});

/* ---------------------- 更新监听 ---------------------- */
const updateListener = EditorView.updateListener.of((update) => {
  if (update.docChanged) {
    const text = update.state.doc.toString();
    model.value = text;
    try {
      const ast = jsep(text);
      checkAST(ast);
      error.value = '';
    } catch (e: any) {
      error.value = translateJsError(e);
    }
  }
});

/* ---------------------- 插入逻辑 ---------------------- */
function insertVariableBlock(variable: VarType) {
  if (!view) return;
  const { from } = view.state.selection.main;
  const { label, value } = variable;

  // 实际插入 value（用于AST校验）
  const tr = view.state.update({
    changes: { from, insert: value },
    effects: addVarEffect.of({ from, to: from + value.length, label, value }),
    selection: { anchor: from + value.length },
  });
  view.dispatch(tr);
}

function insertText(text: string) {
  if (!view) return;
  const { from, to } = view.state.selection.main;
  view.dispatch({
    changes: { from, to, insert: text },
    selection: { anchor: from + text.length },
  });
}

function insertFunction(name: string, args: string[] = []) {
  if (!view) return;
  const { from, to } = view.state.selection.main;
  const argText = args.join(',');
  const insertText = `${name}(${argText})`;
  view.dispatch({
    changes: { from, to, insert: insertText },
    selection: { anchor: from + insertText.length },
  });
}

function myCompletionSource(context: CompletionContext) {
  const word = context.matchBefore(/[\p{L}\p{N}_]+/u);
  if (!word) return null;

  const options: Completion[] = [
    ...props.allowedVars.map((v: any) => ({
      label: v.label,
      type: 'variable',
      apply: (view: EditorView, _completion: any, from: number, to: number) => {
        view.dispatch({
          changes: { from, to, insert: v.value },
          effects: addVarEffect.of({
            from,
            to: from + v.value.length,
            label: v.label,
            value: v.value,
          }),
          selection: { anchor: from + v.value.length },
        });
      },
    })),
    ...props.allowedFuns.map((f: any) => ({
      label: f + '()',
      type: 'function',
      apply: (view: EditorView, _fun: any, from: number, to: number) => {
        const insertText = `${f}()`;
        const cursorPos = from + f.length + 1;
        view.dispatch({
          changes: { from, to, insert: insertText },
          selection: { anchor: cursorPos },
        });
      },
    })),
  ];

  return {
    from: word.from,
    options,
  };
}

const customAutocomplete = autocompletion({
  override: [myCompletionSource],
});

const maxHeightTheme = EditorView.theme({
  '&': {
    // 针对整个编辑器容器 (.cm-editor)
    'max-height': `${props.maxHeight}px`,
    'min-height': `${props.minHeight}px`,
    height: '100%',
  },
  '.cm-scroller': {
    overflow: 'auto', // 确保出现滚动条
  },
});

/* ---------------------- 基础设置 ---------------------- */
const basicSetup = (() => [
  maxHeightTheme,
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  customAutocomplete,
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap,
  ]),
  updateListener,
  variableField,
  atomicRanges,
])();

/* ---------------------- 生命周期 ---------------------- */
defineExpose({
  insertVariableBlock,
  insertText,
  insertFunction,
});

onMounted(() => {
  view = new EditorView({
    doc: model.value,
    extensions: [basicSetup],
    parent: editor.value!,
  });
});

onBeforeUnmount(() => {
  view?.destroy();
});
</script>

<style lang="scss" scoped>
@use './Foma.scss' as *;
</style>

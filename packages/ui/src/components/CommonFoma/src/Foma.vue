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
  autocompletion,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';
import { lintKeymap } from '@codemirror/lint';
import { javascript } from '@codemirror/lang-javascript';
import jsep from 'jsep';
import type { FomaProps } from './Foma.types';

const model = defineModel<string>();
const error = defineModel<string>('error');
const props = withDefaults(defineProps<FomaProps>(), {
  allowedVars: () => [],
  allowedFuns: () => [],
});

const editor = ref<HTMLDivElement | null>(null);
let view: EditorView | null = null;

/* ---------------------- AST 校验 ---------------------- */
function checkAST(node: any) {
  if (!node) return;
  switch (node.type) {
    case 'Identifier':
      if (!props.allowedVars.includes(node.name)) {
        throw new Error(`未定义变量: ${node.name}`);
      }
      break;
    case 'Literal':
      // 数字、字符串等字面量直接跳过
      break;
    case 'BinaryExpression':
    case 'LogicalExpression':
      console.log(node);
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
  constructor(readonly _name: string) {
    super();
  }

  eq(other: VariableWidget) {
    return this._name === other._name;
  }

  toDOM() {
    const span = document.createElement('span');
    span.textContent = this._name;
    span.className = 'cm-var-block';
    return span;
  }

  ignoreEvent() {
    return false;
  }
}

// 插入变量的 Effect
const addVarEffect = StateEffect.define<{ from: number; to: number; name: string }>();

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
          widget: new VariableWidget(e.value.name),
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
function insertVariableBlock(name: string) {
  if (!view) return;
  const { from } = view.state.selection.main;
  const label = name; // 实际插入文档的内容
  const tr = view.state.update({
    changes: { from, insert: label },
    effects: addVarEffect.of({ from, to: from + label.length, name }),
    selection: { anchor: from + label.length },
  });
  view.dispatch(tr);
}

function insertVariable(name: string) {
  if (!view) return;
  const { from, to } = view.state.selection.main;
  view.dispatch({
    changes: { from, to, insert: name },
    selection: { anchor: from + name.length },
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

/* ---------------------- 基础设置 ---------------------- */
const basicSetup = (() => [
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
  autocompletion(),
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
  javascript(),
  updateListener,
  variableField,
  atomicRanges,
])();

/* ---------------------- 生命周期 ---------------------- */
defineExpose({
  insertVariableBlock,
  insertVariable,
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

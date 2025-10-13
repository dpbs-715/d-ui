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
import { FomaProps, type FunctionType, type VarType } from './Foma.types';

const model = defineModel<string>();
const error = defineModel<string>('error');

const props = defineProps(FomaProps);

const editor = ref<HTMLDivElement | null>(null);
let view: EditorView | null = null;

/* ---------------------- AST 校验 ---------------------- */
function checkAST(node: any) {
  if (!node) return;
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
      if (!props.allowedFuns.map((o: FunctionType) => o.value).includes(node.callee.name)) {
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
      if (
        node.object.type === 'Identifier' &&
        !props.allowedFuns.map((o: FunctionType) => o.value).includes(node.object.name)
      ) {
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
class BlockWidget extends WidgetType {
  constructor(
    readonly _label: string,
    readonly _value: string,
  ) {
    super();
  }
  eq(other: BlockWidget) {
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

function getDecosWidthBlock(text: string) {
  let decos = RangeSet.empty;
  for (const v of [...props.allowedVars, ...props.allowedFuns] as VarType[]) {
    const re = new RegExp(`${v.value}`, 'g');
    for (const m of text.matchAll(re)) {
      const from = m.index!;
      const to = from + v.value.length;
      const deco = Decoration.replace({
        widget: new BlockWidget(v.label, v.value),
        inclusive: false,
      }).range(from, to);
      decos = decos.update({ add: [deco] });
    }
  }
  return decos;
}

const variableField = StateField.define<RangeSet<Decoration>>({
  // state 参数可拿到初始文档，首次创建时就把已有 value 转为装饰
  create(state) {
    const text = state.doc.toString();
    return getDecosWidthBlock(text);
  },

  update(decos, tr) {
    // 先把现有装饰根据文本变更映射（避免位置错乱）
    decos = decos.map(tr.changes);

    // 当文档有改动或我们显式发出了 addVarEffect 时，重建整个装饰集合
    const hasAddVarEffect = tr.effects.some((e) => e.is(addVarEffect));
    if (tr.docChanged || hasAddVarEffect) {
      const text = tr.newDoc.toString();
      return getDecosWidthBlock(text);
    }

    // 否则直接返回映射后的装饰（没有必要重建）
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
    if (!props.checkRules) return;
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
function insertVariable(variable: VarType) {
  if (!view) return;
  if (props.readonly) return;
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
  if (props.readonly) return;
  const { from, to } = view.state.selection.main;
  view.dispatch({
    changes: { from, to, insert: text },
    selection: { anchor: from + text.length },
  });
}

function insertFunction(variable: FunctionType, args: string[] = []) {
  if (!view) return;
  if (props.readonly) return;
  const { from } = view.state.selection.main;
  const { label, value } = variable;
  const argText = args.join(',');
  // 实际插入 value（用于AST校验）
  const tr = view.state.update({
    changes: { from, insert: `${value}(${argText})` },
    effects: addVarEffect.of({ from, to: from + value.length, label, value }),
    selection: { anchor: from + value.length + 2 },
  });
  view.dispatch(tr);
}

/* ---------------------- 函数、变量补全 ---------------------- */
function completionSource(context: CompletionContext) {
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
      label: f.label + '()',
      type: 'function',
      apply: (view: EditorView, _fun: any, from: number, to: number) => {
        view.dispatch({
          changes: { from, to, insert: `${f.value}()` },
          effects: addVarEffect.of({
            from,
            to: from + f.value.length,
            label: f.label,
            value: f.value,
          }),
          selection: { anchor: from + f.value.length + 1 },
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
  override: [completionSource],
});
/* ---------------------- 主题 ---------------------- */
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
  EditorState.readOnly.of(props.readonly),
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
  insertVariable,
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

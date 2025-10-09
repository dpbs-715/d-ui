<template>
  <div>
    <div ref="editor" class="editor" />
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import jsep from 'jsep';

const editor = ref<HTMLDivElement | null>(null);
let view: EditorView | null = null;

const allowedVars: string[] = []; // 允许的变量
const allowedFunctions: string[] = []; // 允许的函数
const error = ref('');

// 递归检查 AST 变量合法性
function checkAST(node: any) {
  if (!node) return;
  switch (node.type) {
    case 'Identifier':
      if (!allowedVars.includes(node.name)) {
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
      if (!allowedFunctions.includes(node.callee.name)) {
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
      if (node.object.type === 'Identifier' && !allowedVars.includes(node.object.name)) {
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

onMounted(() => {
  view = new EditorView({
    doc: 'func(1,2)',
    extensions: [
      basicSetup,
      javascript(),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const text = update.state.doc.toString();
          try {
            const ast = jsep(text);
            checkAST(ast);
            error.value = '';
          } catch (e: any) {
            error.value = e?.message || '表达式错误';
          }
        }
      }),
    ],
    parent: editor.value!,
  });
  console.log(view);
});

onBeforeUnmount(() => {
  view?.destroy();
});
</script>

<style lang="scss" scoped>
@use './Foma.scss' as *;
</style>

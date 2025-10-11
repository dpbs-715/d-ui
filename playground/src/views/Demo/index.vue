<script setup lang="ts">
import { CommonFoma } from '~/dlib-ui';
import { ref } from 'vue';
const model = ref('code1+code2');
const error = ref('');
const CommonFomaRef = ref();

const funs = ['SUM', 'MIX'];
const vars = [
  { label: '变量1', value: 'code1' },
  { label: '变量2', value: 'code2' },
];
function insertFun(item: string) {
  CommonFomaRef.value.insertFunction(item, []);
}
function insertVar(item) {
  CommonFomaRef.value.insertVariableBlock(item);
}
</script>

<template>
  <button v-for="item in vars" :key="item.value" @click="insertVar(item)">
    {{ item.label }}
  </button>
  <button v-for="item in funs" :key="item" @click="insertFun(item)">
    {{ item }}
  </button>
  {{ model }}
  <CommonFoma
    ref="CommonFomaRef"
    v-model="model"
    v-model:error="error"
    :allowed-funs="funs"
    :allowed-vars="vars"
  />

  <div v-if="error" class="error">
    {{ error }}
  </div>
</template>

<style scoped>
.error {
  margin-top: 5px;
  color: var(--el-color-error);
}
</style>

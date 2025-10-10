<script setup lang="ts">
import { CommonFoma } from '~/dlib-ui';
import { ref } from 'vue';
const model = ref('');
const error = ref('');
const CommonFomaRef = ref();

const funs = ['SUM', 'MIX'];
const vars = ['变量1', '变量2'];
function insertFun(item: string) {
  CommonFomaRef.value.insertFunction(item, ['1', '2']);
}
function insertVar(item: string) {
  CommonFomaRef.value.insertVariableBlock(item);
}
</script>

<template>
  <button v-for="item in vars" :key="item" @click="insertVar(item)">
    {{ item }}
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

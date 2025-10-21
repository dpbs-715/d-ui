<script setup lang="ts">
import { CommonFoma } from '~/dlib-ui';
import { ref, reactive } from 'vue';
const model = ref('code1+code2+code3');
const error = ref('');
const CommonFomaRef = ref();
const readOnly = ref(false);
const funs = reactive([
  { label: '函数1', value: 'MIX' },
  { label: '函数2', value: 'SUM' },
]);
const vars = reactive([
  { label: '变量1', value: 'code1' },
  { label: '变量2', value: 'code2' },
]);
function insertFun(item: any) {
  CommonFomaRef.value.insertFunction(item, []);
}
function insertVar(item: any) {
  CommonFomaRef.value.insertVariable(item);
}
setTimeout(() => {
  model.value = 'code1 + code2 + code3 + code1';
  vars.push({ label: '变量3', value: 'code3' });
  readOnly.value = true;
}, 2000);
</script>

<template>
  <button v-for="item in vars" :key="item.value" @click="insertVar(item)">
    {{ item.label }}
  </button>
  <button v-for="item in funs" :key="item.value" @click="insertFun(item)">
    {{ item.label }}
  </button>
  {{ model }}
  <CommonFoma
    ref="CommonFomaRef"
    v-model="model"
    v-model:error="error"
    :readonly="readOnly"
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

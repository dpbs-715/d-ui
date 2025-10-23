<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useConfigs } from 'dlib-hooks/src/useConfigs';
import type { CommonFormConfig } from '~/components';
function mockFun() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          label: 'label1',
          value: 1,
        },
        {
          label: 'label3',
          value: 3,
        },
      ]);
    }, 1000);
  });
}
const { config } = useConfigs<CommonFormConfig>([
  {
    field: 'test1',
    label: '测试1',
    component: 'commonSelect',
    props: {
      api: mockFun,
    },
  },
  {
    field: 'test2',
    label: '测试2',
  },
  {
    field: 'test3',
    label: '测试3',
  },
  {
    field: 'test4',
    label: '测试4',
  },
  {
    field: 'test5',
    label: '测试5',
  },
]);
const loading = ref(false);
const formData = reactive({ test1: 1 });
function loadingFun() {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 5000);
}
const readonlyFlg = ref(false);
function setReadonly() {
  readonlyFlg.value = !readonlyFlg.value;
}
</script>

<template>
  <el-button @click="loadingFun">
    loading
  </el-button>
  <el-divider />
  <el-button @click="setReadonly">
    readonly
  </el-button>
  <el-divider />
  <CommonForm v-model="formData" :readonly="readonlyFlg" :loading="loading" :config="config" />
</template>

<style scoped></style>

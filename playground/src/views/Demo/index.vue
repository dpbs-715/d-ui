<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useConfigs } from 'dlib-hooks/src/useConfigs';
import type { CommonFormConfig } from '~/components';
const { config } = useConfigs<CommonFormConfig>([
  {
    field: 'test1',
    label: '测试1',
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
const loading = ref(true);
const formData = reactive({ test1: 123 });
setTimeout(() => {
  loading.value = false;
}, 5000);
</script>

<template>
  <CommonForm v-model="formData" :loading="loading" :config="config" />
</template>

<style scoped></style>

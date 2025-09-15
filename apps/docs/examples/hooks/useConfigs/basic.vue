<script setup lang="ts">
import { ref } from 'vue';
import { useConfigs } from 'dlib-hooks/src/useConfigs';
import { CommonForm } from 'dlib-ui';
import type { CommonFormConfig } from 'dlib-ui';
const formData = ref({});
const { config } = useConfigs<CommonFormConfig>([
  {
    field: 'field1',
    label: '字段1',
  },
  {
    field: 'test2',
    label: '字段2',
  },
]);
</script>

<template>
  <CommonForm
    v-model="formData"
    :config="config"
  />
</template>

<style scoped></style>

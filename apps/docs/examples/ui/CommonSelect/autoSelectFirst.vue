<script setup lang="ts">
import { reactive } from 'vue';
import { CommonForm } from 'dlib-ui';
import { useMixConfig } from 'dlib-hooks';

const formData = reactive({});

function mockApi() {
  return new Promise((resolve) => {
    resolve([{ label: '选项1', value: '1' }]);
  });
}
const { form } = useMixConfig([
  {
    label: '字段',
    field: 'field',
    component: 'commonSelect',
    span: 12,
    props: {
      api: mockApi,
      autoSelectFirst: true,
    },
    form: true,
  },
]);
</script>

<template>
  {{ formData }}
  <el-divider />
  <CommonForm
    v-model="formData"
    :config="form.config"
  />
</template>

<style scoped></style>

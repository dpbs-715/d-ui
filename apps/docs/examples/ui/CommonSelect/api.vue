<script setup lang="ts">
import { reactive } from 'vue';
import { CommonForm } from 'dlib-ui';
import { useMixConfig } from 'dlib-hooks';

const formData = reactive({});

function mockApi() {
  return new Promise((resolve) => {
    resolve([
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' },
    ]);
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
    },
    form: true,
  },
]);
</script>

<template>
  <CommonForm
    v-model="formData"
    :config="form.config"
  />
</template>

<style scoped></style>

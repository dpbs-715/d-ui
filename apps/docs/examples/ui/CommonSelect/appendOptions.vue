<script setup lang="ts">
import { reactive } from 'vue';
import { CommonForm } from 'dlib-ui';
import { useMixConfig } from 'dlib-hooks';

const formData = reactive({});
const bindOptions = reactive([
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
]);
const appendOptions = reactive([
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
]);

const { form } = useMixConfig([
  {
    label: '字段',
    field: 'field',
    component: 'commonSelect',
    span: 12,
    props: {
      bindOptions,
      appendOptions,
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

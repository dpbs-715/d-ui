<script setup lang="ts">
import { reactive } from 'vue';
import { useMixConfig } from 'dlib-hooks/src/useMixConfig';

const formData = reactive({});

const options = reactive([
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
]);

const { form } = useMixConfig([
  {
    label: '字段',
    field: 'field',
    component: 'commonSelect',
    span: 12,
    model: {
      label: 'name',
    },
    props: {
      options,
    },
    form: true,
  },
]);
</script>

<template>
  {{ formData }}
  <CommonForm
    v-model="formData"
    :config="form.config"
  />
</template>

<style scoped></style>

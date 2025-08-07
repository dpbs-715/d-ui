<script setup lang="ts">
import { reactive } from 'vue';
import { CommonForm } from 'dlib-ui';
import { useMixConfig } from 'dlib-hooks';

const formData = reactive({});

function mockApi3() {
  return new Promise((resolve) => {
    resolve([
      { name: '李四', card: '182313' },
      { name: '王五', card: '212312328' },
    ]);
  });
}
const { form } = useMixConfig([
  {
    label: '字段',
    field: 'card',
    component: 'commonSelect',
    span: 12,
    props: {
      api: mockApi3,
      labelField: 'name',
      valueField: 'card',
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

<script setup lang="ts">
import { reactive } from 'vue';
import { CommonForm } from 'dlib-ui';
import { useMixConfig } from 'dlib-hooks';

const formData = reactive({});
const bindOptions: any = reactive([]);
for (let i = 0; i < 20; i++) {
  bindOptions.push({
    label: `选项${i}`,
    value: i,
  });
}
const bindTreeOptions: any = reactive([
  {
    label: '根',
    value: 0,
    children: [
      {
        label: '子1',
        value: 1,
      },
      {
        label: '子2',
        value: 2,
      },
    ],
  },
]);
const { form } = useMixConfig([
  {
    label: '普通',
    field: 'field',
    component: 'commonSelect',
    span: 12,
    props: {
      bindOptions,
      componentType: 'ElSelect',
    },
    form: true,
  },
  {
    label: '虚拟化',
    field: 'field',
    component: 'commonSelect',
    span: 12,
    props: {
      bindOptions,
      componentType: 'ElSelectV2',
    },
    form: true,
  },
  {
    label: '树下拉',
    field: 'field',
    component: 'commonSelect',
    span: 12,
    props: {
      bindOptions: bindTreeOptions,
      componentType: 'ElTreeSelect',
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

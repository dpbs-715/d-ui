<script setup lang="ts">
import { reactive } from 'vue';
import { CommonForm } from 'dlib-ui';
import { useMixConfig } from 'dlib-hooks';

const formData = reactive({});

function mockApi6() {
  return new Promise((resolve) => {
    resolve({
      data: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
      ],
    });
  });
}
const { form } = useMixConfig([
  {
    label: '字段',
    field: 'field',
    component: 'commonSelect',
    span: 12,
    props: {
      api: mockApi6,
      parseData: (res: any) => res.data,
    },
    form: true,
  },
  {
    label: '字段2',
    field: 'field2',
    component: 'commonSelect',
    span: 12,
    props: {
      api: mockApi6,
      parseData: (res: any) => {
        return res.data.map((item: any) => {
          return {
            label: item.label + '测试',
            value: item.value,
          };
        });
      },
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

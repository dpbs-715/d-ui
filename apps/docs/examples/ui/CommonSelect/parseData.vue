<script setup lang="ts">
import { reactive } from 'vue';
import { CommonForm } from '@DLib/ui';
import { useMixConfig } from '@DLib/hooks';

const formData = reactive({});

function mockApi() {
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
      api: mockApi,
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
      api: mockApi,
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

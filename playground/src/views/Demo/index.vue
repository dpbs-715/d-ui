<script setup lang="ts">
import { ref } from 'vue';
const fieldConfig = [
  {
    label: '字段1',
    field: 'label',
    table: true,
    search: {
      component: 'commonSelect',
      props: {
        bindOptions: [
          {
            label: 'label1',
            value: 'value1',
          },
          {
            label: 'label2',
            value: 'value2',
          },
        ],
      },
    },
  },
  {
    label: '字段2',
    field: 'value',
    table: true,
    search: {
      component: 'commonSelect',
      props: {
        query: ({ formData }: any) => {
          return {
            label: formData.value1,
          };
        },
        bindOptions: [
          {
            label: 'label1',
            value: 'value1',
          },
          {
            label: 'label2',
            value: 'value2',
          },
        ],
      },
    },
  },
];

const options = [
  {
    label: 'label1',
    value: 'value1',
  },
  {
    label: 'label2',
    value: 'value2',
  },
];
const model = ref('');
const modelLabel = ref('');
const queryValue = ref('');
</script>

<template>
  <el-button @click="() => (queryValue = 'label2')">
    选择
  </el-button>
  {{ model }}{{ modelLabel }}
  <CommonSelectOrDialog
    v-model:label="modelLabel"
    v-model="model"
    multiple
    join-split=","
    :dialog-fields-config="fieldConfig"
    :bind-options="options"
    :dialog-props="{
      title: '选择数据',
      width: '80%',
    }"
  />
</template>

<style scoped></style>

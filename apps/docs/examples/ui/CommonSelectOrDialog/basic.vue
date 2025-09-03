<script setup lang="ts">
import { ElDivider } from 'element-plus';
import { CommonSelectOrDialog, type CommonTableLayoutConfig } from 'dlib-ui';
import { ref } from 'vue';

const fieldConfig: CommonTableLayoutConfig[] = [
  {
    label: '文字',
    field: 'label',
    table: true,
    search: {
      component: 'commonSelect',
      props: {
        bindOptions: [
          {
            label: 'label1',
            value: 'label1',
          },
          {
            label: 'label2',
            value: 'label2',
          },
        ],
      },
    },
  },
  {
    label: '值',
    field: 'value',
    table: true,
  },
];

const options: Record<string, string>[] = [
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
</script>

<template>
  值:{{ model || '-' }}
  <br>
  文字:{{ modelLabel || '-' }}
  <el-divider />
  <CommonSelectOrDialog
    v-model:label="modelLabel"
    v-model="model"
    :dialog-fields-config="fieldConfig"
    :bind-options="options"
    :dialog-props="{
      title: '选择数据',
    }"
  />
</template>

<style scoped></style>

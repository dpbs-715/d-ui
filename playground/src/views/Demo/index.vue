<script setup lang="ts">
import { ElDivider } from 'element-plus';
import type { CommonTableLayoutConfig } from 'dlib-ui';
import { ref } from 'vue';

const model = ref('');
const modelLabel = ref('');
const fieldConfig: CommonTableLayoutConfig[] = [
  {
    label: '文字',
    field: 'label',
    table: true,
    search: true,
  },
  {
    label: '值',
    field: 'value',
    table: true,
  },
];

function mockApi({ pageNo, _pageSize }) {
  const arr = [];
  for (let i = 10 * (pageNo - 1); i < pageNo * 10; i++) {
    arr.push({
      label: `label${i}`,
      value: `value${i}`,
    });
  }
  return Promise.resolve({
    list: arr,
    total: 50,
  });
}
const queryParams = ref({});
setTimeout(() => {
  queryParams.value = {
    label: '123',
  };
}, 3000);
</script>

<template>
  <el-divider />
  值:{{ model || '-' }}
  <br>
  文字:{{ modelLabel || '-' }}
  <el-divider />
  <CommonSelectOrDialog
    v-model:label="modelLabel"
    v-model="model"
    :query="() => queryParams"
    multiple
    :api="mockApi"
    :dialog-fields-config="fieldConfig"
    :dialog-props="{
      title: '选择数据',
    }"
  />
</template>

<style scoped></style>

<script setup lang="ts">
import { reactive } from 'vue';
import { CommonTable, type CommonTableConfig } from 'dlib-ui';
import { useConfigs } from 'dlib-hooks';
import { ElInput } from 'element-plus';
const { config } = useConfigs<CommonTableConfig>([
  {
    label: '名称1',
    field: 'field1',
    component: 'input',
  },
  {
    label: '名称2',
    field: 'field2',
    component: ({ rowIndex }: any) => {
      if (rowIndex > 0) {
        return ElInput;
      } else {
        return undefined;
      }
    },
  },
  {
    label: '名称3',
    field: 'field3',
  },
  {
    label: '名称4',
    field: 'field4',
  },
  {
    label: '名称5',
    field: 'field5',
  },
]);
const tableData = reactive([
  {
    field1: '1',
    field2: '名称2',
    field3: '名称3',
    field4: '名称4',
    field5: '名称5',
  },
  {
    field1: '2',
    field2: '名称2',
    field3: '名称3',
    field4: '名称4',
    field5: '名称5',
  },
]);
</script>

<template>
  <CommonTable
    :data="tableData"
    :config="config"
  />
</template>

<style scoped></style>

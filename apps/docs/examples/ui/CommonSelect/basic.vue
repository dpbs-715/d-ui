<script setup lang="ts">
import { reactive, ref } from 'vue';
import { CommonSelect, CommonTable, CommonForm } from 'dlib-ui';
import { useMixConfig } from 'dlib-hooks';

const tableData = reactive([{}]);
const formData = reactive({});
const value = ref('1');
const label = ref('选项1');
const bindOptions = reactive([
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
]);

const { table, form } = useMixConfig([
  {
    label: '字段',
    field: 'field',
    component: 'commonSelect',
    props: {
      bindOptions,
    },
    table: true,
    form: true,
  },
]);
</script>

<template>
  直接使用:{{ value }}-{{ label }}<br>
  form中使用:{{ formData }}<br>
  table中使用:{{ tableData }}
  <el-divider>直接使用</el-divider>
  <CommonSelect
    v-model="value"
    v-model:label="label"
    :bind-options="bindOptions"
  />
  <el-divider>form中使用</el-divider>
  <CommonForm
    v-model="formData"
    :config="form.config"
  />
  <el-divider>table中使用</el-divider>
  <CommonTable
    :data="tableData"
    :config="table.config"
  />
</template>

<style scoped></style>

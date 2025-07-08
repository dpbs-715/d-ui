<script setup lang="ts">
import { useMixConfig } from 'dlib-hooks';
const { table, search, form } = useMixConfig([
  {
    field: 'field1',
    label: '字段1',
    search: {
      label: '复写字段1',
    },
    table: {
      hidden: true,
    },
  },
  {
    field: 'test2',
    label: '字段2',
    form: true,
  },
]);
console.log(table, search, form);
</script>

<template>
  {{ table }}
  <el-divider />
  {{ search }}
  <el-divider />
  {{ form }}
</template>

<style scoped></style>

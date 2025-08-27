<script setup lang="ts">
import { ref } from 'vue';
const fieldConfig = [
  {
    label: '字段1',
    field: 'label',
    table: true,
    search: true,
  },
  {
    label: '字段2',
    field: 'value',
    table: true,
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
const model2 = ref('');
</script>

<template>
  {{ model }}{{ modelLabel }}
  <CommonSelectOrDialog
    v-model:label="modelLabel"
    v-model="model"
    multiple
    join-split=","
    :dialog-fields-config="fieldConfig"
    :bind-options="options"
  />
  {{ model2 }}
  <CommonSelectOrDialog
    v-model="model2"
    :dialog-fields-config="fieldConfig"
    :bind-options="options"
  />
</template>

<style scoped></style>

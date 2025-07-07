<script setup lang="ts">
import { reactive } from 'vue';
import { CommonForm } from '@DLib/ui';
import { useMixConfig } from '@DLib/hooks';

const formData = reactive({});
const bindOptions: any = reactive([]);
for (let i = 0; i < 5; i++) {
  bindOptions.push({
    label: `选项${i}`,
    value: i,
  });
}

const { form } = useMixConfig([
  {
    label: '字段',
    field: 'field',
    component: 'commonSelect',
    span: 12,
    props: {
      multiple: true,
      bindOptions,
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

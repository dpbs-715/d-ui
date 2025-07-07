<script setup lang="ts">
import { reactive } from 'vue';
import { useConfigs } from '@DLib/hooks/src/useConfigs';
import { CommonForm } from '@DLib/ui';
import type { CommonFormConfig } from '@DLib/ui';
const formData = reactive({});
const { config, getConfigByField } = useConfigs<CommonFormConfig>([
  {
    field: 'field1',
    label: '字段1',
    component: 'select',
    props: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
      onChange: (val: any) => {
        const o = getConfigByField('test2');
        if (val === '1') {
          o.component = 'input';
        } else {
          o.component = 'select';
        }
      },
    },
  },
  {
    field: 'test2',
    label: '字段2',
  },
]);
</script>

<template>
  <CommonForm
    v-model="formData"
    :config="config"
  />
</template>

<style scoped></style>

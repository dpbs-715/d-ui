<script setup lang="ts">
import { reactive } from 'vue';
import { useRefCollect } from '@DLib/hooks/src/useRefCollect';
import { useConfigs } from '@DLib/hooks/src/useConfigs';
import type { CommonFormConfig } from '~/components';
const { handleRef } = useRefCollect();
const { config } = useConfigs<CommonFormConfig>([
  {
    field: 'test1',
    label: '测试1',
    component: 'commonSelect',
    props: {
      bindOptions: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'test2',
    label: '测试2',
    component: 'input',
  },
]);

const formData = reactive({});
</script>

<template>
  <CommonForm
    :ref="(el) => handleRef(el, 'form1')"
    v-model="formData"
    :config="config"
  />
</template>

<style scoped></style>

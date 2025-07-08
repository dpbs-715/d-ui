<script setup lang="ts">
import { reactive } from 'vue';
import { useConfigs } from '@DLib/hooks/src/useConfigs';
import { CommonForm } from '@DLib/ui';
import type { CommonFormConfig } from '@DLib/ui';
const formData = reactive({});
const { config } = useConfigs<CommonFormConfig>([
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
    },
  },
  {
    field: 'test2',
    label: '字段2',
  },
]);
</script>

<template>
  <el-divider>默认</el-divider>
  <CommonForm
    v-model="formData"
    :config="config"
  />
  <el-divider>small</el-divider>
  <CommonForm
    v-model="formData"
    size="small"
    :config="config"
  />
  <el-divider>default</el-divider>
  <CommonForm
    v-model="formData"
    size="default"
    :config="config"
  />
  <el-divider>large</el-divider>
  <CommonForm
    v-model="formData"
    size="large"
    :config="config"
  />
</template>

<style scoped></style>

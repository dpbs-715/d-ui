<script setup lang="ts">
import { reactive } from 'vue';
import { useConfigs } from 'dlib-hooks/src/useConfigs';
import { CommonForm } from 'dlib-ui';
import type { CommonFormConfig } from 'dlib-ui';

const formData = reactive({});
const { config, setHidden } = useConfigs<CommonFormConfig>([
  {
    field: 'field1',
    label: '字段1',
    props: {
      onChange: (value: string, p: Record<string, any>) => {
        if (value === '1' && !p.formData.test2) {
          setHidden(['test2'], true);
        } else {
          setHidden(['test2'], false);
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

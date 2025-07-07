<script setup lang="ts">
import { ElDialog } from 'element-plus';
import { computed, h, useSlots, getCurrentInstance } from 'vue';
import type { DialogProps, DialogEmits } from './Dialog.types';
import { componentDefaultPropsMap } from '~/components';
import { CommonButton } from '../../Button';
defineOptions({
  name: 'CommonDialog',
});

const props = withDefaults(defineProps<DialogProps>(), {
  title: '标题',
});

const emits: any = defineEmits<DialogEmits>();

const dialogProps = computed(() => {
  const cleaned = Object.fromEntries(
    Object.entries(props).filter(([_, v]) => {
      return v !== undefined;
    }),
  );
  return {
    ...componentDefaultPropsMap.CommonDialog,
    ...cleaned,
  };
});

const dialogVisible = defineModel<boolean>();

function updateModel(val: boolean) {
  dialogVisible.value = val;
}

const slots: any = useSlots();

function close() {
  dialogVisible.value = false;
  emits('close');
}
const vm = getCurrentInstance();

function confirm() {
  const vnode: any = vm?.vnode || {};
  if (vnode['props']?.onConfirm) {
    emits('confirm');
  } else {
    close();
  }
}

const comSlots: any = {
  footer: () => [
    h(CommonButton, { type: 'normal', onClick: close }, '取消'),
    h(CommonButton, { type: 'primary', onClick: confirm }, '确定'),
  ],
  ...slots,
};
</script>
<template>
  <component
    :is="
      h(
        ElDialog,
        {
          ...$attrs,
          ...dialogProps,
          class: 'CommonDialog',
          modelValue: dialogVisible,
          'onUpdate:modelValue': updateModel,
        },
        comSlots,
      )
    "
  />
</template>
<style lang="scss">
@use './Dialog.scss' as *;
</style>

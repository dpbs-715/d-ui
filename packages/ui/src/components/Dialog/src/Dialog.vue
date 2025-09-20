<script setup lang="ts">
import { ElDialog } from 'element-plus';
import { computed, h, useSlots, getCurrentInstance } from 'vue';
import type { DialogEmits, DialogPropsWithEvents } from './Dialog.types';
import { CommonButton } from '../../Button';
import { componentDefaultPropsMap } from '~/components/CreateComponent/src/defaultMap.ts';
defineOptions({
  name: 'CommonDialog',
});

const props = withDefaults(defineProps<DialogPropsWithEvents>(), {
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
    emits('confirm', close);
  } else {
    close();
  }
}

const comSlots: any = {
  footer: () => [
    h(CommonButton, { type: 'normal', onClick: close }, { default: () => '取消' }),
    h(CommonButton, { type: 'primary', onClick: confirm }, { default: () => '确定' }),
  ],
  ...slots,
};
console.log(dialogProps);
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

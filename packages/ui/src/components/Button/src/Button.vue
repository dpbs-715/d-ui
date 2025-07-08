<template>
  <button
    class="CommonButton"
    :class="[
      type ? `CommonButton--${type}` : '',
      size ? `CommonButton--${size}` : '',
      {
        'is-round': round,
        'is-disabled': disabled,
        'is-plain': plain,
        'is-circle': circle,
      },
    ]"
    type="button"
    :disabled="disabled"
    @click="handleClick"
  >
    <el-icon
      v-if="icon || defaultIcon"
      :style="{ marginRight: $slots.default ? '5px' : '0' }"
    >
      <component :is="icon || defaultIcon" />
    </el-icon>
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { ButtonEmits, ButtonProps } from './Button.types';
import { computed, h } from 'vue';
import { CirclePlus, Delete } from '@element-plus/icons-vue';
import exportIcon from './svgs/exportIcon.svg?raw';
import importIcon from './svgs/importIcon.svg?raw';
import { ElIcon } from 'element-plus';
defineOptions({
  name: 'CommonButton',
});

const {
  type = undefined,
  size = 'medium',
  disabled = false,
  round = false,
  icon = undefined,
  circle = false,
} = defineProps<ButtonProps>();

const defaultIcon = computed(() => {
  switch (type) {
    case 'create':
      return CirclePlus;
    case 'delete':
      return Delete;
    case 'export':
      return h('span', { innerHTML: exportIcon });
    case 'import':
      return h('span', { innerHTML: importIcon });
    default:
      return null;
  }
});

const emit = defineEmits<ButtonEmits>();

const handleClick = (event: MouseEvent) => {
  if (!disabled) {
    emit('click', event);
  }
};
</script>

<style lang="scss" scoped>
@use './Button.scss' as *;
</style>

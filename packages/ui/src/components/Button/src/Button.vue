<template>
  <button
    class="CommonButton"
    :class="[
      type ? `CommonButton--${type}` : '',
      size ? `CommonButton--${size}` : '',
      {
        'is-round': round,
        'is-disabled': disabled || loading,
        'is-plain': plain,
        'is-circle': circle,
      },
    ]"
    type="button"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <template v-if="loading || promiseLoading">
      <el-icon
        class="is-loading"
        :style="{ marginRight: $slots.default ? '5px' : '0' }"
      >
        <Loading />
      </el-icon>
    </template>
    <el-icon
      v-else-if="icon || defaultIcon"
      :style="{ marginRight: $slots.default ? '5px' : '0' }"
    >
      <component :is="icon || defaultIcon" />
    </el-icon>
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { ButtonProps } from './Button.types';
import { computed, h, ref } from 'vue';
import { CirclePlus, Delete, Loading } from '@element-plus/icons-vue';
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
  loading = false,
  onClick = undefined,
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
const promiseLoading = ref(false);

async function handleClick(event: MouseEvent) {
  if (!disabled) {
    promiseLoading.value = true;
    try {
      await onClick?.(event);
    } catch (e) {
      console.error(e);
    } finally {
      promiseLoading.value = false;
    }
  }
}
</script>

<style lang="scss" scoped>
@use './Button.scss' as *;
</style>
